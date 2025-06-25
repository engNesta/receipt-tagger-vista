
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'sv' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  getText: (key: string) => string;
}

const translations = {
  sv: {
    // Huvudsida
    title: "Kvitthanteringssystem",
    subtitle: "Ladda upp och organisera dina kvitton och fakturor effektivt för svensk redovisning",
    loadReceipts: "Ladda dina kvitton",
    chooseMethod: "Välj hur du vill ladda dina kvitton i systemet",
    uploadFiles: "Ladda upp kvittofiler", 
    uploadDescription: "Välj bilder eller PDF-filer med dina kvitton att ladda upp",
    chooseFiles: "Välj filer",
    useSample: "Använd exempeldata",
    sampleDescription: "Börja med förladdade svenska exempelkvitton för att utforska systemet",
    loadSampleData: "Ladda exempeldata",
    loadingReceipts: "Laddar kvitton...",
    secureManage: "Hantera och organisera alla dina företagskvitton säkert på ett ställe - redo för Fortnox, Visma och Bokio",
    language: "Språk",
    loadMoreReceipts: "Ladda fler kvitton",
    
    // Kvitthantering
    vendor: "Leverantör",
    price: "Belopp",
    productName: "Vara/Tjänst",
    verificationLetter: "Verifikationsnummer",
    ascending: "Stigande",
    descending: "Fallande", 
    searchPlaceholder: "Sök kvitton efter leverantör, vara eller belopp...",
    noReceiptsTitle: "Inga kvitton hittades",
    noReceiptsDescription: "Försök justera dina söktermer.",
    
    // Sortering och filtrering
    filterBy: "Filtrera efter",
    sortBy: "Sortera efter",
    clearFilter: "Rensa filter",
    mostRecent: "Senaste",
    priceHighToLow: "Belopp: Högst till lägst",
    priceLowToHigh: "Belopp: Lägst till högst",
    vendorAZ: "Leverantör: A-Ö",
    vendorZA: "Leverantör: Ö-A",
    
    // Kvittokort och modal
    selectTagToView: "Välj en kategori för att visa information",
    selectTagForInfo: "Välj en kategori för att visa specifik information",
    
    // Tomma tillståndet
    noReceiptsEmptyTitle: "Börja med dina kvitton",
    uploadYourReceipts: "Ladda upp dina kvitton",
    trySampleData: "Prova exempeldata"
  },
  en: {
    // LoadReceipts page
    title: "Receipt Management System",
    subtitle: "Upload and organize your receipts and invoices efficiently for Swedish accounting",
    loadReceipts: "Load Your Receipts",
    chooseMethod: "Choose how you'd like to load your receipts into the system",
    uploadFiles: "Upload Receipt Files",
    uploadDescription: "Select images or PDF files of your receipts to upload",
    chooseFiles: "Choose Files",
    useSample: "Use Sample Data",
    sampleDescription: "Start with pre-loaded Swedish sample receipts to explore the system",
    loadSampleData: "Load Sample Data", 
    loadingReceipts: "Loading Receipts...",
    secureManage: "Securely manage and organize all your business receipts in one place - ready for Fortnox, Visma and Bokio",
    language: "Language",
    loadMoreReceipts: "Load More Receipts",
    
    // Index page
    vendor: "Vendor",
    price: "Amount",
    productName: "Product/Service",
    verificationLetter: "Verification Number",
    ascending: "Ascending",
    descending: "Descending",
    searchPlaceholder: "Search receipts by vendor, product, or amount...",
    noReceiptsTitle: "No receipts found",
    noReceiptsDescription: "Try adjusting your search terms.",
    
    // Sorting and filtering
    filterBy: "Filter by",
    sortBy: "Sort by",
    clearFilter: "Clear Filter",
    mostRecent: "Most Recent",
    priceHighToLow: "Price: High to Low",
    priceLowToHigh: "Price: Low to High",
    vendorAZ: "Vendor: A-Z",
    vendorZA: "Vendor: Z-A",
    
    // Receipt cards and modal
    selectTagToView: "Select a category to view information",
    selectTagForInfo: "Select a category to view specific information",
    
    // Empty state
    noReceiptsEmptyTitle: "Get started with your receipts",
    uploadYourReceipts: "Upload Your Receipts",
    trySampleData: "Try Sample Data"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('sv'); // Default to Swedish

  const getText = (key: string): string => {
    return translations[language][key as keyof typeof translations.sv] || key;
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
