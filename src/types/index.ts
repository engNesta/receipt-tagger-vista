
// Centralized type definitions for the entire application

// Base entities
export interface Receipt {
  id: number;
  imageUrl: string;
  vendor: string;
  price: string;
  productName: string;
  verificationLetter: string;
  fileId?: string;
}

export interface ProcessedFile {
  file: File;
  id: string;
  timestamp: number;
  metadata: {
    size: number;
    type: string;
    lastModified: number;
  };
  azureUrl?: string;
}

export interface FileWithStatus {
  file: File;
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
  azureUrl?: string;
}

// Statistics and metrics
export interface PipelineStats {
  totalProcessed: number;
  successCount: number;
  errorCount?: number;
  lastProcessed: Date | null;
}

// Callback types
export interface UploadCallbacks {
  onUploadComplete?: (processedFiles?: ProcessedFile[]) => void;
}

// FastAPI related types
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

// Re-export mock data types for consistency
export type { MockClient, MockDocument } from '@/data/mockData';
