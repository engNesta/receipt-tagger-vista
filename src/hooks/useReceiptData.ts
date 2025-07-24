
import { useState, useEffect } from 'react';
import { mockReceipts } from '@/data/mockData';
import type { Receipt, ProcessedFile } from '@/types';
import { transformFileToReceipt, transformProcessedFileToReceipt } from '@/utils/receiptTransformers';

export const useReceiptData = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  const createReceiptsFromFiles = async (processedFiles: ProcessedFile[]) => {
    console.log('Creating receipts from processed files:', processedFiles.length);

    const newReceipts = processedFiles
      .filter(pf => pf.azureUrl)
      .map((processedFile, index) => transformProcessedFileToReceipt(processedFile, index));

    setReceipts(prevReceipts => [...prevReceipts, ...newReceipts]);
    console.log('Created receipts from uploads:', newReceipts.length);
    return newReceipts;
  };

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
  };

  const loadReceiptsFromDatabase = async () => {
    try {
      console.log('Loading receipts from mock data');
      setReceipts(mockReceipts);
      console.log('Loaded mock receipts:', mockReceipts.length);
    } catch (error) {
      console.error('Error loading receipts:', error);
    }
  };

  useEffect(() => {
    loadReceiptsFromDatabase();
  }, []);

  return {
    receipts,
    handleReceiptsAdded,
    createReceiptsFromFiles,
    loadReceiptsFromDatabase
  };
};
