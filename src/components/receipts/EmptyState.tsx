
import React from 'react';
import { FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface EmptyStateProps {
  onUploadClick?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onUploadClick }) => {
  const { getText } = useLanguage();

  return (
    <div className="text-center py-16 px-4">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <FileText className="h-12 w-12 text-gray-400" />
        </div>
        
        {/* Content */}
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {getText('noReceiptsTitle')}
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {getText('noReceiptsDescription')}
        </p>
        
        {/* Action */}
        {onUploadClick && (
          <Button onClick={onUploadClick} className="inline-flex items-center gap-2">
            <Upload className="h-4 w-4" />
            {getText('uploadFirstReceipt')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
