
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { fastApiService, type FastApiDocument, type FastApiUploadResponse } from '@/services/fastApiService';
import { useToast } from '@/hooks/use-toast';

export const useFastApiProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedDocuments, setProcessedDocuments] = useState<FastApiDocument[]>([]);
  const [processingProgress, setProcessingProgress] = useState<{
    current: number;
    total: number;
    currentFile: string;
  } | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Process files through FastAPI pipeline
  const processFiles = useCallback(async (files: File[]) => {
    if (!user || files.length === 0) return;

    console.log('FastAPI Processor: Starting to process', files.length, 'files');
    setIsProcessing(true);
    setProcessingProgress({ current: 0, total: files.length, currentFile: '' });

    try {
      const userDirectory = user.id;
      const results: FastApiUploadResponse[] = [];
      let successful = 0;
      let failed = 0;

      // Process files one by one with progress updates
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`FastAPI Processor: Processing file ${i + 1}/${files.length}: ${file.name}`);
        
        setProcessingProgress({
          current: i + 1,
          total: files.length,
          currentFile: file.name
        });

        try {
          const result = await fastApiService.uploadFile(file, userDirectory);
          console.log('FastAPI Processor: Upload result for', file.name, ':', result);
          results.push(result);
          
          if (result.status === 'success') {
            successful++;
          } else {
            failed++;
          }
        } catch (error) {
          console.error(`FastAPI Processor: Error processing ${file.name}:`, error);
          results.push({
            status: 'error',
            detail: error instanceof Error ? error.message : 'Unknown error'
          });
          failed++;
        }
      }

      // After processing all files, reload documents to get the latest state
      console.log('FastAPI Processor: All files processed, reloading documents');
      await loadDocuments();

      // Show completion toast
      toast({
        title: "Processing Complete",
        description: `Successfully processed ${successful} files. ${failed > 0 ? `${failed} files failed.` : ''}`,
        variant: successful > 0 ? "default" : "destructive"
      });

      return { successful, failed, results };

    } catch (error) {
      console.error('FastAPI Processor: Batch processing error:', error);
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
  }, [user, toast]);

  // Load documents from FastAPI
  const loadDocuments = useCallback(async () => {
    if (!user) {
      console.log('FastAPI Processor: No user, skipping document load');
      return;
    }

    try {
      const userDirectory = user.id;
      console.log('FastAPI Processor: Loading documents for user:', userDirectory);
      const response = await fastApiService.getDocuments(userDirectory);
      
      console.log('FastAPI Processor: API response:', response);
      
      if (response.status === 'success' && response.documents) {
        console.log('FastAPI Processor: Successfully loaded', response.documents.length, 'documents');
        console.log('FastAPI Processor: Documents data:', response.documents);
        setProcessedDocuments(response.documents);
      } else {
        console.error('FastAPI Processor: Failed to load documents:', response.detail);
        // Set empty array if no documents found
        setProcessedDocuments([]);
      }
    } catch (error) {
      console.error('FastAPI Processor: Error loading documents:', error);
      // Don't clear existing documents on error, just log it
    }
  }, [user]);

  console.log('FastAPI Processor: Current state - processedDocuments count:', processedDocuments.length);
  console.log('FastAPI Processor: Current state - processedDocuments:', processedDocuments);

  return {
    isProcessing,
    processedDocuments,
    processingProgress,
    processFiles,
    loadDocuments
  };
};
