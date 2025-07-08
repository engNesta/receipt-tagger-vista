
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

interface LoginFormProps {
  onSuccess?: () => void;
  switchToSignup?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, switchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { getText } = useLanguage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Handle specific auth errors
        if (error.message.includes('Invalid login credentials')) {
          setError(getText('invalidCredentials') || 'Invalid email or password');
        } else if (error.message.includes('Failed to fetch')) {
          setError('Network error. Please check your connection and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link.');
        } else {
          setError(error.message);
        }
        return;
      }

      toast({
        title: getText('welcomeBack'),
        description: getText('loginSuccess'),
      });

      onSuccess?.();
    } catch (err: any) {
      console.error('Login error:', err);
      
      if (err?.message?.includes('Failed to fetch')) {
        setError('Unable to connect to authentication service. Please try again.');
      } else {
        setError(getText('unexpectedError') || 'An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
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
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {getText('signingIn')}
              </>
            ) : (
              getText('signIn')
            )}
          </Button>
          
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
