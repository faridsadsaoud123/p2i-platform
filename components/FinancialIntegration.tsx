
import React, { useState, useMemo } from 'react';
import { MOCK_FINANCIAL_VERSIONS, MOCK_EFP_POSTS, MOCK_SIFAC_ANOMALIES, MOCK_OPERATIONS } from '../mockData';

type FinTab = 'SIFAC' | 'EFP' | 'AE_CP' | 'CONTROLS';

const FinancialIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FinTab>('SIFAC');
  const [isImporting, setIsImporting] = useState(false);
  const [importLog, setImportLog] = useState<string[]>([]);
  const [selectedVersion, setSelectedVersion] = useState(MOCK_FINANCIAL_VERSIONS[1].id);
  const [opId, setOpId] = useState('OP-24-001');

  const handleImport = () => {
    setIsImporting(true);
    setImportLog(['[INFO] Lancement import SIFAC...', '[INFO] Connexion au WebService sécurisé...', '[PROCESS] Analyse du flux JSON (256 segments)...']);
    setTimeout(() => {
      setImportLog(prev => [
        ...prev, 
        '[SUCCESS] 254 segments réconciliés automatiquement via PFI/EOTP.', 
        '[WARNING] 2 lignes rejetées (voir rapport d\'anomalies).', 
        '[INFO] Historisation de l\'import ID: SYNC_20240523_09.'
      ]);
      setIsImporting(false);
    }, 2500);
  };

  const currentOp = MOCK_OPERATIONS.find(o => o.id === opId);
  const versionData = MOCK_FINANCIAL_VERSIONS.find(v => v.id === selectedVersion);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#002E5A]">Pilotage Financier & SIFAC</h1>
          <p className="subtitle text-[#2d5a8e] mt-1 uppercase tracking-widest font-bold">Consolidation, réconciliation et suivi des enveloppes budgétaires</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={opId}
            onChange={(e) => setOpId(e.target.value)}
            className="bg-white border border-gray-200 text-[#002E5A] px-4 py-3 rounded-xl font-bold text-[10px] shadow-sm outline-none focus:ring-2 focus:ring-[#fe740e] uppercase tracking-widest"
          >
            <option value="OP-24-001">OP-24-001 - Rénovation Amphi</option>
            <option value="ALL">VUE GLOBALE PORTEFEUILLE</option>
          </select>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-gray-200 overflow-x-auto whitespace-nowrap">
        {[
          { id: 'SIFAC', label: 'Import SIFAC', icon: 'fa-sync-alt' },
          { id: 'EFP', label: 'Estimations (EFP)', icon: 'fa-file-invoice-dollar' },
          { id: 'AE_CP', label: 'Suivi AE / CP', icon: 'fa-chart-pie' },
          { id: 'CONTROLS', label: 'Contrôles Cohérence', icon: 'fa-check-double' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as FinTab)}
            className={`px-8 py-4 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 flex items-center gap-3 ${
              activeTab === tab.id 
              ? 'border-[#fe740e] text-[#fe740e]' 
              : 'border-transparent text-gray-400 hover:text-[#002E5A]'
            }`}
          >
            <i className={`fas ${tab.icon}`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[500px]">
            
            {/* TAB: SIFAC IMPORT */}
            {activeTab === 'SIFAC' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                 <div className="flex justify-between items-center bg-[#f1f3f8]/50 p-6 rounded-2xl border border-gray-100">
                    <div>
                       <h3 className="text-sm font-bold text-[#002E5A] uppercase tracking-widest">Interface de Synchronisation</h3>
                       <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">Récupération des données AE/CP/Mandats depuis SIFAC</p>
                    </div>
                    <button 
                       onClick={handleImport}
                       disabled={isImporting}
                       className={`px-8 py-4 rounded-xl font-black text-[10px] text-white uppercase tracking-widest shadow-xl transition transform active:scale-95 ${isImporting ? 'bg-gray-300' : 'bg-[#002E5A] hover:bg-[#2d5a8e]'}`}
                    >
                       {isImporting ? <i className="fas fa-spinner fa-spin mr-3"></i> : <i className="fas fa-cloud-download-alt mr-3"></i>}
                       {isImporting ? 'Chargement...' : 'Démarrer Synchronisation'}
                    </button>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#002E5A] text-white p-6 rounded-2xl shadow-xl overflow-hidden relative">
                       <p className="text-[9px] font-bold text-blue-300 uppercase tracking-widest mb-4">Console d'Exécution</p>
                       <div className="font-mono text-[10px] space-y-2 h-48 overflow-y-auto bg-black/20 p-4 rounded-xl custom-scrollbar">
                          {importLog.length === 0 ? <span className="text-blue-200 opacity-50 italic">// En attente du WebService...</span> : importLog.map((line, i) => <p key={i} className="text-blue-100"><span className="opacity-30">[{new Date().toLocaleTimeString()}]</span> {line}</p>)}
                       </div>
                    </div>
                    <div className="border border-red-100 bg-red-50 p-6 rounded-2xl">
                       <h4 className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <i className="fas fa-exclamation-circle"></i> Rapport d'erreurs (Mapping)
                       </h4>
                       <div className="space-y-3">
                          {MOCK_SIFAC_ANOMALIES.map((err, i) => (
                             <div key={i} className="bg-white p-3 rounded-xl border border-red-100 shadow-sm flex items-start gap-4 transition hover:bg-red-100/50">
                                <span className="text-[9px] font-black text-red-500 bg-red-50 px-2 py-1 rounded">L.{err.line}</span>
                                <div className="flex-1">
                                   <p className="text-[10px] font-bold text-gray-800">{err.error}</p>
                                   <p className="text-[9px] text-gray-400 font-semibold uppercase mt-1">PFI Ref: {err.pfi}</p>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {/* TAB: EFP (Estimation Versioning) */}
            {activeTab === 'EFP' && (
              <div className="animate-in fade-in duration-300 space-y-8">
                 <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                    <div>
                       <h3 className="text-sm font-bold text-[#002E5A] uppercase tracking-widest flex items-center gap-3">
                          <i className="fas fa-history text-[#fe740e]"></i> Versions de l'Estimation (EFP)
                       </h3>
                       <p className="text-[10px] text-gray-400 mt-1 italic tracking-tight">RG1 : Toute modification d’une estimation validée crée une nouvelle version.</p>
                    </div>
                    <div className="flex gap-2">
                       <select 
                          value={selectedVersion}
                          onChange={(e) => setSelectedVersion(e.target.value)}
                          className="bg-[#f1f3f8] border-none rounded-xl text-[10px] font-bold px-4 py-2 outline-none focus:ring-2 focus:ring-[#002E5A]"
                       >
                          {MOCK_FINANCIAL_VERSIONS.map(v => <option key={v.id} value={v.id}>{v.name} ({v.date})</option>)}
                       </select>
                       <button className="bg-[#fe740e] text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase shadow-lg transition hover:brightness-110">
                          <i className="fas fa-plus-circle mr-2"></i> Recalage
                       </button>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl">
                       <div className="flex gap-8">
                          <div>
                             <p className="text-[8px] font-bold text-gray-400 uppercase">Statut</p>
                             <span className={`text-[9px] font-black uppercase tracking-widest ${versionData?.status === 'VALIDÉ' ? 'text-green-600' : 'text-[#fe740e]'}`}>{versionData?.status}</span>
                          </div>
                          <div>
                             <p className="text-[8px] font-bold text-gray-400 uppercase">Auteur</p>
                             <span className="text-[9px] font-black uppercase text-[#002E5A]">{versionData?.author}</span>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[8px] font-bold text-gray-400 uppercase">Montant Total Version</p>
                          <span className="text-lg font-black text-[#002E5A]">{versionData?.total.toLocaleString()} €</span>
                       </div>
                    </div>

                    <div className="overflow-x-auto">
                       <table className="w-full text-left">
                          <thead className="bg-[#002E5A] text-white text-[9px] font-black uppercase tracking-widest">
                             <tr>
                                <th className="px-6 py-4 rounded-l-2xl">Nature du Poste</th>
                                <th className="px-6 py-4 text-center">Progression</th>
                                <th className="px-6 py-4 text-right">Ventilation 2024</th>
                                <th className="px-6 py-4 text-right">Ventilation 2025</th>
                                <th className="px-6 py-4 text-right rounded-r-2xl">Montant HT</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                             {MOCK_EFP_POSTS.map((item, i) => (
                               <tr key={i} className="group hover:bg-gray-50 transition border-b border-gray-100">
                                  <td className="px-6 py-5">
                                     <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                                        <span className="text-[10px] font-bold text-gray-700">{item.nature}</span>
                                     </div>
                                  </td>
                                  <td className="px-6 py-5">
                                     <div className="w-24 bg-gray-100 h-1.5 rounded-full overflow-hidden mx-auto shadow-inner">
                                        <div className={`${item.color} h-full rounded-full transition-all duration-700`} style={{ width: `${(item.amount / (versionData?.total || 1)) * 100}%` }}></div>
                                     </div>
                                  </td>
                                  <td className="px-6 py-5 text-right font-bold text-gray-400 text-[10px]">{(item.yearBreakdown as any)[2024]?.toLocaleString() || '-'}</td>
                                  <td className="px-6 py-5 text-right font-bold text-gray-400 text-[10px]">{(item.yearBreakdown as any)[2025]?.toLocaleString() || '-'}</td>
                                  <td className="px-6 py-5 text-right font-black text-[#002E5A] text-[10px]">{item.amount.toLocaleString()} €</td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                    <div className="p-4 bg-[#dbeafe]/30 rounded-2xl border border-blue-100 flex items-start gap-4">
                       <i className="fas fa-comment-dots text-[#2d5a8e] mt-1"></i>
                       <div>
                          <p className="text-[9px] font-bold text-[#2d5a8e] uppercase mb-1">Commentaire de version obligatoire (RG4)</p>
                          <p className="text-[10px] text-[#002E5A] italic">"Mise à jour suite au passage en CODIR - Ajustement du poste Travaux après consultation des entreprises."</p>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {/* TAB: AE / CP PLURIANNUEL */}
            {activeTab === 'AE_CP' && (
              <div className="animate-in fade-in duration-300 space-y-8">
                 <div className="flex justify-between items-center mb-6">
                    <div>
                       <h3 className="text-sm font-bold text-[#002E5A] uppercase tracking-widest">Suivi d'Exécution AE & CP</h3>
                       <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">Comparaison Prévu / Ouvert / Engagé / Mandaté</p>
                    </div>
                    <button className="text-[10px] font-bold text-[#002E5A] bg-[#f1f3f8] px-5 py-2.5 rounded-xl hover:bg-[#dbeafe] transition uppercase tracking-widest">
                       <i className="fas fa-file-export mr-2"></i> Export XLSX
                    </button>
                 </div>

                 <div className="bg-[#f1f3f8]/50 p-8 rounded-3xl space-y-8 border border-gray-100 shadow-inner">
                    <div className="flex justify-between items-end border-b border-gray-200 pb-6">
                       <div className="flex gap-12">
                          <div>
                             <p className="text-[9px] font-bold text-gray-400 uppercase mb-2">AUTORISATIONS ENGAGEMENT (AE)</p>
                             <div className="space-y-1">
                                <div className="flex justify-between w-48 text-[10px] font-bold"><span className="text-gray-400">Ouvertes</span> <span className="text-[#002E5A]">{currentOp?.aeOpen.toLocaleString()} €</span></div>
                                <div className="flex justify-between w-48 text-[10px] font-bold"><span className="text-gray-400">Engagées</span> <span className="text-[#2d5a8e]">{currentOp?.aeEngaged.toLocaleString()} €</span></div>
                                <div className="flex justify-between w-48 text-[10px] font-black border-t border-gray-200 pt-1 mt-1"><span className="text-red-500">Reste à engager</span> <span className="text-red-600">{(currentOp!.aeOpen - currentOp!.aeEngaged).toLocaleString()} €</span></div>
                             </div>
                          </div>
                          <div>
                             <p className="text-[9px] font-bold text-gray-400 uppercase mb-2">CRÉDITS PAIEMENT (CP)</p>
                             <div className="space-y-1">
                                <div className="flex justify-between w-48 text-[10px] font-bold"><span className="text-gray-400">Prévisionnels</span> <span className="text-[#fe740e]">{currentOp?.cpForecast.toLocaleString()} €</span></div>
                                <div className="flex justify-between w-48 text-[10px] font-bold"><span className="text-gray-400">Mandatés (Réel)</span> <span className="text-[#fe740e]">{currentOp?.cpPaid.toLocaleString()} €</span></div>
                                <div className="flex justify-between w-48 text-[10px] font-black border-t border-gray-200 pt-1 mt-1"><span className="text-indigo-600">Reste à payer</span> <span className="text-indigo-700">{(currentOp!.cpForecast - currentOp!.cpPaid).toLocaleString()} €</span></div>
                             </div>
                          </div>
                       </div>
                       <div className="text-center bg-[#002E5A] text-white p-4 rounded-2xl shadow-lg">
                          <p className="text-[8px] font-bold uppercase text-blue-200">Execution CP</p>
                          <p className="text-2xl font-black">{Math.round((currentOp!.cpPaid/currentOp!.cpForecast)*100)}%</p>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <h4 className="text-[10px] font-black text-[#002E5A] uppercase tracking-widest">Écart Prévu vs Réel (CP Mensuel)</h4>
                       <div className="grid grid-cols-12 gap-2">
                          {[2, 4, 8, 12, 10, 5, 0, 0, 0, 0, 0, 0].map((v, i) => (
                             <div key={i} className="flex flex-col items-center gap-2 group">
                                <div className="w-full bg-[#dbeafe] rounded-t-lg relative h-24 shadow-inner">
                                   <div className="absolute bottom-0 left-1 right-1 bg-[#fe740e] rounded-t-sm transition-all duration-1000 shadow-md group-hover:brightness-110" style={{ height: `${v * 8}%` }}></div>
                                </div>
                                <span className="text-[8px] font-bold text-gray-400 uppercase">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {/* TAB: CONTROLS & COHERENCE */}
            {activeTab === 'CONTROLS' && (
              <div className="animate-in fade-in duration-300 space-y-8">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-[#002E5A] uppercase tracking-widest">Vérifications Automatiques (P2I Engine)</h3>
                    <button className="px-6 py-2 bg-[#f1f3f8] text-[9px] font-bold rounded-xl text-[#002E5A] hover:bg-[#002E5A] hover:text-white transition uppercase tracking-widest">
                       Relancer Analyse
                    </button>
                 </div>
                 <div className="space-y-6">
                    {[
                      { 
                        id: 'RG-AE', 
                        label: 'AE Engagée ≤ AE Ouverte', 
                        desc: 'Vérifie que les engagements rattachés ne dépassent pas l\'enveloppe débloquée.', 
                        status: 'CONFORME', 
                        severity: 'OK' 
                      },
                      { 
                        id: 'RG-CP', 
                        label: 'CP Mandatés ≤ CP Ouverts', 
                        desc: 'Assure que les paiements réels restent dans les limites des crédits annuels.', 
                        status: 'CONFORME', 
                        severity: 'OK' 
                      },
                      { 
                        id: 'RG-PROJ', 
                        label: 'Cohérence Prévisions vs AE', 
                        desc: 'Alerte si la somme des CP prévus sur la durée du projet dépasse l\'AE engagée.', 
                        status: 'ALERTE : DÉPASSEMENT 2.5k€', 
                        severity: 'WARN' 
                      },
                      { 
                        id: 'RG-SIFAC', 
                        label: 'Intégrité des Codes PFI SIFAC', 
                        desc: 'Vérifie l\'existence et la stabilité des identifiants dans le WebService Finance.', 
                        status: 'CONFORME', 
                        severity: 'OK' 
                      },
                    ].map((ctrl, i) => (
                      <div key={i} className="flex flex-col md:flex-row gap-6 p-6 bg-[#f1f3f8]/30 rounded-3xl border border-gray-100 hover:bg-white hover:shadow-md transition">
                         <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center text-lg ${
                            ctrl.severity === 'OK' ? 'bg-[#d1fae5] text-green-700' : 'bg-orange-100 text-[#fe740e]'
                         }`}>
                            <i className={`fas ${ctrl.severity === 'OK' ? 'fa-check-shield' : 'fa-exclamation-triangle'}`}></i>
                         </div>
                         <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                               <p className="text-xs font-black text-[#002E5A] uppercase tracking-tighter">{ctrl.label}</p>
                               <span className="text-[8px] font-bold text-gray-300">REF: {ctrl.id}</span>
                            </div>
                            <p className="text-[10px] text-gray-400 mb-3 italic">{ctrl.desc}</p>
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                               ctrl.severity === 'OK' ? 'bg-[#d1fae5]/50 text-green-700 border-green-200' : 'bg-orange-50 text-[#fe740e] border-orange-200'
                            }`}>
                               {ctrl.status}
                            </span>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR KPI: FINANCIAL DASHBOARD */}
        <div className="space-y-8">
           <div className="bg-[#002E5A] text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col justify-between h-96 group">
              <div className="absolute -top-12 -right-12 p-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
                <i className="fas fa-gem fa-9x -rotate-12"></i>
              </div>
              <div className="relative z-10">
                 <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-2">Exercice Budgétaire 2024</p>
                 <h2 className="text-4xl font-black tracking-tight">42.50 <span className="text-lg text-blue-400 font-bold uppercase">M€</span></h2>
                 <p className="text-[10px] text-blue-300 mt-2 italic font-medium opacity-80 underline underline-offset-4 decoration-blue-500/30">Total AE Enveloppe P2I</p>
              </div>
              
              <div className="relative z-10 space-y-6">
                 <div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-3">
                       <span>Consommation AE</span>
                       <span className="text-white">72%</span>
                    </div>
                    <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden shadow-inner border border-white/5">
                       <div className="bg-[#fe740e] h-full rounded-full shadow-lg transition-all duration-[1500ms] relative" style={{ width: '72%' }}>
                          <div className="absolute top-0 right-0 w-1 h-full bg-white/30"></div>
                       </div>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                    <div>
                       <p className="text-[9px] font-bold text-blue-400 uppercase mb-2 tracking-widest">Engagé</p>
                       <p className="text-lg font-black tracking-tight">28.4 <span className="text-xs font-bold text-blue-300">M€</span></p>
                    </div>
                    <div>
                       <p className="text-[9px] font-bold text-blue-400 uppercase mb-2 tracking-widest">Reliquat</p>
                       <p className="text-lg font-black tracking-tight">14.1 <span className="text-xs font-bold text-blue-300">M€</span></p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
              <h3 className="text-[10px] font-bold text-[#002E5A] uppercase tracking-widest mb-6 flex items-center gap-3 border-b border-gray-50 pb-4">
                 <i className="fas fa-shield-alt text-[#fe740e] text-lg"></i> Alertes Stratégiques
              </h3>
              <div className="space-y-5">
                 <div className="p-5 bg-red-50 rounded-[20px] border border-red-100 flex gap-5 group cursor-pointer hover:bg-red-100/50 transition">
                    <div className="w-10 h-10 rounded-2xl bg-[#ff3131] text-white flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition">
                       <i className="fas fa-chart-line"></i>
                    </div>
                    <div>
                       <p className="text-[11px] font-black text-[#ff3131] uppercase tracking-tighter">Dépassement AE</p>
                       <p className="text-[10px] text-red-800/70 mt-1 leading-relaxed italic">L'opération OP-24-001 dépasse son enveloppe de <span className="font-black">2.5k€</span> après recalage études.</p>
                    </div>
                 </div>
                 <div className="p-5 bg-orange-50 rounded-[20px] border border-orange-100 flex gap-5 group cursor-pointer hover:bg-orange-100/50 transition">
                    <div className="w-10 h-10 rounded-2xl bg-[#fe740e] text-white flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition">
                       <i className="fas fa-hourglass-half"></i>
                    </div>
                    <div>
                       <p className="text-[11px] font-black text-[#fe740e] uppercase tracking-tighter">Sous-conso CP</p>
                       <p className="text-[10px] text-orange-800/70 mt-1 leading-relaxed italic"><span className="font-black">30k€</span> de CP prévus en Mai n'ont pas encore généré de mandats SIFAC.</p>
                    </div>
                 </div>
              </div>
              <button className="w-full mt-8 py-4 bg-[#f1f3f8] text-[#002E5A] text-[10px] font-black rounded-2xl hover:bg-[#dbeafe] transition uppercase tracking-widest shadow-sm">
                 Analyse Détaillée <i className="fas fa-arrow-right ml-2"></i>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialIntegration;
