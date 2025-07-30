import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Document } from '@/pages/clients/ClientView';

export interface ClientDocument extends Document {
  clientId: string;
  category: string;
  month: string;
}

interface ClientDocumentStorage {
  [clientId: string]: {
    [month: string]: {
      [category: string]: ClientDocument[];
    };
  };
}

interface ClientDocumentContextType {
  getClientDocuments: (clientId: string) => ClientDocumentStorage[string] | undefined;
  addDocuments: (clientId: string, month: string, category: string, files: File[]) => Promise<ClientDocument[]>;
  removeDocument: (clientId: string, documentId: string) => void;
  getDocumentsByMonthCategory: (clientId: string, month: string, category: string) => ClientDocument[];
}

const ClientDocumentContext = createContext<ClientDocumentContextType | undefined>(undefined);

const STORAGE_KEY = 'client-documents';

export const ClientDocumentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load from localStorage on initialization
  const [documents, setDocuments] = useState<ClientDocumentStorage>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Save to localStorage whenever documents change
  const saveToStorage = useCallback((newDocuments: ClientDocumentStorage) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newDocuments));
    } catch (error) {
      console.error('Failed to save documents to localStorage:', error);
    }
  }, []);

  const getClientDocuments = useCallback((clientId: string) => {
    return documents[clientId];
  }, [documents]);

  const addDocuments = useCallback(async (
    clientId: string, 
    month: string, 
    category: string, 
    files: File[]
  ): Promise<ClientDocument[]> => {
    const newDocuments: ClientDocument[] = files.map((file, index) => ({
      id: `${clientId}-${month}-${category}-${Date.now()}-${index}`,
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 
            file.type === 'application/pdf' ? 'pdf' :
            file.type.includes('sheet') || file.name.endsWith('.xlsx') ? 'excel' : 'pdf',
      url: URL.createObjectURL(file), // Create blob URL for preview
      uploadedAt: new Date(),
      clientId,
      category,
      month
    }));

    setDocuments(prev => {
      const updated = { ...prev };
      
      if (!updated[clientId]) {
        updated[clientId] = {};
      }
      if (!updated[clientId][month]) {
        updated[clientId][month] = {};
      }
      if (!updated[clientId][month][category]) {
        updated[clientId][month][category] = [];
      }
      
      updated[clientId][month][category] = [
        ...updated[clientId][month][category],
        ...newDocuments
      ];
      
      saveToStorage(updated);
      return updated;
    });

    return newDocuments;
  }, [saveToStorage]);

  const removeDocument = useCallback((clientId: string, documentId: string) => {
    setDocuments(prev => {
      const updated = { ...prev };
      
      if (updated[clientId]) {
        Object.keys(updated[clientId]).forEach(month => {
          Object.keys(updated[clientId][month]).forEach(category => {
            updated[clientId][month][category] = updated[clientId][month][category].filter(
              doc => doc.id !== documentId
            );
          });
        });
      }
      
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const getDocumentsByMonthCategory = useCallback((
    clientId: string, 
    month: string, 
    category: string
  ): ClientDocument[] => {
    return documents[clientId]?.[month]?.[category] || [];
  }, [documents]);

  return (
    <ClientDocumentContext.Provider value={{
      getClientDocuments,
      addDocuments,
      removeDocument,
      getDocumentsByMonthCategory
    }}>
      {children}
    </ClientDocumentContext.Provider>
  );
};

export const useClientDocuments = () => {
  const context = useContext(ClientDocumentContext);
  if (context === undefined) {
    throw new Error('useClientDocuments must be used within a ClientDocumentProvider');
  }
  return context;
};