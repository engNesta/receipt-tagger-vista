
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useReceiptDeletion = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const deleteReceipt = async (fileId: string): Promise<boolean> => {
    setIsDeleting(true);
    
    try {
      console.log('Deleting single receipt:', fileId);
      
      const { data, error } = await supabase.functions.invoke('delete-receipt', {
        body: { fileId }
      });

      if (error) {
        console.error('Delete function error:', error);
        throw new Error(error.message || 'Failed to delete receipt');
      }

      if (!data.success) {
        throw new Error(data.error || 'Deletion failed');
      }

      toast({
        title: "Receipt Deleted",
        description: data.message || "Receipt has been successfully deleted.",
      });

      return true;

    } catch (error) {
      console.error('Delete receipt failed:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete receipt';
      
      toast({
        title: "Delete Failed",
        description: errorMessage,
        variant: "destructive",
      });

      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteAllReceipts = async (): Promise<boolean> => {
    setIsDeleting(true);
    
    try {
      console.log('Deleting all receipts');
      
      const { data, error } = await supabase.functions.invoke('delete-receipt', {
        body: { deleteAll: true }
      });

      if (error) {
        console.error('Delete all function error:', error);
        throw new Error(error.message || 'Failed to delete all receipts');
      }

      if (!data.success) {
        throw new Error(data.error || 'Deletion failed');
      }

      toast({
        title: "All Receipts Deleted",
        description: data.message || `Successfully deleted ${data.deletedCount} receipts.`,
      });

      return true;

    } catch (error) {
      console.error('Delete all receipts failed:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete all receipts';
      
      toast({
        title: "Delete All Failed",
        description: errorMessage,
        variant: "destructive",
      });

      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteReceipt,
    deleteAllReceipts,
    isDeleting
  };
};
