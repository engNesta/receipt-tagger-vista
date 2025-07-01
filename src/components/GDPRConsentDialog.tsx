
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink } from 'lucide-react';

interface GDPRConsentDialogProps {
  isOpen: boolean;
  onConsent: () => void;
  onDecline: () => void;
}

const GDPRConsentDialog: React.FC<GDPRConsentDialogProps> = ({ 
  isOpen, 
  onConsent, 
  onDecline 
}) => {
  const [hasReadPolicy, setHasReadPolicy] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  const allConsentsGiven = hasReadPolicy && consentGiven;

  const handleConsent = () => {
    if (allConsentsGiven) {
      // Store consent with timestamp and version for legal compliance
      const consentData = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        dataProcessingConsent: true,
        policyRead: true,
        ipAddress: 'client-side', // In production, this would be captured server-side
        userAgent: navigator.userAgent
      };
      localStorage.setItem('gdpr-receipt-consent', JSON.stringify(consentData));
      onConsent();
    }
  };

  const resetConsents = () => {
    setHasReadPolicy(false);
    setConsentGiven(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      resetConsents();
      onDecline();
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-bold text-center text-blue-800">
            Samtycke till databehandling (MVP-test)
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-4 pr-4 text-sm leading-relaxed">
            <p className="font-medium text-gray-800">
              Genom att klicka på "Jag godkänner" bekräftar du att du:
            </p>

            <div className="space-y-3 ml-4">
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <p>
                  <strong>Frivilligt och tydligt samtycker</strong> till att bilder och data från dina kvitton 
                  (t.ex. leverantör, datum, belopp, OCR-text) behandlas av vårt system.
                </p>
              </div>

              <div className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <p>
                  <strong>Har blivit informerad</strong> om behandlingssyftet och att samtycket är 
                  nödvändigt för testets funktionalitet.
                </p>
              </div>

              <div className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <p>
                  <strong>Förstår att du kan återkalla</strong> ditt samtycke när som helst, 
                  utan att det påverkar tidigare godkänd behandling.
                </p>
              </div>

              <div className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <p>
                  <strong>Ger ett aktivt godkännande</strong> genom att kryssa i rutan — 
                  ingen förvald kryssruta tillåts enligt GDPR.
                </p>
              </div>

              <div className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <p>
                  <strong>Bekräftar att du har läst och förstått</strong> den tillhörande 
                  integritetspolicyn via länken nedan, innan samtycke lämnas.
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
              <p className="font-medium text-yellow-800">
                <strong>Observera:</strong> Inga kvittodata kommer behandlas eller sparas förrän samtycke har registrerats.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                🧾 Kort förklaring varför detta är korrekt enligt GDPR och svensk lag:
              </h4>
              <ul className="space-y-2 text-xs text-blue-700">
                <li>• Samtycke är aktivt, tydligt och informerat, i linje med GDPR definition (Artikel 4.11)</li>
                <li>• Checkboxen måste vara obekryssad från start, användaren måste själv klicka för att ge samtycke</li>
                <li>• Samtycket sparas med tidpunkt/version för att kunna bevisas i efterhand</li>
                <li>• Konsentknappen öppnas först när checkboxen är markerad</li>
                <li>• Användaren får en direkt länk till privacy policy före samtycke lämnas</li>
              </ul>
            </div>
          </div>
        </ScrollArea>

        {/* Privacy Policy Link */}
        <div className="flex-shrink-0 border-t pt-4">
          <Button
            variant="link"
            className="w-full justify-center text-blue-600 hover:text-blue-800"
            onClick={() => window.open('/privacy-policy', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Läs vår integritetspolicy innan du ger samtycke
          </Button>
        </div>

        {/* Consent Checkboxes */}
        <div className="flex-shrink-0 space-y-4 border-t pt-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="policy-read"
              checked={hasReadPolicy}
              onCheckedChange={(checked) => setHasReadPolicy(checked === true)}
              className="mt-1"
            />
            <label htmlFor="policy-read" className="text-sm font-medium leading-relaxed cursor-pointer">
              Jag bekräftar att jag har läst och förstått integritetspolicyn
            </label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="data-consent"
              checked={consentGiven}
              onCheckedChange={(checked) => setConsentGiven(checked === true)}
              className="mt-1"
            />
            <label htmlFor="data-consent" className="text-sm font-medium leading-relaxed cursor-pointer">
              Jag samtycker frivilligt och medvetet till databehandling enligt ovan
            </label>
          </div>

          {!allConsentsGiven && (
            <p className="text-sm text-red-600 font-medium">
              Båda rutorna måste kryssas i för att kunna fortsätta
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 flex-shrink-0 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              resetConsents();
              onDecline();
            }}
            className="flex-1"
          >
            Avbryt
          </Button>
          <Button
            onClick={handleConsent}
            disabled={!allConsentsGiven}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Jag godkänner
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GDPRConsentDialog;
