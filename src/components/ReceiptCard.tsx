
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

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
}

const ReceiptCard: React.FC<ReceiptCardProps> = ({ receipt, selectedTag }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-105 bg-white">
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

        {/* Receipt Information */}
        <div className="p-3 space-y-2">
          <div className={`${selectedTag === 'vendor' ? 'bg-blue-50 border border-blue-200 rounded px-2 py-1' : ''}`}>
            <p className="text-xs text-gray-500">Vendor</p>
            <p className="font-medium text-gray-900 text-sm truncate">{receipt.vendor}</p>
          </div>
          
          <div className={`${selectedTag === 'price' ? 'bg-blue-50 border border-blue-200 rounded px-2 py-1' : ''}`}>
            <p className="text-xs text-gray-500">Price</p>
            <p className="font-semibold text-gray-900 text-sm">{receipt.price}</p>
          </div>
          
          <div className={`${selectedTag === 'productName' ? 'bg-blue-50 border border-blue-200 rounded px-2 py-1' : ''}`}>
            <p className="text-xs text-gray-500">Product</p>
            <p className="font-medium text-gray-900 text-sm truncate">{receipt.productName}</p>
          </div>
          
          <div className={`${selectedTag === 'verificationLetter' ? 'bg-blue-50 border border-blue-200 rounded px-2 py-1' : ''}`}>
            <p className="text-xs text-gray-500">Verification</p>
            <p className="font-medium text-gray-900 text-sm">{receipt.verificationLetter}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReceiptCard;
