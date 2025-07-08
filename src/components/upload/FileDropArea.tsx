import React from 'react';
import UploadArea from '../UploadArea';
import { PipelineStats } from '@/types';

interface FileDropAreaProps {
  isDragOver: boolean;
  isProcessing: boolean;
  isCompact?: boolean;
  stats: PipelineStats;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onFileInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileDropArea: React.FC<FileDropAreaProps> = ({
  isDragOver,
  isProcessing,
  isCompact = false,
  stats,
  onDrop,
  onDragOver,
  onDragLeave,
  onFileInputChange
}) => {
  return (
    <UploadArea
      isDragOver={isDragOver}
      isUploading={isProcessing}
      isCompact={isCompact}
      stats={stats}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onFileInputChange={onFileInputChange}
    />
  );
};

export default FileDropArea;