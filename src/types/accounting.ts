// Types for the 3-step accounting wizard

export interface Receipt {
  id: string;
  filename: string;
  uploadedAt: Date;
  imageUrl: string;
  ocrResult: {
    vendor: string;
    amount: number;
    date: string;
    items: string[];
    confidence: number;
  };
  status: 'readable' | 'unreadable' | 'verified';
  tags?: string[];
}

export interface BankTransaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  reference: string;
  account: string;
}

export interface MatchedEntry {
  id: string;
  receipt: Receipt;
  transaction: BankTransaction;
  confidence: number;
  verified: boolean;
}

export interface ProcessingStep {
  id: 'tolka' | 'identifiera' | 'bokfora';
  name: string;
  completed: boolean;
}

export interface ClientSession {
  clientId: string;
  month: string;
  receipts: Receipt[];
  transactions: BankTransaction[];
  matches: MatchedEntry[];
  currentStep: ProcessingStep['id'];
}