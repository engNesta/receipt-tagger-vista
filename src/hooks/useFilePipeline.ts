
import { useState, useCallback } from 'react';

interface ProcessedFile {
  file: File;
  id: string;
  timestamp: number;
  metadata: {
    size: number;
    type: string;
    lastModified: number;
  };
}

interface PipelineStats {
  totalProcessed: number;
  successCount: number;
  errorCount: number;
  lastProcessed: Date | null;
}

export const useFilePipeline = () => {
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<PipelineStats>({
    totalProcessed: 0,
    successCount: 0,
    errorCount: 0,
    lastProcessed: null
  });

  const detectNewFiles = useCallback((newFiles: File[], existingFiles: ProcessedFile[]) => {
    const existingFileHashes = new Set(
      existingFiles.map(f => `${f.file.name}-${f.file.size}-${f.file.lastModified}`)
    );
    
    return newFiles.filter(file => {
      const fileHash = `${file.name}-${file.size}-${file.lastModified}`;
      return !existingFileHashes.has(fileHash);
    });
  }, []);

  const processFiles = useCallback(async (files: File[]) => {
    console.log('Pipeline: Processing', files.length, 'files');
    setIsProcessing(true);

    const newFiles = detectNewFiles(files, processedFiles);
    console.log('Pipeline: Detected', newFiles.length, 'new files');

    if (newFiles.length === 0) {
      setIsProcessing(false);
      return { processed: [], skipped: files.length };
    }

    const processed: ProcessedFile[] = [];
    let successCount = 0;
    let errorCount = 0;

    for (const file of newFiles) {
      try {
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const processedFile: ProcessedFile = {
          file,
          id: `${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
          metadata: {
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
          }
        };

        processed.push(processedFile);
        successCount++;
        console.log('Pipeline: Successfully processed', file.name);
      } catch (error) {
        console.error('Pipeline: Error processing', file.name, error);
        errorCount++;
      }
    }

    setProcessedFiles(prev => [...prev, ...processed]);
    setStats(prev => ({
      totalProcessed: prev.totalProcessed + processed.length,
      successCount: prev.successCount + successCount,
      errorCount: prev.errorCount + errorCount,
      lastProcessed: new Date()
    }));

    setIsProcessing(false);
    
    return { 
      processed, 
      skipped: files.length - newFiles.length,
      errors: errorCount 
    };
  }, [processedFiles, detectNewFiles]);

  const clearProcessedFiles = useCallback(() => {
    setProcessedFiles([]);
    setStats({
      totalProcessed: 0,
      successCount: 0,
      errorCount: 0,
      lastProcessed: null
    });
  }, []);

  return {
    processedFiles,
    isProcessing,
    stats,
    processFiles,
    clearProcessedFiles,
    detectNewFiles
  };
};
