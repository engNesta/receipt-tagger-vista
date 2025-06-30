
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import UploadSection from './UploadSection';

interface LoadMoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReceiptsAdded: () => void;
}

const LoadMoreModal: React.FC<LoadMoreModalProps> = ({ isOpen, onClose, onReceiptsAdded }) => {
  const { getText } = useLanguage();

  const handleUploadComplete = () => {
    onReceiptsAdded();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{getText('loadMoreReceipts')}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <UploadSection
            onUploadComplete={handleUploadComplete}
            isCompact={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoadMoreModal;
