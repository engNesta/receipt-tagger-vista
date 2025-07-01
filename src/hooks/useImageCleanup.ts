
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CleanupResult {
  success: boolean;
  filesChecked: number;
  filesRemoved: number;
  message: string;
  logId?: string;
}

export const useImageCleanup = () => {
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const { toast } = useToast();

  const runCleanup = async (cleanupType: 'manual' | 'automatic' = 'manual'): Promise<CleanupResult> => {
    setIsCleaningUp(true);
    
    try {
      console.log('Starting image cleanup process...');
      
      const { data, error } = await supabase.functions.invoke('cleanup-invalid-images', {
        body: {
          cleanupType,
          maxAge: 24 // Only check files that haven't been validated in the last 24 hours
        }
      });

      if (error) {
        console.error('Cleanup function error:', error);
        throw new Error(error.message || 'Failed to run cleanup');
      }

      const result = data as CleanupResult;
      console.log('Cleanup completed:', result);

      // Show appropriate toast message
      if (result.filesRemoved > 0) {
        toast({
          title: "Cleanup Completed",
          description: `${result.filesRemoved} invalid images were removed from your collection.`,
        });
      } else {
        toast({
          title: "Cleanup Completed",
          description: "All your images are valid. No cleanup was needed.",
        });
      }

      return result;

    } catch (error) {
      console.error('Cleanup failed:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to clean up invalid images';
      
      toast({
        title: "Cleanup Failed",
        description: errorMessage,
        variant: "destructive",
      });

      return {
        success: false,
        filesChecked: 0,
        filesRemoved: 0,
        message: errorMessage
      };
    } finally {
      setIsCleaningUp(false);
    }
  };

  const runAutomaticCleanup = async (): Promise<CleanupResult> => {
    return runCleanup('automatic');
  };

  return {
    isCleaningUp,
    runCleanup,
    runAutomaticCleanup
  };
};
