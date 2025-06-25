
import React from 'react';
import { FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const EmptyState: React.FC = () => {
  const { getText } = useLanguage();

  return (
    <div className="text-center py-12">
      <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{getText('noReceiptsTitle')}</h3>
      <p className="text-gray-600">{getText('noReceiptsDescription')}</p>
    </div>
  );
};

export default EmptyState;
