
import { useState, useCallback } from 'react';
import { fastApiService, type FastApiDocument, type FastApiUploadResponse } from '@/services/fastApiService';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

export const useFastApiProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processedDocuments, setProcessedDocuments] = useState<FastApiDocument[]>([]);
  const [processingProgress, setProcessingProgress] = useState<{
    current: number;
    total: number;
    currentFile: string;
  } | null>(null);
  
  const { toast } = useToast();

  const processFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    // Use a dummy user directory for now
    const userDirectory = 'demo-user';
    logger.info('Processing files', { count: files.length, user: userDirectory });
    
    setIsProcessing(true);
    setProcessingProgress({ current: 0, total: files.length, currentFile: '' });

    try {
      const allNewDocuments: FastApiDocument[] = [];
      let successful = 0;
      let failed = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProcessingProgress({
          current: i + 1,
          total: files.length,
          currentFile: file.name
        });

        try {
          const result = await fastApiService.uploadFile(file, userDirectory);
          
          if (result.status === 'success' && result.documents) {
            successful++;
            const userDocuments = result.documents.filter(doc => 
              doc.user_id === userDirectory || doc.user_directory === userDirectory
            );
            allNewDocuments.push(...userDocuments);
          } else {
            failed++;
          }
        } catch (error) {
          logger.error('File processing failed', { file: file.name, error });
          failed++;
        }
      }

      if (allNewDocuments.length > 0) {
        setProcessedDocuments(prevDocs => [...prevDocs, ...allNewDocuments]);
        setError(null);
      }

      toast({
        title: "Processing Complete",
        description: `Successfully processed ${successful} files. ${failed > 0 ? `${failed} files failed.` : ''}`,
        variant: successful > 0 ? "default" : "destructive"
      });

      return { successful, failed };

    } catch (error) {
      logger.error('Batch processing failed', { error });
      toast({
        title: "Processing Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsProcessing(false);
      setProcessingProgress(null);
    }
  }, [toast]);

  const loadDocuments = useCallback(async () => {
    // Use a dummy user directory for now
    const userDirectory = 'demo-user';
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fastApiService.getDocuments(userDirectory);
      
      if (response.status === 'success') {
        const userDocuments = response.documents?.filter(doc => 
          doc.user_id === userDirectory || doc.user_directory === userDirectory
        ) || [];
        
        setProcessedDocuments(userDocuments);
        logger.info('Documents loaded', { count: userDocuments.length });
      } else {
        setError('Unable to load documents. Please try again.');
      }
    } catch (error) {
      logger.error('Failed to load documents', { error });
      const errorMessage = error instanceof Error ? error.message : 'Connection failed';
      
      if (errorMessage.includes('fetch')) {
        setError('Unable to connect to document service. Please check your internet connection and try again.');
      } else {
        setError(`Failed to load documents: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isProcessing,
    isLoading,
    error,
    processedDocuments,
    processingProgress,
    processFiles,
    loadDocuments,
    clearError: () => setError(null)
  };
};
