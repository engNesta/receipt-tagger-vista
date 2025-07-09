
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { fastApiService } from '@/services/fastApiService';
import OptimizedImage from '@/components/ui/optimized-image';
import type { Receipt } from '@/types';

interface ReceiptModalProps {
  receipt: Receipt | null;
  selectedTag: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ receipt, selectedTag, isOpen, onClose }) => {
  const { getText } = useLanguage();
  const { user } = useAuth();
  const [summaryText, setSummaryText] = useState('');
  const [fullSummaryText, setFullSummaryText] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const streamingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Typewriter effect for streaming text
  const startTypewriterEffect = (text: string) => {
    setSummaryText('');
    setIsStreaming(true);
    
    let currentIndex = 0;
    
    const typeNextCharacter = () => {
      if (currentIndex < text.length) {
        setSummaryText(text.substring(0, currentIndex + 1));
        currentIndex++;
        streamingIntervalRef.current = setTimeout(typeNextCharacter, 50); // 50ms per character
      } else {
        setIsStreaming(false);
      }
    };
    
    typeNextCharacter();
  };

  // Streaming summary functionality
  const startSummaryStream = async () => {
    if (!receipt || !user) return;
    
    // Cancel any existing stream
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Clear any existing typewriter effect
    if (streamingIntervalRef.current) {
      clearTimeout(streamingIntervalRef.current);
      streamingIntervalRef.current = null;
    }
    
    abortControllerRef.current = new AbortController();
    setIsLoadingSummary(true);
    setSummaryError(null);
    setSummaryText('');
    setFullSummaryText('');
    setIsStreaming(false);
    
    try {
      const response = await fastApiService.getSummary(receipt.fileId, user.id);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }
      
      const decoder = new TextDecoder();
      setIsLoadingSummary(false);
      
      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        
        // Try to parse complete JSON objects from the buffer
        try {
          const jsonData = JSON.parse(buffer);
          
          // Filter and extract only the summary text
          if (jsonData.status === 'success' && jsonData.summary?.summary) {
            setFullSummaryText(jsonData.summary.summary);
            startTypewriterEffect(jsonData.summary.summary);
          } else if (jsonData.status === 'not_found') {
            setSummaryError('No summary found for this receipt');
          } else {
            setSummaryError('Unexpected response format');
          }
          
          buffer = ''; // Clear buffer after successful parse
        } catch (parseError) {
          // JSON not complete yet, continue accumulating
          continue;
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Stream was cancelled, ignore
      }
      
      setIsLoadingSummary(false);
      setSummaryError(error instanceof Error ? error.message : 'Failed to load summary');
    }
  };

  // Start streaming when modal opens
  useEffect(() => {
    if (isOpen && receipt) {
      startSummaryStream();
    }
    
    // Cleanup on close
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      if (streamingIntervalRef.current) {
        clearTimeout(streamingIntervalRef.current);
        streamingIntervalRef.current = null;
      }
    };
  }, [isOpen, receipt?.id]);

  if (!receipt) return null;

  const getDisplayValue = () => {
    if (!selectedTag) return null;
    
    switch (selectedTag) {
      case 'vendor':
        return { label: getText('vendor'), value: receipt.vendor };
      case 'price':
        return { label: getText('price'), value: receipt.price };
      case 'productName':
        return { label: getText('productName'), value: receipt.productName };
      case 'verificationLetter':
        return { label: getText('verificationLetter'), value: receipt.verificationLetter };
      default:
        return null;
    }
  };

  const displayInfo = getDisplayValue();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Receipt #{receipt.id}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left side - Preview */}
          <div id="preview" className="space-y-4">
            <div className="aspect-[4/5] bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
              <OptimizedImage
                src={receipt.imageUrl}
                alt={`Receipt ${receipt.id}`}
                className="group-hover:scale-105 transition-transform duration-300"
                aspectRatio="aspect-[4/5]"
                fallbackContent={
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50">
                    <div className="bg-gray-100 rounded-full p-4 mb-3">
                      <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-center px-2">Receipt {receipt.id}</p>
                  </div>
                }
              />
            </div>

            {displayInfo ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-2">{displayInfo.label}</p>
                <p className="font-semibold text-gray-900 text-lg">{displayInfo.value}</p>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-400 text-sm italic">{getText('selectTagForInfo')}</p>
              </div>
            )}
          </div>

          {/* Right side - Summary Stream */}
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
                    onClick={startSummaryStream}
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptModal;
