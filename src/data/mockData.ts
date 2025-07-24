
// Centralized mock data for the Accountant Portal
// This file contains all dummy data used across the application

export interface MockClient {
  id: string;
  companyName: string;
  registrationNumber: string;
  email: string;
  createdAt: Date;
}

export interface MockDocument {
  id: string;
  name: string;
  type: 'pdf' | 'jpg' | 'png' | 'xlsx';
  size: string;
  uploadDate: string;
  category: 'receipts' | 'invoices_paid' | 'invoices_sent' | 'bank_statements';
  thumbnailUrl: string;
}

export interface MockMatchingRecord {
  id: string;
  record: string;
  statement: string;
  matched: boolean;
  amount?: string;
  date?: string;
}

// Mock clients data
export const mockClients: MockClient[] = [
  {
    id: '1',
    companyName: 'Tech Solutions AB',
    registrationNumber: '556123-4567',
    email: 'info@techsolutions.se',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    companyName: 'Nordic Consulting',
    registrationNumber: '556234-5678',
    email: 'contact@nordicconsulting.se',
    createdAt: new Date('2024-02-20')
  },
  {
    id: '3',
    companyName: 'Stockholm Retail Ltd',
    registrationNumber: '556345-6789',
    email: 'admin@stockholmretail.se',
    createdAt: new Date('2024-03-10')
  }
];

// Mock documents organized by month and category
export const mockDocumentsByMonth = {
  'January': {
    receipts: [
      { id: '1', name: 'office_supplies.pdf', type: 'pdf' as const, size: '2.3 MB', uploadDate: '2024-01-15', category: 'receipts' as const, thumbnailUrl: 'https://via.placeholder.com/150/ff6b6b/fff?text=PDF' },
      { id: '2', name: 'lunch_meeting.jpg', type: 'jpg' as const, size: '1.8 MB', uploadDate: '2024-01-16', category: 'receipts' as const, thumbnailUrl: 'https://via.placeholder.com/150/4ecdc4/fff?text=JPG' }
    ],
    invoices_paid: [
      { id: '3', name: 'software_license.pdf', type: 'pdf' as const, size: '856 KB', uploadDate: '2024-01-20', category: 'invoices_paid' as const, thumbnailUrl: 'https://via.placeholder.com/150/45b7d1/fff?text=PDF' }
    ],
    invoices_sent: [
      { id: '4', name: 'client_invoice_001.pdf', type: 'pdf' as const, size: '1.2 MB', uploadDate: '2024-01-25', category: 'invoices_sent' as const, thumbnailUrl: 'https://via.placeholder.com/150/f9ca24/fff?text=PDF' }
    ],
    bank_statements: [
      { id: '5', name: 'statement_jan_2024.xlsx', type: 'xlsx' as const, size: '3.4 MB', uploadDate: '2024-01-31', category: 'bank_statements' as const, thumbnailUrl: 'https://via.placeholder.com/150/6c5ce7/fff?text=XLSX' }
    ]
  },
  'February': {
    receipts: [
      { id: '6', name: 'taxi_receipt.jpg', type: 'jpg' as const, size: '1.5 MB', uploadDate: '2024-02-05', category: 'receipts' as const, thumbnailUrl: 'https://via.placeholder.com/150/4ecdc4/fff?text=JPG' },
      { id: '7', name: 'hotel_booking.pdf', type: 'pdf' as const, size: '2.1 MB', uploadDate: '2024-02-10', category: 'receipts' as const, thumbnailUrl: 'https://via.placeholder.com/150/ff6b6b/fff?text=PDF' }
    ],
    invoices_paid: [
      { id: '8', name: 'electricity_bill.pdf', type: 'pdf' as const, size: '945 KB', uploadDate: '2024-02-15', category: 'invoices_paid' as const, thumbnailUrl: 'https://via.placeholder.com/150/45b7d1/fff?text=PDF' }
    ],
    invoices_sent: [
      { id: '9', name: 'client_invoice_002.pdf', type: 'pdf' as const, size: '1.1 MB', uploadDate: '2024-02-20', category: 'invoices_sent' as const, thumbnailUrl: 'https://via.placeholder.com/150/f9ca24/fff?text=PDF' }
    ],
    bank_statements: [
      { id: '10', name: 'statement_feb_2024.xlsx', type: 'xlsx' as const, size: '3.2 MB', uploadDate: '2024-02-28', category: 'bank_statements' as const, thumbnailUrl: 'https://via.placeholder.com/150/6c5ce7/fff?text=XLSX' }
    ]
  },
  'March': {
    receipts: [
      { id: '11', name: 'conference_ticket.pdf', type: 'pdf' as const, size: '1.9 MB', uploadDate: '2024-03-08', category: 'receipts' as const, thumbnailUrl: 'https://via.placeholder.com/150/ff6b6b/fff?text=PDF' }
    ],
    invoices_paid: [
      { id: '12', name: 'internet_service.pdf', type: 'pdf' as const, size: '1.3 MB', uploadDate: '2024-03-12', category: 'invoices_paid' as const, thumbnailUrl: 'https://via.placeholder.com/150/45b7d1/fff?text=PDF' }
    ],
    invoices_sent: [
      { id: '13', name: 'client_invoice_003.pdf', type: 'pdf' as const, size: '1.4 MB', uploadDate: '2024-03-18', category: 'invoices_sent' as const, thumbnailUrl: 'https://via.placeholder.com/150/f9ca24/fff?text=PDF' }
    ],
    bank_statements: [
      { id: '14', name: 'statement_mar_2024.xlsx', type: 'xlsx' as const, size: '3.1 MB', uploadDate: '2024-03-31', category: 'bank_statements' as const, thumbnailUrl: 'https://via.placeholder.com/150/6c5ce7/fff?text=XLSX' }
    ]
  }
};

