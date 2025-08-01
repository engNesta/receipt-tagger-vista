// Utility functions for consistent number formatting

export const formatCurrency = (amount: number): string => {
  return `${Math.round(amount * 100) / 100} kr`;
};

export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

export const formatConfidence = (confidence: number): string => {
  return `${Math.round(confidence)}%`;
};

// Download simulation functions
export const downloadSelectedReceipts = (receipts: any[]): void => {
  console.log('Downloading selected receipts:', receipts);
  // Simulate PDF generation delay
  setTimeout(() => {
    console.log('Receipt PDF generated');
  }, 1000);
};

export const downloadSelectedTransactions = (transactions: any[]): void => {
  console.log('Downloading selected transactions:', transactions);
  // Simulate PDF generation delay
  setTimeout(() => {
    console.log('Transaction PDF generated');
  }, 1000);
};

export const downloadBothReportsSelected = (receipts: any[], transactions: any[]): void => {
  console.log('Downloading both reports with selected items:', { receipts, transactions });
  // Simulate PDF generation delay
  setTimeout(() => {
    console.log('Combined PDF generated');
  }, 1000);
};