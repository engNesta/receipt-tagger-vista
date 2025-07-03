
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Receipt, ProcessedFile } from '@/types';
import { transformFileToReceipt, transformProcessedFileToReceipt, createDemoReceipts } from '@/utils/receiptTransformers';

export const useReceiptData = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const { user } = useAuth();

  const createReceiptsFromFiles = async (processedFiles: ProcessedFile[]) => {
    console.log('Creating receipts from processed files:', processedFiles.length);
    console.log('Current user:', user ? 'authenticated' : 'not authenticated');

    const newReceipts = processedFiles
      .filter(pf => pf.azureUrl)
      .map((processedFile, index) => transformProcessedFileToReceipt(processedFile, index));

    setReceipts(prevReceipts => [...prevReceipts, ...newReceipts]);
    console.log('Created receipts from uploads:', newReceipts.length);
    return newReceipts;
  };

  const handleReceiptsAdded = () => {
    const newReceipts = createDemoReceipts(receipts.length);
    setReceipts(prevReceipts => [...prevReceipts, ...newReceipts]);
    console.log('Added demo receipts:', newReceipts.length);
  };

  const loadReceiptsFromDatabase = async () => {
    if (!user) {
      console.log('No user authenticated, skipping database load');
      return;
    }

    try {
      console.log('Loading receipts from database for user:', user.id);
      
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('user_id', user.id)
        .eq('upload_status', 'completed')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading receipts from database:', error);
        return;
      }

      console.log('Raw database data:', data);
      const dbReceipts = data?.map((file, index) => transformFileToReceipt(file, index)) || [];
      console.log('Transformed receipts:', dbReceipts);
      setReceipts(dbReceipts);
      console.log('Loaded receipts from database:', dbReceipts.length);
    } catch (error) {
      console.error('Error loading receipts:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadReceiptsFromDatabase();
    }
  }, [user]);

  return {
    receipts,
    handleReceiptsAdded,
    createReceiptsFromFiles,
    loadReceiptsFromDatabase
  };
};
