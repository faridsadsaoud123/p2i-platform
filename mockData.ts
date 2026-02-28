import { User, RequestItem, Operation, Cofinanceur, OperationCofinanceur, Convention, FinancialEstimationVersion, EFPVersion, Prestataire } from './types';

export const MOCK_PRESTATAIRES: Prestataire[] = [
  {
    id: 'PRES-001',
    nom: 'Bati-Expert Picardie',
    siret: '12345678901234',
    adresse: '12 rue des Maçons',
    ville: 'Amiens',
    codePostal: '80000',
    contactNom: 'Jean Bâtisseur',
    contactEmail: 'jean@bati-expert.fr',
    contactTel: '03 22 11 22 33',
    specialite: 'Gros Œuvre',
    statut: 'ACTIF',
    note: 4.5,
    createdAt: '2023-01-10'
  },
  {
    id: 'PRES-002',
    nom: 'Elec-Service 80',
    siret: '98765432109876',
    adresse: '45 avenue de la Lumière',
    ville: 'Longueau',
    codePostal: '80330',
    contactNom: 'Sophie Volt',
    contactEmail: 'sophie@elec80.fr',
    contactTel: '03 22 44 55 66',
    specialite: 'Électricité',
    statut: 'ACTIF',
    note: 4.8,
    createdAt: '2023-05-15'
  },
  {
    id: 'PRES-003',
    nom: 'Peinture & Déco',
    siret: '55566677788899',
    adresse: '8 rue des Couleurs',
    ville: 'Amiens',
    codePostal: '80080',
    contactNom: 'Marc Palette',
    contactEmail: 'marc@peinture-deco.fr',
    contactTel: '03 22 77 88 99',
    specialite: 'Peinture',
    statut: 'INACTIF',
    note: 3.2,
    createdAt: '2023-11-20'
  }
];

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
  { id: 'REQ-2024-001', title: 'Rénovation Toiture Amphi A', description: 'Infiltrations constatées.', site: 'Campus Centre', building: 'Bâtiment 1', type: 'TRAVAUX', estimatedCost: 150000, priority: 'P1', status: 'VALIDE', createdAt: '2024-01-10', date_validation: '2024-02-28', creatorId: 'u3', operationId: 'OP-24-001' },
  { id: 'REQ-2024-002', title: 'Mise aux normes ascenseurs', description: 'Sécurité réglementaire.', site: 'Campus Nord', building: 'Bâtiment L', type: 'SECURITE', estimatedCost: 45000, priority: 'P2', status: 'EN_ATTENTE', createdAt: '2024-02-15', creatorId: 'u3' },
  { id: 'REQ-2024-003', title: 'Peinture Hall Accueil', description: 'Besoin de rafraîchissement esthétique.', site: 'Campus Centre', building: 'Bâtiment A', type: 'MAINTENANCE', estimatedCost: 5000, priority: 'P4', status: 'PRECISION', createdAt: '2024-03-10', creatorId: 'u3', clarificationRequest: 'Merci de fournir un devis comparatif pour le type de peinture souhaité.' },
  { id: 'REQ-2024-004', title: 'Contrôle Accès Labo', description: 'Nouveau système badge.', site: 'Pôle Cathédrale', building: 'Labo Bio', type: 'SECURITE', estimatedCost: 12000, priority: 'P3', status: 'BROUILLON', createdAt: '2024-05-01', creatorId: 'u3' }
];

export const MOCK_OPERATIONS: Operation[] = [
  { id: 'OP-24-001', requestId: 'REQ-2024-001', title: 'Rénovation Toiture Amphi A', description: 'Réfection complète étanchéité.', site: 'Campus Centre', status: 'EN_EXECUTION', managerId: 'u3', priority: 'P1', pfiCode: 'PFI-2024-TRAV-01', nacresCodes: ['NAC-01'], eotpCodes: ['EOTP-2024-A1'], aeOpen: 150000, aeEngaged: 142000, cpForecast: 150000, cpPaid: 25000, estimationInitial: 150000, startDate: '2024-03-01', endDate: '2024-12-31' },
  { id: 'OP-24-002', requestId: 'REQ-2024-002', title: 'Mise aux normes ascenseurs', description: 'Sécurité réglementaire - Ascenseurs Campus Nord.', site: 'Campus Nord', status: 'EN_CADRAGE', managerId: 'u3', priority: 'P2', pfiCode: 'PFI-2024-TRAV-02', nacresCodes: ['NAC-02'], eotpCodes: ['EOTP-2024-B1'], aeOpen: 45000, aeEngaged: 0, cpForecast: 45000, cpPaid: 0, estimationInitial: 45000, startDate: '2024-06-01', endDate: '2024-09-30' },
  { id: 'OP-24-003', title: 'Rénovation Hall Accueil Bâtiment A', description: 'Rafraîchissement esthétique et peinture.', site: 'Campus Centre', status: 'CREEE', managerId: 'u3', priority: 'P4', pfiCode: 'PFI-2024-MAIN-01', nacresCodes: [], eotpCodes: ['EOTP-2024-C1'], aeOpen: 15000, aeEngaged: 0, cpForecast: 15000, cpPaid: 0, estimationInitial: 15000, startDate: '2024-05-15', endDate: '2024-07-31' },
  { id: 'OP-24-004', title: 'Installation contrôle d\'accès Labo Bio', description: 'Nouveau système badge pour sécurité labo.', site: 'Pôle Cathédrale', status: 'AFFECTEE', managerId: 'u3', priority: 'P3', pfiCode: 'PFI-2024-SEC-01', nacresCodes: [], eotpCodes: ['EOTP-2024-D1'], aeOpen: 22000, aeEngaged: 8000, cpForecast: 22000, cpPaid: 5000, estimationInitial: 20000, startDate: '2024-07-01', endDate: '2024-10-31' }
];

