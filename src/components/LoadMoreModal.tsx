
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import UploadSection from './UploadSection';
import { Trans } from '@/components/Trans';

interface LoadMoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReceiptsAdded: () => void;
}

const LoadMoreModal: React.FC<LoadMoreModalProps> = ({ isOpen, onClose, onReceiptsAdded }) => {
  const handleUploadComplete = () => {
    onReceiptsAdded();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            <Trans text="Load More Receipts" />
          </DialogTitle>
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
