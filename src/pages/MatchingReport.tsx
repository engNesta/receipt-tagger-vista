
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockMatchingRecords } from '@/data/mockData';
import LanguageSelector from '@/components/LanguageSelector';

const MatchingReport = () => {
  const navigate = useNavigate();

  const handleGenerateSIE = (fileName: string) => {
    navigate(`/sie-generated?file=${fileName}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Language Selector in top right */}
      <div className="absolute top-6 right-6">
        <LanguageSelector />
      </div>
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Matching Report</h1>
              <p className="text-gray-600 mt-1">Review document and bank statement matches</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Document Matching Results</span>
              <Badge variant="secondary">
                {mockMatchingRecords.filter(r => r.matched).length} / {mockMatchingRecords.length} Matched
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Document</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Bank Statement</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mockMatchingRecords.map((record, index) => (
                    <tr 
                      key={record.id} 
                      className={`border-b border-gray-100 hover:bg-gray-50 ${
                        record.matched ? 'bg-green-50/30' : 'bg-red-50/30'
                      }`}
                    >
                      <td className="py-4 px-4">
                        {record.matched ? (
                          <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">Matched</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 text-red-600">
                            <XCircle className="w-5 h-5" />
                            <span className="font-medium">No Match</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">{record.record}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{record.statement}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium">{record.amount}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600">{record.date}</span>
                      </td>
                      <td className="py-4 px-4">
                        <Button
                          onClick={() => handleGenerateSIE(record.record)}
                          disabled={!record.matched}
                          size="sm"
                          className={record.matched ? 'bg-blue-600 hover:bg-blue-700' : ''}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Generate SIE
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> SIE files can only be generated for matched documents. 
            Unmatched documents need manual review or additional bank statement data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MatchingReport;
