
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Settings } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';
import { Trans } from '@/components/Trans';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">RawDrop</h1>
              <p className="text-xs text-gray-500">
                <Trans text="Securely manage and organize all your business receipts in one place - ready for Fortnox, Visma and Bokio" />
              </p>
            </div>
          </div>
          
          {/* Header Actions */}
          <div className="flex items-center space-x-3">
            <LanguageSelector />
            
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">
                <Trans text="Settings" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
