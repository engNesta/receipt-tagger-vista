
// Application-wide constants and configuration

export const APP_CONFIG = {
  RECEIPT_GRID_COLUMNS: {
    DEFAULT: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8',
  },
  UPLOAD: {
    ACCEPTED_TYPES: 'image/*,application/pdf',
    PROGRESS_INTERVAL: 150,
    CLEAR_DELAY: 2000,
    RELOAD_DELAY: 1000,
  },
  UI: {
    VERIFICATION_LETTER_LENGTH: 3,
    MAX_FILENAME_LENGTH: 50,
  },
  ROUTES: {
    HOME: '/',
    CLIENTS: '/clients',
    CLIENTS_ADD: '/clients/add',
    CLIENTS_MANAGE: '/clients/manage',
    CLIENTS_VIEW: '/clients/:id/view',
    MATCHING_REPORT: '/matching-report',
    SIE_GENERATED: '/sie-generated',
  }
} as const;

export const SUPPORTED_FILE_FORMATS = ['JPG', 'PNG', 'PDF'] as const;

export const ERROR_MESSAGES = {
  UPLOAD_FAILED: 'Upload failed. Please try again.',
  FILE_TOO_LARGE: 'File is too large. Please choose a smaller file.',
  UNSUPPORTED_FORMAT: 'Unsupported file format.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  CLIENT_NOT_FOUND: 'Client not found.',
  GENERAL_ERROR: 'An error occurred. Please try again.',
} as const;

export const SUCCESS_MESSAGES = {
  CLIENT_CREATED: 'Client created successfully!',
  CLIENT_DELETED: 'Client deleted successfully!',
  UPLOAD_COMPLETE: 'Files uploaded successfully!',
  SIE_GENERATED: 'SIE file generated successfully!',
} as const;

export const DOCUMENT_CATEGORIES = {
  RECEIPTS: 'receipts',
  INVOICES_PAID: 'invoices_paid',
  INVOICES_SENT: 'invoices_sent',
  BANK_STATEMENTS: 'bank_statements',
} as const;

export const CATEGORY_LABELS = {
  [DOCUMENT_CATEGORIES.RECEIPTS]: 'Receipts',
  [DOCUMENT_CATEGORIES.INVOICES_PAID]: 'Invoices Paid',
  [DOCUMENT_CATEGORIES.INVOICES_SENT]: 'Invoices Sent',
  [DOCUMENT_CATEGORIES.BANK_STATEMENTS]: 'Bank Statements',
} as const;
