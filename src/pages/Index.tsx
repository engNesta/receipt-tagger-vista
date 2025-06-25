import React, { useState } from 'react';
import { Search, FileText, DollarSign, Package, CheckCircle, ArrowUpAZ, ArrowDownZA } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReceiptCard from '@/components/ReceiptCard';
import ReceiptModal from '@/components/ReceiptModal';

// Sample receipt data
const sampleReceipts = [
  {
    id: 1,
    imageUrl: "/placeholder.svg",
    vendor: "Office Supply Co.",
    price: "$127.89",
    productName: "Laptop Stand & Accessories",
    verificationLetter: "Verification A"
  },
  {
    id: 2,
    imageUrl: "/placeholder.svg",
    vendor: "Tech Solutions Inc.",
    price: "$2,450.00",
    productName: "Business Software License",
    verificationLetter: "Verification A"
  },
  {
    id: 3,
    imageUrl: "/placeholder.svg",
    vendor: "Stationary World",
    price: "$89.50",
    productName: "Office Supplies Bundle",
    verificationLetter: "Verification A"
  },
  {
    id: 4,
    imageUrl: "/placeholder.svg",
    vendor: "Print Express",
    price: "$234.75",
    productName: "Marketing Materials",
    verificationLetter: "Verification A"
  },
  {
    id: 5,
    imageUrl: "/placeholder.svg",
    vendor: "Furniture Plus",
    price: "$1,299.99",
    productName: "Ergonomic Office Chair",
    verificationLetter: "Verification A"
  },
  {
    id: 6,
    imageUrl: "/placeholder.svg",
    vendor: "Cloud Services Ltd.",
    price: "$99.00",
    productName: "Monthly Cloud Storage",
    verificationLetter: "Verification A"
  }
];

const Index = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  const tags = [
    { name: 'Vendor', icon: FileText, key: 'vendor' },
    { name: 'Price', icon: DollarSign, key: 'price' },
    { name: 'Product Name', icon: Package, key: 'productName' },
    { name: 'Verification Letter', icon: CheckCircle, key: 'verificationLetter' }
  ];

  const sortReceipts = (receipts: any[], tag: string, order: 'asc' | 'desc') => {
    return [...receipts].sort((a, b) => {
      let aValue = a[tag];
      let bValue = b[tag];

      // Handle price sorting (remove $ and convert to number)
      if (tag === 'price') {
        aValue = parseFloat(aValue.replace('$', '').replace(',', ''));
        bValue = parseFloat(bValue.replace('$', '').replace(',', ''));
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  };

  let filteredReceipts = sampleReceipts.filter(receipt =>
    receipt.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.price.includes(searchTerm)
  );

  // Apply sorting if a tag is selected and sort order is set
  if (selectedTag && sortOrder) {
    filteredReceipts = sortReceipts(filteredReceipts, selectedTag, sortOrder);
  }

  const handleTagClick = (tagKey: string) => {
    if (selectedTag === tagKey) {
      setSelectedTag(null);
      setSortOrder(null);
    } else {
      setSelectedTag(tagKey);
      setSortOrder(null);
    }
  };

  const handleSortClick = (order: 'asc' | 'desc') => {
    if (selectedTag) {
      setSortOrder(sortOrder === order ? null : order);
    }
  };

  const handleCardClick = (receipt: any) => {
    setSelectedReceipt(receipt);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReceipt(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Receipt Management System</h1>
          <p className="text-gray-600 mt-2">Organize and categorize receipts and invoices efficiently</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tag Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          {tags.map((tag) => {
            const IconComponent = tag.icon;
            return (
              <Button
                key={tag.key}
                variant={selectedTag === tag.key ? "default" : "outline"}
                onClick={() => handleTagClick(tag.key)}
                className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
              >
                <IconComponent size={16} />
                {tag.name}
              </Button>
            );
          })}
        </div>

        {/* Sort Buttons - Only show when a tag is selected */}
        {selectedTag && (
          <div className="flex gap-2 mb-6">
            <Button
              variant={sortOrder === 'asc' ? "default" : "outline"}
              onClick={() => handleSortClick('asc')}
              className="flex items-center gap-2"
              size="sm"
            >
              <ArrowUpAZ size={16} />
              Ascending
            </Button>
            <Button
              variant={sortOrder === 'desc' ? "default" : "outline"}
              onClick={() => handleSortClick('desc')}
              className="flex items-center gap-2"
              size="sm"
            >
              <ArrowDownZA size={16} />
              Descending
            </Button>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search receipts by vendor, product, or price..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-3 text-lg border-2 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Receipt Grid */}
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-3">
          {filteredReceipts.map((receipt) => (
            <ReceiptCard
              key={receipt.id}
              receipt={receipt}
              selectedTag={selectedTag}
              onClick={() => handleCardClick(receipt)}
            />
          ))}
        </div>

        {filteredReceipts.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No receipts found</h3>
            <p className="text-gray-600">Try adjusting your search terms.</p>
          </div>
        )}
      </div>

      <ReceiptModal
        receipt={selectedReceipt}
        selectedTag={selectedTag}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Index;
