
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
    { key: 'recent', label: getText('mostRecent') },
    { key: 'price-high', label: getText('priceHighToLow') },
    { key: 'price-low', label: getText('priceLowToHigh') },
    { key: 'vendor-az', label: getText('vendorAZ') },
    { key: 'vendor-za', label: getText('vendorZA') }
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
        break;
    }
  };

  const getSelectedFilterLabel = () => {
    if (!selectedTag) return getText('allReceipts');
    const option = filterOptions.find(opt => opt.key === selectedTag);
    return option?.label || getText('allReceipts');
  };

  const getCurrentSortLabel = () => {
    if (!selectedTag || !sortOrder) return getText('mostRecent');
    
    if (selectedTag === 'price') {
      return sortOrder === 'desc' ? getText('priceHighToLow') : getText('priceLowToHigh');
    }
    if (selectedTag === 'vendor') {
      return sortOrder === 'desc' ? getText('vendorZA') : getText('vendorAZ');
    }
    return getText('mostRecent');
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Bar - Takes most space */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder={getText('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Filter and Sort Controls */}
        <div className="flex gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-11 min-w-[140px] justify-between bg-white border-gray-200">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="truncate">{getSelectedFilterLabel()}</span>
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white">
              <DropdownMenuLabel>{getText('filterBy')}</DropdownMenuLabel>
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
                {getText('clearFilter')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-11 min-w-[160px] justify-between bg-white border-gray-200">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  <span className="truncate">{getCurrentSortLabel()}</span>
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white">
              <DropdownMenuLabel>{getText('sortBy')}</DropdownMenuLabel>
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
    </div>
  );
};

export default UnifiedControls;
