import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Upload, FileText } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center px-4">
        <div className="mb-8">
          <div className="bg-blue-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <FileText className="h-12 w-12 text-blue-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Receipt Processing System
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Upload and process your receipts with AI-powered Swedish accounting integration
          </p>
        </div>

        <div className="space-y-4">
          <Link to="/rawdrop">
            <Button size="lg" className="w-full sm:w-auto min-w-[200px] flex items-center justify-center gap-3 px-8 py-4 text-base font-medium">
              <Upload size={20} />
              Start Processing Receipts
            </Button>
          </Link>
          
          <p className="text-sm text-gray-500">
            Supports JPG, PNG, PDF formats • Optimized for Swedish receipts
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;