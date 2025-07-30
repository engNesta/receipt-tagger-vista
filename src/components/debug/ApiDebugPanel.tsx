
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { fastApiService } from '@/services/fastApiService';
import { Trans } from '@/components/Trans';

const ApiDebugPanel: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<'unknown' | 'checking' | 'ok' | 'error'>('unknown');
  const [apiMessage, setApiMessage] = useState<string>('');
  const [documentsStatus, setDocumentsStatus] = useState<string>('Not checked');

  const dummyUserId = 'dummy-user-id'; // Use dummy user ID since auth is removed

  const checkApiHealth = async () => {
    setApiStatus('checking');
    try {
      const result = await fastApiService.healthCheck();
      setApiStatus(result.status === 'ok' ? 'ok' : 'error');
      setApiMessage(result.message || 'API is accessible');
    } catch (error) {
      setApiStatus('error');
      setApiMessage(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const checkDocuments = async () => {
    try {
      const result = await fastApiService.getDocuments(dummyUserId);
      setDocumentsStatus(`${result.status}: ${result.documents?.length || 0} documents found`);
    } catch (error) {
      setDocumentsStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'checking':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'ok':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mb-6">
      <CardHeader>
        <CardTitle className="text-sm">
          <Trans text="API Debug Panel" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">
            <Trans text="FastAPI Status" />:
          </span>
          <div className="flex items-center gap-2">
            {getStatusIcon(apiStatus)}
            <Badge variant={apiStatus === 'ok' ? 'default' : apiStatus === 'error' ? 'destructive' : 'secondary'}>
              {apiStatus}
            </Badge>
          </div>
        </div>
        
        {apiMessage && (
          <p className="text-xs text-gray-600">{apiMessage}</p>
        )}
        
        <div className="flex gap-2">
          <Button size="sm" onClick={checkApiHealth} disabled={apiStatus === 'checking'}>
            <Trans text="Test API" />
          </Button>
          <Button size="sm" variant="outline" onClick={checkDocuments}>
            <Trans text="Check Docs" />
          </Button>
        </div>
        
        <div className="text-xs">
          <p><strong><Trans text="User" />:</strong> {dummyUserId.substring(0, 8)}...</p>
          <p><strong><Trans text="Documents" />:</strong> {documentsStatus}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiDebugPanel;
