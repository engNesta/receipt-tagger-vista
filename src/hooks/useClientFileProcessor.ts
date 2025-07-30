import { useState, useCallback } from 'react';
import { useClientDocuments } from '@/contexts/ClientDocumentContext';
import type { ClientDocument } from '@/contexts/ClientDocumentContext';

interface UseClientFileProcessorProps {
  clientId: string;
  onUploadComplete?: (documents: ClientDocument[]) => void;
}

export const useClientFileProcessor = ({ 
  clientId, 
  onUploadComplete 
}: UseClientFileProcessorProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const { addDocuments } = useClientDocuments();

  const processFiles = useCallback(async (
    files: File[],
    month: string,
    category: string
  ): Promise<ClientDocument[]> => {
    if (files.length === 0) return [];

    setIsProcessing(true);
    setError(null);
    setProcessingProgress(0);

    try {
      // Simulate processing time for demonstration
      const totalFiles = files.length;
      const processed: ClientDocument[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Update progress
        setProcessingProgress(((i + 1) / totalFiles) * 100);
      }

      // Add all documents at once
      const documents = await addDocuments(clientId, month, category, files);
      processed.push(...documents);

      onUploadComplete?.(processed);
      return processed;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  }, [clientId, addDocuments, onUploadComplete]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isProcessing,
    processingProgress,
    error,
    processFiles,
    clearError
  };
};