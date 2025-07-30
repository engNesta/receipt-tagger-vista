import React from 'react';
import type { Receipt } from '@/types';
import { Trans } from '@/components/Trans';

interface ReceiptDisplayInfoProps {
  receipt: Receipt;
  selectedTag: string | null;
}

const ReceiptDisplayInfo: React.FC<ReceiptDisplayInfoProps> = ({ receipt, selectedTag }) => {
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

  if (!displayInfo) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-400 text-sm italic">
          <Trans text="Select a category to view specific information" />
        </p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
      <p className="text-sm text-gray-600 mb-2">{displayInfo.label}</p>
      <p className="font-semibold text-gray-900 text-lg">{displayInfo.value}</p>
    </div>
  );
};

export default ReceiptDisplayInfo;