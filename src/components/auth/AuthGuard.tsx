
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback }) => {
  const { user, loading, error, clearAuthError } = useAuth();
  const { getText } = useLanguage();
  const [showSignup, setShowSignup] = React.useState(false);

  // Clear auth errors when switching between login/signup
  const handleSwitchToSignup = () => {
    clearAuthError();
    setShowSignup(true);
  };

  const handleSwitchToLogin = () => {
    clearAuthError();
    setShowSignup(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-3">{getText('loading')}</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                {error}
                <Button 
                  variant="link" 
                  className="p-0 h-auto ml-2 text-destructive" 
                  onClick={clearAuthError}
                >
                  Dismiss
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          {!showSignup ? (
            <LoginForm
              switchToSignup={handleSwitchToSignup}
            />
          ) : (
            <SignupForm
              switchToLogin={handleSwitchToLogin}
            />
          )}
          
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center text-sm text-gray-500 mb-2">
              <Shield className="h-4 w-4 mr-2" />
              {getText('secureFileUpload')}
            </div>
            <p className="text-xs text-gray-400">
              {getText('filesSecurelyStored')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
