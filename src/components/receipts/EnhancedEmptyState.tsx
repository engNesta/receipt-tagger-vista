
import React from 'react';
import { FileText, Upload, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface EnhancedEmptyStateProps {
  onUploadClick: () => void;
  onLoadSampleClick: () => void;
}

const EnhancedEmptyState: React.FC<EnhancedEmptyStateProps> = ({
  onUploadClick,
  onLoadSampleClick
}) => {
  const { getText } = useLanguage();

  return (
    <div className="text-center py-16 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-blue-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <FileText className="h-12 w-12 text-blue-600" />
        </div>
        
        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
          {getText('noReceiptsTitle')}
        </h3>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Get started by uploading your first receipt or exploring with sample data
        </p>

        <div className="space-y-4">
          <Button 
            onClick={onUploadClick}
            size="lg"
            className="w-full sm:w-auto flex items-center gap-3 px-8 py-3"
          >
            <Upload size={20} />
            Upload Your Receipts
          </Button>
          
          <div className="flex items-center gap-3 text-gray-400">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <Button 
            onClick={onLoadSampleClick}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto flex items-center gap-3 px-8 py-3"
          >
            <Plus size={20} />
            Try Sample Data
          </Button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Supported formats: JPG, PNG, PDF</p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedEmptyState;
