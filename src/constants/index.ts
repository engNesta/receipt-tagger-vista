
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
  }
} as const;

export const SUPPORTED_FILE_FORMATS = ['JPG', 'PNG', 'PDF'] as const;

export const ERROR_MESSAGES = {
  UPLOAD_FAILED: 'Upload failed. Please try again.',
  FILE_TOO_LARGE: 'File is too large. Please choose a smaller file.',
  UNSUPPORTED_FORMAT: 'Unsupported file format.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
} as const;
