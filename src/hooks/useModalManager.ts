
import { useState } from 'react';
import type { Receipt } from '@/types';

export const useModalManager = () => {
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoadMoreModal, setShowLoadMoreModal] = useState(false);

  const handleReceiptClick = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setIsModalOpen(true);
  };

  const closeReceiptModal = () => setIsModalOpen(false);
  const closeLoadMoreModal = () => setShowLoadMoreModal(false);

  return {
    selectedReceipt,
    isModalOpen,
    showLoadMoreModal,
    setShowLoadMoreModal,
    handleReceiptClick,
    closeReceiptModal,
    closeLoadMoreModal
  };
};
