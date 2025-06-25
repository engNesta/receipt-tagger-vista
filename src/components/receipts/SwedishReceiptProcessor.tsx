
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, FileText } from 'lucide-react';
import { 
  extractSwedishReceiptData, 
  validateSwedishReceiptData,
  SwedishReceiptData 
} from '@/utils/swedishReceiptProcessor';
import { useLanguage } from '@/contexts/LanguageContext';

interface SwedishReceiptProcessorProps {
  onDataExtracted?: (data: Partial<SwedishReceiptData>) => void;
}

const SwedishReceiptProcessor: React.FC<SwedishReceiptProcessorProps> = ({ 
  onDataExtracted 
}) => {
  const { getText } = useLanguage();
  const [receiptText, setReceiptText] = useState('');
  const [extractedData, setExtractedData] = useState<Partial<SwedishReceiptData> | null>(null);
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; errors: string[] } | null>(null);

  const handleProcess = () => {
    if (!receiptText.trim()) return;
    
    const data = extractSwedishReceiptData(receiptText);
    const validation = validateSwedishReceiptData(data);
    
    setExtractedData(data);
    setValidationResult(validation);
    onDataExtracted?.(data);
    
    console.log('Extracted Swedish receipt data:', data);
    console.log('Validation result:', validation);
  };

  const handleLoadSample = () => {
    const sampleText = `ICA Supermarket Värtan
Org.nr: 556014-2447
Kvitto: 12345

Mjölk Arla                   29,50 kr
Bröd Pågen                   24,90 kr
Äpplen 1kg                   32,00 kr

Summa:                       86,40 kr
Moms 25%:                    17,28 kr

2024-01-15 14:32
Tack för ditt köp!`;
    
    setReceiptText(sampleText);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Svensk Kvittotolkning
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Klistra in kvittotext:
            </label>
            <Textarea
              value={receiptText}
              onChange={(e) => setReceiptText(e.target.value)}
              placeholder="Klistra in text från ditt kvitto här..."
              className="min-h-32"
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleProcess} disabled={!receiptText.trim()}>
              Tolka Kvitto
            </Button>
            <Button onClick={handleLoadSample} variant="outline">
              Ladda Exempel
            </Button>
          </div>
        </CardContent>
      </Card>

      {extractedData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {validationResult?.isValid ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              Extraherad Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {extractedData.vendor && (
              <div className="flex justify-between">
                <span className="font-medium">Leverantör:</span>
                <span>{extractedData.vendor}</span>
              </div>
            )}
            
            {extractedData.amount && (
              <div className="flex justify-between">
                <span className="font-medium">Belopp:</span>
                <span>{extractedData.amount}</span>
              </div>
            )}
            
            {extractedData.vatAmount && (
              <div className="flex justify-between">
                <span className="font-medium">Moms:</span>
                <span>{extractedData.vatAmount}</span>
              </div>
            )}
            
            {extractedData.orgNumber && (
              <div className="flex justify-between">
                <span className="font-medium">Org.nr:</span>
                <span>{extractedData.orgNumber}</span>
              </div>
            )}
            
            {extractedData.date && (
              <div className="flex justify-between">
                <span className="font-medium">Datum:</span>
                <span>{extractedData.date}</span>
              </div>
            )}
            
            {validationResult && !validationResult.isValid && (
              <div className="mt-4">
                <h4 className="font-medium text-red-600 mb-2">Valideringsfel:</h4>
                <div className="space-y-1">
                  {validationResult.errors.map((error, index) => (
                    <Badge key={index} variant="destructive" className="mr-2">
                      {error}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {validationResult?.isValid && (
              <Badge className="bg-green-100 text-green-800">
                ✓ Data validerad enligt svenska regler
              </Badge>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SwedishReceiptProcessor;
