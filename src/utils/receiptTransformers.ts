
import type { Receipt, ProcessedFile } from '@/types';

export const transformFileToReceipt = (file: any, index: number): Receipt => {
  return {
    id: parseInt(file.id.replace(/-/g, '').slice(0, 8), 16),
    imageUrl: file.azure_blob_url,
    vendor: 'Processing...',
    price: '0 kr',
    productName: file.original_name.replace(/\.[^/.]+$/, ""),
    verificationLetter: `V${String(Date.now()).slice(-3)}${index.toString().padStart(2, '0')}`,
    fileId: file.id
  };
};

export const transformProcessedFileToReceipt = (processedFile: ProcessedFile, index: number): Receipt => {
  return {
    id: Date.now() + index,
    imageUrl: processedFile.azureUrl!,
    vendor: 'Processing...',
    price: '0 kr',
    productName: processedFile.file.name.replace(/\.[^/.]+$/, ""),
    verificationLetter: `V${String(Date.now()).slice(-3)}${index.toString().padStart(2, '0')}`,
    fileId: processedFile.id
  };
};

export const createDemoReceipts = (startId: number): Receipt[] => {
  return [
    {
      id: startId + 1,
      imageUrl: "/placeholder.svg",
      vendor: "Coop Konsum",
      price: "1 562 kr",
      productName: "Lunch & representation",
      verificationLetter: "V007"
    },
    {
      id: startId + 2,
      imageUrl: "/placeholder.svg",
      vendor: "SJ AB",
      price: "1 895 kr",
      productName: "Tågresor företag",
      verificationLetter: "V008"
    }
  ];
};
