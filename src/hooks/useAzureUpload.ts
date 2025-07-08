
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UploadResult {
  success: boolean;
  file?: any;
  url?: string;
  error?: string;
  message?: string;
}

export const useAzureUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (file: File): Promise<UploadResult> => {
    setIsUploading(true);
    
    try {
      console.log('Starting upload for:', file.name);
      
      // Convert file to base64
      const fileData = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
          }
        };
        reader.readAsDataURL(file);
      });

      console.log('File converted to base64, calling edge function');

      // Call edge function
      const { data, error } = await supabase.functions.invoke('azure-upload', {
        body: {
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          fileData
        }
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Upload failed');
      }

      if (!data) {
        throw new Error('No response data from upload function');
      }

      // Handle both success and error cases from the edge function
      if (data.success === false) {
        throw new Error(data.error || 'Upload failed');
      }

      console.log('Upload successful:', data);

      return {
        success: true,
        file: data.file,
        url: data.url,
        message: data.message
      };

    } catch (error) {
      console.error('Upload failed:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
      
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });

      return { 
        success: false, 
        error: errorMessage
      };
    } finally {
      setIsUploading(false);
    }
  };

  const uploadMultipleFiles = async (files: File[]): Promise<UploadResult[]> => {
    const results: UploadResult[] = [];
    
    for (const file of files) {
      const result = await uploadFile(file);
      results.push(result);
    }
    
    return results;
  };

  return {
    uploadFile,
    uploadMultipleFiles,
    isUploading
  };
};
