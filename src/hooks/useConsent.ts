
import { useState, useEffect } from 'react';

interface ConsentData {
  timestamp: string;
  version: string;
  termsAccepted: boolean;
  dataProcessingConsent: boolean;
  gdprAcknowledged: boolean;
}

export const useConsent = () => {
  const [hasConsent, setHasConsent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkConsentStatus();
  }, []);

  const checkConsentStatus = () => {
    try {
      const consentData = localStorage.getItem('receipt-app-consent');
      console.log('Checking consent status, found data:', consentData);
      
      if (consentData) {
        const parsed: ConsentData = JSON.parse(consentData);
        console.log('Parsed consent data:', parsed);
        
        // Check if consent is valid (all required fields are true)
        const isValid = parsed.termsAccepted && 
                       parsed.dataProcessingConsent && 
                       parsed.gdprAcknowledged;
        
        console.log('Consent is valid:', isValid);
        setHasConsent(isValid);
      } else {
        console.log('No consent data found, setting hasConsent to false');
        setHasConsent(false);
      }
    } catch (error) {
      console.error('Error checking consent status:', error);
      setHasConsent(false);
    } finally {
      setIsLoading(false);
    }
  };

  const grantConsent = () => {
    console.log('Granting consent');
    setHasConsent(true);
  };

  const revokeConsent = () => {
    console.log('Revoking consent');
    localStorage.removeItem('receipt-app-consent');
    setHasConsent(false);
  };

  const getConsentData = (): ConsentData | null => {
    try {
      const consentData = localStorage.getItem('receipt-app-consent');
      return consentData ? JSON.parse(consentData) : null;
    } catch (error) {
      console.error('Error getting consent data:', error);
      return null;
    }
  };

  return {
    hasConsent,
    isLoading,
    grantConsent,
    revokeConsent,
    getConsentData,
    checkConsentStatus
  };
};
