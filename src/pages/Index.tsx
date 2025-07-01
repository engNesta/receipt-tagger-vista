import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, Upload, FileText, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import LanguageSelector from '@/components/LanguageSelector';
import UploadSection from '@/components/UploadSection';
import UserProfile from '@/components/auth/UserProfile';
import ReceiptModal from '@/components/ReceiptModal';
import UnifiedControls from '@/components/receipts/UnifiedControls';
import ReceiptsGrid from '@/components/receipts/ReceiptsGrid';
import EmptyState from '@/components/receipts/EmptyState';
import LoadMoreModal from '@/components/LoadMoreModal';
import { useReceiptData } from '@/hooks/useReceiptData';
import { useReceiptFiltering } from '@/hooks/useReceiptFiltering';

const Index = () => {
  const { getText } = useLanguage();
  const { user } = useAuth();
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLoadMoreModal, setShowLoadMoreModal] = useState(false);

  const { receipts, handleReceiptsAdded, createReceiptsFromFiles, loadReceiptsFromDatabase } = useReceiptData();
  const {
    filteredReceipts,
    selectedTag,
    searchTerm,
    setSearchTerm,
    sortOrder,
    handleTagClick,
    handleSortClick
  } = useReceiptFiltering(receipts);

  // Load existing receipts when component mounts and user is authenticated
  useEffect(() => {
    if (user) {
      loadReceiptsFromDatabase();
    }
  }, [user]);

  const handleReceiptClick = (receipt: any) => {
    setSelectedReceipt(receipt);
    setIsModalOpen(true);
  };

  const handleLoadMoreComplete = () => {
    handleReceiptsAdded();
    setShowLoadMoreModal(false);
  };

  // Handle successful file uploads by reloading from database
  const handleUploadComplete = (processedFiles: any[]) => {
    console.log('Files uploaded successfully, reloading receipts from database:', processedFiles.length);
    if (processedFiles.length > 0) {
      // Wait a brief moment for files to be saved to database, then reload
      setTimeout(() => {
        loadReceiptsFromDatabase();
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Clean Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand */}
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">RawDrop</h1>
                <p className="text-xs text-gray-500">{getText('secureManage')}</p>
              </div>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center space-x-3">
              <LanguageSelector />
              
              <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user?.email?.split('@')[0] || getText('profile')}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{getText('profile')}</DialogTitle>
                  </DialogHeader>
                  <UserProfile />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Upload Section - Now full width */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{getText('uploadFiles')}</h2>
            <p className="text-gray-600">{getText('dragDropUpload')}</p>
          </div>
          
          {/* Upload Area - Full width with receipt creation callback */}
          <div className="max-w-4xl mx-auto">
            <UploadSection onUploadComplete={handleUploadComplete} />
          </div>
        </div>

        {/* Receipts Section */}
        <div className="space-y-6">
          {/* Section Header with Load More Button */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{getText('yourReceipts')}</h3>
              <p className="text-sm text-gray-600">{filteredReceipts.length} {getText('receiptsFound')}</p>
            </div>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setShowLoadMoreModal(true)}
            >
              <Plus className="h-4 w-4" />
              {getText('loadMoreFiles')}
            </Button>
          </div>

          {/* Controls */}
          <UnifiedControls
            selectedTag={selectedTag}
            onTagClick={handleTagClick}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortOrder={sortOrder}
            onSortClick={handleSortClick}
          />

          {/* Receipts Grid or Empty State */}
          {filteredReceipts.length > 0 ? (
            <ReceiptsGrid
              receipts={filteredReceipts}
              selectedTag={selectedTag}
              onCardClick={handleReceiptClick}
            />
          ) : (
            <EmptyState />
          )}
        </div>

        {/* Modals */}
        <LoadMoreModal 
          isOpen={showLoadMoreModal}
          onClose={() => setShowLoadMoreModal(false)}
          onReceiptsAdded={handleLoadMoreComplete}
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
