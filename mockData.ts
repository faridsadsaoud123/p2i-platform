
import { User, RequestItem, Operation, Cofinancer, Convention } from './types';

export const MOCK_ROLES = [
  { id: 'r1', name: 'ADMIN', description: 'Accès total au système et gestion des utilisateurs.', protected: true },
  { id: 'r2', name: 'DIRECTION', description: 'Vue stratégique et validation finale des budgets.', protected: false },
  { id: 'r3', name: 'CHEF_SERVICE', description: 'Management des opérations de son service.', protected: false },
  { id: 'r4', name: 'CHARGE_OPERATION', description: 'Gestion technique et financière quotidienne.', protected: false },
  { id: 'r5', name: 'DEMANDEUR', description: 'Saisie de besoins et consultation simple.', protected: false },
];

export const MOCK_USERS: User[] = [
  { id: 'u1', firstName: 'Jean', lastName: 'Admin', email: 'jean.admin@univ-picardie.fr', service: 'DSI', function: 'Directeur SI', role: 'ADMIN', status: 'ACTIVE', createdAt: '2023-01-15' },
  { id: 'u2', firstName: 'Marie', lastName: 'Directrice', email: 'marie.dir@univ-picardie.fr', service: 'DIRECTION', function: 'Directrice P2I', role: 'DIRECTION', status: 'ACTIVE', createdAt: '2023-02-10' },
  { id: 'u3', firstName: 'Paul', lastName: 'Charge', email: 'paul.charge@univ-picardie.fr', service: 'SMOTI', function: "Chargé d'opérations", role: 'CHARGE_OPERATION', status: 'ACTIVE', createdAt: '2023-03-05' }
];

export const MOCK_REQUESTS: RequestItem[] = [
  { id: 'REQ-2024-001', title: 'Rénovation Toiture Amphi A', description: 'Infiltrations constatées.', site: 'Campus Centre', building: 'Bâtiment 1', type: 'TRAVAUX', estimatedCost: 150000, priority: 'P1', status: 'VALIDE', createdAt: '2024-01-10', creatorId: 'u3', operationId: 'OP-24-001' },
  { id: 'REQ-2024-002', title: 'Mise aux normes ascenseurs', description: 'Sécurité réglementaire.', site: 'Campus Nord', building: 'Bâtiment L', type: 'SECURITE', estimatedCost: 45000, priority: 'P2', status: 'EN_ATTENTE', createdAt: '2024-02-15', creatorId: 'u3' },
  { id: 'REQ-2024-003', title: 'Peinture Hall Accueil', description: 'Besoin de rafraîchissement esthétique.', site: 'Campus Centre', building: 'Bâtiment A', type: 'MAINTENANCE', estimatedCost: 5000, priority: 'P4', status: 'PRECISION', createdAt: '2024-03-10', creatorId: 'u3', clarificationRequest: 'Merci de fournir un devis comparatif pour le type de peinture souhaité.' },
  { id: 'REQ-2024-004', title: 'Contrôle Accès Labo', description: 'Nouveau système badge.', site: 'Pôle Cathédrale', building: 'Labo Bio', type: 'SECURITE', estimatedCost: 12000, priority: 'P3', status: 'BROUILLON', createdAt: '2024-05-01', creatorId: 'u3' }
];

export const MOCK_OPERATIONS: Operation[] = [
  { id: 'OP-24-001', requestId: 'REQ-2024-001', title: 'Rénovation Toiture Amphi A', description: 'Réfection complète étanchéité.', site: 'Campus Centre', status: 'EN_EXECUTION', managerId: 'u3', priority: 'P1', pfiCode: 'PFI-2024-TRAV-01', aeOpen: 150000, aeEngaged: 142000, cpForecast: 150000, cpPaid: 25000, startDate: '2024-03-01', endDate: '2024-12-31' }
];

export const MOCK_COFINANCERS: Cofinancer[] = [
  { id: 'COF-1', operationId: 'OP-24-001', name: 'Région Hauts-de-France', type: 'REGION', plannedAmount: 50000, grantedAmount: 45000, receivedAmount: 15000 },
  { id: 'COF-2', operationId: 'OP-24-001', name: 'Plan de Relance État', type: 'ETAT', plannedAmount: 30000, grantedAmount: 30000, receivedAmount: 0 }
];

export const MOCK_CONVENTIONS: Convention[] = [
  { id: 'CONV-1', cofinancerId: 'COF-1', operationId: 'OP-24-001', ref: '2024-REG-TRAV-01', amount: 45000, executionDeadline: '2024-12-31', justificationDeadline: '2025-06-30' }
];

export const MOCK_FINANCIAL_VERSIONS = [
  { id: 'v1', opId: 'OP-24-001', name: 'Estimation Initiale', date: '2024-01-15', author: 'Paul C.', status: 'VALIDÉ', total: 135000 },
  { id: 'v2', opId: 'OP-24-001', name: 'Recalage Études Mars', date: '2024-03-10', author: 'Paul C.', status: 'VALIDÉ', total: 150000 }
];

export const MOCK_EFP_POSTS = [
  { nature: 'Ingénierie & Études', amount: 25000, yearBreakdown: { 2024: 25000 }, color: 'bg-blue-500' },
  { nature: 'Travaux', amount: 110000, yearBreakdown: { 2024: 100000, 2025: 10000 }, color: 'bg-[#fe740e]' },
  { nature: 'Contrôles', amount: 15000, yearBreakdown: { 2024: 15000 }, color: 'bg-emerald-500' }
];

export const MOCK_SIFAC_ANOMALIES = [
  { line: 42, pfi: 'PFI-UNKNOWN-99', amount: 4500, error: 'PFI non référencé' }
];

export interface MarketItem {
  id: string;
  opId: string;
  company: string;
  amount: number;
  paid: number;
  status: 'ACTIF' | 'ARCHIVE';
  date: string;
  ref: string;
  history?: { date: string; amount: number; user: string; reason: string }[];
}

export const MOCK_MARKETS: MarketItem[] = [
  { id: 'M-1', opId: 'OP-24-001', company: 'Toiture Expert', amount: 85000, paid: 45000, status: 'ACTIF', date: '2024-04-10', ref: 'MAR-2024-A1', history: [{ date: '10/04/2024', amount: 85000, user: 'Paul C.', reason: 'Contrat initial' }] }
];
