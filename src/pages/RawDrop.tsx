
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import UploadHero from '@/features/upload/UploadHero';
import ReceiptsSection from '@/features/receipts/ReceiptsSection';
import ReceiptModal from '@/components/ReceiptModal';
import LoadMoreModal from '@/components/LoadMoreModal';
import { useModalManager } from '@/hooks/useModalManager';
import { useReceiptFiltering } from '@/hooks/useReceiptFiltering';
import { useFastApiProcessor } from '@/hooks/useFastApiProcessor';
import { transformFastApiDocToReceipt } from '@/utils/receiptTransformers';
import { logger } from '@/utils/logger';
import type { Receipt } from '@/types';

const Index = () => {
  const { user } = useAuth();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  
  const {
    selectedReceipt,
    isModalOpen,
    showProfileModal,
    showLoadMoreModal,
    setShowProfileModal,
    setShowLoadMoreModal,
    handleReceiptClick,
    closeReceiptModal,
    closeLoadMoreModal
  } = useModalManager();

  const { processedDocuments, loadDocuments, processFiles, isLoading, error, clearError } = useFastApiProcessor();
  
  const {
    filteredReceipts,
    selectedTag,
    searchTerm,
    setSearchTerm,
    sortOrder,
    handleTagClick,
    handleSortClick
  } = useReceiptFiltering(receipts);

  // Transform processed documents to receipts
  useEffect(() => {
    if (Array.isArray(processedDocuments) && processedDocuments.length > 0) {
      try {
        const transformedReceipts = processedDocuments.map(transformFastApiDocToReceipt);
        setReceipts(transformedReceipts);
        logger.info('Transformed documents to receipts', { count: transformedReceipts.length });
      } catch (error) {
        logger.error('Failed to transform documents:', error);
        setReceipts([]);
      }
    } else {
      setReceipts([]);
    }
  }, [processedDocuments]);

  // Load documents when user changes
  useEffect(() => {
    if (user) {
      loadDocuments();
    } else {
      setReceipts([]);
    }
  }, [user, loadDocuments]);

  const handleUploadComplete = async () => {
    clearError();
    await loadDocuments();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header 
        showProfileModal={showProfileModal}
        setShowProfileModal={setShowProfileModal}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mt-8">
          <UploadHero onUploadComplete={handleUploadComplete} />
        </div>

        <ReceiptsSection
          receipts={receipts}
          filteredReceipts={filteredReceipts}
          selectedTag={selectedTag}
          searchTerm={searchTerm}
          sortOrder={sortOrder}
          onTagClick={handleTagClick}
          onSearchChange={setSearchTerm}
          onSortClick={handleSortClick}
          onReceiptClick={handleReceiptClick}
          onLoadMoreClick={() => setShowLoadMoreModal(true)}
          isLoading={isLoading}
          error={error}
          onRetry={loadDocuments}
        />

        <LoadMoreModal 
          isOpen={showLoadMoreModal}
          onClose={closeLoadMoreModal}
          onReceiptsAdded={closeLoadMoreModal}
        />

        <ReceiptModal
          receipt={selectedReceipt}
          selectedTag={selectedTag}
          isOpen={isModalOpen}
          onClose={closeReceiptModal}
        />
      </div>
    </div>
  );
};

export default Index;
