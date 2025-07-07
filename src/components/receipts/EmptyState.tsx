
import React from 'react';
import { FileText, Upload, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface EmptyStateProps {
  onUploadClick?: () => void;
  onRetryClick?: () => void;
  error?: string;
  isLoading?: boolean;
  showRetry?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  onUploadClick, 
  onRetryClick, 
  error, 
  isLoading, 
  showRetry 
}) => {
  const { getText } = useLanguage();

  if (isLoading) {
    return (
      <div className="text-center py-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-blue-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <RefreshCw className="h-12 w-12 text-blue-600 animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Loading Documents...
          </h3>
          <p className="text-gray-600">
            Please wait while we fetch your documents.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-red-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Connection Error
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {error}
          </p>
          <div className="flex gap-3 justify-center">
            {showRetry && onRetryClick && (
              <Button onClick={onRetryClick} variant="outline" className="inline-flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            )}
            {onUploadClick && (
              <Button onClick={onUploadClick} className="inline-flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Documents
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-16 px-4">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <FileText className="h-12 w-12 text-gray-400" />
        </div>
        
        {/* Content */}
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          No Documents Found
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Start by uploading some documents to see them processed and displayed here.
        </p>
        
        {/* Action */}
        <div className="flex gap-3 justify-center">
          {showRetry && onRetryClick && (
            <Button onClick={onRetryClick} variant="outline" className="inline-flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          )}
          {onUploadClick && (
            <Button onClick={onUploadClick} className="inline-flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Documents
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
