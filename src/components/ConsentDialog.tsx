
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';

interface ConsentDialogProps {
  isOpen: boolean;
  onConsent: () => void;
  onDecline: () => void;
}

const ConsentDialog: React.FC<ConsentDialogProps> = ({ isOpen, onConsent, onDecline }) => {
  const { getText } = useLanguage();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToDataProcessing, setAgreedToDataProcessing] = useState(false);
  const [acknowledgedGDPRRights, setAcknowledgedGDPRRights] = useState(false);

  const allConsentsGiven = agreedToTerms && agreedToDataProcessing && acknowledgedGDPRRights;

  const handleConsent = () => {
    if (allConsentsGiven) {
      // Store consent in localStorage with timestamp
      const consentData = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        termsAccepted: true,
        dataProcessingConsent: true,
        gdprAcknowledged: true
      };
      localStorage.setItem('receipt-app-consent', JSON.stringify(consentData));
      onConsent();
    }
  };

  const resetConsents = () => {
    setAgreedToTerms(false);
    setAgreedToDataProcessing(false);
    setAcknowledgedGDPRRights(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      resetConsents();
      onDecline();
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-bold text-center">
            {getText('consentTitle')}
          </DialogTitle>
          <p className="text-lg font-semibold text-center mt-2">
            {getText('consentWelcome')}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {getText('consentIntro')}
          </p>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-6 pr-4">
            {/* Purpose & Scope */}
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">
                {getText('consentPurpose')}
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {getText('consentPurposeText')}
              </p>
            </div>

            {/* Data Processing & GDPR */}
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">
                {getText('consentData')}
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {getText('consentDataText')}
              </p>
            </div>

            {/* Confidentiality */}
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">
                {getText('consentConfidentiality')}
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {getText('consentConfidentialityText')}
              </p>
            </div>

            {/* Limitation of Liability */}
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">
                {getText('consentLiability')}
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {getText('consentLiabilityText')}
              </p>
            </div>

            {/* Withdrawal & Termination */}
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">
                {getText('consentWithdrawal')}
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {getText('consentWithdrawalText')}
              </p>
            </div>

            {/* Acceptance */}
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">
                {getText('consentAcceptance')}
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {getText('consentAcceptanceText')}
              </p>
            </div>
          </div>
        </ScrollArea>

        {/* Consent Checkboxes */}
        <div className="flex-shrink-0 space-y-4 border-t pt-4 mt-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={setAgreedToTerms}
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm font-medium leading-relaxed cursor-pointer">
              {getText('agreeToTerms')}
            </label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="dataProcessing"
              checked={agreedToDataProcessing}
              onCheckedChange={setAgreedToDataProcessing}
              className="mt-1"
            />
            <label htmlFor="dataProcessing" className="text-sm font-medium leading-relaxed cursor-pointer">
              {getText('agreeToDataProcessing')}
            </label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="gdprRights"
              checked={acknowledgedGDPRRights}
              onCheckedChange={setAcknowledgedGDPRRights}
              className="mt-1"
            />
            <label htmlFor="gdprRights" className="text-sm font-medium leading-relaxed cursor-pointer">
              {getText('acknowledgeGDPRRights')}
            </label>
          </div>

          {!allConsentsGiven && (
            <p className="text-sm text-red-600 font-medium">
              {getText('consentRequired')}
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
            {getText('cancel')}
          </Button>
          <Button
            onClick={handleConsent}
            disabled={!allConsentsGiven}
            className="flex-1"
          >
            {getText('iAgree')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConsentDialog;
