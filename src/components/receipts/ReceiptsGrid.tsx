
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
  return (
    <div className={`grid ${APP_CONFIG.RECEIPT_GRID_COLUMNS.DEFAULT} gap-4`}>
      {receipts.map((receipt) => (
        <ReceiptCard
          key={receipt.id}
          receipt={receipt}
          selectedTag={selectedTag}
          onClick={() => onCardClick(receipt)}
        />
      ))}
    </div>
  );
});

ReceiptsGrid.displayName = 'ReceiptsGrid';

export default ReceiptsGrid;
