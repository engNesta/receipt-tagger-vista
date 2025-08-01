import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import type { MatchedEntry } from '@/types/accounting';
import { formatCurrency } from '@/utils/numberFormatters';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: MatchedEntry | null;
  onVerify: (matchId: string, accountCode: string, description: string, vatRate: number) => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  match,
  onVerify
}) => {
  const [accountCode, setAccountCode] = useState('');
  const [description, setDescription] = useState('');
  const [vatRate, setVatRate] = useState(25);

  const handleVerify = () => {
    if (match && accountCode && description) {
      onVerify(match.id, accountCode, description, vatRate);
      onClose();
      // Reset form
      setAccountCode('');
      setDescription('');
      setVatRate(25);
    }
  };

  if (!match) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Verifiera transaktion</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Transaction Details */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Kvitto</h4>
                  <p className="text-sm text-gray-600">{match.receipt.filename}</p>
                  <p className="text-sm">{match.receipt.ocrResult.vendor}</p>
                  <p className="text-sm font-medium">{match.receipt.ocrResult.amount} kr</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Transaktion</h4>
                  <p className="text-sm text-gray-600">{match.transaction.description}</p>
                  <p className="text-sm">{match.transaction.date}</p>
                  <p className="text-sm font-medium">{match.transaction.amount} kr</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="accountCode">Kontokod</Label>
              <Select value={accountCode} onValueChange={setAccountCode}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj kontokod" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1930">1930 - Bankkonto</SelectItem>
                  <SelectItem value="2641">2641 - Utgående moms 25%</SelectItem>
                  <SelectItem value="2611">2611 - Utgående moms 12%</SelectItem>
                  <SelectItem value="2621">2621 - Utgående moms 6%</SelectItem>
                  <SelectItem value="4010">4010 - Försäljning varor</SelectItem>
                  <SelectItem value="6110">6110 - Kontorsmaterial</SelectItem>
                  <SelectItem value="6212">6212 - Telefon</SelectItem>
                  <SelectItem value="6250">6250 - IT-tjänster</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Beskrivning</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ange beskrivning för verifikationen"
              />
            </div>

            <div>
              <Label htmlFor="vatRate">Moms (%)</Label>
              <Select value={vatRate.toString()} onValueChange={(value) => setVatRate(Number(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0% - Momsfritt</SelectItem>
                  <SelectItem value="6">6% - Böcker, tidningar</SelectItem>
                  <SelectItem value="12">12% - Livsmedel, hotell</SelectItem>
                  <SelectItem value="25">25% - Standardmoms</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Avbryt
            </Button>
            <Button 
              onClick={handleVerify}
              disabled={!accountCode || !description}
              className="bg-green-600 hover:bg-green-700"
            >
              Verifiera
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationModal;