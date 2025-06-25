
// Swedish accounting integration preparation
export interface SIEExportData {
  company: {
    name: string;
    orgNumber: string;
  };
  transactions: SIETransaction[];
}

export interface SIETransaction {
  date: string;
  verificationNumber: string;
  description: string;
  account: string;
  debit?: number;
  credit?: number;
  vatCode?: string;
}

// Standard Swedish account codes for expenses
export const swedishAccountCodes = {
  '6110': 'Kontorsmaterial',
  '6150': 'Trycksaker',
  '6212': 'Telefon',
  '6250': 'IT-tjänster',
  '6310': 'Marknadsföring',
  '6420': 'Representation',
  '6540': 'IT-utrustning',
  '6550': 'Kontorsutrustning',
  '6980': 'Övriga kostnader',
  '2640': 'Ingående moms (25%)',
  '2641': 'Ingående moms (12%)',
  '2642': 'Ingående moms (6%)',
  '1930': 'Leverantörsskulder'
};

// Swedish VAT codes
export const swedishVatCodes = {
  'MP1': 'Moms 25% (köp)',
  'MP2': 'Moms 12% (köp)',
  'MP3': 'Moms 6% (köp)',
  'MP0': 'Momsfri (köp)'
};

export class SwedishAccountingMapper {
  // Map receipt data to Swedish account codes
  static mapToAccountCode(productName: string, vendor: string): string {
    const product = productName.toLowerCase();
    const vendorName = vendor.toLowerCase();
    
    // IT and software
    if (product.includes('microsoft') || product.includes('office') || product.includes('programvara')) {
      return '6250'; // IT-tjänster
    }
    
    // Telecommunications
    if (vendorName.includes('telia') || vendorName.includes('telenor') || product.includes('telefon')) {
      return '6212'; // Telefon
    }
    
    // Office supplies
    if (vendorName.includes('staples') || product.includes('kontorsmaterial') || product.includes('papper')) {
      return '6110'; // Kontorsmaterial
    }
    
    // Marketing materials
    if (product.includes('marknadsföring') || product.includes('tryck') || vendorName.includes('tryckeri')) {
      return '6150'; // Trycksaker
    }
    
    // Office furniture
    if (vendorName.includes('ikea') || product.includes('stol') || product.includes('möbler')) {
      return '6550'; // Kontorsutrustning
    }
    
    // Food and representation
    if (vendorName.includes('ica') || vendorName.includes('coop') || product.includes('lunch')) {
      return '6420'; // Representation
    }
    
    // Default to other costs
    return '6980'; // Övriga kostnader
  }

  static getVatCode(vatRate: number): string {
    switch (vatRate) {
      case 25: return 'MP1';
      case 12: return 'MP2';
      case 6: return 'MP3';
      case 0: return 'MP0';
      default: return 'MP1'; // Default to 25%
    }
  }

  static calculateVatAmount(totalAmount: number, vatRate: number): number {
    return Math.round((totalAmount * vatRate / (100 + vatRate)) * 100) / 100;
  }
}

// Generate SIE format export data
export function generateSIEExport(receipts: any[], companyInfo: { name: string; orgNumber: string }): string {
  const sieLines: string[] = [];
  
  // SIE header
  sieLines.push('#FLAGGA 0');
  sieLines.push('#PROGRAM "Kvitthantering" "1.0"');
  sieLines.push(`#FNAMN "${companyInfo.name}"`);
  sieLines.push(`#ORGNR "${companyInfo.orgNumber}"`);
  sieLines.push('#TAXAR 2024');
  sieLines.push('#VALUTA SEK');
  
  // Account plan
  Object.entries(swedishAccountCodes).forEach(([code, name]) => {
    sieLines.push(`#KONTO ${code} "${name}"`);
  });
  
  // Transactions
  receipts.forEach((receipt, index) => {
    const verificationNumber = receipt.verificationLetter || `V${String(index + 1).padStart(3, '0')}`;
    const date = new Date().toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
    const accountCode = SwedishAccountingMapper.mapToAccountCode(receipt.productName, receipt.vendor);
    
    // Parse amount
    const amount = parseFloat(receipt.price.replace(/[^\d,]/g, '').replace(',', '.'));
    const vatAmount = SwedishAccountingMapper.calculateVatAmount(amount, 25); // Assume 25% VAT
    const netAmount = amount - vatAmount;
    
    sieLines.push(`#VER "KV" "${verificationNumber}" "${date}" "${receipt.vendor}"`);
    sieLines.push(`#TRANS ${accountCode} {} ${netAmount.toFixed(2)}`);
    sieLines.push(`#TRANS 2640 {} ${vatAmount.toFixed(2)}`); // Ingående moms 25%
    sieLines.push(`#TRANS 1930 {} -${amount.toFixed(2)}`); // Leverantörsskuld
    sieLines.push('');
  });
  
  return sieLines.join('\n');
}

// Integration endpoints configuration (for future use)
export const swedishAccountingIntegrations = {
  fortnox: {
    name: 'Fortnox',
    apiUrl: 'https://api.fortnox.se/3/',
    requiredFields: ['access-token', 'client-secret'],
    endpoints: {
      suppliers: '/suppliers',
      vouchers: '/vouchers',
      accounts: '/accounts'
    }
  },
  visma: {
    name: 'Visma eEkonomi',
    apiUrl: 'https://eaccountingapi.vismaonline.com/',
    requiredFields: ['token'],
    endpoints: {
      suppliers: '/suppliers',
      vouchers: '/vouchers',
      accounts: '/accounts'
    }
  },
  bokio: {
    name: 'Bokio',
    apiUrl: 'https://api.bokio.se/',
    requiredFields: ['api-key'],
    endpoints: {
      suppliers: '/suppliers',
      vouchers: '/vouchers',
      accounts: '/accounts'
    }
  }
};

// Prepare data for accounting integration
export function prepareForIntegration(receipts: any[], integration: keyof typeof swedishAccountingIntegrations) {
  const config = swedishAccountingIntegrations[integration];
  
  return receipts.map(receipt => {
    const accountCode = SwedishAccountingMapper.mapToAccountCode(receipt.productName, receipt.vendor);
    const amount = parseFloat(receipt.price.replace(/[^\d,]/g, '').replace(',', '.'));
    
    return {
      supplier: receipt.vendor,
      description: receipt.productName,
      amount: amount,
      accountCode: accountCode,
      vatCode: SwedishAccountingMapper.getVatCode(25), // Default to 25%
      verificationNumber: receipt.verificationLetter,
      integration: config.name
    };
  });
}
