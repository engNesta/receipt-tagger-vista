
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
  async healthCheck(): Promise<{ status: 'ok' | 'error'; message?: string }> {
    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/`, { method: 'GET' });
      return response.ok 
        ? { status: 'ok' }
        : { status: 'error', message: `API returned status ${response.status}` };
    } catch (error) {
      return { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Network connection failed' 
      };
    }
  },

  async uploadFile(file: File, userDirectory: string): Promise<FastApiUploadResponse> {
    // Validate file type and size before upload
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, GIF, and PDF files are allowed.');
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('File size too large. Maximum size is 10MB.');
    }

    const formData = new FormData();
    formData.append('files', file);
    formData.append('user_id', userDirectory);
    formData.append('user_directory', userDirectory);

    const response = await fetch(`${FASTAPI_BASE_URL}/upload/`, {
      method: 'POST',
      body: formData,
      headers: { 'X-User-ID': userDirectory },
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}. Please try again.`);
    }

    return response.json();
  },

  async getDocuments(userDirectory: string): Promise<FastApiDocumentsResponse> {
    const healthCheck = await this.healthCheck();
    if (healthCheck.status === 'error') {
      throw new Error(`API service unavailable: ${healthCheck.message}`);
    }
    
    const response = await fetch(`${FASTAPI_BASE_URL}/documents/?user_id=${encodeURIComponent(userDirectory)}`, {
      method: 'GET',
      headers: { 'X-User-ID': userDirectory }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { status: 'success', documents: [], detail: 'No documents found for this user' };
      }
      
      const errorText = await response.text();
      throw new Error(`Failed to fetch documents: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    if (result.documents) {
      result.documents = result.documents.filter((doc: FastApiDocument) => 
        doc.user_id === userDirectory || doc.user_directory === userDirectory
      );
    }
    
    return result;
  },

  async getSummary(jobId: string, userId: string): Promise<Response> {
    const response = await fetch(`${FASTAPI_BASE_URL}/summary/${jobId}?user_id=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: { 
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-User-ID': userId
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch summary: ${response.status}`);
    }

    return response;
  }

};
