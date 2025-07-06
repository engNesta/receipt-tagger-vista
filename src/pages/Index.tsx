
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
  imageUrl: doc.file_url || '/placeholder.svg', // You might need to add file URL to your FastAPI response
  vendor: doc.tags?.find((tag: any) => tag.type === 'vendor')?.value || 'Unknown Vendor',
  price: doc.tags?.find((tag: any) => tag.type === 'price')?.value || '$0.00',
  productName: doc.tags?.find((tag: any) => tag.type === 'product')?.value || 'Unknown Product',
  verificationLetter: doc.tags?.find((tag: any) => tag.type === 'verification')?.value || 'N/A',
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
    const transformedReceipts = processedDocuments.map((doc, index) => 
      transformFastApiDocToReceipt(doc, index)
    );
    setReceipts(transformedReceipts);
  }, [processedDocuments]);

  // Load documents when user changes
  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user, loadDocuments]);

  const handleReceiptClick = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setIsModalOpen(true);
  };

  const handleUploadComplete = () => {
    console.log('Upload completed, documents will be automatically refreshed');
    // The useFastApiProcessor hook handles reloading documents after processing
  };

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
            // For demo purposes - in real app this would add more FastAPI documents
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
