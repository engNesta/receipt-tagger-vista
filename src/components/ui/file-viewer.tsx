import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { FileText, Download } from 'lucide-react';
import OptimizedImage from './optimized-image';

interface FileViewerProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  fallbackContent?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
}

const FileViewer: React.FC<FileViewerProps> = ({
  src,
  alt,
  className,
  aspectRatio = "aspect-[3/4]",
  fallbackContent,
  onLoad,
  onError
}) => {
  const [fileType, setFileType] = useState<'image' | 'pdf' | 'unknown'>('unknown');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Determine file type from URL or extension
    const url = src.toLowerCase();
    if (url.includes('.pdf') || url.includes('pdf')) {
      setFileType('pdf');
    } else if (url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg') || url.includes('image')) {
      setFileType('image');
    } else {
      setFileType('unknown');
    }
    setIsLoading(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  if (isLoading) {
    return (
      <div className={cn(aspectRatio, "relative overflow-hidden bg-gray-50", className)}>
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (hasError || fileType === 'unknown') {
    return (
      <div className={cn(aspectRatio, "relative overflow-hidden bg-gray-50", className)}>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
          {fallbackContent || (
            <>
              <div className="bg-gray-100 rounded-full p-4 mb-3">
                <FileText className="w-8 h-8" />
              </div>
              <p className="text-xs font-medium text-center px-2">File unavailable</p>
            </>
          )}
        </div>
      </div>
    );
  }

  if (fileType === 'image') {
    return (
      <OptimizedImage
        src={src}
        alt={alt}
        className={className}
        aspectRatio={aspectRatio}
        fallbackContent={fallbackContent}
        onLoad={handleLoad}
        onError={handleError}
      />
    );
  }

  if (fileType === 'pdf') {
    return (
      <div className={cn(aspectRatio, "relative overflow-hidden bg-gray-50 border border-gray-200", className)}>
        <div className="absolute inset-0 flex flex-col">
          {/* PDF Preview Header */}
          <div className="bg-gray-100 px-3 py-2 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-red-600" />
              <span className="text-xs font-medium text-gray-700">PDF Document</span>
            </div>
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
            >
              <Download className="w-3 h-3" />
              Open
            </a>
          </div>
          
          {/* PDF Iframe */}
          <div className="flex-1 relative">
            <iframe
              src={`${src}#toolbar=0&navpanes=0&scrollbar=0`}
              className="absolute inset-0 w-full h-full border-0"
              title={alt}
              onLoad={handleLoad}
              onError={handleError}
            />
            
            {/* Overlay for PDF interaction */}
            <div className="absolute inset-0 bg-transparent group-hover:bg-black group-hover:bg-opacity-5 transition-all duration-300 pointer-events-none" />
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default FileViewer;