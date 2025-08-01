import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, FileText } from 'lucide-react';
import { toast } from 'sonner';
import type { Receipt } from '@/types/accounting';
import { formatConfidence } from '@/utils/numberFormatters';

interface UnreadableReceiptsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unreadableReceipts: Receipt[];
}

const UnreadableReceiptsModal: React.FC<UnreadableReceiptsModalProps> = ({
  isOpen,
  onClose,
  unreadableReceipts
}) => {
  const handleDownload = () => {
    toast.success(`Laddar ner ${unreadableReceipts.length} oläsbara kvitton som PDF...`);
    // Simulate PDF download
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Oläsbara kvitton ({unreadableReceipts.length})
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Dessa kvitton kunde inte läsas automatiskt och behöver hanteras manuellt:
          </p>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {unreadableReceipts.map((receipt) => (
              <Card key={receipt.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <img 
                        src={receipt.imageUrl} 
                        alt={receipt.filename}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{receipt.filename}</h4>
                      <p className="text-sm text-gray-600">
                        Uppladdad: {receipt.uploadedAt.toLocaleDateString('sv-SE')}
                      </p>
                      <p className="text-xs text-red-600">
                        OCR-konfidens: {formatConfidence(receipt.ocrResult.confidence)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {unreadableReceipts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p>Inga oläsbara kvitton hittades</p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Stäng
            </Button>
            {unreadableReceipts.length > 0 && (
              <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Ladda ner som PDF
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnreadableReceiptsModal;