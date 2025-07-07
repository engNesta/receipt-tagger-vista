
const FASTAPI_BASE_URL = 'https://fastapi-server-1-l30y.onrender.com';

export interface FastApiDocument {
  id: string;
  user_id: string;
  user_directory: string;
  job_id: string;
  original_blob_name: string;
  ingested_path: string;
  original_filename: string;
  timestamp: number;
  status: string;
  tags: {
    vendor?: string;
    product_or_service?: string;
    price?: number;
    [key: string]: any;
  };
  _rid?: string;
  _self?: string;
  _etag?: string;
  _attachments?: string;
  _ts?: number;
}

export interface FastApiUploadResponse {
  status: 'success' | 'skipped' | 'error';
  documents?: FastApiDocument[];
  metadata?: any;
  reason?: string;
  detail?: string;
}

export interface FastApiDocumentsResponse {
  status: 'success' | 'error';
  documents?: FastApiDocument[];
  detail?: string;
}

export const fastApiService = {
  // Health check to verify API is accessible
  async healthCheck(): Promise<{ status: 'ok' | 'error'; message?: string }> {
    try {
      console.log(`Health check: Testing connection to ${FASTAPI_BASE_URL}`);
      const response = await fetch(`${FASTAPI_BASE_URL}/`, {
        method: 'GET',
      });

      if (response.ok) {
        console.log('Health check: API is accessible');
        return { status: 'ok' };
      } else {
        console.log(`Health check: API returned status ${response.status}`);
        return { status: 'error', message: `API returned status ${response.status}` };
      }
    } catch (error) {
      console.error('Health check: Failed to connect to API:', error);
      return { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Network connection failed' 
      };
    }
  },

  // Upload and process a single file with user context
  async uploadFile(file: File, userDirectory: string): Promise<FastApiUploadResponse> {
    const formData = new FormData();
    formData.append('files', file);
    formData.append('user_id', userDirectory);
    formData.append('user_directory', userDirectory);

    console.log(`Uploading file ${file.name} to ${FASTAPI_BASE_URL}/upload/`);
    console.log(`User ID: ${userDirectory}`);
    console.log(`User Directory: ${userDirectory}`);

    const response = await fetch(`${FASTAPI_BASE_URL}/upload/`, {
      method: 'POST',
      body: formData,
      headers: {
        'X-User-ID': userDirectory, // Add user context to headers
      }
    });

    console.log(`Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Upload failed: ${response.status} - ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Upload result:', result);
    
    return result;
  },

  // Get all processed documents for a specific user - Updated to match your API
  async getDocuments(userDirectory: string): Promise<FastApiDocumentsResponse> {
    console.log(`Fetching documents for user: ${userDirectory}`);
    
    // First check if the API is accessible
    const healthCheck = await this.healthCheck();
    if (healthCheck.status === 'error') {
      throw new Error(`API service unavailable: ${healthCheck.message}`);
    }
    
    // Updated to use query parameter instead of path parameter
    const response = await fetch(`${FASTAPI_BASE_URL}/documents/?user_id=${encodeURIComponent(userDirectory)}`, {
      method: 'GET',
      headers: {
        'X-User-ID': userDirectory, // Add user context to headers
      }
    });

    console.log(`Get documents response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Get documents failed: ${response.status} - ${errorText}`);
      
      // If it's a 404, return empty success response instead of throwing
      if (response.status === 404) {
        return {
          status: 'success',
          documents: [],
          detail: 'No documents found for this user'
        };
      }
      
      throw new Error(`Failed to fetch documents: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Documents result:', result);
    
    // Ensure returned documents belong to the requesting user
    if (result.documents) {
      result.documents = result.documents.filter((doc: FastApiDocument) => 
        doc.user_id === userDirectory || doc.user_directory === userDirectory
      );
      console.log('Filtered documents for user:', userDirectory, result.documents);
    }
    
    return result;
  },

  // Process multiple files in batch with user context
  async processBatch(files: File[], userDirectory: string): Promise<{
    successful: number;
    failed: number;
    results: FastApiUploadResponse[];
  }> {
    const results: FastApiUploadResponse[] = [];
    let successful = 0;
    let failed = 0;

    console.log(`Processing batch of ${files.length} files for user: ${userDirectory}`);

    for (const file of files) {
      try {
        const result = await this.uploadFile(file, userDirectory);
        results.push(result);
        
        if (result.status === 'success') {
          successful++;
        } else {
          failed++;
        }
      } catch (error) {
        console.error(`Error processing file ${file.name} for user ${userDirectory}:`, error);
        results.push({
          status: 'error',
          detail: error instanceof Error ? error.message : 'Unknown error'
        });
        failed++;
      }
    }

    console.log(`Batch processing complete for user ${userDirectory}: ${successful} successful, ${failed} failed`);
    return { successful, failed, results };
  }
};
