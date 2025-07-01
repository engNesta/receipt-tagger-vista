
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Shield } from 'lucide-react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback }) => {
  const { user, loading } = useAuth();
  const [showSignup, setShowSignup] = React.useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-3">Loading...</span>
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
          {!showSignup ? (
            <LoginForm
              switchToSignup={() => setShowSignup(true)}
            />
          ) : (
            <SignupForm
              switchToLogin={() => setShowSignup(false)}
            />
          )}
          
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center text-sm text-gray-500 mb-2">
              <Shield className="h-4 w-4 mr-2" />
              Secure file upload and management
            </div>
            <p className="text-xs text-gray-400">
              Your files are securely stored and only accessible by you
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