export const MOCK_COFINANCEURS: Cofinanceur[] = [
  { id: 'COF-1', nom: 'Région Hauts-de-France', type: 'REGION', actif: true, createdAt: '2023-01-01', updatedAt: '2023-01-01' },
  { id: 'COF-2', nom: 'Plan de Relance État', type: 'ETAT', actif: true, createdAt: '2023-01-01', updatedAt: '2023-01-01' },
  { id: 'COF-3', nom: 'Amiens Métropole', type: 'METROPOLE', actif: true, createdAt: '2023-01-01', updatedAt: '2023-01-01' },
];

export const MOCK_OPERATION_COFINANCEURS: OperationCofinanceur[] = [
  { id: 'OC-1', operationId: 'OP-24-001', cofinanceurId: 'COF-1', montantPrevu: 50000, montantAccorde: 45000, montantRecu: 15000, statut: 'ACCORDE' },
  { id: 'OC-2', operationId: 'OP-24-001', cofinanceurId: 'COF-2', montantPrevu: 30000, montantAccorde: 30000, montantRecu: 0, statut: 'ACCORDE' }
];

export const MOCK_CONVENTIONS: Convention[] = [
  { id: 'CONV-1', operationCofinanceurId: 'OC-1', operationId: 'OP-24-001', ref: '2024-REG-TRAV-01', amount: 45000, executionDeadline: '2024-12-31', justificationDeadline: '2025-06-30' }
];

export const MOCK_FINANCIAL_VERSIONS: FinancialEstimationVersion[] = [
  { 
    id: 'v1', 
    opId: 'OP-24-001', 
    versionNumber: 1,
    name: 'Estimation Initiale', 
    date: '2024-01-15', 
    author: 'Paul C.', 
    status: 'VALIDÉ', 
    total: 135000,
    lines: [
        { year: 2024, nature: 'Études', amount: 25000 },
        { year: 2024, nature: 'Travaux', amount: 100000 },
        { year: 2024, nature: 'Contrôles', amount: 10000 },
    ]
  },
  { 
    id: 'v2', 
    opId: 'OP-24-001', 
    versionNumber: 2,
    name: 'Recalage Études Mars', 
    date: '2024-03-10', 
    author: 'Paul C.', 
    status: 'VALIDÉ', 
    total: 150000,
    comment: 'Mise à jour suite au passage en CODIR - Ajustement du poste Travaux après consultation des entreprises.',
    lines: [
        { year: 2024, nature: 'Études', amount: 25000 },
        { year: 2024, nature: 'Travaux', amount: 110000 },
        { year: 2024, nature: 'Contrôles', amount: 15000 },
    ]
  }
];

export const MOCK_EFP_VERSIONS: EFPVersion[] = [
  {
    id: 'efp-v1',
    opId: 'OP-24-001',
    versionNumber: 1,
    date: '2024-01-20',
    author: 'Paul C.',
    status: 'VALIDÉ',
    total: 135000,
    posts: [
      { nature: 'Études', amount: 25000, yearBreakdown: { 2024: 25000 }, color: 'bg-blue-500' },
      { nature: 'MOE', amount: 0, yearBreakdown: {}, color: 'bg-indigo-500' },
      { nature: 'Travaux', amount: 100000, yearBreakdown: { 2024: 100000 }, color: 'bg-[#fe740e]' },
      { nature: 'Contrôles', amount: 10000, yearBreakdown: { 2024: 10000 }, color: 'bg-emerald-500' },
      { nature: 'Divers', amount: 0, yearBreakdown: {}, color: 'bg-gray-500' }
    ]
  },
  {
    id: 'efp-v2',
    opId: 'OP-24-001',
    versionNumber: 2,
    date: '2024-03-15',
    author: 'Paul C.',
    status: 'VALIDÉ',
    total: 150000,
    comment: 'Recalage après réception des devis définitifs.',
    posts: [
      { nature: 'Études', amount: 25000, yearBreakdown: { 2024: 25000 }, color: 'bg-blue-500' },
      { nature: 'MOE', amount: 0, yearBreakdown: {}, color: 'bg-indigo-500' },
      { nature: 'Travaux', amount: 110000, yearBreakdown: { 2024: 100000, 2025: 10000 }, color: 'bg-[#fe740e]' },
      { nature: 'Contrôles', amount: 15000, yearBreakdown: { 2024: 15000 }, color: 'bg-emerald-500' },
      { nature: 'Divers', amount: 0, yearBreakdown: {}, color: 'bg-gray-500' }
    ]
  }
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
