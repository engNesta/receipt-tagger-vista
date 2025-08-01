import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, CreditCard, Check, X } from 'lucide-react';
import type { MatchedEntry } from '@/types/accounting';
import VerificationModal from '../modals/VerificationModal';
import { formatCurrency, formatConfidence } from '@/utils/numberFormatters';

interface UnverifiedTabProps {
  unverifiedMatches: MatchedEntry[];
  onVerifyMatch: (matchId: string, accountCode: string, description: string, vatRate: number) => void;
  onRemoveMatch: (matchId: string) => void;
}

const UnverifiedTab: React.FC<UnverifiedTabProps> = ({
  unverifiedMatches,
  onVerifyMatch,
  onRemoveMatch
}) => {
  const [selectedMatch, setSelectedMatch] = useState<MatchedEntry | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const handleVerifyClick = (match: MatchedEntry) => {
    setSelectedMatch(match);
    setShowVerificationModal(true);
  };

  const handleVerify = (matchId: string, accountCode: string, description: string, vatRate: number) => {
    onVerifyMatch(matchId, accountCode, description, vatRate);
  };

  return (
    <div className="space-y-4">
      {unverifiedMatches.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">
              <Check className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Inga overifierade matchningar</h3>
              <p>Alla matchningar är verifierade eller så finns det inga matchningar att verifiera.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        unverifiedMatches.map((match) => (
          <Card key={match.id}>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h4 className="font-medium">Kvitto</h4>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium">{match.receipt.filename}</p>
                    <p className="text-sm text-gray-600">{match.receipt.ocrResult.vendor}</p>
                    <p className="text-sm font-medium">{formatCurrency(match.receipt.ocrResult.amount)}</p>
                    <p className="text-xs text-gray-500">{match.receipt.ocrResult.date}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-green-600" />
                    <h4 className="font-medium">Transaktion</h4>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium">{match.transaction.description}</p>
                    <p className="text-sm font-medium">{formatCurrency(Math.abs(match.transaction.amount))}</p>
                    <p className="text-xs text-gray-500">{match.transaction.date}</p>
                    <Badge variant="outline" className="mt-1">
                      {formatConfidence(match.confidence)} matchning
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <Button
                  size="sm"
                  onClick={() => handleVerifyClick(match)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Verifiera
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRemoveMatch(match.id)}
                >
                  <X className="w-4 h-4 mr-1" />
                  Ta bort match
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
      
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        match={selectedMatch}
        onVerify={handleVerify}
      />
    </div>
  );
};

export default UnverifiedTab;