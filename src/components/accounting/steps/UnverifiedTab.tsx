import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import type { MatchedEntry } from '@/types/accounting';

interface UnverifiedTabProps {
  unverifiedMatches: MatchedEntry[];
  onVerifyMatch: (matchId: string) => void;
  onRemoveMatch: (matchId: string) => void;
}

const UnverifiedTab: React.FC<UnverifiedTabProps> = ({ 
  unverifiedMatches, 
  onVerifyMatch, 
  onRemoveMatch 
}) => {
  const [editingMatch, setEditingMatch] = useState<string | null>(null);
  const [accountNumbers, setAccountNumbers] = useState<Record<string, string>>({});
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});

  const handleVerifyMatch = (matchId: string) => {
    onVerifyMatch(matchId);
    setEditingMatch(null);
  };

  return (
    <div className="space-y-4">
      {unverifiedMatches.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Inga overifierade matchningar</p>
          </CardContent>
        </Card>
      ) : (
        unverifiedMatches.map((match) => (
          <Card key={match.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <span>Match #{match.id.slice(-6)}</span>
                <Badge variant="secondary" className="text-xs">
                  {(match.confidence * 100).toFixed(0)}% säkerhet
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Receipt Info */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Kvitto</h4>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    <p><strong>Leverantör:</strong> {match.receipt.ocrResult.vendor}</p>
                    <p><strong>Belopp:</strong> {match.receipt.ocrResult.amount} kr</p>
                    <p><strong>Datum:</strong> {match.receipt.ocrResult.date}</p>
                  </div>
                </div>

                {/* Transaction Info */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Transaktion</h4>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    <p><strong>Beskrivning:</strong> {match.transaction.description}</p>
                    <p><strong>Belopp:</strong> {match.transaction.amount} kr</p>
                    <p><strong>Datum:</strong> {match.transaction.date}</p>
                    <p><strong>Referens:</strong> {match.transaction.reference}</p>
                  </div>
                </div>
              </div>

              {/* Editing Form */}
              {editingMatch === match.id ? (
                <div className="border-t pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`account-${match.id}`}>Kontokod</Label>
                      <Select 
                        value={accountNumbers[match.id] || ''} 
                        onValueChange={(value) => setAccountNumbers(prev => ({ ...prev, [match.id]: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Välj kontokod" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1930">1930 - Kassa/Bank</SelectItem>
                          <SelectItem value="2641">2641 - Utgående moms 25%</SelectItem>
                          <SelectItem value="4010">4010 - Försäljning varor</SelectItem>
                          <SelectItem value="6000">6000 - Handelsvaror</SelectItem>
                          <SelectItem value="6100">6100 - Lokalkostnader</SelectItem>
                          <SelectItem value="6200">6200 - Hyror</SelectItem>
                          <SelectItem value="6300">6300 - Reparation/underhåll</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`description-${match.id}`}>Beskrivning</Label>
                      <Input
                        id={`description-${match.id}`}
                        value={descriptions[match.id] || match.transaction.description}
                        onChange={(e) => setDescriptions(prev => ({ ...prev, [match.id]: e.target.value }))}
                        placeholder="Ange beskrivning"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleVerifyMatch(match.id)}
                      disabled={!accountNumbers[match.id]}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Verifiera match
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingMatch(null)}
                    >
                      Avbryt
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    onClick={() => setEditingMatch(match.id)}
                    variant="outline"
                  >
                    Redigera och verifiera
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemoveMatch(match.id)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Ta bort match
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default UnverifiedTab;