
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, FileText, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FileDropZone from '@/components/FileDropZone';
import { useFilePipeline } from '@/hooks/useFilePipeline';

const FileProcessor = () => {
  const navigate = useNavigate();
  const { processedFiles, isProcessing, stats, processFiles, clearProcessedFiles } = useFilePipeline();

  const handleFilesProcessed = async (files: File[]) => {
    const result = await processFiles(files);
    console.log('Processing result:', result);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/receipts')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Receipts
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">File Processor</h1>
                <p className="text-sm text-gray-500">Drop files to detect and process them automatically</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-green-500" />
                <span>Processed: {stats.totalProcessed}</span>
              </div>
              {stats.lastProcessed && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>Last: {stats.lastProcessed.toLocaleTimeString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Drop Zone */}
          <div>
            <FileDropZone 
              onFilesProcessed={handleFilesProcessed}
              acceptedTypes={['image/*', 'application/pdf', '.txt', '.csv']}
              maxFiles={20}
            />
          </div>

          {/* Processed Files Panel */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Processed Files</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearProcessedFiles}
                disabled={processedFiles.length === 0}
              >
                Clear All
              </Button>
            </div>
            
            {processedFiles.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No files processed yet</p>
                <p className="text-sm text-gray-400 mt-1">Drop files to see them here</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {processedFiles.map((processedFile) => (
                  <div key={processedFile.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {processedFile.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(processedFile.metadata.size / 1024 / 1024).toFixed(2)} MB • 
                        {new Date(processedFile.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stats Summary */}
            {stats.totalProcessed > 0 && (
              <div className="mt-6 pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Success:</span>
                    <span className="ml-2 font-medium text-green-600">{stats.successCount}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Errors:</span>
                    <span className="ml-2 font-medium text-red-600">{stats.errorCount}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileProcessor;
