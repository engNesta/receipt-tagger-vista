
// Swedish receipt field extraction patterns and validation
export interface SwedishReceiptData {
  vendor: string;
  amount: string;
  vatAmount?: string;
  vatRate?: string;
  orgNumber?: string;
  date?: string;
  receiptNumber?: string;
  items?: string[];
}

export interface ExtractionPattern {
  name: string;
  patterns: {
    vendor: RegExp[];
    amount: RegExp[];
    vatAmount: RegExp[];
    vatRate: RegExp[];
    orgNumber: RegExp[];
    date: RegExp[];
    receiptNumber: RegExp[];
  };
}

// Swedish receipt patterns for major retailers and service providers
export const swedishReceiptPatterns: ExtractionPattern[] = [
  {
    name: 'ICA',
    patterns: {
      vendor: [/ICA\s+(Supermarket|Maxi|Kvantum|Nära)/i, /ICA\s+\w+/i],
      amount: [/Totalt[:\s]+(\d+[,\.]\d{2})\s*kr/i, /Summa[:\s]+(\d+[,\.]\d{2})\s*kr/i],
      vatAmount: [/Moms\s+25%[:\s]+(\d+[,\.]\d{2})/i, /VAT\s+25%[:\s]+(\d+[,\.]\d{2})/i],
      vatRate: [/Moms\s+(\d+)%/i, /VAT\s+(\d+)%/i],
      orgNumber: [/Org\.?nr[:\s]+(\d{6}-\d{4})/i, /(\d{10})/],
      date: [/(\d{4}-\d{2}-\d{2})/, /(\d{2}\/\d{2}-\d{4})/],
      receiptNumber: [/Kvitto[:\s#]+(\d+)/i, /Receipt[:\s#]+(\d+)/i]
    }
  },
  {
    name: 'Coop',
    patterns: {
      vendor: [/Coop\s+(Konsum|Forum|Extra)/i, /Coop\s+\w+/i],
      amount: [/Summa[:\s]+(\d+[,\.]\d{2})\s*kr/i, /Totalt[:\s]+(\d+[,\.]\d{2})\s*kr/i],
      vatAmount: [/Moms\s+25%[:\s]+(\d+[,\.]\d{2})/i],
      vatRate: [/Moms\s+(\d+)%/i],
      orgNumber: [/Org\.?nr[:\s]+(\d{6}-\d{4})/i],
      date: [/(\d{4}-\d{2}-\d{2})/, /(\d{2}-\d{2}-\d{4})/],
      receiptNumber: [/Kvitto[:\s#]+(\d+)/i]
    }
  },
  {
    name: 'Generic Swedish',
    patterns: {
      vendor: [/^[A-ZÅÄÖ][a-zåäö\s]+(?:AB|HB|KB|Aktiebolag)/i],
      amount: [/(?:Totalt|Summa|Att\s+betala)[:\s]+(\d+[,\.]\d{2})\s*(?:kr|SEK)/i],
      vatAmount: [/(?:Moms|VAT)\s+\d+%[:\s]+(\d+[,\.]\d{2})/i],
      vatRate: [/(?:Moms|VAT)\s+(\d+)%/i],
      orgNumber: [/(?:Org\.?nr|Organisationsnummer)[:\s]+(\d{6}-\d{4})/i, /(\d{10})/],
      date: [/(\d{4}-\d{2}-\d{2})/, /(\d{2}\/\d{2}-\d{4})/, /(\d{2}-\d{2}-\d{4})/],
      receiptNumber: [/(?:Kvitto|Receipt|Verifikation)[:\s#]+(\d+)/i]
    }
  }
];

// Swedish VAT rates
export const swedishVatRates = [25, 12, 6, 0]; // Standard, reduced, books/transport, zero

// Swedish accounting validation rules
export class SwedishReceiptValidator {
  static validateOrgNumber(orgNumber: string): boolean {
    // Swedish organization number format: XXXXXX-XXXX
    const cleaned = orgNumber.replace(/\D/g, '');
    if (cleaned.length !== 10) return false;
    
    // Basic Luhn algorithm check for Swedish org numbers
    const digits = cleaned.split('').map(Number);
    let sum = 0;
    
    for (let i = 0; i < 9; i++) {
      let digit = digits[i];
      if (i % 2 === 1) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === digits[9];
  }

  static validateVatRate(rate: number): boolean {
    return swedishVatRates.includes(rate);
  }

  static validateAmount(amount: string): boolean {
    // Swedish amount format: "1 234,56 kr" or "1234.56 SEK"
    const amountRegex = /^\d{1,3}(?:\s?\d{3})*[,\.]\d{2}\s*(?:kr|SEK)?$/i;
    return amountRegex.test(amount.trim());
  }

  static normalizeAmount(amount: string): number {
    // Convert Swedish format to number
    const cleaned = amount.replace(/[^\d,\.]/g, '').replace(',', '.');
    return parseFloat(cleaned.replace(/\s/g, ''));
  }

  static validateDate(dateStr: string): boolean {
    const dateFormats = [
      /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
      /^\d{2}\/\d{2}-\d{4}$/, // DD/MM-YYYY
      /^\d{2}-\d{2}-\d{4}$/ // DD-MM-YYYY
    ];
    
    return dateFormats.some(format => format.test(dateStr));
  }
}

// Extract data from receipt text using Swedish patterns
export function extractSwedishReceiptData(receiptText: string): Partial<SwedishReceiptData> {
  const extractedData: Partial<SwedishReceiptData> = {};
  
  for (const patternSet of swedishReceiptPatterns) {
    // Try vendor patterns
    for (const pattern of patternSet.patterns.vendor) {
      const match = receiptText.match(pattern);
      if (match && !extractedData.vendor) {
        extractedData.vendor = match[1] || match[0];
      }
    }
    
    // Try amount patterns
    for (const pattern of patternSet.patterns.amount) {
      const match = receiptText.match(pattern);
      if (match && match[1] && !extractedData.amount) {
        extractedData.amount = match[1] + ' kr';
      }
    }
    
    // Try VAT patterns
    for (const pattern of patternSet.patterns.vatAmount) {
      const match = receiptText.match(pattern);
      if (match && match[1] && !extractedData.vatAmount) {
        extractedData.vatAmount = match[1] + ' kr';
      }
    }
    
    // Try org number patterns
    for (const pattern of patternSet.patterns.orgNumber) {
      const match = receiptText.match(pattern);
      if (match && match[1] && !extractedData.orgNumber) {
        extractedData.orgNumber = match[1];
      }
    }
    
    // Try date patterns
    for (const pattern of patternSet.patterns.date) {
      const match = receiptText.match(pattern);
      if (match && match[1] && !extractedData.date) {
        extractedData.date = match[1];
      }
    }
  }
  
  return extractedData;
}

// Validate extracted receipt data
export function validateSwedishReceiptData(data: Partial<SwedishReceiptData>): { 
  isValid: boolean; 
  errors: string[] 
} {
  const errors: string[] = [];
  
  if (data.orgNumber && !SwedishReceiptValidator.validateOrgNumber(data.orgNumber)) {
    errors.push('Ogiltigt organisationsnummer');
  }
  
  if (data.amount && !SwedishReceiptValidator.validateAmount(data.amount)) {
    errors.push('Ogiltigt beloppsformat');
  }
  
  if (data.date && !SwedishReceiptValidator.validateDate(data.date)) {
    errors.push('Ogiltigt datumformat');
  }
  
  if (data.vatRate && !SwedishReceiptValidator.validateVatRate(parseInt(data.vatRate))) {
    errors.push('Ogiltig momssats för Sverige');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
