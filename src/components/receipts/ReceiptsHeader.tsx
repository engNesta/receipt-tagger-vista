
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReceiptsHeaderProps {
  onLoadMoreClick: () => void;
}

const ReceiptsHeader: React.FC<ReceiptsHeaderProps> = ({ onLoadMoreClick }) => {
  const { getText } = useLanguage();

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{getText('title')}</h1>
            <p className="text-gray-600 mt-2">{getText('subtitle')}</p>
          </div>
          <Button
            onClick={onLoadMoreClick}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            {getText('loadMoreReceipts')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptsHeader;
