
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { sanitizeSearchQuery } from '@/utils/sanitizer';
import { Trans } from '@/components/Trans';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative mb-8">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <Input
        placeholder="Search receipts by vendor, product, or amount..."
        value={searchTerm}
        onChange={(e) => {
          const sanitizedValue = sanitizeSearchQuery(e.target.value);
          onSearchChange(sanitizedValue);
        }}
        className="pl-10 py-3 text-lg border-2 focus:border-blue-500 transition-colors"
        maxLength={100}
      />
    </div>
  );
};

export default SearchBar;
