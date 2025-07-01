
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { getText } = useLanguage();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: getText('signedOut'),
        description: getText('signOutSuccess'),
      });
    } catch (error) {
      toast({
        title: "Error",
        description: getText('signOutError'),
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  const getUserInitials = () => {
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>{getText('profile')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.email}</p>
            <p className="text-sm text-gray-500">
              {getText('joined')} {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {getText('signOut')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
