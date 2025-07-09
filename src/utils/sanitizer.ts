/**
 * Security utility functions for input sanitization and validation
 */

/**
 * Sanitizes a string by removing potentially dangerous characters and scripts
 */
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove HTML tags and script content
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

/**
 * Escapes HTML entities to prevent XSS
 */
export const escapeHtml = (text: string): string => {
  if (!text || typeof text !== 'string') return '';
  
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
  };
  
  return text.replace(/[&<>"'\/]/g, (s) => map[s]);
};

/**
 * Validates file types for uploads
 */
export const validateFileType = (file: File, allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']): boolean => {
  return allowedTypes.includes(file.type);
};

/**
 * Validates file size (default max 10MB)
 */
export const validateFileSize = (file: File, maxSizeInMB: number = 10): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

/**
 * Sanitizes search query for safe database queries
 */
export const sanitizeSearchQuery = (query: string): string => {
  if (!query || typeof query !== 'string') return '';
  
  // Remove SQL injection patterns and limit length
  return query
    .replace(/['";\\]/g, '')
    .replace(/\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b/gi, '')
    .substring(0, 100)
    .trim();
};