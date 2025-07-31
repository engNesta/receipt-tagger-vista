
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, FileText, Paperclip, CheckCircle, ExternalLink } from 'lucide-react';

const SIEGenerated = () => {
  const [searchParams] = useSearchParams();
  const fileName = searchParams.get('file') || 'unknown_file';
  
  // Generate a mock SIE filename based on current date
  const currentDate = new Date();
  const sieFileName = `SIE_${currentDate.getFullYear()}_${String(currentDate.getMonth() + 1).padStart(2, '0')}.se`;

  const handleDownload = () => {
    // Simulate file download
    console.log('Downloading SIE file:', sieFileName);
    // In a real app, this would trigger an actual download
    alert(`Downloading ${sieFileName} - This is a simulation`);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', sieFileName);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SIE File Generated</h1>
              <p className="text-gray-600">Your Swedish accounting file is ready</p>
            </div>
          </div>
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>

        {/* Success Message */}
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">SIE file successfully generated!</p>
                <p className="text-sm text-green-700">
                  SIE file ready — drag and drop into Fortnox or download below
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Display */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Generated Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original Document */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Original Document</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Paperclip className="h-8 w-8 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">{fileName}</p>
                      <p className="text-sm text-gray-600">Source document</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Generated SIE File */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Generated SIE File</h3>
                <div 
                  className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50 cursor-move hover:bg-blue-100 transition-colors"
                  draggable
                  onDragStart={handleDragStart}
                  title="Drag this file to Fortnox or other accounting software"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">{sieFileName}</p>
                      <p className="text-sm text-blue-700">Swedish SIE format</p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-blue-600 flex items-center gap-1">
                    <span>⚡</span>
                    <span>Ready to drag into Fortnox</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleDownload} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download SIE File
                </Button>
                <Button variant="outline" className="flex-1">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in Fortnox
                </Button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">How to use this file:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Drag the SIE file directly into your Fortnox interface</li>
                  <li>• Or download and import through your accounting software</li>
                  <li>• The file contains properly formatted Swedish accounting entries</li>
                  <li>• All VAT calculations are included according to Swedish standards</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SIEGenerated;
