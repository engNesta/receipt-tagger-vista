
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';

interface LoginFormProps {
  onSuccess?: () => void;
  switchToSignup?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, switchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();
  const { getText } = useLanguage();
  const { retryWithBackoff } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await retryWithBackoff(async () => {
        return await supabase.auth.signInWithPassword({
          email,
          password
        });
      });

      if (error) {
        // Handle specific auth errors
        if (error.message.includes('Invalid login credentials')) {
          setError(getText('invalidCredentials') || 'Invalid email or password');
        } else if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
          setError('Network connection issue. Please check your internet connection or try switching networks.');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link.');
        } else {
          setError(error.message);
        }
        return;
      }

      setRetryCount(0);
      toast({
        title: getText('welcomeBack'),
        description: getText('loginSuccess'),
      });

      onSuccess?.();
    } catch (err: any) {
      console.error('Login error:', err);
      
      if (err?.message?.includes('Failed to fetch') || err?.message?.includes('Network') || !navigator.onLine) {
        setRetryCount(prev => prev + 1);
        setError(`Network connection issue. Please check your internet connection or try switching networks. ${retryCount > 0 ? `(Attempt ${retryCount + 1})` : ''}`);
      } else {
        setError(getText('unexpectedError') || 'An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const checkNetworkStatus = () => {
    if (!navigator.onLine) {
      setError('You are currently offline. Please check your internet connection.');
      return false;
    }
    return true;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{getText('signIn')}</CardTitle>
        <CardDescription>
          {getText('signInDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">{getText('email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">{getText('password')}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading} onClick={(e) => {
            if (!checkNetworkStatus()) {
              e.preventDefault();
              return;
            }
          }}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {retryCount > 0 ? `Retrying... (${retryCount + 1})` : getText('signingIn')}
              </>
            ) : (
              getText('signIn')
            )}
          </Button>
          
          {!navigator.onLine && (
            <div className="text-center text-sm text-orange-600">
              ⚠️ You appear to be offline
            </div>
          )}
          
          {switchToSignup && (
            <div className="text-center text-sm">
              {getText('dontHaveAccount')}{' '}
              <button
                type="button"
                onClick={switchToSignup}
                className="text-blue-600 hover:underline"
              >
                {getText('signUp')}
              </button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
