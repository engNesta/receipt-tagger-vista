
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UploadResult {
  success: boolean;
  file?: any;
  url?: string;
  error?: string;
}

export const useAzureUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (file: File): Promise<UploadResult> => {
    setIsUploading(true);
    
    try {
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

      // Call edge function
      const { data, error } = await supabase.functions.invoke('azure-upload', {
        body: {
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          fileData
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Upload Successful",
        description: `${file.name} has been uploaded successfully.`,
      });

      return data;
    } catch (error) {
      console.error('Upload failed:', error);
      
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : 'Failed to upload file',
        variant: "destructive",
      });

      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
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
