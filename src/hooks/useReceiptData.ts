import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// Define the receipt interface for type safety
interface Receipt {
  id: number;
  imageUrl: string;
  vendor: string;
  price: string;
  productName: string;
  verificationLetter: string;
  fileId?: string; // Add optional fileId to link to uploaded files
}

interface ProcessedFile {
  file: File;
  id: string;
  timestamp: number;
  metadata: {
    size: number;
    type: string;
    lastModified: number;
  };
  azureUrl?: string;
}

export const useReceiptData = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const { user } = useAuth();

  // Create receipts from uploaded files
  const createReceiptsFromFiles = async (processedFiles: ProcessedFile[]) => {
    if (!user) {
      console.log('User not authenticated, cannot create receipts');
      return;
    }

    console.log('Creating receipts from processed files:', processedFiles.length);

    const newReceipts = processedFiles
      .filter(pf => pf.azureUrl) // Only create receipts for successfully uploaded files
      .map((processedFile, index) => ({
        id: Date.now() + index, // Temporary ID until we get from database
        imageUrl: processedFile.azureUrl!,
        vendor: 'Unknown', // Will be populated by cloud processing
        price: '0 kr', // Will be populated by cloud processing
        productName: processedFile.file.name.replace(/\.[^/.]+$/, ""), // Use filename without extension
        verificationLetter: `V${String(Date.now()).slice(-3)}${index.toString().padStart(2, '0')}`, // Generate temp verification
        fileId: processedFile.id
      }));

    // Store in Supabase files table (this is already done by the pipeline)
    // For now, just add to local state - later we'll read from database
    setReceipts(prevReceipts => [...prevReceipts, ...newReceipts]);
    
    console.log('Created receipts from uploads:', newReceipts.length);
    return newReceipts;
  };

  // Legacy method for demo data - keep for "Load More" button
  const handleReceiptsAdded = () => {
    const newReceipts = [
      {
        id: receipts.length + 1,
        imageUrl: "/placeholder.svg",
        vendor: "Coop Konsum",
        price: "1 562 kr",
        productName: "Lunch & representation",
        verificationLetter: "V007"
      },
      {
        id: receipts.length + 2,
        imageUrl: "/placeholder.svg",
        vendor: "SJ AB",
        price: "1 895 kr",
        productName: "Tågresor företag",
        verificationLetter: "V008"
      }
    ];
    
    setReceipts(prevReceipts => [...prevReceipts, ...newReceipts]);
    console.log('Added demo receipts:', newReceipts.length);
  };

  // Load receipts from database (placeholder for future implementation)
  const loadReceiptsFromDatabase = async () => {
    if (!user) return;

    try {
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

      // Convert file records to receipt format
      const dbReceipts = data?.map((file, index) => ({
        id: parseInt(file.id.replace(/-/g, '').slice(0, 8), 16), // Convert UUID to number
        imageUrl: file.azure_blob_url,
        vendor: 'Processing...', // Will be updated when cloud processing is done
        price: '0 kr',
        productName: file.original_name.replace(/\.[^/.]+$/, ""),
        verificationLetter: `V${String(Date.now()).slice(-3)}${index.toString().padStart(2, '0')}`,
        fileId: file.id
      })) || [];

      setReceipts(dbReceipts);
      console.log('Loaded receipts from database:', dbReceipts.length);
    } catch (error) {
      console.error('Error loading receipts:', error);
    }
  };

  return {
    receipts,
    handleReceiptsAdded,
    createReceiptsFromFiles,
    loadReceiptsFromDatabase
  };
};
