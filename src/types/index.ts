// Centralized type definitions for the entire application

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

export interface PipelineStats {
  totalProcessed: number;
  successCount: number;
  errorCount?: number;
  lastProcessed: Date | null;
}

export interface UploadCallbacks {
  onUploadComplete?: (processedFiles?: ProcessedFile[]) => void;
}

export interface FastApiDocument {
  id: string;
  filename: string;
  user_directory: string;
  tags: Array<{
    type: string;
    value: string;
    confidence?: number;
  }>;
  metadata: Record<string, any>;
  processed_at: string;
  file_url?: string;
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
