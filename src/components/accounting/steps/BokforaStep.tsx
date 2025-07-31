import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, Download, FileText, Send, ArrowLeft } from 'lucide-react';
import { useAccountingWizard } from '@/contexts/AccountingWizardContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const BokforaStep: React.FC = () => {
  const { 
    session, 
    setCurrentStep,
    getMatchedEntries,
    getUnmatchedReceipts,
    getUnmatchedTransactions
  } = useAccountingWizard();
  
  const [isExporting, setIsExporting] = useState(false);
  const [showUnmatchedReport, setShowUnmatchedReport] = useState(false);
  const { toast } = useToast();

  if (!session) return null;

  const verifiedEntries = getMatchedEntries().filter(m => m.verified);
  const unmatchedReceipts = getUnmatchedReceipts();
  const unmatchedTransactions = getUnmatchedTransactions();

  const handleSendToFortnox = async () => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsExporting(false);
    toast({
      title: "Export slutförd",
      description: `${verifiedEntries.length} transaktioner skickade till Fortnox`,
    });
  };

  const handleDownloadUnmatchedReport = () => {
    // Simulate PDF generation
    toast({
      title: "PDF genererad",
      description: "Rapport över omatchade poster har genererats",
    });
  };

  const totalAmount = verifiedEntries.reduce((sum, entry) => sum + Math.abs(entry.transaction.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Steg 3: Bokföra</h2>
          <p className="text-gray-600">Granska och slutför bokföringen</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{verifiedEntries.length}</div>
            <div className="text-sm text-gray-600">Verifierade poster</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{totalAmount.toFixed(2)} kr</div>
            <div className="text-sm text-gray-600">Total belopp</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{unmatchedReceipts.length}</div>
            <div className="text-sm text-gray-600">Omatchade kvitton</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{unmatchedTransactions.length}</div>
            <div className="text-sm text-gray-600">Omatchade transaktioner</div>
          </CardContent>
        </Card>
      </div>

      {/* Verified Entries Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Verifierade poster för export
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Leverantör</TableHead>
                <TableHead>Beskrivning</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Belopp</TableHead>
                <TableHead>Konto</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {verifiedEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <div className="font-medium">{entry.receipt.ocrResult.vendor}</div>
                  </TableCell>
                  <TableCell>{entry.transaction.description}</TableCell>
                  <TableCell>{entry.transaction.date}</TableCell>
                  <TableCell>{Math.abs(entry.transaction.amount)} kr</TableCell>
                  <TableCell>6420 - Representation</TableCell>
                  <TableCell>
                    <Badge variant="default">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verifierad
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Button 
          variant="outline"
          onClick={() => setCurrentStep('identifiera')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Tillbaka: Identifiera
        </Button>

        <div className="flex gap-4">
          {(unmatchedReceipts.length > 0 || unmatchedTransactions.length > 0) && (
            <Dialog open={showUnmatchedReport} onOpenChange={setShowUnmatchedReport}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Visa omatchade poster
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Omatchade poster</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {unmatchedReceipts.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Omatchade kvitton ({unmatchedReceipts.length})</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Leverantör</TableHead>
                            <TableHead>Belopp</TableHead>
                            <TableHead>Datum</TableHead>
                            <TableHead>Fil</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {unmatchedReceipts.map((receipt) => (
                            <TableRow key={receipt.id}>
                              <TableCell>{receipt.ocrResult.vendor}</TableCell>
                              <TableCell>{receipt.ocrResult.amount} kr</TableCell>
                              <TableCell>{receipt.ocrResult.date}</TableCell>
                              <TableCell>{receipt.filename}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {unmatchedTransactions.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Omatchade transaktioner ({unmatchedTransactions.length})</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Beskrivning</TableHead>
                            <TableHead>Belopp</TableHead>
                            <TableHead>Datum</TableHead>
                            <TableHead>Referens</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {unmatchedTransactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell>{transaction.description}</TableCell>
                              <TableCell>{Math.abs(transaction.amount)} kr</TableCell>
                              <TableCell>{transaction.date}</TableCell>
                              <TableCell>{transaction.reference}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button onClick={handleDownloadUnmatchedReport} className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Ladda ner PDF-rapport
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          <Button 
            onClick={handleSendToFortnox}
            disabled={isExporting || verifiedEntries.length === 0}
            className="flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {isExporting ? 'Skickar till Fortnox...' : 'Skicka till Fortnox'}
          </Button>
        </div>
      </div>

      {verifiedEntries.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Inga verifierade poster</h3>
              <p>Gå tillbaka till föregående steg för att verifiera matchningar innan du fortsätter.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BokforaStep;