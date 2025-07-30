
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Trans } from '@/components/Trans';
import type { Receipt } from '@/types';
import UnifiedControls from '@/components/receipts/UnifiedControls';
import ReceiptsGrid from '@/components/receipts/ReceiptsGrid';
import EmptyState from '@/components/receipts/EmptyState';

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
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
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
  onLoadMoreClick,
  isLoading,
  error,
  onRetry
}) => {

  console.log('ReceiptsSection render - Total receipts:', receipts.length);
  console.log('ReceiptsSection render - Filtered receipts:', filteredReceipts.length);
  console.log('ReceiptsSection render - Receipts data:', receipts);
  console.log('ReceiptsSection render - Filtered data:', filteredReceipts);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-center text-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            <Trans text="Your Receipts" />
          </h3>
          <p className="text-sm text-gray-600">
            {filteredReceipts.length} <Trans text="receipts found" />
          </p>
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
      {isLoading || error || filteredReceipts.length > 0 ? (
        isLoading || error ? (
          <EmptyState 
            isLoading={isLoading}
            error={error || undefined}
            showRetry={!!error}
            onRetryClick={onRetry}
          />
        ) : (
          <ReceiptsGrid
            receipts={filteredReceipts}
            selectedTag={selectedTag}
            onCardClick={onReceiptClick}
          />
        )
      ) : (
        <EmptyState 
          showRetry={true}
          onRetryClick={onRetry}
        />
      )}
    </div>
  );
};

export default ReceiptsSection;
