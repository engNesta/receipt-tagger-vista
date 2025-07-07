
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

      // Update processedDocuments with all new documents from uploads (user-scoped)
      if (allNewDocuments.length > 0) {
        console.log('FastAPI Processor: Adding', allNewDocuments.length, 'new documents to state for user:', userDirectory);
        setProcessedDocuments(prev => {
          // Filter existing documents to ensure they belong to current user
          const userFilteredPrev = prev.filter(doc => 
            doc.user_id === userDirectory || doc.user_directory === userDirectory
          );
          const updated = [...userFilteredPrev, ...allNewDocuments];
          console.log('FastAPI Processor: Updated processedDocuments for user:', userDirectory, updated);
          return updated;
        });
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
      console.log('FastAPI Processor: No user, skipping document load');
      return;
    }

    const userDirectory = user.id;
    
    try {
      console.log('FastAPI Processor: Loading documents for user:', userDirectory);
      const response = await fastApiService.getDocuments(userDirectory);
      
      console.log('FastAPI Processor: API response for user', userDirectory, ':', response);
      
      if (response.status === 'success' && response.documents) {
        // Double-check that all documents belong to the current user
        const userDocuments = response.documents.filter(doc => 
          doc.user_id === userDirectory || doc.user_directory === userDirectory
        );
        console.log('FastAPI Processor: Successfully loaded', userDocuments.length, 'documents for user:', userDirectory);
        console.log('FastAPI Processor: User documents data:', userDocuments);
        setProcessedDocuments(userDocuments);
      } else {
        console.log('FastAPI Processor: No documents found for user', userDirectory, ':', response.detail);
        // Set empty array for this user
        setProcessedDocuments([]);
      }
    } catch (error) {
      console.error('FastAPI Processor: Error loading documents for user', userDirectory, ':', error);
      // Set empty array on error to avoid showing other users' data
      setProcessedDocuments([]);
    }
  }, [user]);

  console.log('FastAPI Processor: Current state - user:', user?.id);
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
