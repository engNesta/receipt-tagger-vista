import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'sv' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  getText: (key: string) => string;
}

const translations = {
  sv: {
    // Autentisering
    signIn: "Logga in",
    signUp: "Skapa konto",
    createAccount: "Skapa konto",
    email: "E-post",
    password: "Lösenord",
    confirmPassword: "Bekräfta lösenord",
    signingIn: "Loggar in...",
    creatingAccount: "Skapar konto...",
    signInDescription: "Ange dina uppgifter för att komma åt ditt konto",
    signUpDescription: "Registrera dig för att börja ladda upp och hantera dina filer",
    dontHaveAccount: "Har du inget konto?",
    alreadyHaveAccount: "Har du redan ett konto?",
    welcomeBack: "Välkommen tillbaka!",
    loginSuccess: "Du har loggats in framgångsrikt.",
    accountCreated: "Konto skapat!",
    checkEmailVerification: "Kontrollera din e-post för att verifiera ditt konto.",
    passwordsDoNotMatch: "Lösenorden stämmer inte överens",
    passwordTooShort: "Lösenordet måste vara minst 6 tecken långt",
    unexpectedError: "Ett oväntat fel inträffade",
    loading: "Laddar...",
    profile: "Profil",
    signOut: "Logga ut",
    signedOut: "Utloggad",
    signOutSuccess: "Du har loggats ut framgångsrikt.",
    signOutError: "Misslyckades med att logga ut. Försök igen.",
    joined: "Registrerad",
    secureFileUpload: "Säker filuppladdning och hantering",
    filesSecurelyStored: "Dina filer lagras säkert och är endast tillgängliga för dig",

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
    quickActions: "Snabbåtgärder",
    loadMoreFiles: "Ladda fler filer",
    yourReceipts: "Dina kvitton",
    receiptsFound: "kvitton hittades",
    dragDropUpload: "Dra och släpp filer här eller klicka för att välja",
    
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
    allReceipts: "Alla kvitton",
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
    trySampleData: "Prova exempeldata",

    // Samtycke och villkor
    consentTitle: "📄 Samtycke & Villkor för Betatest",
    consentWelcome: "Välkommen till vårt Betatestprogram",
    consentIntro: "Innan du fortsätter, vänligen läs och bekräfta ditt godkännande av följande villkor:",
    
    consentPurpose: "1. Syfte & Omfattning",
    consentPurposeText: "Genom att delta hjälper du oss att testa och förbättra vårt kvittohanteringsverktyg, som extraherar och organiserar dina kvittodata. Du förstår att detta är en förhandsversion i beta, som kan innehålla buggar och pågående utveckling.",
    
    consentData: "2. Databehandling & GDPR-efterlevnad",
    consentDataText: "Vi kan behandla personlig och finansiell data från kvitton (t.ex. leverantör, datum, belopp). Behandlingen är laglig enligt GDPR Artikel 6(1)(b) (nödvändig för avtalsuppfyllelse) eller samtycke. Vi samlar endast data som är nödvändig för testet och behåller den endast så länge som behövs. En fullständig radering sker inom 30 dagar efter att betan stängs eller på begäran. Dina data lagras säkert (krypterade under överföring och i vila). Åtkomst är begränsad till auktoriserad personal. Du, som kontoinnehavare eller dataleverantör, har rätt att när som helst få tillgång till, korrigera, radera eller begränsa dina data.",
    
    consentConfidentiality: "3. Sekretess",
    consentConfidentialityText: "All data - kvittobilder, extraherad text och utdata - är konfidentiell. Vi kommer inte att dela dina data med tredje parter förutom: Behandlare som är nödvändiga för tjänsteleverans (t.ex. OCR API-leverantörer), under strikta sekretessavtal. Juridiska skyldigheter (t.ex. stämningar eller myndighetskrav).",
    
    consentLiability: "4. Ansvarsbegränsning",
    consentLiabilityText: "Eftersom detta är en betatjänst: Vi ger inga garantier angående noggrannhet eller tillgänglighet. Vi är inte ansvariga för någon förlust, fel eller problem som uppstår från behandling av dina data. I den utsträckning som är juridiskt tillåtet, är vårt ansvar begränsat till det belopp du betalat (om något).",
    
    consentWithdrawal: "5. Återkallelse & Uppsägning",
    consentWithdrawalText: "Du kan när som helst dra dig ur betan genom att kontakta oss. Vid återkallelse kommer dina data att raderas permanent inom 30 dagar. Vi kan också pausa eller avsluta betan efter eget gottfinnande, med 30 dagars varsel.",
    
    consentAcceptance: "6. Godkännande",
    consentAcceptanceText: "Genom att klicka på 'Jag godkänner' bekräftar du: Att du har läst och förstått dessa villkor. Att du samtycker till vår behandling av dina kvittodata. Att du erkänner dina GDPR-rättigheter och våra säkerhets-, sekretess- och bevarandeåtaganden.",
    
    iAgree: "Jag godkänner",
    cancel: "Avbryt",
    agreeToTerms: "Jag godkänner villkoren",
    agreeToDataProcessing: "Jag samtycker till databehandling",
    acknowledgeGDPRRights: "Jag erkänner mina GDPR-rättigheter",
    consentRequired: "Du måste godkänna alla villkor för att fortsätta"
  },
  en: {
    // Authentication
    signIn: "Sign In",
    signUp: "Sign Up",
    createAccount: "Create Account",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    signingIn: "Signing in...",
    creatingAccount: "Creating account...",
    signInDescription: "Enter your credentials to access your account",
    signUpDescription: "Sign up to start uploading and managing your files",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    welcomeBack: "Welcome back!",
    loginSuccess: "You have been logged in successfully.",
    accountCreated: "Account created!",
    checkEmailVerification: "Please check your email to verify your account.",
    passwordsDoNotMatch: "Passwords do not match",
    passwordTooShort: "Password must be at least 6 characters long",
    unexpectedError: "An unexpected error occurred",
    loading: "Loading...",
    profile: "Profile",
    signOut: "Sign Out",
    signedOut: "Signed out",
    signOutSuccess: "You have been signed out successfully.",
    signOutError: "Failed to sign out. Please try again.",
    joined: "Joined",
    secureFileUpload: "Secure file upload and management",
    filesSecurelyStored: "Your files are securely stored and only accessible by you",

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
    quickActions: "Quick Actions",
    loadMoreFiles: "Load More Files",
    yourReceipts: "Your Receipts",
    receiptsFound: "receipts found",
    dragDropUpload: "Drag and drop files here or click to select",
    
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
    allReceipts: "All Receipts",
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
    trySampleData: "Try Sample Data",

    // Consent and Terms
    consentTitle: "📄 Consent & Beta Terms Agreement",
    consentWelcome: "Welcome to our Beta Test Program",
    consentIntro: "Before proceeding, please read and confirm your acceptance of the following terms:",
    
    consentPurpose: "1. Purpose & Scope",
    consentPurposeText: "By participating, you help us test and improve our receipt processing tool, which extracts and organizes your receipt data. You understand this is a pre-release beta, subject to bugs and ongoing development.",
    
    consentData: "2. Data Processing & GDPR Compliance",
    consentDataText: "We may process personal and financial data from receipts (e.g. vendor, date, amount). Processing is lawful under GDPR Article 6(1)(b) (necessary for contractual performance) or consent. We collect only data necessary for the test and retain it only as needed. A full deletion occurs within 30 days of beta closure or upon request. Your data is securely stored (encrypted in transit and at rest). Access is limited to authorized personnel. You, as account-holder or data-provider, have the right to access, correct, delete, or restrict your data at any time.",
    
    consentConfidentiality: "3. Confidentiality",
    consentConfidentialityText: "All data—receipt images, extracted text, and outputs—are confidential. We will not share your data with third parties except: Processors necessary for service delivery (e.g. OCR API providers), under strict confidentiality agreements. Legal obligations (e.g. subpoenas or regulatory requests).",
    
    consentLiability: "4. Limitation of Liability",
    consentLiabilityText: "As this is a beta service: We make no warranties regarding accuracy or availability. We are not liable for any loss, errors, or issues arising from processing your data. To the extent legally permissible, our liability is capped at the amount you paid (if any).",
    
    consentWithdrawal: "5. Withdrawal & Termination",
    consentWithdrawalText: "You can withdraw from the beta at any time by contacting us. Upon withdrawal, your data will be permanently deleted within 30 days. We may also pause or terminate the beta at our discretion, with 30 days' notice.",
    
    consentAcceptance: "6. Acceptance",
    consentAcceptanceText: "By clicking 'I Agree', you confirm: You have read and understood these terms. You consent to our processing of your receipt data. You acknowledge your GDPR rights and our security, confidentiality, and retention commitments.",
    
    iAgree: "I Agree",
    cancel: "Cancel",
    agreeToTerms: "I agree to the terms",
    agreeToDataProcessing: "I consent to data processing",
    acknowledgeGDPRRights: "I acknowledge my GDPR rights",
    consentRequired: "You must accept all terms to continue"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('sv'); // Changed default back to Swedish

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
