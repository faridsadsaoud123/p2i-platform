
export type UserRole = 'ADMIN' | 'DIRECTION' | 'CHEF_SERVICE' | 'CHARGE_OPERATION' | 'DEMANDEUR';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  service: string;
  function: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export type RequestStatus = 'BROUILLON' | 'EN_ATTENTE' | 'VALIDE' | 'REJETE' | 'PRECISION';
export type Priority = 'P1' | 'P2' | 'P3' | 'P4';

export interface RequestItem {
  id: string;
  title: string;
  description: string;
  site: string;
  building: string;
  type: 'DIAGNOSTIC' | 'MAINTENANCE' | 'TRAVAUX' | 'SECURITE';
  estimatedCost: number;
  priority: Priority;
  status: RequestStatus;
  createdAt: string;
  creatorId: string;
  rejectionReason?: string;
  clarificationRequest?: string;
  operationId?: string;
}

export type OperationStatus = 'CREEE' | 'AFFECTEE' | 'EN_CADRAGE' | 'EN_EXECUTION' | 'SUIVI_FINAL' | 'CLOTUREE' | 'SUSPENDUE' | 'REPORTEE';

export interface Operation {
  id: string;
  requestId?: string;
  title: string;
  description: string;
  site: string;
  status: OperationStatus;
  managerId: string;
  priority: Priority;
  pfiCode: string;
  nacresCode?: string;
  eotpCode?: string;
  aeOpen: number;
  aeEngaged: number;
  cpForecast: number;
  cpPaid: number;
  startDate: string;
  endDate: string;
}

export interface Cofinancer {
  id: string;
  operationId: string;
  name: string;
  type: 'ETAT' | 'REGION' | 'METROPOLE' | 'AUTRE';
  plannedAmount: number;
  grantedAmount: number;
  receivedAmount: number;
}

export interface Convention {
  id: string;
  cofinancerId: string;
  operationId: string;
  ref: string;
  amount: number;
  executionDeadline: string;
  justificationDeadline: string;
  history?: { date: string; user: string; change: string }[];
}
