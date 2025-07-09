import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';

interface ReceiptSummaryProps {
  summaryText: string;
  isLoadingSummary: boolean;
  summaryError: string | null;
  isStreaming: boolean;
  onRetry: () => void;
}

const ReceiptSummary: React.FC<ReceiptSummaryProps> = ({
  summaryText,
  isLoadingSummary,
  summaryError,
  isStreaming,
  onRetry
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Summary</h3>
      <div 
        id="summaryStream" 
        className="min-h-[300px] max-h-[400px] overflow-y-auto border rounded-lg p-4 bg-gray-50"
      >
        {isLoadingSummary ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span className="text-sm text-gray-600">Loading summary...</span>
          </div>
        ) : summaryError ? (
          <div className="text-center py-8">
            <p className="text-sm text-red-600 mb-4">{summaryError}</p>
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry</span>
            </Button>
          </div>
        ) : summaryText ? (
          <div className="text-sm leading-relaxed space-y-2">
            <p className="whitespace-pre-wrap">
              {summaryText}
              {isStreaming && (
                <span className="inline-block w-0.5 h-4 bg-primary ml-1 animate-pulse" />
              )}
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No summary available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptSummary;