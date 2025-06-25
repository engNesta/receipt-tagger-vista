
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface Receipt {
  id: number;
  imageUrl: string;
  vendor: string;
  price: string;
  productName: string;
  verificationLetter: string;
}

interface ReceiptCardProps {
  receipt: Receipt;
  selectedTag: string | null;
  onClick: () => void;
}

const ReceiptCard: React.FC<ReceiptCardProps> = ({ receipt, selectedTag, onClick }) => {
  const { getText } = useLanguage();

  const getDisplayValue = () => {
    if (!selectedTag) return null;
    
    switch (selectedTag) {
      case 'vendor':
        return { label: getText('vendor'), value: receipt.vendor };
      case 'price':
        return { label: getText('price'), value: receipt.price };
      case 'productName':
        return { label: getText('productName'), value: receipt.productName };
      case 'verificationLetter':
        return { label: getText('verificationLetter'), value: receipt.verificationLetter };
      default:
        return null;
    }
  };

  const displayInfo = getDisplayValue();

  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-105 bg-white cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-0">
        {/* Receipt Image */}
        <div className="aspect-[4/5] bg-gray-100 flex items-center justify-center border-b">
          <img
            src={receipt.imageUrl}
            alt={`Receipt ${receipt.id}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-gray-400">
                  <svg class="w-12 h-12 mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                  </svg>
                  <p class="text-xs font-medium">Receipt ${receipt.id}</p>
                </div>
              `;
            }}
          />
        </div>

        {/* Selected Tag Information */}
        <div className="p-3 min-h-[60px] flex items-center justify-center">
          {displayInfo ? (
            <div className="text-center w-full">
              <p className="text-xs text-gray-500 mb-1">{displayInfo.label}</p>
              <p className="font-semibold text-gray-900 text-sm truncate">{displayInfo.value}</p>
            </div>
          ) : (
            <p className="text-gray-400 text-xs italic">Select a tag to view information</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReceiptCard;
