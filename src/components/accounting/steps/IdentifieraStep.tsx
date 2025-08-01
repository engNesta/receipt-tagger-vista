import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, Link2, ArrowRight, Check, X, CheckCircle, Search, Download, FileText, CreditCard } from 'lucide-react';
import { useAccountingWizard } from '@/contexts/AccountingWizardContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import FileDropArea from '@/components/upload/FileDropArea';
import { useFileProcessor } from '@/hooks/useFileProcessor';
import { toast } from 'sonner';
import UnverifiedTab from './UnverifiedTab';
import type { BankTransaction } from '@/types/accounting';

const IdentifieraStep: React.FC = () => {
  const { 
    session, 
    addTransactions, 
    createMatch, 
    removeMatch, 
    verifyMatch,
    setCurrentStep,
    getUnmatchedReceipts,
    getUnmatchedTransactions,
    getMatchedEntries,
    getUnverifiedMatches
  } = useAccountingWizard();
  
  const [showBankUploader, setShowBankUploader] = useState(false);
  const [bankFileUploaded, setBankFileUploaded] = useState(false);
  const [showTabs, setShowTabs] = useState(false);

  const { 
    pendingFiles, 
    isProcessing, 
    addFiles, 
    processAllFiles, 
    removeFile 
  } = useFileProcessor({
    onUploadComplete: () => {
      // Convert uploaded bank files to transactions (simplified)
      const newTransactions: BankTransaction[] = pendingFiles.map((file, index) => ({
        id: `trans-${Date.now()}-${index}`,
        date: new Date().toISOString().split('T')[0],
        amount: -(Math.random() * 1000),
        description: `IMPORTED FROM ${file.name.toUpperCase()}`,
        reference: `REF${Date.now()}${index}`,
        account: '1234567890'
      }));
      addTransactions(newTransactions);
      setBankFileUploaded(true);
      setShowBankUploader(false);
      toast.success(`${newTransactions.length} transaktioner laddades`);
    }
  });

  if (!session) return null;

  const unmatchedReceipts = getUnmatchedReceipts();
  const unmatchedTransactions = getUnmatchedTransactions();
  const matchedEntries = getMatchedEntries();
  const unverifiedMatches = getUnverifiedMatches();

  const handleFileUpload = (files: File[]) => {
    addFiles(files);
  };

  const handleCreateMatch = (receiptId: string, transactionId: string) => {
    createMatch(receiptId, transactionId, 85); // Default confidence
  };

  const handleStartMatching = () => {
    // Simulate automatic matching
    const receipts = session?.receipts || [];
    const transactions = session?.transactions || [];
    
    receipts.forEach((receipt, index) => {
      if (index < transactions.length) {
        const transaction = transactions[index];
        const confidence = Math.random() * 0.5 + 0.5; // 50-100% confidence
        createMatch(receipt.id, transaction.id, confidence * 100);
      }
    });
    
    setShowTabs(true);
    toast.success('Automatisk matchning slutförd');
  };

  const canProceed = matchedEntries.length > 0 && unverifiedMatches.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Steg 2: Identifiera Transaktioner</h2>
          <p className="text-gray-600">Matcha kvitton med banktransaktioner</p>
        </div>
        {!bankFileUploaded && (
          <Button onClick={() => setShowBankUploader(true)} className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Ladda upp bankfil
          </Button>
        )}
      </div>

      {!bankFileUploaded && (
        <Card>
          <CardContent className="p-8 text-center">
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Ladda upp bankutdrag först
            </h3>
            <p className="text-gray-600 mb-4">
              Du måste ladda upp ett bankutdrag innan du kan matcha transaktioner
            </p>
            <Button onClick={() => setShowBankUploader(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Ladda upp bankfil
            </Button>
          </CardContent>
        </Card>
      )}

      {bankFileUploaded && !showTabs && (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Bankfil laddad
            </h3>
            <p className="text-gray-600 mb-4">
              Starta automatisk matchning mellan kvitton och transaktioner
            </p>
            <Button onClick={handleStartMatching} className="bg-blue-600 hover:bg-blue-700">
              <Search className="w-4 h-4 mr-2" />
              Starta Matchning
            </Button>
          </CardContent>
        </Card>
      )}

      {showTabs && (
        <Tabs defaultValue="matched" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="matched">
            Matchade ({matchedEntries.length})
          </TabsTrigger>
          <TabsTrigger value="unmatched">
            Omatchade ({unmatchedReceipts.length + unmatchedTransactions.length})
          </TabsTrigger>
          <TabsTrigger value="unverified">
            Overifierade ({unverifiedMatches.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matched" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Matchade transaktioner</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kvitto</TableHead>
                    <TableHead>Transaktion</TableHead>
                    <TableHead>Belopp</TableHead>
                    <TableHead>Säkerhet</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Åtgärder</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matchedEntries.map((match) => (
                    <TableRow key={match.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{match.receipt.ocrResult.vendor}</div>
                          <div className="text-sm text-gray-500">{match.receipt.filename}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{match.transaction.description}</div>
                          <div className="text-sm text-gray-500">{match.transaction.date}</div>
                        </div>
                      </TableCell>
                      <TableCell>{Math.abs(match.transaction.amount)} kr</TableCell>
                      <TableCell>
                        <Badge variant="outline">{match.confidence}%</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={match.verified ? 'default' : 'secondary'}>
                          {match.verified ? 'Verifierad' : 'Inte verifierad'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {!match.verified && (
                            <Button 
                              size="sm" 
                              onClick={() => verifyMatch(match.id)}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Verifiera
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeMatch(match.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unmatched" className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button 
              onClick={() => {
                toast.success('Laddar ner omatchade kvitton...');
                // Simulate PDF download
              }}
              variant="outline"
              disabled={unmatchedReceipts.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Ladda ner kvitton ({unmatchedReceipts.length})
            </Button>
            <Button 
              onClick={() => {
                toast.success('Laddar ner omatchade transaktioner...');
                // Simulate PDF download
              }}
              variant="outline"
              disabled={unmatchedTransactions.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Ladda ner transaktioner ({unmatchedTransactions.length})
            </Button>
            <Button 
              onClick={() => {
                toast.success('Laddar ner komplett rapport...');
                // Simulate PDF download
              }}
              variant="outline"
              disabled={unmatchedReceipts.length === 0 && unmatchedTransactions.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Ladda ner båda
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Omatchade kvitton ({unmatchedReceipts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {unmatchedReceipts.map((receipt) => (
                    <div key={receipt.id} className="p-3 border rounded flex justify-between items-center">
                      <div>
                        <div className="font-medium">{receipt.ocrResult.vendor}</div>
                        <div className="text-sm text-gray-500">
                          {receipt.ocrResult.date} - {receipt.ocrResult.amount} kr
                        </div>
                      </div>
                      <Badge variant="outline">Omatchad</Badge>
                    </div>
                  ))}
                  {unmatchedReceipts.length === 0 && (
                    <p className="text-gray-500 text-center py-4">Inga omatchade kvitton</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Omatchade transaktioner ({unmatchedTransactions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {unmatchedTransactions.map((transaction) => (
                    <div key={transaction.id} className="p-3 border rounded">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-gray-500">
                            {transaction.date} - {Math.abs(transaction.amount)} kr
                          </div>
                        </div>
                        <Badge variant="outline">Omatchad</Badge>
                      </div>
                      <div className="mt-2">
                        <select 
                          className="w-full p-1 border rounded text-sm"
                          onChange={(e) => {
                            if (e.target.value) {
                              handleCreateMatch(e.target.value, transaction.id);
                            }
                          }}
                          defaultValue=""
                        >
                          <option value="">Välj kvitto att matcha...</option>
                          {unmatchedReceipts.map((receipt) => (
                            <option key={receipt.id} value={receipt.id}>
                              {receipt.ocrResult.vendor} - {receipt.ocrResult.amount} kr
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                  {unmatchedTransactions.length === 0 && (
                    <p className="text-gray-500 text-center py-4">Inga omatchade transaktioner</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="unverified" className="space-y-4">
          <UnverifiedTab
            unverifiedMatches={unverifiedMatches}
            onVerifyMatch={(matchId, accountCode, description, vatRate) => {
              verifyMatch(matchId);
              toast.success('Match verifierad!');
            }}
            onRemoveMatch={(matchId) => {
              removeMatch(matchId);
              toast.success('Match borttagen');
            }}
          />
        </TabsContent>
        </Tabs>
      )}

      <div className="flex justify-between">
        <Button 
          variant="outline"
          onClick={() => setCurrentStep('tolka')}
        >
          Tillbaka: Tolka kvitton
        </Button>
        <Button 
          onClick={() => setCurrentStep('bokfora')}
          disabled={!canProceed}
          className="flex items-center gap-2"
        >
          Nästa: Bokföra
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Bank Upload Modal */}
      <Dialog open={showBankUploader} onOpenChange={setShowBankUploader}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ladda upp bankfil</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Stöder CSV, PDF och bildformat av kontoutdrag
            </p>
            <FileDropArea
              isDragOver={false}
              isProcessing={isProcessing}
              stats={{ totalProcessed: 0, successCount: 0, lastProcessed: null }}
              onDrop={(e) => {
                e.preventDefault();
                const files = Array.from(e.dataTransfer.files);
                handleFileUpload(files);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDragLeave={(e) => e.preventDefault()}
              onFileInputChange={(e) => {
                const files = Array.from(e.target.files || []);
                handleFileUpload(files);
              }}
            />
            
            {pendingFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">Filer att bearbeta ({pendingFiles.length})</h4>
                {pendingFiles.map((file, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">{file.name}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      Ta bort
                    </Button>
                  </div>
                ))}
                <Button 
                  onClick={processAllFiles}
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? 'Bearbetar...' : 'Bearbeta filer'}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IdentifieraStep;