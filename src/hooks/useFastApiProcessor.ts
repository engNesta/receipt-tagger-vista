
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

    setIsProcessing(true);
    setProcessingProgress({ current: 0, total: files.length, currentFile: '' });

    try {
      const userDirectory = user.id; // Using user ID as directory
      const results: FastApiUploadResponse[] = [];
      let successful = 0;
      let failed = 0;

      // Process files one by one with progress updates
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProcessingProgress({
          current: i + 1,
          total: files.length,
          currentFile: file.name
        });

        try {
          const result = await fastApiService.uploadFile(file, userDirectory);
          results.push(result);
          
          if (result.status === 'success') {
            successful++;
          } else {
            failed++;
          }
        } catch (error) {
          console.error(`Error processing ${file.name}:`, error);
          results.push({
            status: 'error',
            detail: error instanceof Error ? error.message : 'Unknown error'
          });
          failed++;
        }
      }

      // Fetch updated documents after processing
      await loadDocuments();

      // Show completion toast
      toast({
        title: "Processing Complete",
        description: `Successfully processed ${successful} files. ${failed > 0 ? `${failed} files failed.` : ''}`,
        variant: successful > 0 ? "default" : "destructive"
      });

      return { successful, failed, results };

    } catch (error) {
      console.error('Batch processing error:', error);
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
    if (!user) return;

    try {
      const userDirectory = user.id;
      const response = await fastApiService.getDocuments(userDirectory);
      
      if (response.status === 'success' && response.documents) {
        setProcessedDocuments(response.documents);
      } else {
        console.error('Failed to load documents:', response.detail);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  }, [user]);

  return {
    isProcessing,
    processedDocuments,
    processingProgress,
    processFiles,
    loadDocuments
  };
};
