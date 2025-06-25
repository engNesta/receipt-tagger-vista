import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'sv';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  getText: (key: string) => string;
}

const translations = {
  en: {
    // LoadReceipts page
    title: "Receipt Management System",
    subtitle: "Upload and organize your receipts and invoices efficiently",
    loadReceipts: "Load Your Receipts",
    chooseMethod: "Choose how you'd like to load your receipts into the system",
    uploadFiles: "Upload Receipt Files",
    uploadDescription: "Select images or PDF files of your receipts to upload",
    chooseFiles: "Choose Files",
    useSample: "Use Sample Data",
    sampleDescription: "Start with pre-loaded sample receipts to explore the system",
    loadSampleData: "Load Sample Data",
    loadingReceipts: "Loading Receipts...",
    secureManage: "Securely manage and organize all your business receipts in one place",
    language: "Language",
    
    // Index page
    vendor: "Vendor",
    price: "Price",
    productName: "Product Name",
    verificationLetter: "Verification Letter",
    ascending: "Ascending",
    descending: "Descending",
    searchPlaceholder: "Search receipts by vendor, product, or price...",
    noReceiptsTitle: "No receipts found",
    noReceiptsDescription: "Try adjusting your search terms.",
    
    // Receipt cards and modal
    selectTagToView: "Select a tag to view information",
    selectTagForInfo: "Select a tag to view specific information"
  },
  sv: {
    // LoadReceipts page
    title: "Kvitthanteringssystem",
    subtitle: "Ladda upp och organisera dina kvitton och fakturor effektivt",
    loadReceipts: "Ladda dina kvitton",
    chooseMethod: "Välj hur du vill ladda dina kvitton i systemet",
    uploadFiles: "Ladda upp kvittofiler",
    uploadDescription: "Välj bilder eller PDF-filer med dina kvitton att ladda upp",
    chooseFiles: "Välj filer",
    useSample: "Använd exempeldata",
    sampleDescription: "Börja med förladdade exempelkvitton för att utforska systemet",
    loadSampleData: "Ladda exempeldata",
    loadingReceipts: "Laddar kvitton...",
    secureManage: "Hantera och organisera alla dina företagskvitton säkert på ett ställe",
    language: "Språk",
    
    // Index page
    vendor: "Leverantör",
    price: "Pris",
    productName: "Produktnamn",
    verificationLetter: "Verifieringsbrev",
    ascending: "Stigande",
    descending: "Fallande",
    searchPlaceholder: "Sök kvitton efter leverantör, produkt eller pris...",
    noReceiptsTitle: "Inga kvitton hittades",
    noReceiptsDescription: "Försök justera dina söktermer.",
    
    // Receipt cards and modal
    selectTagToView: "Välj en tagg för att visa information",
    selectTagForInfo: "Välj en tagg för att visa specifik information"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const getText = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, getText }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
