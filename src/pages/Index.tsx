
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import UploadHero from '@/features/upload/UploadHero';
import ReceiptsSection from '@/features/receipts/ReceiptsSection';
import ReceiptModal from '@/components/ReceiptModal';
import LoadMoreModal from '@/components/LoadMoreModal';
import MongoDBTest from '@/components/MongoDBTest';
import { useReceiptFiltering } from '@/hooks/useReceiptFiltering';
import { useFastApiProcessor } from '@/hooks/useFastApiProcessor';
import type { Receipt } from '@/types';

// Transform FastAPI document to Receipt format
const transformFastApiDocToReceipt = (doc: any, index: number): Receipt => ({
  id: index + 1,
  imageUrl: doc.ingested_path || '/placeholder.svg',
  vendor: doc.tags?.vendor || 'Unknown Vendor',
  price: doc.tags?.price ? `${doc.tags.price} kr` : '0 kr',
  productName: doc.tags?.product_or_service || 'Unknown Product',
  verificationLetter: doc.status || 'N/A',
  fileId: doc.id
});

const Index = () => {
  const { user } = useAuth();
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLoadMoreModal, setShowLoadMoreModal] = useState(false);
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  const { processedDocuments, loadDocuments } = useFastApiProcessor();
  
  const {
    filteredReceipts,
    selectedTag,
    searchTerm,
    setSearchTerm,
    sortOrder,
    handleTagClick,
    handleSortClick
  } = useReceiptFiltering(receipts);

  // Transform processed documents to receipts when they change
  useEffect(() => {
    console.log('Index.tsx - Processing documents effect triggered');
    console.log('Index.tsx - processedDocuments count:', processedDocuments.length);
    console.log('Index.tsx - processedDocuments data:', processedDocuments);
    
    if (processedDocuments.length > 0) {
      const transformedReceipts = processedDocuments.map((doc, index) => 
        transformFastApiDocToReceipt(doc, index)
      );
      console.log('Index.tsx - Transformed receipts:', transformedReceipts);
      setReceipts(transformedReceipts);
    } else {
      console.log('Index.tsx - No documents to transform, setting empty receipts');
      setReceipts([]);
    }
  }, [processedDocuments]); // Simplified dependency - React will handle deep comparison

  // Load documents when user changes (only once on mount)
  useEffect(() => {
    if (user) {
      console.log('Index.tsx - User changed, loading documents for:', user.id);
      loadDocuments();
    }
  }, [user, loadDocuments]);

  const handleReceiptClick = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setIsModalOpen(true);
  };

  const handleUploadComplete = () => {
    console.log('Index.tsx - Upload completed, documents should update automatically');
    // No need to reload manually - the processFiles function updates the state directly
  };

  console.log('Index.tsx - Final state - receipts count:', receipts.length);
  console.log('Index.tsx - Final state - receipts data:', receipts);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header 
        showProfileModal={showProfileModal}
        setShowProfileModal={setShowProfileModal}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MongoDBTest />
        
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
        />

        <LoadMoreModal 
          isOpen={showLoadMoreModal}
          onClose={() => setShowLoadMoreModal(false)}
          onReceiptsAdded={() => {
            setShowLoadMoreModal(false);
          }}
        />

        <ReceiptModal
          receipt={selectedReceipt}
          selectedTag={selectedTag}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Index;
