
import { useState, useEffect } from 'react';

interface ConsentData {
  timestamp: string;
  version: string;
  dataProcessingConsent: boolean;
  policyRead: boolean;
  ipAddress?: string;
  userAgent?: string;
}

export const useConsent = () => {
  const [hasConsent, setHasConsent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkConsentStatus();
  }, []);

  const checkConsentStatus = () => {
    try {
      // Check for new GDPR consent format first
      const gdprConsentData = localStorage.getItem('gdpr-receipt-consent');
      console.log('Checking GDPR consent status, found data:', gdprConsentData);
      
      if (gdprConsentData) {
        const parsed: ConsentData = JSON.parse(gdprConsentData);
        console.log('Parsed GDPR consent data:', parsed);
        
        const isValid = parsed.dataProcessingConsent && parsed.policyRead;
        console.log('GDPR consent is valid:', isValid);
        setHasConsent(isValid);
      } else {
        // Fallback to old consent format for backward compatibility
        const oldConsentData = localStorage.getItem('receipt-app-consent');
        if (oldConsentData) {
          const parsed = JSON.parse(oldConsentData);
          const isValid = parsed.termsAccepted && 
                         parsed.dataProcessingConsent && 
                         parsed.gdprAcknowledged;
          setHasConsent(isValid);
        } else {
          console.log('No consent data found, setting hasConsent to false');
          setHasConsent(false);
        }
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
    localStorage.removeItem('gdpr-receipt-consent');
    localStorage.removeItem('receipt-app-consent'); // Also remove old format
    setHasConsent(false);
  };

  const getConsentData = (): ConsentData | null => {
    try {
      const consentData = localStorage.getItem('gdpr-receipt-consent');
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
