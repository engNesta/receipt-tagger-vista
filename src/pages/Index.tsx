
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
import type { Receipt, FastApiDocument } from '@/types';

// Transform FastAPI document to Receipt format
const transformFastApiDocToReceipt = (doc: FastApiDocument, index: number): Receipt => {
  console.log('Transforming FastAPI document:', doc);
  
  // Create a more reliable ID from the document ID
  const numericId = doc.id ? parseInt(doc.id.replace(/-/g, '').substring(0, 8), 16) : (Date.now() + index);
  
  const receipt: Receipt = {
    id: numericId,
    imageUrl: doc.ingested_path || '/placeholder.svg',
    vendor: doc.tags?.vendor || 'Unknown Vendor',
    price: doc.tags?.price ? `${doc.tags.price} kr` : '0 kr',
    productName: doc.tags?.product_or_service || doc.original_filename || 'Unknown Product',
    verificationLetter: doc.status || 'N/A',
    fileId: doc.id
  };
  
  console.log('Transformed to receipt:', receipt);
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
    console.log('=== TRANSFORMATION EFFECT TRIGGERED ===');
    console.log('processedDocuments length:', processedDocuments?.length || 0);
    console.log('processedDocuments data:', processedDocuments);
    
    if (processedDocuments && Array.isArray(processedDocuments) && processedDocuments.length > 0) {
      console.log('Starting transformation of', processedDocuments.length, 'documents');
      
      try {
        const transformedReceipts = processedDocuments.map((doc, index) => {
          console.log(`Transforming document ${index + 1}/${processedDocuments.length}:`, doc);
          return transformFastApiDocToReceipt(doc, index);
        });
        
        console.log('Successfully transformed receipts:', transformedReceipts);
        console.log('Setting receipts state with', transformedReceipts.length, 'receipts');
        
        setReceipts(transformedReceipts);
        
        console.log('Receipts state updated');
      } catch (error) {
        console.error('Error during transformation:', error);
        setReceipts([]);
      }
    } else {
      console.log('No documents to transform or invalid data, setting empty receipts');
      console.log('processedDocuments type:', typeof processedDocuments);
      console.log('processedDocuments is array:', Array.isArray(processedDocuments));
      setReceipts([]);
    }
  }, [processedDocuments]);

  // Load documents when user changes
  useEffect(() => {
    if (user) {
      console.log('User changed, loading documents for:', user.id);
      loadDocuments();
    } else {
      console.log('No user, clearing receipts');
      setReceipts([]);
    }
  }, [user, loadDocuments]);

  const handleReceiptClick = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setIsModalOpen(true);
  };

  const handleUploadComplete = async () => {
    console.log('Upload completed, reloading documents');
    // Reload documents to get the latest data
    if (user) {
      await loadDocuments();
    }
  };

  console.log('=== INDEX RENDER STATE ===');
  console.log('User:', user?.id || 'No user');
  console.log('ProcessedDocuments count:', processedDocuments?.length || 0);
  console.log('Receipts count:', receipts.length);
  console.log('Filtered receipts count:', filteredReceipts.length);
  console.log('Current receipts:', receipts);

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
