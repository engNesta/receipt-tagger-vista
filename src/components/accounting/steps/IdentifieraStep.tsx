import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, Link2, ArrowRight, Check, X } from 'lucide-react';
import { useAccountingWizard } from '@/contexts/AccountingWizardContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import FileDropArea from '@/components/upload/FileDropArea';
import { useFileProcessor } from '@/hooks/useFileProcessor';
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
      setShowBankUploader(false);
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

  const canProceed = matchedEntries.length > 0 && unverifiedMatches.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Steg 2: Identifiera Transaktioner</h2>
          <p className="text-gray-600">Matcha kvitton med banktransaktioner</p>
        </div>
        <Button onClick={() => setShowBankUploader(true)} className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Ladda upp bankfil
        </Button>
      </div>

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
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Omatchade kvitton</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {unmatchedReceipts.map((receipt) => (
                    <div key={receipt.id} className="p-3 border rounded flex justify-between items-center">
                      <div>
                        <div className="font-medium">{receipt.ocrResult.vendor}</div>
                        <div className="text-sm text-gray-500">{receipt.ocrResult.amount} kr</div>
                      </div>
                      <Badge variant="outline">{receipt.ocrResult.date}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Omatchade transaktioner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {unmatchedTransactions.map((transaction) => (
                    <div key={transaction.id} className="p-3 border rounded">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-gray-500">{Math.abs(transaction.amount)} kr</div>
                        </div>
                        <Badge variant="outline">{transaction.date}</Badge>
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
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="unverified" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overifierade matchningar</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kvitto</TableHead>
                    <TableHead>Transaktion</TableHead>
                    <TableHead>Säkerhet</TableHead>
                    <TableHead>Åtgärder</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unverifiedMatches.map((match) => (
                    <TableRow key={match.id}>
                      <TableCell>{match.receipt.ocrResult.vendor}</TableCell>
                      <TableCell>{match.transaction.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{match.confidence}%</Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          onClick={() => verifyMatch(match.id)}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Verifiera
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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