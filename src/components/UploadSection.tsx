import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Loader2 } from 'lucide-react';
import GDPRConsentDialog from './GDPRConsentDialog';
import UploadArea from './UploadArea';
import FileStatusList from './FileStatusList';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useFastApiProcessor } from '@/hooks/useFastApiProcessor';
import { useToast } from '@/hooks/use-toast';

interface UploadSectionProps {
  onUploadComplete?: (processedFiles?: any[]) => void;
  isCompact?: boolean;
}

const UploadSection: React.FC<UploadSectionProps> = ({ 
  onUploadComplete, 
  isCompact = false 
}) => {
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const { toast } = useToast();
  
  const {
    isDragOver,
    uploadingFiles,
    showConsentDialog,
    stats,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleConsentGiven,
    handleConsentDeclined,
    removeFile
  } = useFileUpload({ onUploadComplete });

  const {
    isProcessing,
    processingProgress,
    processFiles
  } = useFastApiProcessor();

  // Handle file selection (don't process immediately)
  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      console.log('UploadSection: Files selected:', fileArray.map(f => f.name));
      setPendingFiles(prev => [...prev, ...fileArray]);
    }
  };

  // Handle drag and drop (don't process immediately)
  const handleDropFiles = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    console.log('UploadSection: Files dropped:', droppedFiles.map(f => f.name));
    setPendingFiles(prev => [...prev, ...droppedFiles]);
    handleDrop(e); // For visual feedback
  };

  // Process all pending files through FastAPI
  const handleProcessFiles = async () => {
    if (pendingFiles.length === 0) return;

    console.log('UploadSection: Starting to process', pendingFiles.length, 'files through FastAPI');

    try {
      const result = await processFiles(pendingFiles);
      console.log('UploadSection: Processing completed:', result);
      
      // Clear pending files after successful processing
      setPendingFiles([]);
      
      // Show success toast
      toast({
        title: "Files processed successfully!",
        description: `${pendingFiles.length} files have been processed and saved.`,
        className: "bg-green-50 border-green-200 text-green-800",
      });
      
      // Notify parent component
      if (onUploadComplete) {
        console.log('UploadSection: Notifying parent of upload completion');
        onUploadComplete([]);
      }
    } catch (error) {
      console.error('UploadSection: Processing failed:', error);
      toast({
        title: "Processing failed",
        description: "There was an error processing your files. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Remove file from pending list
  const removePendingFile = (index: number) => {
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const containerClass = isCompact ? "space-y-4" : "space-y-6";
  const hasPendingFiles = pendingFiles.length > 0;

  return (
    <>
      <div className={containerClass}>
        {/* Upload Area */}
        <UploadArea
          isDragOver={isDragOver}
          isUploading={isProcessing}
          isCompact={isCompact}
          stats={stats}
          onDrop={handleDropFiles}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onFileInputChange={handleFileInputChange}
        />

        {/* Pending Files List */}
        {hasPendingFiles && (
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Ready to Process ({pendingFiles.length})</h4>
              <Button
                onClick={handleProcessFiles}
                disabled={isProcessing}
                className="flex items-center gap-2"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isProcessing ? 'Processing...' : 'Process Files'}
              </Button>
            </div>
            
            <div className="space-y-2">
              {pendingFiles.map((file, index) => (
                <div key={`${file.name}-${index}`} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePendingFile(index)}
                    disabled={isProcessing}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Processing Progress */}
        {processingProgress && (
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Processing Files</h4>
              <span className="text-sm text-gray-600">
                {processingProgress.current} / {processingProgress.total}
              </span>
            </div>
            <div className="mb-2">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(processingProgress.current / processingProgress.total) * 100}%` 
                  }}
                />
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Currently processing: {processingProgress.currentFile}
            </p>
          </div>
        )}

        {/* File Processing Status (keep existing for Azure uploads) */}
        <FileStatusList
          uploadingFiles={uploadingFiles}
          onRemoveFile={removeFile}
        />
      </div>

      <GDPRConsentDialog
        isOpen={showConsentDialog}
        onConsent={handleConsentGiven}
        onDecline={handleConsentDeclined}
      />
    </>
  );
};

export default UploadSection;
