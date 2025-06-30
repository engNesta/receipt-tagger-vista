
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

// Helper function to parse Azure connection string
function parseConnectionString(connectionString: string) {
  const parts = connectionString.split(';');
  const config: { [key: string]: string } = {};
  
  parts.forEach(part => {
    const [key, value] = part.split('=');
    if (key && value) {
      config[key] = value;
    }
  });
  
  return {
    accountName: config.AccountName,
    accountKey: config.AccountKey,
    endpointSuffix: config.EndpointSuffix || 'core.windows.net'
  };
}

// Helper function to create Azure Storage REST API signature
async function createSharedKeySignature(
  accountName: string,
  accountKey: string,
  method: string,
  url: string,
  headers: { [key: string]: string },
  contentLength: number
) {
  const dateString = new Date().toUTCString();
  headers['x-ms-date'] = dateString;
  headers['x-ms-version'] = '2020-04-08';
  
  const canonicalizedHeaders = Object.keys(headers)
    .filter(key => key.startsWith('x-ms-'))
    .sort()
    .map(key => `${key}:${headers[key]}`)
    .join('\n');
  
  const urlPath = new URL(url).pathname;
  const canonicalizedResource = `/${accountName}${urlPath}`;
  
  const stringToSign = [
    method,
    '', // Content-Encoding
    '', // Content-Language
    contentLength || '', // Content-Length
    '', // Content-MD5
    headers['Content-Type'] || '', // Content-Type
    '', // Date
    '', // If-Modified-Since
    '', // If-Match
    '', // If-None-Match
    '', // If-Unmodified-Since
    '', // Range
    canonicalizedHeaders,
    canonicalizedResource
  ].join('\n');

  const keyData = Uint8Array.from(atob(accountKey), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(stringToSign));
  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
  
  return `SharedKey ${accountName}:${signatureBase64}`;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Azure upload function called with REST API approach');

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
      userId = 'anonymous_' + Date.now();
      console.log('Using anonymous user ID:', userId);
    }

    const { fileName, fileSize, mimeType, fileData }: UploadRequest = await req.json()
    console.log('Processing file:', fileName, 'Size:', fileSize);

    // Convert base64 to bytes
    const binaryString = atob(fileData)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    const containerName = 'raw_drop';
    const timestamp = Date.now()
    
    // Sanitize userId to ensure Azure compliance (replace hyphens and other invalid chars)
    const sanitizedUserId = userId
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/_{2,}/g, '_')
      .toLowerCase();
    
    // Sanitize fileName to ensure Azure compliance
    const sanitizedFileName = fileName
      .replace(/[^a-zA-Z0-9._]/g, '_') // Only allow letters, numbers, dots, and underscores
      .replace(/_{2,}/g, '_') // Replace multiple underscores with single underscore
      .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
      .toLowerCase(); // Convert to lowercase for consistency
    
    // Create Azure-compliant blob name (using forward slashes for virtual folders)
    const uniqueFileName = `${sanitizedUserId}/${timestamp}_${sanitizedFileName}`;
    
    console.log('Sanitized user ID:', sanitizedUserId);
    console.log('Sanitized file name:', sanitizedFileName);
    console.log('Final blob name:', uniqueFileName);

    // Create the blob URL
    const blobUrl = `https://${azureConfig.accountName}.blob.${azureConfig.endpointSuffix}/${containerName}/${uniqueFileName}`;
    
    console.log('Attempting upload to Azure via REST API:', blobUrl);

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

    // Save metadata to Supabase (only if we have a real user)
    let fileRecord = null;
    if (userId && !userId.startsWith('anonymous_')) {
      try {
        const { data, error: dbError } = await supabaseClient
          .from('files')
          .insert({
            user_id: userId,
            original_name: fileName,
            file_size: fileSize,
            mime_type: mimeType,
            azure_blob_url: blobUrl,
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
        url: blobUrl,
        message: `File uploaded successfully to Azure Blob Storage: ${uniqueFileName}`
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
