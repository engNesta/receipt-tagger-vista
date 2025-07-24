
// UI utility functions and constants

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Re-export cn function for consistency
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// File type icon mapping
export const getFileTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'pdf':
      return '📄';
    case 'jpg':
    case 'jpeg':
    case 'png':
      return '🖼️';
    case 'xlsx':
    case 'xls':
      return '📊';
    case 'docx':
    case 'doc':
      return '📝';
    default:
      return '📎';
  }
};

// File type color mapping for badges
export const getFileTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'pdf':
      return 'bg-red-100 text-red-800';
    case 'jpg':
    case 'jpeg':
    case 'png':
      return 'bg-green-100 text-green-800';
    case 'xlsx':
    case 'xls':
      return 'bg-blue-100 text-blue-800';
    case 'docx':
    case 'doc':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Format file size
export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format date for display
export const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Common loading states
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action 
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
}) => (
  <div className="text-center py-12">
    <Icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    {action}
  </div>
);
