
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Receipt } from '@/types';
import UnifiedControls from '@/components/receipts/UnifiedControls';
import ReceiptsGrid from '@/components/receipts/ReceiptsGrid';
import EmptyState from '@/components/receipts/EmptyState';
import CleanupButton from '@/components/CleanupButton';

interface ReceiptsSectionProps {
  receipts: Receipt[];
  filteredReceipts: Receipt[];
  selectedTag: string | null;
  searchTerm: string;
  sortOrder: 'asc' | 'desc' | null;
  onTagClick: (tag: string | null) => void;
  onSearchChange: (term: string) => void;
  onSortClick: (order: 'asc' | 'desc') => void;
  onReceiptClick: (receipt: Receipt) => void;
  onLoadMoreClick: () => void;
}

const ReceiptsSection: React.FC<ReceiptsSectionProps> = ({
  receipts,
  filteredReceipts,
  selectedTag,
  searchTerm,
  sortOrder,
  onTagClick,
  onSearchChange,
  onSortClick,
  onReceiptClick,
  onLoadMoreClick
}) => {
  const { getText } = useLanguage();

  const handleCleanupComplete = () => {
    // Force a page reload to refresh the receipts after cleanup
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* Section Header with Load More Button and Cleanup Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{getText('yourReceipts')}</h3>
          <p className="text-sm text-gray-600">{filteredReceipts.length} {getText('receiptsFound')}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <CleanupButton 
            onCleanupComplete={handleCleanupComplete}
            variant="outline"
            size="default"
          />
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={onLoadMoreClick}
          >
            <Plus className="h-4 w-4" />
            {getText('loadMoreFiles')}
          </Button>
        </div>
      </div>

      {/* Controls */}
      <UnifiedControls
        selectedTag={selectedTag}
        onTagClick={onTagClick}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        sortOrder={sortOrder}
        onSortClick={onSortClick}
      />

      {/* Receipts Grid or Empty State */}
      {filteredReceipts.length > 0 ? (
        <ReceiptsGrid
          receipts={filteredReceipts}
          selectedTag={selectedTag}
          onCardClick={onReceiptClick}
        />
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default ReceiptsSection;
