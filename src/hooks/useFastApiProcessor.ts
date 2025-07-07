
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { fastApiService, type FastApiDocument, type FastApiUploadResponse } from '@/services/fastApiService';
import { useToast } from '@/hooks/use-toast';

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
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Process files through FastAPI pipeline with user context
  const processFiles = useCallback(async (files: File[]) => {
    if (!user || files.length === 0) {
      console.log('FastAPI Processor: No user or no files to process');
      return;
    }

    const userDirectory = user.id;
    console.log('FastAPI Processor: Starting to process', files.length, 'files for user:', userDirectory);
    setIsProcessing(true);
    setProcessingProgress({ current: 0, total: files.length, currentFile: '' });

    try {
      const results: FastApiUploadResponse[] = [];
      const allNewDocuments: FastApiDocument[] = [];
      let successful = 0;
      let failed = 0;

      // Process files one by one with progress updates
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`FastAPI Processor: Processing file ${i + 1}/${files.length}: ${file.name} for user: ${userDirectory}`);
        
        setProcessingProgress({
          current: i + 1,
          total: files.length,
          currentFile: file.name
        });

        try {
          const result = await fastApiService.uploadFile(file, userDirectory);
          console.log('FastAPI Processor: Upload result for', file.name, ':', result);
          results.push(result);
          
          if (result.status === 'success' && result.documents) {
            successful++;
            // Filter documents to ensure they belong to the current user
            const userDocuments = result.documents.filter(doc => 
              doc.user_id === userDirectory || doc.user_directory === userDirectory
            );
            allNewDocuments.push(...userDocuments);
            console.log('FastAPI Processor: Added user documents from upload:', userDocuments);
          } else {
            failed++;
          }
        } catch (error) {
          console.error(`FastAPI Processor: Error processing ${file.name} for user ${userDirectory}:`, error);
          results.push({
            status: 'error',
            detail: error instanceof Error ? error.message : 'Unknown error'
          });
          failed++;
        }
      }

      // Update state with new documents immediately from upload response
      if (allNewDocuments.length > 0) {
        console.log('FastAPI Processor: Setting processed documents directly from upload results:', allNewDocuments.length);
        setProcessedDocuments(prevDocs => {
          const combined = [...prevDocs, ...allNewDocuments];
          console.log('FastAPI Processor: Combined documents count:', combined.length);
          return combined;
        });
        setError(null); // Clear any previous errors on successful upload
      }

      // Show completion toast
      toast({
        title: "Processing Complete",
        description: `Successfully processed ${successful} files. ${failed > 0 ? `${failed} files failed.` : ''}`,
        variant: successful > 0 ? "default" : "destructive"
      });

      return { successful, failed, results };

    } catch (error) {
      console.error('FastAPI Processor: Batch processing error for user', userDirectory, ':', error);
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

  // Load documents from FastAPI for current user only
  const loadDocuments = useCallback(async () => {
    if (!user) {
      console.log('FastAPI Processor: No user, clearing documents');
      setProcessedDocuments([]);
      setError(null);
      return;
    }

    const userDirectory = user.id;
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('FastAPI Processor: Loading documents for user:', userDirectory);
      const response = await fastApiService.getDocuments(userDirectory);
      
      console.log('FastAPI Processor: Load documents response for user', userDirectory, ':', response);
      
      if (response.status === 'success' && response.documents && response.documents.length > 0) {
        // Filter documents to ensure they belong to the current user
        const userDocuments = response.documents.filter(doc => 
          doc.user_id === userDirectory || doc.user_directory === userDirectory
        );
        console.log('FastAPI Processor: Successfully loaded', userDocuments.length, 'documents for user:', userDirectory);
        console.log('FastAPI Processor: Setting processedDocuments state:', userDocuments);
        setProcessedDocuments(userDocuments);
        setError(null);
      } else if (response.status === 'success' && response.documents?.length === 0) {
        console.log('FastAPI Processor: No documents found for user', userDirectory);
        setProcessedDocuments([]);
        setError(null);
      } else {
        console.log('FastAPI Processor: Unexpected response format:', response);
        setError('Unable to load documents. Please try again.');
      }
    } catch (error) {
      console.error('FastAPI Processor: Error loading documents for user', userDirectory, ':', error);
      const errorMessage = error instanceof Error ? error.message : 'Connection failed';
      
      // Check if it's a network error
      if (errorMessage.includes('fetch')) {
        setError('Unable to connect to document service. Please check your internet connection and try again.');
      } else {
        setError(`Failed to load documents: ${errorMessage}`);
      }
      
      // Don't clear existing documents on error - they might have been just uploaded
      console.log('FastAPI Processor: Keeping existing documents due to load error');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  console.log('=== FastAPI Processor Hook State ===');
  console.log('User:', user?.id || 'No user');
  console.log('ProcessedDocuments count:', processedDocuments.length);
  console.log('ProcessedDocuments sample:', processedDocuments.slice(0, 2));
  console.log('IsProcessing:', isProcessing);

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
