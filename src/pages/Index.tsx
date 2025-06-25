
import React, { useState } from 'react';
import ReceiptModal from '@/components/ReceiptModal';
import LoadMoreModal from '@/components/LoadMoreModal';
import LanguageSelector from '@/components/LanguageSelector';
import ReceiptsHeader from '@/components/receipts/ReceiptsHeader';
import TagFilters from '@/components/receipts/TagFilters';
import SortControls from '@/components/receipts/SortControls';
import SearchBar from '@/components/receipts/SearchBar';
import ReceiptsGrid from '@/components/receipts/ReceiptsGrid';
import EmptyState from '@/components/receipts/EmptyState';
import { useReceiptData } from '@/hooks/useReceiptData';
import { useReceiptFiltering } from '@/hooks/useReceiptFiltering';

const Index = () => {
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadMoreModalOpen, setIsLoadMoreModalOpen] = useState(false);

  const { receipts, handleReceiptsAdded } = useReceiptData();
  const {
    selectedTag,
    searchTerm,
    sortOrder,
    filteredReceipts,
    setSearchTerm,
    handleTagClick,
    handleSortClick
  } = useReceiptFiltering(receipts);

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
      <ReceiptsHeader onLoadMoreClick={() => setIsLoadMoreModalOpen(true)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TagFilters selectedTag={selectedTag} onTagClick={handleTagClick} />
        <SortControls
          selectedTag={selectedTag}
          sortOrder={sortOrder}
          onSortClick={handleSortClick}
        />
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        {filteredReceipts.length === 0 ? (
          <EmptyState />
        ) : (
          <ReceiptsGrid
            receipts={filteredReceipts}
            selectedTag={selectedTag}
            onCardClick={handleCardClick}
          />
        )}
      </div>

      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          <LanguageSelector />
        </div>
      </div>

      <ReceiptModal
        receipt={selectedReceipt}
        selectedTag={selectedTag}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <LoadMoreModal
        isOpen={isLoadMoreModalOpen}
        onClose={() => setIsLoadMoreModalOpen(false)}
        onReceiptsAdded={handleReceiptsAdded}
      />
    </div>
  );
};

export default Index;
