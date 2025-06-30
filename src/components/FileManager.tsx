
import React from 'react';
import { FileText, Download, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFileList } from '@/hooks/useFileList';
import { useToast } from '@/hooks/use-toast';

const FileManager: React.FC = () => {
  const { files, loading, deleteFile, refetch } = useFileList();
  const { toast } = useToast();

  const handleDelete = async (fileId: string, fileName: string) => {
    try {
      await deleteFile(fileId);
      toast({
        title: "File Deleted",
        description: `${fileName} has been deleted.`,
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : 'Failed to delete file',
        variant: "destructive",
      });
    }
  };

  const handleDownload = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading files...</div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center p-8">
        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No files uploaded yet</p>
        <p className="text-sm text-gray-400 mt-1">Upload files to see them here</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Your Files</h3>
          <Button variant="outline" size="sm" onClick={refetch}>
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="divide-y">
        {files.map((file) => (
          <div key={file.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium text-gray-900">{file.original_name}</p>
                <p className="text-sm text-gray-500">
                  {(file.file_size / 1024 / 1024).toFixed(2)} MB • 
                  {new Date(file.created_at).toLocaleDateString()} • 
                  <span className={`capitalize ${
                    file.upload_status === 'completed' ? 'text-green-600' : 
                    file.upload_status === 'failed' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {file.upload_status}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(file.azure_blob_url, '_blank')}
                title="View in Azure"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownload(file.azure_blob_url, file.original_name)}
                title="Download"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(file.id, file.original_name)}
                title="Delete"
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileManager;
