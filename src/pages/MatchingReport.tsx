
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, ArrowLeft, FileText } from 'lucide-react';

// Dummy data for matching report
const matchingData = [
  { record: "invoice_rent.pdf", statement: "bank_statement_july.xlsx", matched: true },
  { record: "taxi.jpg", statement: "statement_march.xlsx", matched: false },
  { record: "freelance_invoice.png", statement: "bank_statement_july.xlsx", matched: true },
  { record: "meal.png", statement: "bank_statement_july.xlsx", matched: false }
];

const MatchingReport = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
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
              <h1 className="text-3xl font-bold text-gray-900">Matching Report</h1>
              <p className="text-gray-600">Review matched documents and bank statements</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        {/* Matching Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Document Matching Results</span>
              <Badge variant="secondary">
                {matchingData.filter(item => item.matched).length} of {matchingData.length} matched
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Bank Statement</TableHead>
                  <TableHead>Match Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matchingData.map((item, index) => (
                  <TableRow 
                    key={index}
                    className={item.matched ? 'bg-green-50 hover:bg-green-100' : 'bg-red-50 hover:bg-red-100'}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        {item.record}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        {item.statement}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {item.matched ? (
                          <>
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Matched
                            </Badge>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-5 w-5 text-red-600" />
                            <Badge variant="secondary" className="bg-red-100 text-red-800">
                              No Match
                            </Badge>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/sie-generated?file=${encodeURIComponent(item.record)}`}>
                        <Button 
                          size="sm" 
                          disabled={!item.matched}
                          className={item.matched ? 'bg-blue-600 hover:bg-blue-700' : ''}
                        >
                          Generate SIE
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {matchingData.filter(item => item.matched).length}
              </div>
              <p className="text-sm text-gray-600">Matched Documents</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">
                {matchingData.filter(item => !item.matched).length}
              </div>
              <p className="text-sm text-gray-600">Unmatched Documents</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((matchingData.filter(item => item.matched).length / matchingData.length) * 100)}%
              </div>
              <p className="text-sm text-gray-600">Match Rate</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MatchingReport;
