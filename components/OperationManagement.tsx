
import React, { useState } from 'react';
import { MOCK_OPERATIONS, MOCK_MARKETS, MOCK_COFINANCERS, MOCK_CONVENTIONS, MarketItem } from '../mockData';
import { STATUS_COLORS, PRIORITY_COLORS } from '../constants';
import { Cofinancer, Convention } from '../types';

const OperationManagement: React.FC = () => {
  const [selectedOpId, setSelectedOpId] = useState<string | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'CYCLE' | 'MARKETS' | 'COFINANCERS' | 'CONVENTIONS'>('CYCLE');
  const [showMarketModal, setShowMarketModal] = useState(false);
  const [editingMarket, setEditingMarket] = useState<MarketItem | null>(null);

  const selectedOp = MOCK_OPERATIONS.find(o => o.id === selectedOpId);

  const checkConventionAlert = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days <= 30 && days >= 0;
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 font-medium">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#002E5A]">Suivi des Opérations PPI</h1>
          <p className="subtitle text-[#2d5a8e] mt-1 uppercase tracking-widest font-bold">Répertoire opérationnel et pilotage budgétaire</p>
        </div>
        <button className="bg-white border border-gray-200 text-[#002E5A] px-4 py-3 rounded-xl flex items-center font-bold text-xs shadow-sm hover:bg-gray-50 transition-all uppercase tracking-widest">
          <i className="fas fa-search mr-2 text-[#fe740e]"></i> Recherche multicritères
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {MOCK_OPERATIONS.map((op) => (
          <div key={op.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="flex flex-col lg:flex-row">
               <div className="lg:w-80 bg-[#f1f3f8]/50 p-8 border-r border-gray-100 flex flex-col">
                  <div className="flex items-center gap-2 mb-6">
                     <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter bg-white shadow-sm border border-gray-100 text-[#002E5A]">{op.id}</span>
                     <span className={`px-4 py-1 rounded-full text-[10px] font-black shadow-sm ${STATUS_COLORS[op.status]}`}>{op.status.replace('_', ' ')}</span>
                  </div>
                  <div className="space-y-4">
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-1">Référentiel SIFAC</p>
                     <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-400">PFI</span>
                        <span className="text-[10px] font-black text-[#002E5A]">{op.pfiCode}</span>
                     </div>
                  </div>
               </div>

               <div className="flex-1 p-8">
                  <div className="flex justify-between items-start mb-8">
                     <div>
                        <h3 className="text-lg font-bold text-[#002E5A] leading-tight mb-2 uppercase tracking-tight">{op.title}</h3>
                        <p className="text-[11px] text-gray-500 line-clamp-2 italic font-medium">{op.description}</p>
                     </div>
                     <button onClick={() => {setSelectedOpId(op.id); setActiveDetailTab('CYCLE');}} className="bg-[#f1f3f8] text-[#002E5A] px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#dbeafe] transition shadow-sm">Détails & Finance</button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                       <div className="flex justify-between items-end">
                          <p className="text-[9px] font-black text-[#2d5a8e] uppercase tracking-widest">Autorisations Engagement</p>
                          <span className="text-xs font-black text-[#002E5A]">{Math.round((op.aeEngaged/op.aeOpen)*100)}%</span>
                       </div>
                       <div className="w-full bg-[#f1f3f8] h-3 rounded-full overflow-hidden shadow-inner"><div className="h-full bg-[#002E5A] rounded-full transition-all duration-1000" style={{ width: `${(op.aeEngaged/op.aeOpen)*100}%` }}></div></div>
                    </div>
                    <div className="space-y-3">
                       <div className="flex justify-between items-end">
                          <p className="text-[9px] font-black text-[#fe740e] uppercase tracking-widest">Consommation CP</p>
                          <span className="text-xs font-black text-[#fe740e]">{Math.round((op.cpPaid/op.cpForecast)*100)}%</span>
                       </div>
                       <div className="w-full bg-[#f1f3f8] h-3 rounded-full overflow-hidden shadow-inner"><div className="h-full bg-[#fe740e] rounded-full transition-all duration-1000" style={{ width: `${(op.cpPaid/op.cpForecast)*100}%` }}></div></div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Detail */}
      {selectedOpId && selectedOp && (
        <div className="fixed inset-0 z-50 flex justify-end p-0 bg-[#002E5A]/40 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white w-full max-w-5xl h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
            <div className="p-8 bg-[#002E5A] text-white flex justify-between items-start shrink-0">
               <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] bg-[#fe740e] text-white px-3 py-1 rounded-lg font-bold uppercase tracking-widest">{selectedOp.id}</span>
                    <h2 className="text-xl font-bold uppercase">{selectedOp.title}</h2>
                  </div>
                  <p className="subtitle text-blue-200 uppercase tracking-widest italic">{selectedOp.pfiCode} • {selectedOp.site}</p>
               </div>
               <button onClick={() => setSelectedOpId(null)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"><i className="fas fa-times"></i></button>
            </div>

            {/* Sidebar Tabs */}
            <div className="flex border-b border-gray-100 bg-[#f1f3f8]/30 px-8 shrink-0">
               {[
                 { id: 'CYCLE', label: 'Cycle & Historique', icon: 'fa-history' },
                 { id: 'MARKETS', label: 'Marchés Publics', icon: 'fa-file-contract' },
                 { id: 'COFINANCERS', label: 'Cofinancement', icon: 'fa-hand-holding-usd' },
                 { id: 'CONVENTIONS', label: 'Conventions', icon: 'fa-file-signature' },
               ].map(tab => (
                 <button key={tab.id} onClick={() => setActiveDetailTab(tab.id as any)} className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-4 flex items-center gap-2 ${activeDetailTab === tab.id ? 'border-[#fe740e] text-[#fe740e]' : 'border-transparent text-gray-400 hover:text-[#002E5A]'}`}>
                   <i className={`fas ${tab.icon}`}></i> {tab.label}
                 </button>
               ))}
            </div>

            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-12">
               {activeDetailTab === 'CYCLE' && (
                  <section className="animate-in fade-in duration-300">
                     <div className="relative pl-12 border-l-2 border-gray-100 space-y-12">
                        {[
                          { date: '10/04/2024', user: 'Paul C.', title: 'Passage en Exécution', desc: 'Notification des marchés et validation AE.' },
                          { date: '15/03/2024', user: 'Paul C.', title: 'Saisie de l\'EFP v1', desc: 'Définition des postes de dépense initiaux.' },
                          { date: '01/03/2024', user: 'Système', title: 'Opération Créée', desc: 'Transformation depuis REQ-2024-001.' },
                        ].map((h, i) => (
                           <div key={i} className="relative">
                              <div className="absolute -left-[57px] top-0 w-4 h-4 rounded-full bg-white border-4 border-[#002E5A] shadow-sm"></div>
                              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                 <div className="flex justify-between items-center mb-2">
                                    <h5 className="text-xs font-black text-[#002E5A] uppercase">{h.title}</h5>
                                    <span className="text-[10px] font-bold text-gray-400">{h.date}</span>
                                 </div>
                                 <p className="text-[11px] text-gray-600 font-medium italic mb-2">"{h.desc}"</p>
                                 <span className="text-[9px] font-black text-[#fe740e] uppercase">— {h.user}</span>
                              </div>
                           </div>
                        ))}
                     </div>
                  </section>
               )}

               {activeDetailTab === 'MARKETS' && (
                 <section className="animate-in fade-in duration-300 space-y-6">
                    <div className="flex justify-between items-center">
                       <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Marchés rattachés à l'opération</h4>
                       <button className="bg-[#fe740e] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg transition hover:brightness-110"><i className="fas fa-plus mr-2"></i> Nouveau Marché</button>
                    </div>
                    {MOCK_MARKETS.filter(m => m.opId === selectedOpId).map(market => (
                      <div key={market.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md transition group">
                         <div className="flex gap-6 items-center">
                            <div className="w-12 h-12 bg-blue-50 text-[#002E5A] rounded-2xl flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition"><i className="fas fa-building"></i></div>
                            <div>
                               <p className="text-xs font-black text-[#002E5A] uppercase">{market.company}</p>
                               <p className="text-[10px] text-gray-400 font-bold mt-1">Réf: {market.ref} • {market.date}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-sm font-black text-[#fe740e]">{market.amount.toLocaleString()} €</p>
                            <button onClick={() => setEditingMarket(market)} className="text-[9px] font-black text-gray-400 uppercase mt-2 hover:text-[#002E5A] transition">Modifier / Avenant</button>
                         </div>
                      </div>
                    ))}
                 </section>
               )}

               {activeDetailTab === 'COFINANCERS' && (
                 <section className="animate-in fade-in duration-300 space-y-8">
                    <div className="flex justify-between items-center">
                       <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Financeurs Externes (Rule 6.1)</h4>
                       <button className="bg-[#002E5A] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg transition hover:brightness-110"><i className="fas fa-plus mr-2"></i> Ajouter Financeur</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {MOCK_COFINANCERS.filter(c => c.operationId === selectedOpId).map(cof => (
                         <div key={cof.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition flex flex-col gap-4 relative">
                            <button className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition"><i className="fas fa-trash-alt text-xs"></i></button>
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-2xl bg-[#f1f3f8] text-[#2d5a8e] flex items-center justify-center text-lg"><i className="fas fa-landmark"></i></div>
                               <div>
                                  <p className="text-[10px] font-black text-[#002E5A] uppercase tracking-tighter">{cof.name}</p>
                                  <span className="text-[8px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-black uppercase">{cof.type}</span>
                               </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                               <div>
                                  <p className="text-[8px] font-bold text-gray-400 uppercase">Accordé</p>
                                  <p className="text-xs font-black text-[#002E5A]">{cof.grantedAmount.toLocaleString()} €</p>
                               </div>
                               <div>
                                  <p className="text-[8px] font-bold text-gray-400 uppercase">Reçu</p>
                                  <p className="text-xs font-black text-emerald-600">{cof.receivedAmount.toLocaleString()} €</p>
                               </div>
                            </div>
                            <div className="w-full bg-[#f1f3f8] h-1.5 rounded-full overflow-hidden">
                               <div className="bg-emerald-500 h-full" style={{ width: `${(cof.receivedAmount/cof.grantedAmount)*100}%` }}></div>
                            </div>
                            <div className="flex justify-between items-center text-[9px] font-black text-gray-400">
                               <span>Reste à recevoir</span>
                               <span className="text-red-500">{(cof.grantedAmount - cof.receivedAmount).toLocaleString()} €</span>
                            </div>
                         </div>
                       ))}
                    </div>
                 </section>
               )}

               {activeDetailTab === 'CONVENTIONS' && (
                 <section className="animate-in fade-in duration-300 space-y-8">
                    <div className="flex justify-between items-center">
                       <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Suivi des Conventions (Rule 6.5)</h4>
                       <button className="bg-[#fe740e] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg hover:brightness-110 transition"><i className="fas fa-plus mr-2"></i> Enregistrer Convention</button>
                    </div>
                    <div className="space-y-4">
                       {MOCK_CONVENTIONS.filter(conv => conv.operationId === selectedOpId).map(conv => (
                         <div key={conv.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                            <div className="flex justify-between items-start mb-6">
                               <div>
                                  <p className="text-[10px] font-black text-[#002E5A] uppercase tracking-widest mb-1">Ref: {conv.ref}</p>
                                  <p className="text-xs font-bold text-gray-500">Montant conventionné : <span className="text-[#002E5A]">{conv.amount.toLocaleString()} €</span></p>
                               </div>
                               <button className="text-[9px] font-black text-[#2d5a8e] bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100 transition uppercase">Modifier</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                               <div className={`p-4 rounded-2xl border-l-4 ${checkConventionAlert(conv.executionDeadline) ? 'bg-red-50 border-red-500' : 'bg-[#f1f3f8]/50 border-[#002E5A]'}`}>
                                  <div className="flex items-center justify-between">
                                     <p className="text-[9px] font-black text-gray-400 uppercase mb-2">Échéance Exécution</p>
                                     {checkConventionAlert(conv.executionDeadline) && <i className="fas fa-exclamation-circle text-red-500 animate-pulse"></i>}
                                  </div>
                                  <p className={`text-xs font-black ${checkConventionAlert(conv.executionDeadline) ? 'text-red-600' : 'text-[#002E5A]'}`}>{new Date(conv.executionDeadline).toLocaleDateString('fr-FR')}</p>
                                  {checkConventionAlert(conv.executionDeadline) && <p className="text-[8px] font-bold text-red-500 uppercase mt-1 italic tracking-tight">Alerte : Moins de 30 jours restants !</p>}
                               </div>
                               <div className="p-4 rounded-2xl bg-[#f1f3f8]/50 border-l-4 border-emerald-500">
                                  <p className="text-[9px] font-black text-gray-400 uppercase mb-2">Échéance Justification</p>
                                  <p className="text-xs font-black text-emerald-700">{new Date(conv.justificationDeadline).toLocaleDateString('fr-FR')}</p>
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </section>
               )}
            </div>

            <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 shrink-0">
               <button className="px-8 py-4 bg-[#ff3131] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:brightness-110 transition">Suspendre le projet</button>
               <button className="px-8 py-4 bg-[#002E5A] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:brightness-110 transition">Valider Changements</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperationManagement;
