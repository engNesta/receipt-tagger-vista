
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import FileViewer from '@/components/ui/file-viewer';
import type { Receipt } from '@/types';
import { Trans } from '@/components/Trans';

interface ReceiptCardProps {
  receipt: Receipt;
  selectedTag: string | null;
  onClick: () => void;
}

const ReceiptCard: React.FC<ReceiptCardProps> = React.memo(({ receipt, selectedTag, onClick }) => {
  const getDisplayValue = () => {
    if (!selectedTag) return null;
    
    switch (selectedTag) {
      case 'vendor':
        return { label: 'Vendor', value: receipt.vendor };
      case 'price':
        return { label: 'Amount', value: receipt.price };
      case 'productName':
        return { label: 'Product/Service', value: receipt.productName };
      case 'verificationLetter':
        return { label: 'Verification Number', value: receipt.verificationLetter };
      default:
        return null;
    }
  };

  const displayInfo = getDisplayValue();

  return (
    <Card 
      className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer bg-white border-gray-200 hover:border-blue-200"
      onClick={onClick}
    >
      <CardContent className="p-0">
        {/* Document Image */}
        <FileViewer
          src={receipt.imageUrl}
          alt={`Document ${receipt.id}`}
          className="group-hover:scale-105 transition-transform duration-300"
          aspectRatio="aspect-[3/4]"
          fallbackContent={
            <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50">
              <div className="bg-gray-100 rounded-full p-4 mb-3">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
                  <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
                </svg>
              </div>
              <p className="text-xs font-medium text-center px-2">Document {receipt.id}</p>
              <p className="text-xs text-gray-400 text-center px-2 mt-1">{receipt.productName}</p>
            </div>
          }
        />

        {/* Information Panel */}
        <div className="p-3 bg-white border-t border-gray-100">
          {displayInfo ? (
            <div className="space-y-1">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                {displayInfo.label}
              </p>
              <p className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
                {displayInfo.value}
              </p>
            </div>
          ) : (
            // Show basic info when no tag is selected
            <div className="space-y-2">
              <p className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
                {receipt.productName}
              </p>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">{receipt.vendor}</p>
                <p className="text-xs font-medium text-green-600">{receipt.price}</p>
              </div>
              <p className="text-xs text-gray-400 italic text-center">
                <Trans text="Select a category to view information" />
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

ReceiptCard.displayName = 'ReceiptCard';

export default ReceiptCard;
