
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

      // Update state with new documents and reload all documents
      if (allNewDocuments.length > 0) {
        console.log('FastAPI Processor: Adding', allNewDocuments.length, 'new documents to state');
        // After upload, reload all documents to ensure we have the complete, up-to-date list
        await loadDocuments();
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
      return;
    }

    const userDirectory = user.id;
    
    try {
      console.log('FastAPI Processor: Loading documents for user:', userDirectory);
      const response = await fastApiService.getDocuments(userDirectory);
      
      console.log('FastAPI Processor: Load documents response for user', userDirectory, ':', response);
      
      if (response.status === 'success') {
        if (response.documents && response.documents.length > 0) {
          // Double-check that all documents belong to the current user
          const userDocuments = response.documents.filter(doc => 
            doc.user_id === userDirectory || doc.user_directory === userDirectory
          );
          console.log('FastAPI Processor: Successfully loaded', userDocuments.length, 'documents for user:', userDirectory);
          console.log('FastAPI Processor: Setting processedDocuments state:', userDocuments);
          setProcessedDocuments(userDocuments);
        } else {
          console.log('FastAPI Processor: No documents found for user', userDirectory, '- setting empty array');
          setProcessedDocuments([]);
        }
      } else {
        console.log('FastAPI Processor: Error response, setting empty array');
        setProcessedDocuments([]);
      }
    } catch (error) {
      console.error('FastAPI Processor: Error loading documents for user', userDirectory, ':', error);
      // Set empty array on error to avoid showing other users' data
      setProcessedDocuments([]);
    }
  }, [user]);

  console.log('=== FastAPI Processor Hook State ===');
  console.log('User:', user?.id || 'No user');
  console.log('ProcessedDocuments count:', processedDocuments.length);
  console.log('ProcessedDocuments sample:', processedDocuments.slice(0, 2));
  console.log('IsProcessing:', isProcessing);

  return {
    isProcessing,
    processedDocuments,
    processingProgress,
    processFiles,
    loadDocuments
  };
};
