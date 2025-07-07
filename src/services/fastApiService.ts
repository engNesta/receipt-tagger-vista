
const FASTAPI_BASE_URL = 'https://fastapi-server-1-l30y.onrender.com'; // Updated to your actual FastAPI server URL

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
  // Upload and process a single file
  async uploadFile(file: File, userDirectory: string): Promise<FastApiUploadResponse> {
    const formData = new FormData();
    formData.append('files', file);
    formData.append('user_id', userDirectory);
    formData.append('user_directory', userDirectory); // Add this field as well

    console.log(`Uploading file ${file.name} to ${FASTAPI_BASE_URL}/upload/`);
    console.log(`User ID: ${userDirectory}`);
    console.log(`User Directory: ${userDirectory}`);

    const response = await fetch(`${FASTAPI_BASE_URL}/upload/`, {
      method: 'POST',
      body: formData,
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

  // Get all processed documents for a user
  async getDocuments(userDirectory: string): Promise<FastApiDocumentsResponse> {
    console.log(`Fetching documents for user: ${userDirectory}`);
    
    const response = await fetch(`${FASTAPI_BASE_URL}/documents/${userDirectory}`, {
      method: 'GET',
    });

    console.log(`Get documents response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Get documents failed: ${response.status} - ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Documents result:', result);
    return result;
  },

  // Process multiple files in batch
  async processBatch(files: File[], userDirectory: string): Promise<{
    successful: number;
    failed: number;
    results: FastApiUploadResponse[];
  }> {
    const results: FastApiUploadResponse[] = [];
    let successful = 0;
    let failed = 0;

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
        results.push({
          status: 'error',
          detail: error instanceof Error ? error.message : 'Unknown error'
        });
        failed++;
      }
    }

    return { successful, failed, results };
  }
};
