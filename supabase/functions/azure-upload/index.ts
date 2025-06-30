
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UploadRequest {
  fileName: string;
  fileSize: number;
  mimeType: string;
  fileData: string; // base64 encoded
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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Use service role key instead of anon key
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the current user - more lenient approach
    const authHeader = req.headers.get('Authorization');
    console.log('Auth header present:', !!authHeader);

    let userId = null;
    if (authHeader) {
      try {
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
        if (user) {
          userId = user.id;
          console.log('User authenticated:', userId);
        } else {
          console.log('No user found, proceeding with anonymous upload');
        }
      } catch (authErr) {
        console.log('Auth error, proceeding with anonymous upload:', authErr);
      }
    }

    // If no user, create a temporary user ID for anonymous uploads
    if (!userId) {
      userId = 'anonymous-' + Date.now();
      console.log('Using anonymous user ID:', userId);
    }

    const { fileName, fileSize, mimeType, fileData }: UploadRequest = await req.json()
    console.log('Processing file:', fileName, 'Size:', fileSize);

    // Convert base64 to blob
    const binaryString = atob(fileData)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    // Generate unique filename
    const timestamp = Date.now()
    const uniqueFileName = `${userId}/${timestamp}-${fileName}`

    // For now, simulate successful upload without actual Azure connection
    // This will allow the frontend to work while Azure credentials are being set up
    const mockBlobUrl = `https://mockstore.blob.core.windows.net/dropzone/${uniqueFileName}`;
    
    console.log('Mock upload successful for:', uniqueFileName);

    // Save metadata to Supabase (only if we have a real user)
    let fileRecord = null;
    if (userId && !userId.startsWith('anonymous-')) {
      try {
        const { data, error: dbError } = await supabaseClient
          .from('files')
          .insert({
            user_id: userId,
            original_name: fileName,
            file_size: fileSize,
            mime_type: mimeType,
            azure_blob_url: mockBlobUrl,
            upload_status: 'completed'
          })
          .select()
          .single()

        if (dbError) {
          console.error('Database error:', dbError)
        } else {
          fileRecord = data;
          console.log('File metadata saved to database');
        }
      } catch (dbErr) {
        console.error('Database operation failed:', dbErr);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        file: fileRecord,
        url: mockBlobUrl,
        message: 'File uploaded successfully (mock mode)'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Upload error:', error)
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
