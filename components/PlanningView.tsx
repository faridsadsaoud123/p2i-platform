
import React, { useState, useContext } from 'react';
import { DataContext } from './DataContext';
import { Operation } from '../types';

const PlanningView: React.FC = () => {
  const dataContext = useContext(DataContext);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
  
  if (!dataContext) {
    return <div>Erreur: Contexte de données non disponible</div>;
  }

  const { operations } = dataContext;
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
  
  const phases = [
    { name: 'Programmation', color: 'bg-[#002E5A]', start: 0, length: 2 },
    { name: 'Études & MOE', color: 'bg-[#2d5a8e]', start: 2, length: 3 },
    { name: 'Consultation', color: 'bg-[#fe740e]', start: 5, length: 2 },
    { name: 'Travaux', color: 'bg-indigo-600', start: 7, length: 4 },
    { name: 'Réception', color: 'bg-emerald-500', start: 11, length: 1 },
  ];

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'CREEE': 'bg-gray-100 text-gray-700',
      'AFFECTEE': 'bg-blue-100 text-blue-700',
      'EN_CADRAGE': 'bg-indigo-100 text-indigo-700',
      'EN_EXECUTION': 'bg-orange-100 text-orange-700',
      'SUIVI_FINAL': 'bg-green-100 text-green-700',
      'CLOTUREE': 'bg-emerald-100 text-emerald-700',
      'SUSPENDUE': 'bg-red-100 text-red-700',
      'REPORTEE': 'bg-yellow-100 text-yellow-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'P1': 'bg-red-100 text-red-700',
      'P2': 'bg-orange-100 text-orange-700',
      'P3': 'bg-yellow-100 text-yellow-700',
      'P4': 'bg-green-100 text-green-700'
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  // Si aucune opération n'est sélectionnée, afficher la liste
  if (!selectedOperation) {
    return (
      <div className="space-y-8 animate-in zoom-in-95 duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#002E5A]">Planning & Flux de Trésorerie</h1>
            <p className="subtitle text-[#2d5a8e] mt-1 uppercase tracking-widest font-bold">Sélectionnez une opération pour voir son planning</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-[#002E5A] uppercase tracking-widest mb-6">Opérations Disponibles</h2>
          
          <div className="grid gap-4">
            {operations.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <i className="fas fa-inbox text-4xl mb-4 block"></i>
                <p>Aucune opération disponible</p>
              </div>
            ) : (
              operations.map(op => (
                <div
                  key={op.id}
                  onClick={() => setSelectedOperation(op)}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-[#fe740e] hover:shadow-lg transition-all cursor-pointer bg-gradient-to-r from-white to-[#f1f3f8]/30"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-[#002E5A]">{op.id}</h3>
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase ${getStatusColor(op.status)}`}>
                          {op.status.replace(/_/g, ' ')}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase ${getPriorityColor(op.priority)}`}>
                          {op.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 font-semibold mb-3">{op.title}</p>
                      <p className="text-xs text-gray-500 mb-4">{op.description}</p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[10px]">
                        <div>
                          <span className="text-gray-500 uppercase font-bold">Site</span>
                          <p className="text-[#002E5A] font-bold">{op.site}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 uppercase font-bold">Début</span>
                          <p className="text-[#002E5A] font-bold">{formatDate(op.startDate)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 uppercase font-bold">Fin</span>
                          <p className="text-[#002E5A] font-bold">{formatDate(op.endDate)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 uppercase font-bold">Montant Total</span>
                          <p className="text-[#002E5A] font-bold">{(op.cpForecast / 1000).toFixed(1)}k€</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-[#fe740e] text-2xl">
                      <i className="fas fa-chevron-right"></i>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // Affichage du planning détaillé de l'opération sélectionnée
  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => setSelectedOperation(null)}
              className="flex items-center gap-2 text-[#002E5A] hover:text-[#fe740e] transition-colors font-bold text-sm"
            >
              <i className="fas fa-arrow-left"></i> Retour à la liste
            </button>
          </div>
          <h1 className="text-2xl font-bold text-[#002E5A]">Planning & Flux de Trésorerie</h1>
          <p className="subtitle text-[#2d5a8e] mt-1 uppercase tracking-widest font-bold">{selectedOperation.id} - {selectedOperation.title}</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-[#fe740e] hover:bg-[#d9630c] text-white px-6 py-3 rounded-xl flex items-center font-bold text-xs shadow-xl transition-all">
            <i className="fas fa-save mr-2"></i> SAUVEGARDER
          </button>
        </div>
      </div>


      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-sm font-bold text-[#002E5A] uppercase tracking-widest">Jalons Opérationnels (Gantt Macro)</h2>
           <div className="flex gap-4">
              <span className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400"><div className="w-2 h-2 rounded-full bg-[#002E5A]"></div> ÉTUDES</span>
              <span className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400"><div className="w-2 h-2 rounded-full bg-[#fe740e]"></div> TRAVAUX</span>
           </div>
        </div>
        
        <div className="relative mt-4">
          <div className="flex border-b border-gray-100 pb-4">
            <div className="w-56 flex-shrink-0 text-[10px] font-bold text-[#002E5A] uppercase tracking-widest">Phase / Phase</div>
            <div className="flex-1 grid grid-cols-12 gap-0">
              {months.map(m => (
                <div key={m} className="text-center text-[9px] font-extrabold text-gray-300 uppercase">{m}</div>
              ))}
            </div>
          </div>

          <div className="space-y-6 py-6">
            {phases.map(phase => (
              <div key={phase.name} className="flex items-center group">
                <div className="w-56 flex-shrink-0 text-xs font-bold text-gray-600 group-hover:text-[#002E5A] transition-colors">{phase.name}</div>
                <div className="flex-1 grid grid-cols-12 gap-0 h-10 relative bg-[#f1f3f8]/30 rounded-xl overflow-hidden shadow-inner border border-gray-50/50">
                   <div 
                    className={`absolute top-1.5 bottom-1.5 ${phase.color} rounded-lg shadow-xl flex items-center justify-center text-[9px] text-white font-bold transition-all hover:brightness-110 cursor-pointer border border-white/10`}
                    style={{ 
                      left: `${(phase.start / 12) * 100}%`, 
                      width: `${(phase.length / 12) * 100}%` 
                    }}
                   >
                    <span className="truncate px-2">{phase.length} MOIS</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="absolute top-0 bottom-0 left-56 right-0 pointer-events-none flex opacity-40">
             {Array.from({length: 12}).map((_, i) => (
               <div key={i} className="flex-1 border-l border-dashed border-gray-200 h-full"></div>
             ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-sm font-bold text-[#002E5A] uppercase tracking-widest">Projection Mensuelle des CP (k€)</h2>
           <div className="bg-[#dbeafe] px-4 py-2 rounded-xl text-[9px] font-bold text-[#2d5a8e] flex items-center">
              <i className="fas fa-exclamation-triangle mr-2"></i> AJUSTEMENTS MANUELS AUTORISÉS
           </div>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-center border-separate border-spacing-x-1">
              <thead className="bg-[#f1f3f8]">
                <tr>
                   <th className="px-6 py-5 text-left font-bold text-[#002E5A] text-[10px] uppercase rounded-l-xl">Nature</th>
                   {months.map(m => <th key={m} className="px-3 py-5 text-[9px] font-extrabold text-gray-400 uppercase tracking-tighter">{m}</th>)}
                   <th className="px-6 py-5 font-bold text-[#002E5A] text-[10px] uppercase rounded-r-xl">Total OP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5 text-left text-xs font-bold text-gray-600">INGÉNIERIE & ÉTUDES</td>
                  {Array.from({length: 12}).map((_, i) => (
                    <td key={i} className="px-3 py-5"><input type="number" defaultValue={i < 4 ? 5 : 0} className="w-14 text-center text-xs font-bold border-none bg-[#f1f3f8] rounded-lg py-2 focus:ring-2 focus:ring-[#002E5A] outline-none" /></td>
                  ))}
                  <td className="px-6 py-5 text-xs font-extrabold text-[#002E5A]">20.00</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5 text-left text-xs font-bold text-gray-600">TRAVAUX & MATÉRIELS</td>
                  {Array.from({length: 12}).map((_, i) => (
                    <td key={i} className="px-3 py-5"><input type="number" defaultValue={i > 6 ? 25 : 0} className="w-14 text-center text-xs font-bold border-none bg-[#f1f3f8] rounded-lg py-2 focus:ring-2 focus:ring-[#002E5A] outline-none" /></td>
                  ))}
                  <td className="px-6 py-5 text-xs font-extrabold text-[#002E5A]">125.00</td>
                </tr>
                <tr className="bg-[#002E5A] text-white rounded-xl overflow-hidden">
                   <td className="px-6 py-5 text-left font-bold text-[10px] uppercase tracking-widest rounded-l-2xl shadow-xl">TOTAL MENSUEL</td>
                   {months.map((_, i) => (
                     <td key={i} className="px-3 py-5 font-extrabold text-xs">{(i < 4 ? 5 : i > 6 ? 25 : 0)}</td>
                   ))}
                   <td className="px-6 py-5 font-black text-xs bg-[#fe740e] rounded-r-2xl shadow-xl">145.00</td>
                </tr>
              </tbody>
           </table>
        </div>
        <div className="mt-8 p-6 bg-[#f1f3f8]/50 rounded-2xl border border-gray-100 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#fe740e] shadow-sm">
             <i className="fas fa-info-circle"></i>
          </div>
          <div>
             <p className="text-[10px] font-bold text-[#002E5A] uppercase tracking-wider mb-1">Impact sur le Fonds de Roulement</p>
             <p className="text-[10px] text-gray-500 leading-relaxed italic">
                Ces prévisions sont consolidées mensuellement par la Direction des Finances pour le pilotage de la trésorerie de l'Université.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanningView;