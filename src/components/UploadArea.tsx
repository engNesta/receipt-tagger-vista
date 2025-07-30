
import React, { useRef } from 'react';
import { Upload, Loader2, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Trans } from '@/components/Trans';

interface UploadAreaProps {
  isDragOver: boolean;
  isUploading: boolean;
  isCompact?: boolean;
  stats: {
    totalProcessed: number;
    successCount: number;
    lastProcessed: Date | null;
  };
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({
  isDragOver,
  isUploading,
  isCompact = false,
  stats,
  onDrop,
  onDragOver,
  onDragLeave,
  onFileInputChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadAreaClass = isCompact
    ? "border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors"
    : "border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors";

  return (
    <div 
      className={`${uploadAreaClass} ${isDragOver ? 'border-blue-500 bg-blue-50' : ''}`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <Upload className={`mx-auto ${isCompact ? 'h-8 w-8' : 'h-12 w-12'} text-gray-400 mb-2`} />
      <h3 className={`${isCompact ? 'text-base' : 'text-lg'} font-semibold text-gray-900 mb-2`}>
        <Trans text="Upload Receipt Files" />
      </h3>
      <p className={`text-gray-600 mb-4 ${isCompact ? 'text-sm' : ''}`}>
        {isDragOver ? (
          <Trans text="Drop files here to process" />
        ) : (
          <Trans text="Drag & drop files or click to browse" />
        )}
      </p>
      
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,application/pdf"
        onChange={onFileInputChange}
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
              <Trans text="Choose Files" />
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
  );
};

export default UploadArea;
