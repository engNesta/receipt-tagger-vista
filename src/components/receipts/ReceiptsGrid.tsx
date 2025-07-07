
import React from 'react';
import ReceiptCard from '@/components/ReceiptCard';
import type { Receipt } from '@/types';
import { APP_CONFIG } from '@/constants';

interface ReceiptsGridProps {
  receipts: Receipt[];
  selectedTag: string | null;
  onCardClick: (receipt: Receipt) => void;
}

const ReceiptsGrid: React.FC<ReceiptsGridProps> = React.memo(({ receipts, selectedTag, onCardClick }) => {
  console.log('ReceiptsGrid render - Receipts to display:', receipts.length);
  console.log('ReceiptsGrid render - Receipt data:', receipts);
  
  if (receipts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No documents found. Upload some documents to see them here.</p>
      </div>
    );
  }
  
  return (
    <div className={`grid ${APP_CONFIG.RECEIPT_GRID_COLUMNS.DEFAULT} gap-4`}>
      {receipts.map((receipt) => {
        console.log('Rendering receipt card:', receipt.id, receipt);
        return (
          <ReceiptCard
            key={receipt.id}
            receipt={receipt}
            selectedTag={selectedTag}
            onClick={() => onCardClick(receipt)}
          />
        );
      })}
    </div>
  );
});

ReceiptsGrid.displayName = 'ReceiptsGrid';

export default ReceiptsGrid;
