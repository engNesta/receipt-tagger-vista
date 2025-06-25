
import React, { useState } from 'react';
import { Upload, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface UploadSectionProps {
  onUploadComplete?: () => void;
  onLoadSample?: () => void;
  showSampleOption?: boolean;
  isCompact?: boolean;
}

const UploadSection: React.FC<UploadSectionProps> = ({ 
  onUploadComplete, 
  onLoadSample,
  showSampleOption = true,
  isCompact = false 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { getText } = useLanguage();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setIsLoading(true);
      console.log('Files selected:', files.length);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsLoading(false);
      onUploadComplete?.();
    }
  };

  const handleLoadSample = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    onLoadSample?.();
  };

  const containerClass = isCompact 
    ? "space-y-4" 
    : "space-y-6";
    
  const uploadAreaClass = isCompact
    ? "border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors"
    : "border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors";

  return (
    <div className={containerClass}>
      {/* Upload Files Option */}
      <div className={uploadAreaClass}>
        <Upload className={`mx-auto ${isCompact ? 'h-8 w-8' : 'h-12 w-12'} text-gray-400 mb-2`} />
        <h3 className={`${isCompact ? 'text-base' : 'text-lg'} font-semibold text-gray-900 mb-2`}>
          {getText('uploadFiles')}
        </h3>
        <p className={`text-gray-600 mb-4 ${isCompact ? 'text-sm' : ''}`}>
          {getText('uploadDescription')}
        </p>
        <input
          type="file"
          multiple
          accept="image/*,application/pdf"
          onChange={handleFileUpload}
          className="hidden"
          id={`file-upload-${isCompact ? 'modal' : 'main'}`}
          disabled={isLoading}
        />
        <label htmlFor={`file-upload-${isCompact ? 'modal' : 'main'}`}>
          <Button asChild className="cursor-pointer" disabled={isLoading}>
            <span>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {getText('loadingReceipts')}
                </>
              ) : (
                getText('chooseFiles')
              )}
            </span>
          </Button>
        </label>
      </div>

      {showSampleOption && (
        <>
          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Use Sample Data Option */}
          <div className="text-center">
            <h3 className={`${isCompact ? 'text-base' : 'text-lg'} font-semibold text-gray-900 mb-2`}>
              {getText('useSample')}
            </h3>
            <p className={`text-gray-600 mb-4 ${isCompact ? 'text-sm' : ''}`}>
              {getText('sampleDescription')}
            </p>
            <Button 
              onClick={handleLoadSample}
              disabled={isLoading}
              className="flex items-center gap-2 mx-auto"
              size={isCompact ? "sm" : "lg"}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {getText('loadingReceipts')}
                </>
              ) : (
                <>
                  {getText('loadSampleData')}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default UploadSection;
