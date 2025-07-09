import { useState, useEffect, useRef } from 'react';
import { fastApiService } from '@/services/fastApiService';
import type { Receipt } from '@/types';

interface UseSummaryStreamProps {
  receipt: Receipt | null;
  userId: string | undefined;
  isOpen: boolean;
}

export const useSummaryStream = ({ receipt, userId, isOpen }: UseSummaryStreamProps) => {
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
    if (!receipt || !userId) return;
    
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
      const response = await fastApiService.getSummary(receipt.fileId, userId);
      
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

  return {
    summaryText,
    fullSummaryText,
    isLoadingSummary,
    summaryError,
    isStreaming,
    startSummaryStream
  };
};