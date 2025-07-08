
import type { Receipt, ProcessedFile, FastApiDocument } from '@/types';

// Transform FastAPI document to Receipt format
export const transformFastApiDocToReceipt = (doc: FastApiDocument, index: number): Receipt => {
  const numericId = doc.id ? parseInt(doc.id.replace(/-/g, '').substring(0, 8), 16) : (Date.now() + index);
  
  const priceValue = doc.tags?.price;
  let formattedPrice = '0 kr';
  
  if (priceValue !== undefined && priceValue !== null) {
    if (typeof priceValue === 'number') {
      formattedPrice = `${priceValue} kr`;
    } else {
      const priceStr = String(priceValue);
      formattedPrice = priceStr.toLowerCase().includes('kr') ? priceStr : `${priceStr} kr`;
    }
  }
  
  return {
    id: numericId,
    imageUrl: doc.ingested_path || '/placeholder.svg',
    vendor: doc.tags?.vendor || 'Unknown Vendor',
    price: formattedPrice,
    productName: doc.tags?.product_or_service || doc.original_filename || 'Unknown Product',
    verificationLetter: doc.status || 'N/A',
    fileId: doc.id
  };
};

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
