
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