// Mock matching records data
export const mockMatchingRecords: MockMatchingRecord[] = [
  { 
    id: '1', 
    record: 'invoice_rent.pdf', 
    statement: 'bank_statement_july.xlsx', 
    matched: true,
    amount: '15,000 SEK',
    date: '2024-07-15'
  },
  { 
    id: '2', 
    record: 'taxi.jpg', 
    statement: 'statement_march.xlsx', 
    matched: false,
    amount: '450 SEK',
    date: '2024-03-22'
  },
  { 
    id: '3', 
    record: 'freelance_invoice.png', 
    statement: 'bank_statement_july.xlsx', 
    matched: true,
    amount: '8,500 SEK',
    date: '2024-07-20'
  },
  { 
    id: '4', 
    record: 'meal.png', 
    statement: 'bank_statement_july.xlsx', 
    matched: false,
    amount: '320 SEK',
    date: '2024-07-18'
  }
];

// Mock receipt data for RawDrop page
export const mockReceipts = [
  {
    id: 1,
    imageUrl: "/placeholder.svg",
    vendor: "ICA Supermarket",
    price: "234 kr",
    productName: "Kontorsmaterial",
    verificationLetter: "V001"
  },
  {
    id: 2,
    imageUrl: "/placeholder.svg",
    vendor: "Staples",
    price: "1 299 kr",
    productName: "Datorutrustning",
    verificationLetter: "V002"
  },
  {
    id: 3,
    imageUrl: "/placeholder.svg",
    vendor: "Coop Konsum",
    price: "1 562 kr",
    productName: "Lunch & representation",
    verificationLetter: "V003"
  },
  {
    id: 4,
    imageUrl: "/placeholder.svg",
    vendor: "SJ AB",
    price: "1 895 kr",
    productName: "Tågresor företag",
    verificationLetter: "V004"
  }
];

// Utility function to get documents for a specific month
export const getDocumentsForMonth = (month: string) => {
  return mockDocumentsByMonth[month as keyof typeof mockDocumentsByMonth] || {
    receipts: [],
    invoices_paid: [],
    invoices_sent: [],
    bank_statements: []
  };
};

// Utility function to get all months with documents
export const getAvailableMonths = () => {
  return Object.keys(mockDocumentsByMonth);
};

// Utility function to get client by ID
export const getClientById = (id: string) => {
  return mockClients.find(client => client.id === id);
};
