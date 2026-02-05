
import React from 'react';

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrateur',
  DIRECTION: 'Direction',
  CHEF_SERVICE: 'Chef de Service',
  CHARGE_OPERATION: "Chargé d'Opération",
  DEMANDEUR: 'Demandeur'
};

export const STATUS_COLORS: Record<string, string> = {
  // Requests
  BROUILLON: 'bg-gray-100 text-gray-800',
  EN_ATTENTE: 'bg-[#fe740e]/10 text-[#fe740e]',
  VALIDE: 'bg-[#d1fae5] text-green-800',
  REJETE: 'bg-[#ff3131]/10 text-[#ff3131]',
  PRECISION: 'bg-[#dbeafe] text-[#2d5a8e]',
  
  // Operations
  CREEE: 'bg-slate-100 text-slate-700',
  AFFECTEE: 'bg-blue-50 text-[#002E5A]',
  EN_CADRAGE: 'bg-indigo-50 text-indigo-700',
  EN_EXECUTION: 'bg-orange-50 text-[#fe740e]',
  CLOTUREE: 'bg-emerald-50 text-emerald-700',
  SUSPENDUE: 'bg-rose-50 text-[#ff3131]'
};

export const PRIORITY_COLORS: Record<string, string> = {
  CRITIQUE: 'bg-[#ff3131] text-white',
  HAUTE: 'bg-[#fe740e] text-white',
  MOYENNE: 'bg-[#2d5a8e] text-white',
  BASSE: 'bg-gray-400 text-white'
};

export const THEME = {
  primary: '#002E5A',
  secondary: '#fe740e',
  accent: '#2d5a8e',
  danger: '#ff3131',
  info: '#dbeafe',
  success: '#d1fae5',
  neutral: '#f1f3f8'
};
