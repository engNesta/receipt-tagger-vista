import React from 'react';
import OptimizedImage from '@/components/ui/optimized-image';
import type { Receipt } from '@/types';

interface ReceiptImageProps {
  receipt: Receipt;
}

const ReceiptImage: React.FC<ReceiptImageProps> = ({ receipt }) => {
  return (
    <div className="aspect-[4/5] bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
      <OptimizedImage
        src={receipt.imageUrl}
        alt={`Receipt ${receipt.id}`}
        className="group-hover:scale-105 transition-transform duration-300"
        aspectRatio="aspect-[4/5]"
        fallbackContent={
          <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50">
            <div className="bg-gray-100 rounded-full p-4 mb-3">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm font-medium text-center px-2">Receipt {receipt.id}</p>
          </div>
        }
      />
    </div>
  );
};

export default ReceiptImage;