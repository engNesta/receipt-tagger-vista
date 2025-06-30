
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { UploadRequest } from './types.ts'
import { parseConnectionString, createSharedKeySignature } from './azure-utils.ts'

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
    console.log('Azure upload function called');

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

    // Get Azure connection string
    const azureConnectionString = Deno.env.get('AZURE_STORAGE_CONNECTION_STRING');
    if (!azureConnectionString) {
      throw new Error('Azure Storage Connection String not configured');
    }

    // Parse connection string
    const azureConfig = parseConnectionString(azureConnectionString);
    console.log('Azure config parsed for account:', azureConfig.accountName);

    const { fileName, fileSize, mimeType, fileData }: UploadRequest = await req.json()
    console.log('Processing file:', fileName, 'Size:', fileSize);

    // Convert base64 to bytes
    const binaryString = atob(fileData)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    const containerName = 'dropzone';
    const timestamp = Date.now()
    
    // Create simple blob name with extension
    const blobName = `${timestamp}.jpg`;
    
    console.log('Blob name with extension:', blobName);

    // Create the blob URL
    const blobUrl = `https://${azureConfig.accountName}.blob.${azureConfig.endpointSuffix}/${containerName}/${blobName}`;
    
    console.log('Uploading to:', blobUrl);

    // Prepare headers for the PUT request
    const uploadHeaders: { [key: string]: string } = {
      'Content-Type': mimeType,
      'Content-Length': bytes.length.toString(),
      'x-ms-blob-type': 'BlockBlob',
    };

    // Create the authorization signature
    const authorization = await createSharedKeySignature(
      azureConfig.accountName,
      azureConfig.accountKey,
      'PUT',
      blobUrl,
      uploadHeaders,
      bytes.length
    );

    uploadHeaders['Authorization'] = authorization;

    // Upload the file to Azure Blob Storage
    const uploadResponse = await fetch(blobUrl, {
      method: 'PUT',
      headers: uploadHeaders,
      body: bytes,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Azure upload failed:', uploadResponse.status, errorText);
      throw new Error(`Azure upload failed: ${uploadResponse.status} - ${errorText}`);
    }

    console.log('Azure upload completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        url: blobUrl,
        message: `File uploaded successfully: ${blobName}`
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Azure upload error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Upload failed' 
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
