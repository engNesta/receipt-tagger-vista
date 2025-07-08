import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Loader2 } from 'lucide-react';

interface PendingFilesListProps {
  files: File[];
  isProcessing: boolean;
  onProcessFiles: () => void;
  onRemoveFile: (index: number) => void;
}

const PendingFilesList: React.FC<PendingFilesListProps> = ({
  files,
  isProcessing,
  onProcessFiles,
  onRemoveFile
}) => {
  if (files.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold">Ready to Process ({files.length})</h4>
        <Button
          onClick={onProcessFiles}
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
        {files.map((file, index) => (
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
              onClick={() => onRemoveFile(index)}
              disabled={isProcessing}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingFilesList;