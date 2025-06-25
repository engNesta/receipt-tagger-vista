import React, { useState } from 'react';
import { Upload, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useConsent } from '@/hooks/useConsent';
import ConsentDialog from './ConsentDialog';

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
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<'upload' | 'sample' | null>(null);
  const { getText } = useLanguage();
  const { hasConsent, grantConsent } = useConsent();

  console.log('UploadSection - hasConsent:', hasConsent, 'showConsentDialog:', showConsentDialog);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log('File upload triggered, hasConsent:', hasConsent);
      
      if (!hasConsent) {
        console.log('No consent, showing dialog');
        setPendingAction('upload');
        setShowConsentDialog(true);
        return;
      }

      setIsLoading(true);
      console.log('Files selected:', files.length);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsLoading(false);
      onUploadComplete?.();
    }
  };

  const handleLoadSample = async () => {
    console.log('Load sample triggered, hasConsent:', hasConsent);
    
    if (!hasConsent) {
      console.log('No consent, showing dialog for sample');
      setPendingAction('sample');
      setShowConsentDialog(true);
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    onLoadSample?.();
  };

  const handleConsentGiven = async () => {
    console.log('Consent given, pending action:', pendingAction);
    grantConsent();
    setShowConsentDialog(false);
    
    // Execute the pending action
    if (pendingAction === 'upload') {
      // Trigger file input click
      const fileInput = document.getElementById(`file-upload-${isCompact ? 'modal' : 'main'}`);
      fileInput?.click();
    } else if (pendingAction === 'sample') {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
      onLoadSample?.();
    }
    
    setPendingAction(null);
  };

  const handleConsentDeclined = () => {
    console.log('Consent declined');
    setShowConsentDialog(false);
    setPendingAction(null);
  };

  const containerClass = isCompact 
    ? "space-y-4" 
    : "space-y-6";
    
  const uploadAreaClass = isCompact
    ? "border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors"
    : "border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors";

  return (
    <>
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

      <ConsentDialog
        isOpen={showConsentDialog}
        onConsent={handleConsentGiven}
        onDecline={handleConsentDeclined}
      />
    </>
  );
};

export default UploadSection;
