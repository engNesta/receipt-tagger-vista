
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Users, BarChart3 } from 'lucide-react';
import { APP_CONFIG } from '@/constants';
import { Trans } from '@/components/Trans';
import LanguageSelector from '@/components/LanguageSelector';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
      {/* Language Selector in top right */}
      <div className="absolute top-6 right-6">
        <LanguageSelector />
      </div>
      
      <div className="max-w-3xl mx-auto text-center px-4">
        <div className="mb-8">
          <div className="bg-blue-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <FileText className="h-12 w-12 text-blue-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <Trans text="Accountant Portal" />
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            <Trans text="Manage your clients and process receipts with AI-powered Swedish accounting integration" />
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link to={APP_CONFIG.ROUTES.CLIENTS}>
            <Button size="lg" className="w-full flex items-center justify-center gap-3 px-8 py-4 text-base font-medium bg-blue-600 hover:bg-blue-700">
              <Users size={20} />
              <Trans text="Client Management" />
            </Button>
          </Link>
          
          <Link to={APP_CONFIG.ROUTES.MATCHING_REPORT}>
            <Button size="lg" variant="outline" className="w-full flex items-center justify-center gap-3 px-8 py-4 text-base font-medium">
              <BarChart3 size={20} />
              <Trans text="Matching Report" />
            </Button>
          </Link>
        </div>
        
        <p className="text-sm text-gray-500 mt-6">
          <Trans text="Complete client lifecycle management • Document processing • Swedish accounting integration" />
        </p>
      </div>
    </div>
  );
};

export default Index;
