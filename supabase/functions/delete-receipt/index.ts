
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { parseConnectionString, createSharedKeySignature } from '../azure-upload/azure-utils.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Delete receipt function called');

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Verify user authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid or expired authentication token');
    }

    console.log('Authenticated user:', user.id);

    // Get Azure connection string
    const azureConnectionString = Deno.env.get('AZURE_STORAGE_CONNECTION_STRING');
    if (!azureConnectionString) {
      throw new Error('Azure Storage Connection String not configured');
    }

    const azureConfig = parseConnectionString(azureConnectionString);
    const { fileId, deleteAll } = await req.json();

    let filesToDelete = [];
    
    if (deleteAll) {
      console.log('Bulk delete requested');
      // Get all files for the user
      const { data: files, error: fetchError } = await supabaseClient
        .from('files')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) {
        throw new Error(`Failed to fetch files: ${fetchError.message}`);
      }

      filesToDelete = files || [];
    } else if (fileId) {
      console.log('Single delete requested for file:', fileId);
      // Get specific file
      const { data: file, error: fetchError } = await supabaseClient
        .from('files')
        .select('*')
        .eq('id', fileId)
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        throw new Error(`Failed to fetch file: ${fetchError.message}`);
      }

      filesToDelete = [file];
    } else {
      throw new Error('Either fileId or deleteAll must be specified');
    }

    console.log('Files to delete:', filesToDelete.length);

    // Delete Azure blobs
    const deletionResults = [];
    for (const file of filesToDelete) {
      try {
        if (file.azure_blob_url) {
          // Extract blob name from URL
          const url = new URL(file.azure_blob_url);
          const pathParts = url.pathname.split('/');
          const containerName = pathParts[1]; // Should be 'dropzone'
          const blobName = pathParts.slice(2).join('/'); // Everything after container name

          console.log('Deleting blob:', blobName);

          // Create DELETE request for Azure blob
          const blobUrl = file.azure_blob_url;
          const deleteHeaders: { [key: string]: string } = {
            'x-ms-blob-type': 'BlockBlob',
            'Content-Length': '0',
          };

          // Create authorization signature for DELETE
          const authorization = await createSharedKeySignature(
            azureConfig.accountName,
            azureConfig.accountKey,
            'DELETE',
            blobUrl,
            deleteHeaders,
            0
          );

          deleteHeaders['Authorization'] = authorization;

          // Delete the blob from Azure
          const deleteResponse = await fetch(blobUrl, {
            method: 'DELETE',
            headers: deleteHeaders,
          });

          if (!deleteResponse.ok && deleteResponse.status !== 404) {
            // 404 is OK - blob might already be deleted
            console.error('Azure blob deletion failed:', deleteResponse.status, await deleteResponse.text());
            throw new Error(`Azure blob deletion failed: ${deleteResponse.status}`);
          }

          console.log('Successfully deleted blob:', blobName);
        }

        deletionResults.push({ fileId: file.id, success: true });
      } catch (error) {
        console.error('Error deleting blob for file:', file.id, error);
        deletionResults.push({ fileId: file.id, success: false, error: error.message });
      }
    }

    // Delete database records (even if some blob deletions failed)
    const fileIds = filesToDelete.map(f => f.id);
    const { error: dbError } = await supabaseClient
      .from('files')
      .delete()
      .eq('user_id', user.id)
      .in('id', fileIds);

    if (dbError) {
      console.error('Database deletion failed:', dbError);
      throw new Error(`Database deletion failed: ${dbError.message}`);
    }

    console.log('Successfully deleted database records:', fileIds.length);

    const successCount = deletionResults.filter(r => r.success).length;
    const failureCount = deletionResults.filter(r => !r.success).length;

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Deleted ${successCount} files successfully${failureCount > 0 ? `, ${failureCount} blob deletions failed` : ''}`,
        deletedCount: successCount,
        failureCount: failureCount,
        results: deletionResults
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Delete receipt error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Deletion failed' 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
