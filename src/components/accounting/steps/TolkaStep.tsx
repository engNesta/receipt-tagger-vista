import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Eye, Trash2, ArrowRight, Download } from 'lucide-react';
import { useAccountingWizard } from '@/contexts/AccountingWizardContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import FileDropArea from '@/components/upload/FileDropArea';
import { useFileProcessor } from '@/hooks/useFileProcessor';
import UnreadableReceiptsModal from '../modals/UnreadableReceiptsModal';
import type { Receipt } from '@/types/accounting';
import { formatCurrency, formatConfidence } from '@/utils/numberFormatters';

const TolkaStep: React.FC = () => {
  const { session, removeReceipt, updateReceipt, setCurrentStep, addReceipts } = useAccountingWizard();
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [showUnreadableModal, setShowUnreadableModal] = useState(false);

  const { 
    pendingFiles, 
    isProcessing, 
    addFiles, 
    processAllFiles, 
    removeFile 
  } = useFileProcessor({
    onUploadComplete: () => {
      // Convert processed files to receipts (simplified)
      const newReceipts: Receipt[] = pendingFiles.map((file, index) => ({
        id: `receipt-${Date.now()}-${index}`,
        filename: file.name,
        uploadedAt: new Date(),
        imageUrl: '/placeholder.svg',
        ocrResult: {
          vendor: 'Processed Receipt',
          amount: Math.random() * 1000,
          date: new Date().toISOString().split('T')[0],
          items: ['Item 1', 'Item 2'],
          confidence: Math.floor(Math.random() * 20) + 80
        },
        status: 'readable' as const
      }));
      addReceipts(newReceipts);
      setShowUploader(false);
    }
  });

  if (!session) return null;

  const readableReceipts = session.receipts.filter(r => r.status === 'readable' || r.status === 'verified');
  const unreadableReceipts = session.receipts.filter(r => r.status === 'unreadable');

  const handleFileUpload = (files: File[]) => {
    addFiles(files);
  };

  const canProceed = session.receipts.some(r => r.status === 'readable' || r.status === 'verified');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Steg 1: Tolka Kvitton</h2>
          <p className="text-gray-600">Granska OCR-resultat och ladda upp fler kvitton vid behov</p>
        </div>
        <div className="flex gap-2">
          {unreadableReceipts.length > 0 && (
            <Button 
              variant="outline" 
              onClick={() => setShowUnreadableModal(true)}
            >
              <Download className="w-4 h-4 mr-2" />
              Oläsbara kvitton ({unreadableReceipts.length})
            </Button>
          )}
          <Button onClick={() => setShowUploader(true)} className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Ladda upp kvitton
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {readableReceipts.map((receipt) => (
          <Card key={receipt.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img 
                  src={receipt.imageUrl} 
                  alt={receipt.filename}
                  className="w-16 h-16 object-cover rounded border"
                />
                <div>
                  <h3 className="font-semibold">{receipt.filename}</h3>
                  <p className="text-sm text-gray-600">
                    {receipt.ocrResult.vendor} - {formatCurrency(receipt.ocrResult.amount)}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={receipt.status === 'readable' ? 'default' : 
                                  receipt.status === 'verified' ? 'default' : 'destructive'}>
                      {receipt.status === 'readable' && 'Läsbar'}
                      {receipt.status === 'verified' && 'Verifierad'}
                      {receipt.status === 'unreadable' && 'Oläsbar'}
                    </Badge>
                    <Badge variant="outline">
                      {formatConfidence(receipt.ocrResult.confidence)} säkerhet
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Visa OCR
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>OCR Resultat - {receipt.filename}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="font-semibold">Leverantör:</label>
                          <p>{receipt.ocrResult.vendor}</p>
                        </div>
                        <div>
                          <label className="font-semibold">Belopp:</label>
                          <p>{formatCurrency(receipt.ocrResult.amount)}</p>
                        </div>
                        <div>
                          <label className="font-semibold">Datum:</label>
                          <p>{receipt.ocrResult.date}</p>
                        </div>
                        <div>
                          <label className="font-semibold">Säkerhet:</label>
                          <p>{formatConfidence(receipt.ocrResult.confidence)}</p>
                        </div>
                      </div>
                      <div>
                        <label className="font-semibold">Artiklar:</label>
                        <ul className="list-disc list-inside mt-1">
                          {receipt.ocrResult.items.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>


                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => removeReceipt(receipt.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={() => setCurrentStep('identifiera')}
          disabled={!canProceed}
          className="flex items-center gap-2"
        >
          Nästa: Identifiera transaktioner
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Upload Modal */}
      <Dialog open={showUploader} onOpenChange={setShowUploader}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ladda upp kvitton</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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

      <UnreadableReceiptsModal
        isOpen={showUnreadableModal}
        onClose={() => setShowUnreadableModal(false)}
        unreadableReceipts={unreadableReceipts}
      />
    </div>
  );
};

export default TolkaStep;