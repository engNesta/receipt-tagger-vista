
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import UploadSection from '@/components/UploadSection';
import type { ProcessedFile } from '@/types';

interface UploadHeroProps {
  onUploadComplete?: (processedFiles?: ProcessedFile[]) => void;
}

const UploadHero: React.FC<UploadHeroProps> = ({ onUploadComplete }) => {
  const { getText } = useLanguage();

  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{getText('uploadFiles')}</h2>
        <p className="text-gray-600">{getText('dragDropUpload')}</p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <UploadSection onUploadComplete={onUploadComplete} />
      </div>
    </div>
  );
};

export default UploadHero;
