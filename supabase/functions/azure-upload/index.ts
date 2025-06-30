
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { UploadRequest } from './types.ts'
import { parseConnectionString, createSharedKeySignature } from './azure-utils.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// File type validation
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILENAME_LENGTH = 255;

// Sanitize filename to prevent path traversal
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace invalid chars with underscore
    .replace(/\.+/g, '.') // Replace multiple dots with single dot
    .replace(/^\./, '') // Remove leading dot
    .substring(0, MAX_FILENAME_LENGTH); // Limit length
}

// Validate file extension matches MIME type
function validateFileType(filename: string, mimeType: string): boolean {
  const extension = filename.toLowerCase().split('.').pop();
  const mimeToExt: { [key: string]: string[] } = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/jpg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/gif': ['gif'],
    'image/webp': ['webp'],
    'application/pdf': ['pdf']
  };
  
  return mimeToExt[mimeType]?.includes(extension || '') || false;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Azure upload function called');

    // Initialize Supabase client with service role for server-side operations
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

    // Parse connection string
    const azureConfig = parseConnectionString(azureConnectionString);
    console.log('Azure config parsed for account:', azureConfig.accountName);

    const { fileName, fileSize, mimeType, fileData }: UploadRequest = await req.json()
    
    // Security validations
    if (!fileName || typeof fileName !== 'string') {
      throw new Error('Invalid filename provided');
    }

    if (!fileSize || typeof fileSize !== 'number' || fileSize <= 0) {
      throw new Error('Invalid file size provided');
    }

    if (fileSize > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    if (!mimeType || !ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new Error('File type not allowed. Only images and PDFs are permitted.');
    }

    if (!validateFileType(fileName, mimeType)) {
      throw new Error('File extension does not match file type');
    }

    if (!fileData || typeof fileData !== 'string') {
      throw new Error('Invalid file data provided');
    }

    // Sanitize filename
    const sanitizedFilename = sanitizeFilename(fileName);
    console.log('Processing file:', sanitizedFilename, 'Size:', fileSize, 'Type:', mimeType);

    // Convert base64 to bytes with size validation
    let bytes: Uint8Array;
    try {
      const binaryString = atob(fileData);
      
      // Validate decoded size matches reported size (with some tolerance for encoding)
      const expectedSize = Math.ceil(fileSize * 1.37); // Base64 overhead
      if (Math.abs(binaryString.length - fileSize) > expectedSize * 0.1) {
        throw new Error('File size mismatch detected');
      }
      
      bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
    } catch (error) {
      throw new Error('Invalid base64 file data');
    }

    const containerName = 'dropzone';
    const timestamp = Date.now();
    
    // Create secure blob path with user ID and sanitized filename
    const fileExtension = sanitizedFilename.split('.').pop() || 'bin';
    const blobName = `rawdrop/${user.id}/${timestamp}_${sanitizedFilename}`;
    
    console.log('Blob name with user path:', blobName);

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

    // Store file record in database
    const { error: dbError } = await supabaseClient
      .from('files')
      .insert({
        user_id: user.id,
        original_name: sanitizedFilename,
        file_size: fileSize,
        mime_type: mimeType,
        azure_blob_url: blobUrl,
        upload_status: 'completed'
      });

    if (dbError) {
      console.error('Database insert failed:', dbError);
      // Note: File is uploaded but not tracked in DB - consider cleanup
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        url: blobUrl,
        message: `File uploaded successfully: ${blobName}`,
        fileId: user.id // Return for client-side tracking
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
