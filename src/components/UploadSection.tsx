
import React from 'react';
import ConsentDialog from './ConsentDialog';
import UploadArea from './UploadArea';
import FileStatusList from './FileStatusList';
import { useFileUpload } from '@/hooks/useFileUpload';

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
    isProcessing,
    stats,
    handleFilesUpload,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleConsentGiven,
    handleConsentDeclined,
    removeFile
  } = useFileUpload({ onUploadComplete });

  // Event handlers
  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      await handleFilesUpload(fileArray);
    }
  };

  // Styling variables
  const containerClass = isCompact ? "space-y-4" : "space-y-6";
  const isUploading = uploadingFiles.length > 0;

  return (
    <>
      <div className={containerClass}>
        {/* Upload Area with Drag & Drop */}
        <UploadArea
          isDragOver={isDragOver}
          isUploading={isUploading}
          isCompact={isCompact}
          stats={stats}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onFileInputChange={handleFileInputChange}
        />

        {/* File Processing Status */}
        <FileStatusList
          uploadingFiles={uploadingFiles}
          onRemoveFile={removeFile}
        />
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
