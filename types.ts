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
  date_validation?: string;
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
  nacresCodes?: string[];
  eotpCodes?: string[];
  aeOpen: number;
  aeEngaged: number;
  cpForecast: number;
  cpPaid: number;
  estimationInitial?: number;
  startDate: string;
  endDate: string;
  dateClotureReelle?: string;
  history?: { date: string; user: string; title: string; desc: string }[];
}

export type CofinanceurType = 'ETAT' | 'REGION' | 'METROPOLE' | 'AUTRE';

export interface Cofinanceur {
  id: string;
  nom: string;
  type: CofinanceurType;
  actif: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OperationCofinanceur {
  id: string;
  operationId: string;
  cofinanceurId: string;
  montantPrevu: number;
  montantAccorde: number;
  montantRecu: number;
  statut: 'PREVU' | 'ACCORDE' | 'RECU' | 'ANNULE';
}

export interface Convention {
  id: string;
  operationCofinanceurId: string;
  operationId: string;
  ref: string;
  amount: number;
  executionDeadline: string;
  justificationDeadline: string;
  history?: { date: string; user: string; change: string }[];
}

export interface FinancialEstimationLine {
  year: number;
  nature: string;
  amount: number;
}

// === New entities for estimations / EFP / AE / CP ===

export type EstimationStatus = 'BROUILLON' | 'VALIDÉ';

export interface Estimation {
  id: string;
  operationId: string;
  name: string; // e.g. "Estimation initiale"
  comment?: string;
  status: EstimationStatus;
  createdAt: string;
  authorId: string;
}

export interface EstimationVersion {
  id: string;
  estimationId: string;
  versionNumber: number;
  date: string;
  authorId: string;
  comment?: string;
  total: number;
  lines: EstimationLigne[];
}

export interface EstimationLigne {
  year: number;
  nature: string;
  amount: number;
}

export interface EFP {
  id: string;
  operationId: string;
  name: string;
  comment?: string;
  status: 'BROUILLON' | 'VALIDÉ';
  createdAt: string;
  authorId: string;
}

export interface EFPVersion {
  id: string;
  efpId: string;
  versionNumber: number;
  date: string;
  authorId: string;
  comment?: string;
  total: number;
  posts: EFPPoste[];
}

export interface EFPPoste {
  nature: string; // études, MOE, travaux, contrôles, autres
  amount: number;
  yearBreakdown?: Record<number, number>;
}

export interface AE {
  id: string;
  operationId: string;
  year: number;
  aePrevues: number;
  aeOuvertes: number;
  aeEngagees: number;
}

export interface CP {
  id: string;
  operationId: string;
  year: number;
  cpPrevus: number;
  cpOuverts: number;
  cpMandates: number;
}

export interface HistoriqueAction {
  id: string;
  relatedId: string; // could be operation, estimation, efp, etc.
  relatedType: string;
  date: string;
  user: string;
  action: string;
  comment?: string;
}

export interface FinancialEstimationVersion {
  id: string;
  opId: string;
  versionNumber: number;
  name: string;
  date: string;
  author: string;
  status: 'BROUILLON' | 'VALIDÉ';
  total: number;
  comment?: string;
  lines: FinancialEstimationLine[];
}

export interface EFPPost {
  nature: string;
  amount: number;
  yearBreakdown?: { [year: number]: number };
  color: string;
}

export interface EFPVersion {
  id: string;
  opId: string;
  versionNumber: number;
  date: string;
  author: string;
  status: 'BROUILLON' | 'VALIDÉ';
  total: number;
  comment?: string;
  posts: EFPPost[];
}

export interface Prestataire {
  id: string;
  nom: string;
  siret: string;
  adresse: string;
  ville: string;
  codePostal: string;
  contactNom: string;
  contactEmail: string;
  contactTel: string;
  specialite: string;
  statut: 'ACTIF' | 'INACTIF';
  note?: number;
  createdAt: string;
}
