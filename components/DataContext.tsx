import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MOCK_REQUESTS, MOCK_OPERATIONS } from '../mockData';
import { RequestItem, Operation, RequestStatus, Priority, OperationStatus } from '../types';

interface DataContextType {
  requests: RequestItem[];
  operations: Operation[];
  setRequests: React.Dispatch<React.SetStateAction<RequestItem[]>>;
  setOperations: React.Dispatch<React.SetStateAction<Operation[]>>;
  transformRequestToOperation: (requestId: string) => string | null;
  updateRequest: (id: string, updates: Partial<RequestItem>) => void;
  updateOperation: (id: string, updates: Partial<Operation>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<RequestItem[]>(MOCK_REQUESTS);
  const [operations, setOperations] = useState<Operation[]>(MOCK_OPERATIONS);

  const updateRequest = (id: string, updates: Partial<RequestItem>) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const updateOperation = (id: string, updates: Partial<Operation>) => {
    setOperations(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const transformRequestToOperation = (requestId: string, comment?: string): string | null => {
    const request = requests.find(r => r.id === requestId);
    if (!request || (request.status !== 'VALIDE' && request.status !== 'EN_ATTENTE') || request.operationId) return null;

    const newOpId = `OP-${new Date().getFullYear().toString().slice(-2)}-${(operations.length + 1).toString().padStart(3, '0')}`;

    const newOperation: Operation = {
      id: newOpId,
      requestId: request.id,
      title: request.title,
      description: request.description,
      site: request.site,
      status: 'CREEE',
      managerId: 'u1', // Default manager
      priority: request.priority,
      pfiCode: `PFI-${Math.floor(1000 + Math.random() * 9000)}`, // Generated unique PFI
      eotpCodes: [],
      nacresCodes: [],
      aeOpen: request.estimatedCost,
      aeEngaged: 0,
      cpForecast: request.estimatedCost,
      cpPaid: 0,
      estimationInitial: request.estimatedCost,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      history: [
        {
          date: new Date().toLocaleDateString('fr-FR'),
          user: 'Système',
          title: 'Opération Créée',
          desc: comment ? `Validée avec commentaire: "${comment}"` : `Transformation automatique depuis la demande ${request.id}.`
        }
      ]
    };

    setOperations(prev => [newOperation, ...prev]);
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'VALIDE', operationId: newOpId, date_validation: new Date().toISOString().split('T')[0] } : r));

    return newOpId;
  };

  return (
    <DataContext.Provider value={{ 
      requests, 
      operations, 
      setRequests, 
      setOperations, 
      transformRequestToOperation,
      updateRequest,
      updateOperation
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
