
import { useState } from 'react';

// Swedish sample receipt data with SEK currency and Swedish businesses
const sampleReceipts = [
  {
    id: 1,
    imageUrl: "/placeholder.svg",
    vendor: "ICA Supermarket",
    price: "1 247 kr",
    productName: "Livsmedel & kontorsmaterial",
    verificationLetter: "V001"
  },
  {
    id: 2,
    imageUrl: "/placeholder.svg", 
    vendor: "Telia Company AB",
    price: "2 450 kr",
    productName: "Företagstelefoni månadskostnad",
    verificationLetter: "V002"
  },
  {
    id: 3,
    imageUrl: "/placeholder.svg",
    vendor: "Staples Sverige",
    price: "895 kr",
    productName: "Kontorsmaterial",
    verificationLetter: "V003"
  },
  {
    id: 4,
    imageUrl: "/placeholder.svg",
    vendor: "Tryckerigruppen AB",
    price: "2 347 kr",
    productName: "Marknadsföringsmaterial",
    verificationLetter: "V004"
  },
  {
    id: 5,
    imageUrl: "/placeholder.svg",
    vendor: "IKEA Business",
    price: "12 999 kr",
    productName: "Ergonomisk kontorsstol",
    verificationLetter: "V005"
  },
  {
    id: 6,
    imageUrl: "/placeholder.svg",
    vendor: "Microsoft Sverige",
    price: "990 kr",
    productName: "Office 365 Business månadsprenumeration",
    verificationLetter: "V006"
  }
];

export const useReceiptData = () => {
  const [receipts, setReceipts] = useState(sampleReceipts);

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
