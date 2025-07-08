import React from 'react';
import GDPRConsentDialog from './GDPRConsentDialog';
import FileStatusList from './FileStatusList';
import FileDropArea from './upload/FileDropArea';
import PendingFilesList from './upload/PendingFilesList';
import ProcessingProgress from './upload/ProcessingProgress';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useFileProcessor } from '@/hooks/useFileProcessor';

interface UploadSectionProps {
  onUploadComplete?: (processedFiles?: any[]) => void;
  isCompact?: boolean;
}

const UploadSection: React.FC<UploadSectionProps> = ({ 
  onUploadComplete, 
  isCompact = false 
}) => {
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
    pendingFiles,
    isProcessing,
    processingProgress,
    addFiles,
    removeFile: removePendingFile,
    processAllFiles
  } = useFileProcessor({ onUploadComplete });

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      addFiles(Array.from(files));
    }
  };

  const handleDropFiles = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
    handleDrop(e);
  };

  const containerClass = isCompact ? "space-y-4" : "space-y-6";

  return (
    <>
      <div className={containerClass}>
        <FileDropArea
          isDragOver={isDragOver}
          isProcessing={isProcessing}
          isCompact={isCompact}
          stats={stats}
          onDrop={handleDropFiles}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onFileInputChange={handleFileInputChange}
        />

        <PendingFilesList
          files={pendingFiles}
          isProcessing={isProcessing}
          onProcessFiles={processAllFiles}
          onRemoveFile={removePendingFile}
        />

        <ProcessingProgress progress={processingProgress} />

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
