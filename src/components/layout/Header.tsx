import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import LanguageSelector from '@/components/LanguageSelector';
import UserProfile from '@/components/auth/UserProfile';
interface HeaderProps {
  showProfileModal: boolean;
  setShowProfileModal: (show: boolean) => void;
}
const Header: React.FC<HeaderProps> = ({
  showProfileModal,
  setShowProfileModal
}) => {
  const {
    getText
  } = useLanguage();
  const {
    user
  } = useAuth();
  return <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">RawDrop</h1>
              <p className="text-xs text-gray-500">{getText('secureManage')}</p>
            </div>
          </div>
          
          {/* Header Actions */}
          <div className="flex items-center space-x-3">
            <LanguageSelector />
            
            <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user?.email?.split('@')[0] || getText('profile')}</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{getText('profile')}</DialogTitle>
                </DialogHeader>
                <UserProfile />
                
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </header>;
};
export default Header;