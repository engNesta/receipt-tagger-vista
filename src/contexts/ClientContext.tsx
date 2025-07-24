
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Client {
  id: string;
  companyName: string;
  registrationNumber: string;
  email: string;
  createdAt: Date;
}

interface ClientContextType {
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  deleteClient: (id: string) => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

const dummyClients: Client[] = [
  {
    id: '1',
    companyName: 'Tech Solutions AB',
    registrationNumber: '556123-4567',
    email: 'info@techsolutions.se',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    companyName: 'Nordic Consulting',
    registrationNumber: '556234-5678',
    email: 'contact@nordicconsulting.se',
    createdAt: new Date('2024-02-20')
  },
  {
    id: '3',
    companyName: 'Stockholm Retail Ltd',
    registrationNumber: '556345-6789',
    email: 'admin@stockholmretail.se',
    createdAt: new Date('2024-03-10')
  }
];

export const ClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(dummyClients);

  const addClient = (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setClients(prev => [...prev, newClient]);
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(client => client.id !== id));
  };

  return (
    <ClientContext.Provider value={{ clients, addClient, deleteClient }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClients = () => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientProvider');
  }
  return context;
};
