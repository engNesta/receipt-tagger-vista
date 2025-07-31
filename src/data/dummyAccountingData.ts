import type { Receipt, BankTransaction, MatchedEntry } from '@/types/accounting';

export const dummyReceipts: Receipt[] = [
  {
    id: 'receipt-1',
    filename: 'ica_receipt_001.jpg',
    uploadedAt: new Date('2024-01-15'),
    imageUrl: '/placeholder.svg',
    ocrResult: {
      vendor: 'ICA Supermarket',
      amount: 567.50,
      date: '2024-01-15',
      items: ['Mjölk', 'Bröd', 'Äpplen', 'Kaffe'],
      confidence: 95
    },
    status: 'readable'
  },
  {
    id: 'receipt-2',
    filename: 'coop_receipt_002.jpg',
    uploadedAt: new Date('2024-01-16'),
    imageUrl: '/placeholder.svg',
    ocrResult: {
      vendor: 'Coop Konsum',
      amount: 234.75,
      date: '2024-01-16',
      items: ['Kött', 'Potatis', 'Lök'],
      confidence: 88
    },
    status: 'readable'
  },
  {
    id: 'receipt-3',
    filename: 'blurry_receipt.jpg',
    uploadedAt: new Date('2024-01-17'),
    imageUrl: '/placeholder.svg',
    ocrResult: {
      vendor: 'Unknown',
      amount: 0,
      date: '',
      items: [],
      confidence: 23
    },
    status: 'unreadable'
  },
  {
    id: 'receipt-4',
    filename: 'restaurant_bill.jpg',
    uploadedAt: new Date('2024-01-18'),
    imageUrl: '/placeholder.svg',
    ocrResult: {
      vendor: 'Restaurang Klarälven',
      amount: 1250.00,
      date: '2024-01-18',
      items: ['Lunch för 4 personer', 'Drycker'],
      confidence: 92
    },
    status: 'verified'
  }
];

export const dummyTransactions: BankTransaction[] = [
  {
    id: 'trans-1',
    date: '2024-01-15',
    amount: -567.50,
    description: 'ICA SUPERMARKET STOCKHOLM',
    reference: 'REF123456',
    account: '1234567890'
  },
  {
    id: 'trans-2',
    date: '2024-01-16',
    amount: -234.75,
    description: 'COOP KONSUM MALMÖ',
    reference: 'REF123457',
    account: '1234567890'
  },
  {
    id: 'trans-3',
    date: '2024-01-18',
    amount: -1250.00,
    description: 'RESTAURANG KLARÄLVEN',
    reference: 'REF123458',
    account: '1234567890'
  },
  {
    id: 'trans-4',
    date: '2024-01-20',
    amount: -89.90,
    description: 'UNKNOWN MERCHANT',
    reference: 'REF123459',
    account: '1234567890'
  }
];

export const dummyMatches: MatchedEntry[] = [
  {
    id: 'match-1',
    receipt: dummyReceipts[0],
    transaction: dummyTransactions[0],
    confidence: 98,
    verified: true
  },
  {
    id: 'match-2',
    receipt: dummyReceipts[1],
    transaction: dummyTransactions[1],
    confidence: 95,
    verified: true
  },
  {
    id: 'match-3',
    receipt: dummyReceipts[3],
    transaction: dummyTransactions[2],
    confidence: 92,
    verified: false
  }
];