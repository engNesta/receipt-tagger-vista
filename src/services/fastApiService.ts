
const FASTAPI_BASE_URL = 'http://localhost:8000'; // Update this to your FastAPI server URL

export interface FastApiDocument {
  id: string;
  filename: string;
  user_directory: string;
  tags: string[];
  metadata: Record<string, any>;
  processed_at: string;
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
    formData.append('file', file);
    formData.append('user_directory', userDirectory);

    const response = await fetch(`${FASTAPI_BASE_URL}/upload/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Get all processed documents for a user
  async getDocuments(userDirectory: string): Promise<FastApiDocumentsResponse> {
    const response = await fetch(`${FASTAPI_BASE_URL}/documents/${userDirectory}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
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
