
import React, { useState } from 'react';
import { Upload, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';

const LoadReceipts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { getText } = useLanguage();

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <FileText className="h-16 w-16 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {getText('title')}
            </h1>
            <p className="text-xl text-gray-600">
              {getText('subtitle')}
            </p>
          </div>

          {/* Main Card */}
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl text-gray-800">
                {getText('loadReceipts')}
              </CardTitle>
              <p className="text-gray-600 mt-2">
                {getText('chooseMethod')}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Files Option */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {getText('uploadFiles')}
                </h3>
                <p className="text-gray-600 mb-4">
                  {getText('uploadDescription')}
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
                    <span>{getText('chooseFiles')}</span>
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
                  {getText('useSample')}
                </h3>
                <p className="text-gray-600 mb-4">
                  {getText('sampleDescription')}
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
                      {getText('loadingReceipts')}
                    </>
                  ) : (
                    <>
                      {getText('loadSampleData')}
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
              {getText('secureManage')}
            </p>
          </div>
        </div>
      </div>

      {/* Language Selector */}
      <div className="p-4">
        <div className="max-w-2xl mx-auto">
          <LanguageSelector />
        </div>
      </div>
    </div>
  );
};

export default LoadReceipts;
