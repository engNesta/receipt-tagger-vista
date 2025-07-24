
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type FileRecord = Database['public']['Tables']['files']['Row'];

export const useFileList = () => {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      // For now, return empty array since we don't have authentication
      setFiles([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      // For now, just remove from local state
      setFiles(prev => prev.filter(file => file.id !== fileId));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete file');
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return {
    files,
    loading,
    error,
    refetch: fetchFiles,
    deleteFile
  };
};
