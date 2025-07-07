
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
const transformFastApiDocToReceipt = (doc: any, index: number): Receipt => {
  console.log('Transforming document:', doc);
  
  const receipt = {
    id: parseInt(doc.id.replace(/-/g, '').slice(0, 8), 16) || (Date.now() + index),
    imageUrl: doc.ingested_path || '/placeholder.svg',
    vendor: doc.tags?.vendor || 'Unknown Vendor',
    price: doc.tags?.price ? `${doc.tags.price} kr` : '0 kr',
    productName: doc.tags?.product_or_service || 'Unknown Product',
    verificationLetter: doc.status || 'N/A',
    fileId: doc.id
  };
  
  console.log('Transformed receipt:', receipt);
  return receipt;
};

const Index = () => {
  const { user } = useAuth();
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLoadMoreModal, setShowLoadMoreModal] = useState(false);
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  const { processedDocuments, loadDocuments, processFiles } = useFastApiProcessor();
  
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
    
    if (processedDocuments && processedDocuments.length > 0) {
      console.log('Index.tsx - Starting transformation of documents');
      const transformedReceipts = processedDocuments.map((doc, index) => {
        console.log(`Index.tsx - Transforming document ${index}:`, doc);
        return transformFastApiDocToReceipt(doc, index);
      });
      console.log('Index.tsx - Transformed receipts:', transformedReceipts);
      setReceipts(transformedReceipts);
      console.log('Index.tsx - Set receipts state with:', transformedReceipts.length, 'receipts');
    } else {
      console.log('Index.tsx - No documents to transform, setting empty receipts');
      setReceipts([]);
    }
  }, [processedDocuments]);

  // Load documents when user changes
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

  const handleUploadComplete = async () => {
    console.log('Index.tsx - Upload completed, documents should already be updated');
    // Documents are already updated in the processFiles function
    // No need to reload here as they're already added to state
  };

  console.log('Index.tsx - Render - receipts count:', receipts.length);
  console.log('Index.tsx - Render - receipts data:', receipts);
  console.log('Index.tsx - Render - processedDocuments count:', processedDocuments.length);

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
