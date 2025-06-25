
import { useState } from 'react';

// Sample receipt data
const sampleReceipts = [
  {
    id: 1,
    imageUrl: "/placeholder.svg",
    vendor: "Office Supply Co.",
    price: "$127.89",
    productName: "Laptop Stand & Accessories",
    verificationLetter: "Verification A"
  },
  {
    id: 2,
    imageUrl: "/placeholder.svg",
    vendor: "Tech Solutions Inc.",
    price: "$2,450.00",
    productName: "Business Software License",
    verificationLetter: "Verification A"
  },
  {
    id: 3,
    imageUrl: "/placeholder.svg",
    vendor: "Stationary World",
    price: "$89.50",
    productName: "Office Supplies Bundle",
    verificationLetter: "Verification A"
  },
  {
    id: 4,
    imageUrl: "/placeholder.svg",
    vendor: "Print Express",
    price: "$234.75",
    productName: "Marketing Materials",
    verificationLetter: "Verification A"
  },
  {
    id: 5,
    imageUrl: "/placeholder.svg",
    vendor: "Furniture Plus",
    price: "$1,299.99",
    productName: "Ergonomic Office Chair",
    verificationLetter: "Verification A"
  },
  {
    id: 6,
    imageUrl: "/placeholder.svg",
    vendor: "Cloud Services Ltd.",
    price: "$99.00",
    productName: "Monthly Cloud Storage",
    verificationLetter: "Verification A"
  }
];

export const useReceiptData = () => {
  const [receipts, setReceipts] = useState(sampleReceipts);

  const handleReceiptsAdded = () => {
    const newReceipts = [
      {
        id: receipts.length + 1,
        imageUrl: "/placeholder.svg",
        vendor: "New Supplier Ltd.",
        price: "$156.23",
        productName: "Fresh Office Equipment",
        verificationLetter: "Verification B"
      },
      {
        id: receipts.length + 2,
        imageUrl: "/placeholder.svg",
        vendor: "Digital Services Co.",
        price: "$89.99",
        productName: "Software Subscription",
        verificationLetter: "Verification B"
      }
    ];
    
    setReceipts(prevReceipts => [...prevReceipts, ...newReceipts]);
    console.log('New receipts added:', newReceipts.length);
  };

  return {
    receipts,
    handleReceiptsAdded
  };
};
