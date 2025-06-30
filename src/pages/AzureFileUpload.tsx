
import React from 'react';
import { Cloud, FileText } from 'lucide-react';
import AzureUploadZone from '@/components/AzureUploadZone';
import FileManager from '@/components/FileManager';

const AzureFileUpload: React.FC = () => {
  const handleUploadComplete = (files: any[]) => {
    console.log('Files uploaded:', files);
    // Refresh file list will happen automatically via the FileManager component
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Cloud className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">Azure File Upload</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Zone */}
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Upload Files</h2>
              <p className="text-gray-600">
                Files are securely uploaded to Azure Blob Storage and tracked in your database.
              </p>
            </div>
            <AzureUploadZone onUploadComplete={handleUploadComplete} />
          </div>

          {/* File Manager */}
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">File Manager</h2>
              <p className="text-gray-600">
                View, download, and manage your uploaded files.
              </p>
            </div>
            <FileManager />
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <FileText className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Azure Integration Features</h3>
              <ul className="text-blue-800 space-y-1">
                <li>• Secure file uploads directly to Azure Blob Storage</li>
                <li>• File metadata tracked in Supabase database</li>
                <li>• User-specific file access with Row Level Security</li>
                <li>• Support for images, PDFs, and other document types</li>
                <li>• Real-time upload progress and status tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AzureFileUpload;
