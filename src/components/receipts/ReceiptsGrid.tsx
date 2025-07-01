
import React from 'react';
import ReceiptCard from '@/components/ReceiptCard';

interface Receipt {
  id: number;
  imageUrl: string;
  vendor: string;
  price: string;
  productName: string;
  verificationLetter: string;
}

interface ReceiptsGridProps {
  receipts: Receipt[];
  selectedTag: string | null;
  onCardClick: (receipt: Receipt) => void;
}

const ReceiptsGrid: React.FC<ReceiptsGridProps> = ({ receipts, selectedTag, onCardClick }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
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
};

export default ReceiptsGrid;
