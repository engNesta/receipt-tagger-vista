
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
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the current user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { fileName, fileSize, mimeType, fileData }: UploadRequest = await req.json()

    // Convert base64 to blob
    const binaryString = atob(fileData)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    // Generate unique filename
    const timestamp = Date.now()
    const uniqueFileName = `${user.id}/${timestamp}-${fileName}`

    // Upload to Azure Blob Storage
    const azureConnectionString = Deno.env.get('AZURE_STORAGE_CONNECTION_STRING')
    if (!azureConnectionString) {
      throw new Error('Azure connection string not configured')
    }

    // Parse connection string
    const connectionParts = azureConnectionString.split(';')
    const accountName = connectionParts.find(part => part.startsWith('AccountName='))?.split('=')[1]
    const accountKey = connectionParts.find(part => part.startsWith('AccountKey='))?.split('=')[1]

    if (!accountName || !accountKey) {
      throw new Error('Invalid Azure connection string')
    }

    // Create Azure Blob URL
    const containerName = 'dropzone'
    const blobUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${uniqueFileName}`

    // Upload to Azure (using REST API)
    const dateHeader = new Date().toUTCString()
    const contentLength = bytes.length.toString()
    
    // Create authorization header for Azure
    const stringToSign = `PUT\n\n\n${contentLength}\n\n${mimeType}\n\n\n\n\n\n\nx-ms-blob-type:BlockBlob\nx-ms-date:${dateHeader}\nx-ms-version:2020-04-08\n/${accountName}/${containerName}/${uniqueFileName}`
    
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(atob(accountKey)),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(stringToSign))
    const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    const authorization = `SharedKey ${accountName}:${signatureBase64}`

    const azureResponse = await fetch(blobUrl, {
      method: 'PUT',
      headers: {
        'Authorization': authorization,
        'x-ms-blob-type': 'BlockBlob',
        'x-ms-date': dateHeader,
        'x-ms-version': '2020-04-08',
        'Content-Type': mimeType,
        'Content-Length': contentLength,
      },
      body: bytes,
    })

    if (!azureResponse.ok) {
      const errorText = await azureResponse.text()
      console.error('Azure upload failed:', errorText)
      throw new Error(`Azure upload failed: ${azureResponse.status}`)
    }

    // Save metadata to Supabase
    const { data: fileRecord, error: dbError } = await supabaseClient
      .from('files')
      .insert({
        user_id: user.id,
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
      throw new Error('Failed to save file metadata')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        file: fileRecord,
        url: blobUrl 
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
