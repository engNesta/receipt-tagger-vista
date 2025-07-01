
import { useState, useCallback } from 'react';
import { useConsent } from '@/hooks/useConsent';
import { useFilePipeline } from '@/hooks/useFilePipeline';

interface FileWithStatus {
  file: File;
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
  azureUrl?: string;
}

interface UseFileUploadProps {
  onUploadComplete?: (processedFiles?: any[]) => void;
}

export const useFileUpload = ({ onUploadComplete }: UseFileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<FileWithStatus[]>([]);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  
  const { hasConsent, grantConsent } = useConsent();
  const { processFiles, isProcessing, stats } = useFilePipeline();

  // File processing with visual feedback and Azure storage
  const processFileWithStatus = async (fileWithStatus: FileWithStatus): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 25 + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadingFiles(prev => prev.map(f => 
            f.id === fileWithStatus.id 
              ? { ...f, status: 'completed', progress: 100 }
              : f
          ));
          resolve();
        } else {
          setUploadingFiles(prev => prev.map(f => 
            f.id === fileWithStatus.id 
              ? { ...f, status: 'processing', progress }
              : f
          ));
        }
      }, 150);
    });
  };

  // Main file upload handler with Azure integration and receipt creation
  const handleFilesUpload = async (files: File[]) => {
    console.log('Processing files through Azure-enhanced pipeline:', files.length);

    // Create file status objects
    const filesWithStatus: FileWithStatus[] = files.map(file => ({
      file,
      id: `${Date.now()}-${Math.random()}`,
      status: 'pending',
      progress: 0
    }));

    setUploadingFiles(filesWithStatus);

    // Process files through the pipeline
    const pipelineResult = await processFiles(files);
    console.log('Pipeline result with Azure storage:', pipelineResult);

    // Update file status with Azure URLs if available
    if (pipelineResult.processed) {
      pipelineResult.processed.forEach(processedFile => {
        setUploadingFiles(prev => prev.map(f => 
          f.file.name === processedFile.file.name 
            ? { ...f, azureUrl: processedFile.azureUrl }
            : f
        ));
      });
    }

    // Process each file with visual feedback
    for (const fileWithStatus of filesWithStatus) {
      await processFileWithStatus(fileWithStatus);
    }

    // Notify parent component about successful uploads for receipt creation
    const successfullyProcessed = pipelineResult.processed?.filter(pf => pf.azureUrl) || [];
    if (successfullyProcessed.length > 0 && onUploadComplete) {
      console.log('Notifying parent component about successful uploads:', successfullyProcessed.length);
      onUploadComplete(successfullyProcessed);
    }

    // Clear completed files after a delay
    setTimeout(() => {
      setUploadingFiles([]);
    }, 2000);
  };

  // Event handlers
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    
    if (!hasConsent) {
      setPendingFiles(droppedFiles);
      setShowConsentDialog(true);
      return;
    }

    await handleFilesUpload(droppedFiles);
  }, [hasConsent]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  // Consent handlers
  const handleConsentGiven = async () => {
    grantConsent();
    setShowConsentDialog(false);
    
    if (pendingFiles.length > 0) {
      await handleFilesUpload(pendingFiles);
      setPendingFiles([]);
    }
  };

  const handleConsentDeclined = () => {
    setShowConsentDialog(false);
    setPendingFiles([]);
  };

  // Utility functions
  const removeFile = (fileId: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
  };

  return {
    isDragOver,
    uploadingFiles,
    showConsentDialog,
    pendingFiles,
    isProcessing,
    stats,
    handleFilesUpload,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleConsentGiven,
    handleConsentDeclined,
    removeFile,
    setIsDragOver,
    setShowConsentDialog,
    setPendingFiles
  };
};
