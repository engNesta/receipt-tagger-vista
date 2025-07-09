
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useSummaryStream } from '@/hooks/useSummaryStream';
import ReceiptImage from '@/components/receipts/ReceiptImage';
import ReceiptSummary from '@/components/receipts/ReceiptSummary';
import ReceiptDisplayInfo from '@/components/receipts/ReceiptDisplayInfo';
import type { Receipt } from '@/types';

interface ReceiptModalProps {
  receipt: Receipt | null;
  selectedTag: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ receipt, selectedTag, isOpen, onClose }) => {
  const { user } = useAuth();
  const {
    summaryText,
    isLoadingSummary,
    summaryError,
    isStreaming,
    startSummaryStream
  } = useSummaryStream({
    receipt,
    userId: user?.id,
    isOpen
  });

  if (!receipt) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Receipt #{receipt.id}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left side - Preview */}
          <div id="preview" className="space-y-4">
            <ReceiptImage receipt={receipt} />
            <ReceiptDisplayInfo receipt={receipt} selectedTag={selectedTag} />
          </div>

          {/* Right side - Summary Stream */}
          <ReceiptSummary
            summaryText={summaryText}
            isLoadingSummary={isLoadingSummary}
            summaryError={summaryError}
            isStreaming={isStreaming}
            onRetry={startSummaryStream}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptModal;
