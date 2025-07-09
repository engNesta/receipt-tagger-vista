
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { sanitizeSearchQuery } from '@/utils/sanitizer';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  const { getText } = useLanguage();

  return (
    <div className="relative mb-8">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <Input
        placeholder={getText('searchPlaceholder')}
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
