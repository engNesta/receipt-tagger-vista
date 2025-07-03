import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Database, CheckCircle, XCircle } from 'lucide-react';

interface MongoDBTestResult {
  success: boolean;
  message?: string;
  collections?: string[];
  sampleData?: Record<string, any[]>;
  totalCollections?: number;
  error?: string;
  details?: string;
}

const MongoDBTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MongoDBTestResult | null>(null);

  const testMongoDB = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('Calling MongoDB test function...');
      
      const { data, error } = await supabase.functions.invoke('mongodb-test', {
        body: {}
      });
      
      if (error) {
        throw error;
      }
      
      console.log('MongoDB test result:', data);
      setResult(data);
      
    } catch (error) {
      console.error('Error testing MongoDB:', error);
      setResult({
        success: false,
        error: error.message || 'Failed to test MongoDB connection'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            MongoDB Connection Test
          </CardTitle>
          <CardDescription>
            Test the connection to your MongoDB database and view available collections
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={testMongoDB} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Connection...
              </>
            ) : (
              'Test MongoDB Connection'
            )}
          </Button>

          {result && (
            <div className="space-y-4">
              <Alert variant={result.success ? 'default' : 'destructive'}>
                <div className="flex items-center gap-2">
                  {result.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription>
                    {result.success ? result.message : result.error}
                  </AlertDescription>
                </div>
              </Alert>

              {result.success && result.collections && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Database Collections ({result.totalCollections})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {result.collections.map((collection, index) => (
                        <div 
                          key={index}
                          className="p-2 bg-gray-100 rounded text-sm font-mono"
                        >
                          {collection}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {result.success && result.sampleData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sample Data</CardTitle>
                    <CardDescription>
                      First 3 documents from each collection (max 5 collections shown)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(result.sampleData).map(([collectionName, data]) => (
                        <div key={collectionName} className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-2 text-blue-600">
                            {collectionName} ({Array.isArray(data) ? data.length : 0} documents)
                          </h4>
                          <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto max-h-40 overflow-y-auto">
                            {JSON.stringify(data, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {!result.success && result.details && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-red-600">Error Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-red-50 p-3 rounded text-xs overflow-x-auto text-red-800">
                      {result.details}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MongoDBTest;