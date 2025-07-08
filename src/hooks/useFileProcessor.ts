import { useState, useCallback } from 'react';
import { useFastApiProcessor } from '@/hooks/useFastApiProcessor';
import { logger } from '@/utils/logger';

interface UseFileProcessorProps {
  onUploadComplete?: (processedFiles?: any[]) => void;
}

export const useFileProcessor = ({ onUploadComplete }: UseFileProcessorProps = {}) => {
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  
  const { isProcessing, processingProgress, processFiles, clearError } = useFastApiProcessor();

  const addFiles = useCallback((files: File[]) => {
    setPendingFiles(prev => [...prev, ...files]);
    logger.info('Files added to pending list', { count: files.length });
  }, []);

  const removeFile = useCallback((index: number) => {
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const processAllFiles = useCallback(async () => {
    if (pendingFiles.length === 0) return;

    try {
      await processFiles(pendingFiles);
      setPendingFiles([]);
      onUploadComplete?.([]);
      logger.info('File processing completed successfully');
    } catch (error) {
      logger.error('File processing failed', { error });
      // Error handling is done in the hook
    }
  }, [pendingFiles, processFiles, onUploadComplete]);

  const clearPendingFiles = useCallback(() => {
    setPendingFiles([]);
  }, []);

  return {
    pendingFiles,
    isProcessing,
    processingProgress,
    addFiles,
    removeFile,
    processAllFiles,
    clearPendingFiles,
    clearError
  };
};