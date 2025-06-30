
import React, { useState, useCallback, useRef } from 'react';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAzureUpload } from '@/hooks/useAzureUpload';

interface FileWithStatus {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  progress: number;
  error?: string;
}

interface AzureUploadZoneProps {
  onUploadComplete?: (files: any[]) => void;
  maxFiles?: number;
}

const AzureUploadZone: React.FC<AzureUploadZoneProps> = ({ 
  onUploadComplete, 
  maxFiles = 10 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<FileWithStatus[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadFile, isUploading } = useAzureUpload();

  const processFile = async (fileWithStatus: FileWithStatus) => {
    setUploadingFiles(prev => prev.map(f => 
      f.id === fileWithStatus.id 
        ? { ...f, status: 'uploading', progress: 50 }
        : f
    ));

    try {
      const result = await uploadFile(fileWithStatus.file);
      
      if (result.success) {
        setUploadingFiles(prev => prev.map(f => 
          f.id === fileWithStatus.id 
            ? { ...f, status: 'completed', progress: 100 }
            : f
        ));
        return result;
      } else {
        setUploadingFiles(prev => prev.map(f => 
          f.id === fileWithStatus.id 
            ? { ...f, status: 'error', progress: 0, error: result.error }
            : f
        ));
        return null;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadingFiles(prev => prev.map(f => 
        f.id === fileWithStatus.id 
          ? { ...f, status: 'error', progress: 0, error: errorMessage }
          : f
      ));
      return null;
    }
  };

  const handleFiles = async (newFiles: File[]) => {
    const filesToProcess = newFiles.slice(0, maxFiles);
    
    const filesWithStatus: FileWithStatus[] = filesToProcess.map(file => ({
      file,
      id: `${Date.now()}-${Math.random()}`,
      status: 'pending',
      progress: 0
    }));

    setUploadingFiles(prev => [...prev, ...filesWithStatus]);

    const uploadResults = [];
    for (const fileWithStatus of filesWithStatus) {
      const result = await processFile(fileWithStatus);
      if (result) {
        uploadResults.push(result);
      }
    }

    onUploadComplete?.(uploadResults);

    // Clear completed files after delay
    setTimeout(() => {
      setUploadingFiles(prev => prev.filter(f => f.status !== 'completed'));
    }, 3000);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getStatusIcon = (status: FileWithStatus['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Upload to Azure Storage
        </h3>
        <p className="text-gray-600 mb-4">
          {isDragOver ? 'Drop files here to upload' : 'Drag & drop files or click to browse'}
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,application/pdf"
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        <Button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Uploading...
            </>
          ) : (
            'Choose Files'
          )}
        </Button>
      </div>

      {/* Upload Status */}
      {uploadingFiles.length > 0 && (
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm">Uploading to Azure</h4>
            <span className="text-xs text-gray-500">
              {uploadingFiles.filter(f => f.status === 'completed').length} / {uploadingFiles.length}
            </span>
          </div>
          
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {uploadingFiles.map((fileWithStatus) => (
              <div key={fileWithStatus.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded text-sm">
                {getStatusIcon(fileWithStatus.status)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {fileWithStatus.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(fileWithStatus.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {fileWithStatus.error && (
                    <p className="text-xs text-red-500">{fileWithStatus.error}</p>
                  )}
                </div>
                {fileWithStatus.status === 'uploading' && (
                  <div className="w-16">
                    <Progress value={fileWithStatus.progress} className="h-1" />
                  </div>
                )}
                {(fileWithStatus.status === 'completed' || fileWithStatus.status === 'error') && (
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
  );
};

export default AzureUploadZone;
