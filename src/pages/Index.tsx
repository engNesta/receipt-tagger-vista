
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, Upload, FileText, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import LanguageSelector from '@/components/LanguageSelector';
import UploadSection from '@/components/UploadSection';
import UserProfile from '@/components/auth/UserProfile';
import ReceiptCard from '@/components/ReceiptCard';
import ReceiptModal from '@/components/ReceiptModal';
import UnifiedControls from '@/components/receipts/UnifiedControls';
import LoadMoreModal from '@/components/LoadMoreModal';
import { useReceiptData } from '@/hooks/useReceiptData';
import { useReceiptFiltering } from '@/hooks/useReceiptFiltering';

const Index = () => {
  const { getText } = useLanguage();
  const { user } = useAuth();
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLoadMoreModal, setShowLoadMoreModal] = useState(false);

  const { receipts, handleReceiptsAdded } = useReceiptData();
  const {
    filteredReceipts,
    selectedTag,
    searchTerm,
    setSearchTerm,
    sortOrder,
    handleTagClick,
    handleSortClick
  } = useReceiptFiltering(receipts);

  const handleReceiptClick = (receipt: any) => {
    setSelectedReceipt(receipt);
    setIsModalOpen(true);
  };

  const handleUploadComplete = () => {
    setShowUploadModal(false);
  };

  const handleLoadMoreComplete = () => {
    handleReceiptsAdded();
    setShowLoadMoreModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header with user profile */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">RawDrop</h1>
              <span className="text-sm text-gray-500">Secure File Management</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              
              <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {user?.email?.split('@')[0] || 'Profile'}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>User Profile</DialogTitle>
                  </DialogHeader>
                  <UserProfile />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center space-x-2">
                      <Upload className="h-4 w-4" />
                      <span>{getText('uploadFiles')}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{getText('uploadFiles')}</DialogTitle>
                    </DialogHeader>
                    <UploadSection 
                      onUploadComplete={handleUploadComplete}
                      isCompact={true}
                    />
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="outline" 
                  className="flex items-center space-x-2"
                  onClick={() => setShowLoadMoreModal(true)}
                >
                  <FileText className="h-4 w-4" />
                  <span>Load More Files</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main upload section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <UploadSection onUploadComplete={() => console.log('Upload completed')} />
          </div>
          
          <div className="space-y-6">
            <UnifiedControls
              selectedTag={selectedTag}
              onTagClick={handleTagClick}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortOrder={sortOrder}
              onSortClick={handleSortClick}
            />
          </div>
        </div>

        <div className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredReceipts.map((receipt) => (
              <ReceiptCard
                key={receipt.id}
                receipt={receipt}
                selectedTag={selectedTag}
                onClick={() => handleReceiptClick(receipt)}
              />
            ))}
          </div>
        </div>

        <LoadMoreModal 
          isOpen={showLoadMoreModal}
          onClose={() => setShowLoadMoreModal(false)}
          onReceiptsAdded={handleLoadMoreComplete}
        />
      </div>

      <ReceiptModal
        receipt={selectedReceipt}
        selectedTag={selectedTag}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Index;
