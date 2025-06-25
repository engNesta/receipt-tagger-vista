import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';

interface Receipt {
  id: number;
  imageUrl: string;
  vendor: string;
  price: string;
  productName: string;
  verificationLetter: string;
}

interface ReceiptModalProps {
  receipt: Receipt | null;
  selectedTag: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ receipt, selectedTag, isOpen, onClose }) => {
  const { getText } = useLanguage();

  if (!receipt) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Receipt #{receipt.id}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Receipt Image */}
          <div className="aspect-[4/5] bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
            <img
              src={receipt.imageUrl}
              alt={`Receipt ${receipt.id}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = `
                  <div class="flex flex-col items-center justify-center h-full text-gray-400">
                    <svg class="w-16 h-16 mb-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                    </svg>
                    <p class="text-sm font-medium">Receipt ${receipt.id}</p>
                  </div>
                `;
              }}
            />
          </div>

          {/* Selected Tag Information */}
          {displayInfo ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-2">{displayInfo.label}</p>
              <p className="font-semibold text-gray-900 text-lg">{displayInfo.value}</p>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-400 text-sm italic">{getText('selectTagForInfo')}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptModal;
