
import React from 'react';
import { FileText, CheckCircle, AlertCircle, Loader2, X, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface FileWithStatus {
  file: File;
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
  azureUrl?: string;
}

interface FileStatusListProps {
  uploadingFiles: FileWithStatus[];
  onRemoveFile: (fileId: string) => void;
}

const FileStatusList: React.FC<FileStatusListProps> = ({ uploadingFiles, onRemoveFile }) => {
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

  if (uploadingFiles.length === 0) {
    return null;
  }

  return (
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
                onClick={() => onRemoveFile(fileWithStatus.id)}
                className="p-1 h-auto"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileStatusList;
