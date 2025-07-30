
import React from 'react';
import UploadSection from '@/components/UploadSection';
import type { ProcessedFile } from '@/types';
import { Trans } from '@/components/Trans';

interface UploadHeroProps {
  onUploadComplete?: (processedFiles?: ProcessedFile[]) => void;
}

const UploadHero: React.FC<UploadHeroProps> = ({ onUploadComplete }) => {
  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          <Trans text="Upload Receipt Files" />
        </h2>
        <p className="text-gray-600">
          <Trans text="Drag and drop files here or click to select" />
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <UploadSection onUploadComplete={onUploadComplete} />
      </div>
    </div>
  );
};

export default UploadHero;
