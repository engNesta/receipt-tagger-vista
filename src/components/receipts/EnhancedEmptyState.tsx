
import React, { useState } from 'react';
import { FileText, Upload, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useConsent } from '@/hooks/useConsent';
import ConsentDialog from '../ConsentDialog';

interface EnhancedEmptyStateProps {
  onUploadClick: () => void;
  onLoadSampleClick: () => void;
}

const EnhancedEmptyState: React.FC<EnhancedEmptyStateProps> = ({
  onUploadClick,
  onLoadSampleClick
}) => {
  const { getText } = useLanguage();
  const { hasConsent, grantConsent } = useConsent();
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<'upload' | 'sample' | null>(null);

  const handleUploadClick = () => {
    if (!hasConsent) {
      setPendingAction('upload');
      setShowConsentDialog(true);
      return;
    }
    onUploadClick();
  };

  const handleLoadSampleClick = () => {
    if (!hasConsent) {
      setPendingAction('sample');
      setShowConsentDialog(true);
      return;
    }
    onLoadSampleClick();
  };

  const handleConsentGiven = () => {
    grantConsent();
    setShowConsentDialog(false);
    
    if (pendingAction === 'upload') {
      onUploadClick();
    } else if (pendingAction === 'sample') {
      onLoadSampleClick();
    }
    
    setPendingAction(null);
  };

  const handleConsentDeclined = () => {
    setShowConsentDialog(false);
    setPendingAction(null);
  };

  return (
    <>
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg mx-auto text-center">
          {/* Icon Container with proper spacing */}
          <div className="mb-8">
            <div className="bg-blue-50 rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-6 shadow-sm">
              <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600" />
            </div>
          </div>
          
          {/* Content Section with proper hierarchy */}
          <div className="mb-10">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 leading-tight">
              {getText('noReceiptsEmptyTitle')}
            </h3>
            
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
              Ladda upp dina kvitton eller utforska systemet med svenska exempeldata
            </p>
          </div>

          {/* Action Buttons with proper spacing - centered */}
          <div className="flex flex-col items-center space-y-6 mb-10">
            <Button 
              onClick={handleUploadClick}
              size="lg"
              className="w-full sm:w-auto min-w-[200px] flex items-center justify-center gap-3 px-8 py-4 text-base font-medium shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Upload size={20} />
              {getText('uploadYourReceipts')}
            </Button>
            
            {/* Divider with better visual balance */}
            <div className="flex items-center gap-4 py-2 w-full max-w-xs">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-gray-400 font-medium px-2">eller</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <Button 
              onClick={handleLoadSampleClick}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto min-w-[200px] flex items-center justify-center gap-3 px-8 py-4 text-base font-medium border-2 hover:bg-gray-50 transition-all duration-200"
            >
              <Plus size={20} />
              {getText('trySampleData')}
            </Button>
          </div>

          {/* Footer Information with proper spacing */}
          <div className="pt-6 border-t border-gray-100">
            <div className="space-y-2 text-sm text-gray-500">
              <p className="font-medium">Filformat som stöds: JPG, PNG, PDF</p>
              <p className="text-xs opacity-80">Optimerat för svenska kvitton och redovisning</p>
            </div>
          </div>
        </div>
      </div>

      <ConsentDialog
        isOpen={showConsentDialog}
        onConsent={handleConsentGiven}
        onDecline={handleConsentDeclined}
      />
    </>
  );
};

export default EnhancedEmptyState;
