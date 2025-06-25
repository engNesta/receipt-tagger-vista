
import React, { useState } from 'react';
import { Upload, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const LoadReceipts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoadReceipts = async () => {
    setIsLoading(true);
    
    // Simulate loading receipts
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    navigate('/receipts');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log('Files selected:', files.length);
      // Here you would typically process the uploaded files
      handleLoadReceipts();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FileText className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Receipt Management System
          </h1>
          <p className="text-xl text-gray-600">
            Upload and organize your receipts and invoices efficiently
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl text-gray-800">
              Load Your Receipts
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Choose how you'd like to load your receipts into the system
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload Files Option */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload Receipt Files
              </h3>
              <p className="text-gray-600 mb-4">
                Select images or PDF files of your receipts to upload
              </p>
              <input
                type="file"
                multiple
                accept="image/*,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button asChild className="cursor-pointer">
                  <span>Choose Files</span>
                </Button>
              </label>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Use Sample Data Option */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Use Sample Data
              </h3>
              <p className="text-gray-600 mb-4">
                Start with pre-loaded sample receipts to explore the system
              </p>
              <Button 
                onClick={handleLoadReceipts}
                disabled={isLoading}
                className="flex items-center gap-2 mx-auto"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading Receipts...
                  </>
                ) : (
                  <>
                    Load Sample Data
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">
            Securely manage and organize all your business receipts in one place
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadReceipts;
