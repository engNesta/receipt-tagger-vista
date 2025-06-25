
import React from 'react';
import { Search, Filter, ArrowUpDown, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';

interface UnifiedControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedTag: string | null;
  sortOrder: 'asc' | 'desc' | null;
  onTagClick: (tagKey: string) => void;
  onSortClick: (order: 'asc' | 'desc') => void;
}

const UnifiedControls: React.FC<UnifiedControlsProps> = ({
  searchTerm,
  onSearchChange,
  selectedTag,
  sortOrder,
  onTagClick,
  onSortClick
}) => {
  const { getText } = useLanguage();

  const filterOptions = [
    { key: 'vendor', label: getText('vendor') },
    { key: 'price', label: getText('price') },
    { key: 'productName', label: getText('productName') },
    { key: 'verificationLetter', label: getText('verificationLetter') }
  ];

  const sortOptions = [
    { key: 'recent', label: 'Most Recent' },
    { key: 'price-high', label: 'Price: High to Low' },
    { key: 'price-low', label: 'Price: Low to High' },
    { key: 'vendor-az', label: 'Vendor: A-Z' },
    { key: 'vendor-za', label: 'Vendor: Z-A' }
  ];

  const handleSortSelection = (sortKey: string) => {
    switch (sortKey) {
      case 'price-high':
        onTagClick('price');
        onSortClick('desc');
        break;
      case 'price-low':
        onTagClick('price');
        onSortClick('asc');
        break;
      case 'vendor-az':
        onTagClick('vendor');
        onSortClick('asc');
        break;
      case 'vendor-za':
        onTagClick('vendor');
        onSortClick('desc');
        break;
      default:
        // Handle recent or other cases
        break;
    }
  };

  const getSelectedFilterLabel = () => {
    if (!selectedTag) return getText('vendor');
    const option = filterOptions.find(opt => opt.key === selectedTag);
    return option?.label || getText('vendor');
  };

  const getCurrentSortLabel = () => {
    if (!selectedTag || !sortOrder) return 'Most Recent';
    
    if (selectedTag === 'price') {
      return sortOrder === 'desc' ? 'Price: High to Low' : 'Price: Low to High';
    }
    if (selectedTag === 'vendor') {
      return sortOrder === 'desc' ? 'Vendor: Z-A' : 'Vendor: A-Z';
    }
    return 'Most Recent';
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder={getText('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border-gray-300 focus:border-blue-500"
          />
        </div>

        {/* Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="justify-between min-w-[140px]">
              <div className="flex items-center gap-2">
                <Filter size={16} />
                <span className="hidden sm:inline">{getSelectedFilterLabel()}</span>
              </div>
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {filterOptions.map((option) => (
              <DropdownMenuItem
                key={option.key}
                onClick={() => onTagClick(option.key)}
                className={selectedTag === option.key ? "bg-blue-50 text-blue-700" : ""}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onTagClick('')}>
              Clear Filter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="justify-between min-w-[160px]">
              <div className="flex items-center gap-2">
                <ArrowUpDown size={16} />
                <span className="hidden sm:inline">{getCurrentSortLabel()}</span>
              </div>
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.key}
                onClick={() => handleSortSelection(option.key)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default UnifiedControls;
