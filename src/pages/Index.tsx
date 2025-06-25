
import React, { useState } from 'react';
import ReceiptModal from '@/components/ReceiptModal';
import LoadMoreModal from '@/components/LoadMoreModal';
import LanguageSelector from '@/components/LanguageSelector';
import ReceiptsHeader from '@/components/receipts/ReceiptsHeader';
import UnifiedControls from '@/components/receipts/UnifiedControls';
import ReceiptsGrid from '@/components/receipts/ReceiptsGrid';
import EnhancedEmptyState from '@/components/receipts/EnhancedEmptyState';
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

  const handleUploadClick = () => {
    setIsLoadMoreModalOpen(true);
  };

  const handleLoadSample = () => {
    handleReceiptsAdded();
  };

  const showEmptyState = receipts.length === 0;
  const showNoResults = receipts.length > 0 && filteredReceipts.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <ReceiptsHeader onLoadMoreClick={() => setIsLoadMoreModalOpen(true)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showEmptyState ? (
          <EnhancedEmptyState 
            onUploadClick={handleUploadClick}
            onLoadSampleClick={handleLoadSample}
          />
        ) : (
          <>
            <UnifiedControls
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedTag={selectedTag}
              sortOrder={sortOrder}
              onTagClick={handleTagClick}
              onSortClick={handleSortClick}
            />

            {showNoResults ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No matching receipts</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <ReceiptsGrid
                receipts={filteredReceipts}
                selectedTag={selectedTag}
                onCardClick={handleCardClick}
              />
            )}
          </>
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
