import React from 'react';

interface ProcessingProgressProps {
  progress: {
    current: number;
    total: number;
    currentFile: string;
  } | null;
}

const ProcessingProgress: React.FC<ProcessingProgressProps> = ({ progress }) => {
  if (!progress) return null;

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">Processing Files</h4>
        <span className="text-sm text-gray-600">
          {progress.current} / {progress.total}
        </span>
      </div>
      <div className="mb-2">
        <div className="bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${(progress.current / progress.total) * 100}%` 
            }}
          />
        </div>
      </div>
      <p className="text-sm text-gray-600">
        Currently processing: {progress.currentFile}
      </p>
    </div>
  );
};

export default ProcessingProgress;