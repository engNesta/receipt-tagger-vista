
import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import UploadSection from '@/components/UploadSection';

const LoadReceipts = () => {
  const navigate = useNavigate();
  const { getText } = useLanguage();

  const handleReceiptsLoaded = () => {
    navigate('/receipts');
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
            <CardContent>
              <UploadSection
                onUploadComplete={handleReceiptsLoaded}
                onLoadSample={handleReceiptsLoaded}
                showSampleOption={true}
                isCompact={false}
              />
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
