import React, { useState, useCallback, useRef } from 'react';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, X, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { useConsent } from '@/hooks/useConsent';
import { useFilePipeline } from '@/hooks/useFilePipeline';
import ConsentDialog from './ConsentDialog';

interface FileWithStatus {
  file: File;
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
  azureUrl?: string;
}

interface UploadSectionProps {
  onUploadComplete?: () => void;
  isCompact?: boolean;
}

const UploadSection: React.FC<UploadSectionProps> = ({ 
  onUploadComplete, 
  isCompact = false 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<FileWithStatus[]>([]);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { getText } = useLanguage();
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

  // Main file upload handler with Azure integration
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

    // Process files through the pipeline (now includes Azure storage)
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

    // Clear completed files after a delay
    setTimeout(() => {
      setUploadingFiles([]);
      onUploadComplete?.();
    }, 2000);
  };

  // Event handlers
  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      
      if (!hasConsent) {
        setPendingFiles(fileArray);
        setShowConsentDialog(true);
        return;
      }

      await handleFilesUpload(fileArray);
    }
  };

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

  const getStatusIcon = (status: FileWithStatus['status'], hasAzureUrl?: boolean) => {
    switch (status) {
      case 'completed':
        return hasAzureUrl ? <Cloud className="h-4 w-4 text-blue-500" /> : <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  // Styling variables
  const containerClass = isCompact ? "space-y-4" : "space-y-6";
  const uploadAreaClass = isCompact
    ? "border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors"
    : "border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors";

  const isUploading = uploadingFiles.length > 0;

  return (
    <>
      <div className={containerClass}>
        {/* Upload Area with Drag & Drop */}
        <div 
          className={`${uploadAreaClass} ${isDragOver ? 'border-blue-500 bg-blue-50' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className={`mx-auto ${isCompact ? 'h-8 w-8' : 'h-12 w-12'} text-gray-400 mb-2`} />
          <h3 className={`${isCompact ? 'text-base' : 'text-lg'} font-semibold text-gray-900 mb-2`}>
            {getText('uploadFiles')}
          </h3>
          <p className={`text-gray-600 mb-4 ${isCompact ? 'text-sm' : ''}`}>
            {isDragOver ? 'Drop files here to process' : 'Drag & drop files or click to browse'}
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,application/pdf"
            onChange={handleFileInputChange}
            className="hidden"
            id={`file-upload-${isCompact ? 'modal' : 'main'}`}
            disabled={isUploading}
          />
          
          <label htmlFor={`file-upload-${isCompact ? 'modal' : 'main'}`}>
            <Button asChild className="cursor-pointer" disabled={isUploading}>
              <span>
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Processing & Storing...
                  </>
                ) : (
                  getText('chooseFiles')
                )}
              </span>
            </Button>
          </label>

          {/* Processing Stats with Azure indicator */}
          {stats.totalProcessed > 0 && !isCompact && (
            <div className="mt-4 text-xs text-gray-500 flex items-center justify-center space-x-2">
              <Cloud className="h-3 w-3" />
              <span>
                Processed: {stats.totalProcessed} files • 
                Success: {stats.successCount} • 
                {stats.lastProcessed && ` Last: ${stats.lastProcessed.toLocaleTimeString()}`}
              </span>
            </div>
          )}
        </div>

        {/* File Processing Status */}
        {uploadingFiles.length > 0 && (
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-sm flex items-center space-x-2">
                <span>Processing & Storing Files</span>
                <Cloud className="h-4 w-4 text-blue-500" />
              </h4>
              <span className="text-xs text-gray-500">
                {uploadingFiles.filter(f => f.status === 'completed').length} / {uploadingFiles.length}
              </span>
            </div>
            
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {uploadingFiles.map((fileWithStatus) => (
                <div key={fileWithStatus.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded text-sm">
                  {getStatusIcon(fileWithStatus.status, !!fileWithStatus.azureUrl)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {fileWithStatus.file.name}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center space-x-2">
                      <span>{(fileWithStatus.file.size / 1024 / 1024).toFixed(2)} MB</span>
                      {fileWithStatus.azureUrl && (
                        <>
                          <span>•</span>
                          <span className="text-blue-600">Stored in cloud</span>
                        </>
                      )}
                    </p>
                  </div>
                  {fileWithStatus.status === 'processing' && (
                    <div className="w-16">
                      <Progress value={fileWithStatus.progress} className="h-1" />
                    </div>
                  )}
                  {fileWithStatus.status === 'completed' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(fileWithStatus.id)}
                      className="p-1 h-auto"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ConsentDialog
        isOpen={showConsentDialog}
        onConsent={handleConsentGiven}
        onDecline={handleConsentDeclined}
      />
    </>
  );
};

export default UploadSection;
