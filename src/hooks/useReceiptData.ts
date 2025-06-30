
import { useState } from 'react';

// Define the receipt interface for type safety
interface Receipt {
  id: number;
  imageUrl: string;
  vendor: string;
  price: string;
  productName: string;
  verificationLetter: string;
}

export const useReceiptData = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  const handleReceiptsAdded = () => {
    const newReceipts = [
      {
        id: receipts.length + 1,
        imageUrl: "/placeholder.svg",
        vendor: "Coop Konsum",
        price: "1 562 kr",
        productName: "Lunch & representation",
        verificationLetter: "V007"
      },
      {
        id: receipts.length + 2,
        imageUrl: "/placeholder.svg",
        vendor: "SJ AB",
        price: "1 895 kr",
        productName: "Tågresor företag",
        verificationLetter: "V008"
      }
    ];
    
    setReceipts(prevReceipts => [...prevReceipts, ...newReceipts]);
    console.log('Nya kvitton tillagda:', newReceipts.length);
  };

  return {
    receipts,
    handleReceiptsAdded
  };
};
