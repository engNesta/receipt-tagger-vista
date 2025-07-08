
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearAuthError = () => setError(null);

  const handleAuthError = (error: any, context: string) => {
    logger.error(`Auth error in ${context}:`, error);
    
    // Detect network-related errors
    const isNetworkError = error?.message?.includes('Failed to fetch') ||
                          error?.message?.includes('Network request failed') ||
                          error?.message?.includes('TypeError: fetch') ||
                          error?.code === 'NETWORK_ERROR' ||
                          !navigator.onLine;
    
    const isAuthError = error?.message?.includes('refresh_token_not_found') || 
                       error?.message?.includes('invalid_grant');
    
    if (isNetworkError) {
      setError('Network connection issue. Please check your internet connection or try switching networks.');
    } else if (isAuthError) {
      localStorage.removeItem('supabase.auth.token');
      setError('Authentication session expired. Please sign in again.');
    } else {
      setError(error?.message || 'Authentication error occurred');
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        logger.info('Auth state change:', { event, hasSession: !!session });
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Clear errors on successful auth
        if (session) {
          setError(null);
        }
      }
    );

    // THEN check for existing session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          handleAuthError(error, 'getSession');
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (err) {
        handleAuthError(err, 'getSession');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) {
        handleAuthError(error, 'signOut');
      }
    } catch (err) {
      handleAuthError(err, 'signOut');
    }
  };

  const retryWithBackoff = async (operation: () => Promise<any>, maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        if (attempt === maxRetries) throw error;
        
        // Only retry on network errors
        const isRetryableError = error?.message?.includes('Failed to fetch') ||
                                error?.message?.includes('Network request failed') ||
                                !navigator.onLine;
        
        if (!isRetryableError) throw error;
        
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt - 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

  return {
    user,
    session,
    loading,
    error,
    isAuthenticated: !!user,
    signOut,
    clearAuthError,
    retryWithBackoff
  };
};
