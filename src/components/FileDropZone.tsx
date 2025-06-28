
import React, { useState, useCallback, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface FileWithStatus {
  file: File;
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
}

interface FileDropZoneProps {
  onFilesProcessed?: (files: File[]) => void;
  acceptedTypes?: string[];
  maxFiles?: number;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({
  onFilesProcessed,
  acceptedTypes = ['image/*', 'application/pdf'],
  maxFiles = 10
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getText } = useLanguage();

  const processFile = async (fileWithStatus: FileWithStatus): Promise<void> => {
    return new Promise((resolve) => {
      // Simulate file processing with progress updates
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setFiles(prev => prev.map(f => 
            f.id === fileWithStatus.id 
              ? { ...f, status: 'completed', progress: 100 }
              : f
          ));
          resolve();
        } else {
          setFiles(prev => prev.map(f => 
            f.id === fileWithStatus.id 
              ? { ...f, status: 'processing', progress }
              : f
          ));
        }
      }, 100);
    });
  };

  const handleFiles = async (newFiles: File[]) => {
    const filesWithStatus: FileWithStatus[] = newFiles.slice(0, maxFiles).map(file => ({
      file,
      id: `${Date.now()}-${Math.random()}`,
      status: 'pending',
      progress: 0
    }));

    setFiles(prev => [...prev, ...filesWithStatus]);
    setIsProcessing(true);

    // Process files through pipeline
    for (const fileWithStatus of filesWithStatus) {
      await processFile(fileWithStatus);
    }

    setIsProcessing(false);
    onFilesProcessed?.(newFiles);
    console.log('Files processed through pipeline:', newFiles.length);
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

  const clearCompletedFiles = () => {
    setFiles(prev => prev.filter(f => f.status !== 'completed'));
  };

  const getStatusIcon = (status: FileWithStatus['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
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
          Drop files here to process
        </h3>
        <p className="text-gray-600 mb-4">
          Drag and drop files or click to browse
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        <Button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Choose Files'}
        </Button>
      </div>

      {/* File Processing Status */}
      {files.length > 0 && (
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Processing Pipeline</h4>
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearCompletedFiles}
              disabled={isProcessing}
            >
              Clear Completed
            </Button>
          </div>
          
          <div className="space-y-2">
            {files.map((fileWithStatus) => (
              <div key={fileWithStatus.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                {getStatusIcon(fileWithStatus.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {fileWithStatus.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(fileWithStatus.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                {fileWithStatus.status === 'processing' && (
                  <div className="w-20">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${fileWithStatus.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                <span className="text-xs text-gray-500 capitalize">
                  {fileWithStatus.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileDropZone;
