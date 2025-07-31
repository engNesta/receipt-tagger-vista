import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { ClientSession, Receipt, BankTransaction, MatchedEntry, ProcessingStep } from '@/types/accounting';
import { dummyReceipts, dummyTransactions, dummyMatches } from '@/data/dummyAccountingData';

interface AccountingWizardContextType {
  session: ClientSession | null;
  initializeSession: (clientId: string, month: string) => void;
  addReceipts: (receipts: Receipt[]) => void;
  removeReceipt: (receiptId: string) => void;
  updateReceipt: (receiptId: string, updates: Partial<Receipt>) => void;
  addTransactions: (transactions: BankTransaction[]) => void;
  createMatch: (receiptId: string, transactionId: string, confidence: number) => void;
  removeMatch: (matchId: string) => void;
  verifyMatch: (matchId: string) => void;
  setCurrentStep: (step: ProcessingStep['id']) => void;
  getUnmatchedReceipts: () => Receipt[];
  getUnmatchedTransactions: () => BankTransaction[];
  getMatchedEntries: () => MatchedEntry[];
  getUnverifiedMatches: () => MatchedEntry[];
}

const AccountingWizardContext = createContext<AccountingWizardContextType | undefined>(undefined);

export const AccountingWizardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<ClientSession | null>(null);

  const initializeSession = (clientId: string, month: string) => {
    setSession({
      clientId,
      month,
      receipts: [...dummyReceipts],
      transactions: [...dummyTransactions],
      matches: [...dummyMatches],
      currentStep: 'tolka'
    });
  };

  const addReceipts = (receipts: Receipt[]) => {
    if (!session) return;
    setSession(prev => prev ? {
      ...prev,
      receipts: [...prev.receipts, ...receipts]
    } : null);
  };

  const removeReceipt = (receiptId: string) => {
    if (!session) return;
    setSession(prev => prev ? {
      ...prev,
      receipts: prev.receipts.filter(r => r.id !== receiptId),
      matches: prev.matches.filter(m => m.receipt.id !== receiptId)
    } : null);
  };

  const updateReceipt = (receiptId: string, updates: Partial<Receipt>) => {
    if (!session) return;
    setSession(prev => prev ? {
      ...prev,
      receipts: prev.receipts.map(r => 
        r.id === receiptId ? { ...r, ...updates } : r
      )
    } : null);
  };

  const addTransactions = (transactions: BankTransaction[]) => {
    if (!session) return;
    setSession(prev => prev ? {
      ...prev,
      transactions: [...prev.transactions, ...transactions]
    } : null);
  };

  const createMatch = (receiptId: string, transactionId: string, confidence: number) => {
    if (!session) return;
    const receipt = session.receipts.find(r => r.id === receiptId);
    const transaction = session.transactions.find(t => t.id === transactionId);
    
    if (receipt && transaction) {
      const newMatch: MatchedEntry = {
        id: `match-${Date.now()}`,
        receipt,
        transaction,
        confidence,
        verified: false
      };
      
      setSession(prev => prev ? {
        ...prev,
        matches: [...prev.matches, newMatch]
      } : null);
    }
  };

  const removeMatch = (matchId: string) => {
    if (!session) return;
    setSession(prev => prev ? {
      ...prev,
      matches: prev.matches.filter(m => m.id !== matchId)
    } : null);
  };

  const verifyMatch = (matchId: string) => {
    if (!session) return;
    setSession(prev => prev ? {
      ...prev,
      matches: prev.matches.map(m => 
        m.id === matchId ? { ...m, verified: true } : m
      )
    } : null);
  };

  const setCurrentStep = (step: ProcessingStep['id']) => {
    if (!session) return;
    setSession(prev => prev ? {
      ...prev,
      currentStep: step
    } : null);
  };

  const getUnmatchedReceipts = (): Receipt[] => {
    if (!session) return [];
    const matchedReceiptIds = session.matches.map(m => m.receipt.id);
    return session.receipts.filter(r => !matchedReceiptIds.includes(r.id));
  };

  const getUnmatchedTransactions = (): BankTransaction[] => {
    if (!session) return [];
    const matchedTransactionIds = session.matches.map(m => m.transaction.id);
    return session.transactions.filter(t => !matchedTransactionIds.includes(t.id));
  };

  const getMatchedEntries = (): MatchedEntry[] => {
    return session?.matches || [];
  };

  const getUnverifiedMatches = (): MatchedEntry[] => {
    return session?.matches.filter(m => !m.verified) || [];
  };

  return (
    <AccountingWizardContext.Provider value={{
      session,
      initializeSession,
      addReceipts,
      removeReceipt,
      updateReceipt,
      addTransactions,
      createMatch,
      removeMatch,
      verifyMatch,
      setCurrentStep,
      getUnmatchedReceipts,
      getUnmatchedTransactions,
      getMatchedEntries,
      getUnverifiedMatches
    }}>
      {children}
    </AccountingWizardContext.Provider>
  );
};

export const useAccountingWizard = () => {
  const context = useContext(AccountingWizardContext);
  if (context === undefined) {
    throw new Error('useAccountingWizard must be used within an AccountingWizardProvider');
  }
  return context;
};