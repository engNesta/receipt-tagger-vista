
import React from 'react';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Trans } from '@/components/Trans';

interface ReceiptsHeaderProps {
  onLoadMoreClick: () => void;
}

const ReceiptsHeader: React.FC<ReceiptsHeaderProps> = ({ onLoadMoreClick }) => {

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 rounded-lg p-2">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                <Trans text="Receipts" />
              </h1>
              <p className="text-sm text-gray-500">
                <Trans text="Manage your receipts" />
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button onClick={onLoadMoreClick} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <Trans text="Add Receipts" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptsHeader;
