
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

interface CleanupRequest {
  userId?: string;
  cleanupType: 'manual' | 'automatic' | 'scheduled';
  maxAge?: number; // Hours since last validation
}

interface ImageValidationResult {
  url: string;
  isValid: boolean;
  error?: string;
  statusCode?: number;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const validateImageUrl = async (url: string): Promise<ImageValidationResult> => {
  try {
    console.log('Validating image URL:', url);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Supabase-Cleanup-Function/1.0'
      }
    });
    
    clearTimeout(timeoutId);
    
    const isValid = response.ok && response.status < 400;
    
    return {
      url,
      isValid,
      statusCode: response.status,
      error: isValid ? undefined : `HTTP ${response.status}: ${response.statusText}`
    };
  } catch (error) {
    console.error('Image validation failed for URL:', url, error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      url,
      isValid: false,
      error: errorMessage
    };
  }
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    let userId: string | undefined;
    if (token) {
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id;
    }

    const { cleanupType = 'manual', maxAge = 24 }: CleanupRequest = await req.json().catch(() => ({}));

    console.log('Starting cleanup process:', { userId, cleanupType, maxAge });

    // Create cleanup log entry
    const { data: logEntry, error: logError } = await supabase
      .from('cleanup_logs')
      .insert({
        user_id: userId,
        cleanup_type: cleanupType,
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (logError) {
      console.error('Failed to create cleanup log:', logError);
      throw new Error('Failed to initialize cleanup process');
    }

    // Build query to get files that need validation
    let query = supabase
      .from('files')
      .select('id, azure_blob_url, last_validated, original_name')
      .eq('upload_status', 'completed');

    // Filter by user if specified
    if (userId) {
      query = query.eq('user_id', userId);
    }

    // Only validate files that haven't been validated recently
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - maxAge);
    
    query = query.or(`last_validated.is.null,last_validated.lt.${cutoffTime.toISOString()}`);

    const { data: files, error: filesError } = await query;

    if (filesError) {
      console.error('Failed to fetch files:', filesError);
      throw new Error('Failed to fetch files for validation');
    }

    console.log(`Found ${files?.length || 0} files to validate`);

    if (!files || files.length === 0) {
      // Update log as completed with no files processed
      await supabase
        .from('cleanup_logs')
        .update({
          files_checked: 0,
          files_removed: 0,
          completed_at: new Date().toISOString()
        })
        .eq('id', logEntry.id);

      return new Response(
        JSON.stringify({
          success: true,
          message: 'No files needed validation',
          filesChecked: 0,
          filesRemoved: 0
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // Validate images in batches to avoid overwhelming the system
    const batchSize = 10;
    const invalidFileIds: string[] = [];
    let totalChecked = 0;

    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(files.length / batchSize)}`);

      // Validate images in this batch
      const validationPromises = batch.map(file => validateImageUrl(file.azure_blob_url));
      const results = await Promise.allSettled(validationPromises);

      // Process results
      for (let j = 0; j < batch.length; j++) {
        const file = batch[j];
        const result = results[j];
        
        totalChecked++;

        if (result.status === 'fulfilled' && !result.value.isValid) {
          console.log(`Invalid image found: ${file.original_name} (${file.azure_blob_url})`);
          invalidFileIds.push(file.id);
        } else if (result.status === 'rejected') {
          console.error(`Validation failed for ${file.original_name}:`, result.reason);
          // Consider failed validations as potentially invalid
          invalidFileIds.push(file.id);
        }

        // Update last_validated timestamp for this file
        await supabase
          .from('files')
          .update({ last_validated: new Date().toISOString() })
          .eq('id', file.id);
      }

      // Add a small delay between batches to be respectful to Azure
      if (i + batchSize < files.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Remove invalid files from database
    let filesRemoved = 0;
    if (invalidFileIds.length > 0) {
      console.log(`Removing ${invalidFileIds.length} invalid files from database`);
      
      const { error: deleteError } = await supabase
        .from('files')
        .delete()
        .in('id', invalidFileIds);

      if (deleteError) {
        console.error('Failed to delete invalid files:', deleteError);
        throw new Error('Failed to remove invalid files from database');
      }

      filesRemoved = invalidFileIds.length;
    }

    // Update cleanup log as completed
    await supabase
      .from('cleanup_logs')
      .update({
        files_checked: totalChecked,
        files_removed: filesRemoved,
        completed_at: new Date().toISOString()
      })
      .eq('id', logEntry.id);

    console.log(`Cleanup completed: ${totalChecked} files checked, ${filesRemoved} files removed`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Cleanup completed: ${filesRemoved} invalid files removed`,
        filesChecked: totalChecked,
        filesRemoved: filesRemoved,
        logId: logEntry.id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Cleanup function error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
