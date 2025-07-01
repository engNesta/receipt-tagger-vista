
import { useState, useMemo } from 'react';

interface Receipt {
  id: number;
  imageUrl: string;
  vendor: string;
  price: string;
  productName: string;
  verificationLetter: string;
}

export const useReceiptFiltering = (receipts: Receipt[]) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  const sortReceipts = (receipts: Receipt[], tag: string, order: 'asc' | 'desc') => {
    return [...receipts].sort((a, b) => {
      let aValue = a[tag as keyof Receipt];
      let bValue = b[tag as keyof Receipt];

      // Handle Swedish price sorting (remove 'kr' and spaces, convert to number)
      if (tag === 'price') {
        aValue = parseFloat(String(aValue).replace('kr', '').replace(/\s/g, '').replace(',', '.')) as any;
        bValue = parseFloat(String(bValue).replace('kr', '').replace(/\s/g, '').replace(',', '.')) as any;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc' 
          ? aValue.localeCompare(bValue, 'sv-SE')
          : bValue.localeCompare(aValue, 'sv-SE');
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  };

  const filteredReceipts = useMemo(() => {
    let filtered = receipts.filter(receipt =>
      receipt.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.price.includes(searchTerm)
    );

    // Apply sorting if a tag is selected and sort order is set
    if (selectedTag && sortOrder) {
      filtered = sortReceipts(filtered, selectedTag, sortOrder);
    }

    return filtered;
  }, [receipts, searchTerm, selectedTag, sortOrder]);

  const handleTagClick = (tagKey: string) => {
    if (tagKey === '') {
      // Clear filter
      setSelectedTag(null);
      setSortOrder(null);
    } else if (selectedTag === tagKey) {
      // Toggle off if same tag clicked
      setSelectedTag(null);
      setSortOrder(null);
    } else {
      // Set new tag, reset sort order
      setSelectedTag(tagKey);
      setSortOrder(null);
    }
  };

  const handleSortClick = (order: 'asc' | 'desc') => {
    if (selectedTag) {
      setSortOrder(sortOrder === order ? null : order);
    }
  };

  return {
    selectedTag,
    setSelectedTag,
    searchTerm,
    setSearchTerm,
    sortOrder,
    setSortOrder,
    filteredReceipts,
    handleTagClick,
    handleSortClick
  };
};
