
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/hooks/useAuth';

type FileRecord = Database['public']['Tables']['files']['Row'];

export const useFileList = () => {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  const fetchFiles = async () => {
    if (!isAuthenticated || !user) {
      setFiles([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setFiles(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (fileId: string) => {
    if (!isAuthenticated || !user) {
      throw new Error('Authentication required');
    }

    try {
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId)
        .eq('user_id', user.id); // Additional security check

      if (error) {
        throw error;
      }

      // Remove from local state
      setFiles(prev => prev.filter(file => file.id !== fileId));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete file');
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [isAuthenticated, user?.id]);

  return {
    files,
    loading,
    error,
    refetch: fetchFiles,
    deleteFile
  };
};
