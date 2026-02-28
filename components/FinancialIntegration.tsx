
import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_FINANCIAL_VERSIONS, MOCK_EFP_VERSIONS, MOCK_SIFAC_ANOMALIES, MOCK_OPERATIONS } from '../mockData';
import { FinancialEstimationVersion, EFPVersion, FinancialEstimationLine, EFPPost } from '../types';
import { useNotification } from './NotificationSystem';

type FinTab = 'SIFAC' | 'EFP' | 'AE_CP' | 'CONTROLS';

const FinancialIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FinTab>('SIFAC');
  const [isImporting, setIsImporting] = useState(false);
  const [importLog, setImportLog] = useState<string[]>([]);
  const [estimations, setEstimations] = useState<FinancialEstimationVersion[]>(MOCK_FINANCIAL_VERSIONS);
  const [efpVersions, setEfpVersions] = useState<EFPVersion[]>(MOCK_EFP_VERSIONS);
  const [selectedVersion, setSelectedVersion] = useState(MOCK_FINANCIAL_VERSIONS[MOCK_FINANCIAL_VERSIONS.length - 1].id);
  const [selectedEFPVersion, setSelectedEFPVersion] = useState(MOCK_EFP_VERSIONS[MOCK_EFP_VERSIONS.length - 1].id);
  const [opId, setOpId] = useState('OP-24-001');
  const { showNotification } = useNotification();

  // Modal states
  const [showEstimationModal, setShowEstimationModal] = useState(false);
  const [showEFPModal, setShowEFPModal] = useState(false);
  const [showAnnualBreakdownDrawer, setShowAnnualBreakdownDrawer] = useState<number | null>(null); // index of post

  // Form states
  const [estimationForm, setEstimationForm] = useState<{
    name: string;
    comment: string;
    lines: FinancialEstimationLine[];
  }>({
    name: '',
    comment: '',
    lines: [{ year: 2024, nature: 'Travaux', amount: 0 }]
  });

  const [efpForm, setEfpForm] = useState<{
    comment: string;
    posts: EFPPost[];
    annualBreakdownEnabled: boolean;
  }>({
    comment: '',
    posts: [
      { nature: 'Études', amount: 0, yearBreakdown: {}, color: 'bg-blue-500' },
      { nature: 'MOE', amount: 0, yearBreakdown: {}, color: 'bg-indigo-500' },
      { nature: 'Travaux', amount: 0, yearBreakdown: {}, color: 'bg-[#fe740e]' },
      { nature: 'Contrôles', amount: 0, yearBreakdown: {}, color: 'bg-emerald-500' },
      { nature: 'Divers', amount: 0, yearBreakdown: {}, color: 'bg-gray-500' }
    ],
    annualBreakdownEnabled: false
  });

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
  const versionData = estimations.find(v => v.id === selectedVersion);
  const currentEFPVersion = efpVersions.find(v => v.id === selectedEFPVersion);

  // Estimation Handlers
  const handleOpenEstimationModal = () => {
    const nextVersion = estimations.length + 1;
    setEstimationForm({
      name: `Révision ${nextVersion}`,
      comment: '',
      lines: versionData ? [...versionData.lines] : [{ year: 2024, nature: 'Travaux', amount: 0 }]
    });
    setShowEstimationModal(true);
  };

  const handleSaveEstimation = (status: 'BROUILLON' | 'VALIDÉ') => {
    // Validation
    if (!estimationForm.name) {
      showNotification('Le nom de la version est obligatoire.', 'error');
      return;
    }
    if (estimations.length > 0 && !estimationForm.comment) {
      showNotification('Le commentaire de justification est obligatoire pour une révision.', 'error');
      return;
    }
    for (const line of estimationForm.lines) {
      if (line.amount < 0) {
        showNotification('Les montants doivent être positifs.', 'error');
        return;
      }
      if (!line.nature || !line.year) {
        showNotification('Tous les champs des lignes sont obligatoires.', 'error');
        return;
      }
    }

    const total = estimationForm.lines.reduce((acc, curr) => acc + curr.amount, 0);
    const nextVersionNum = estimations.length + 1;
    const newVersion: FinancialEstimationVersion = {
      id: `v${nextVersionNum}`,
      opId: opId,
      versionNumber: nextVersionNum,
      name: estimationForm.name,
      date: new Date().toISOString().split('T')[0],
      author: 'Paul C.',
      status,
      total,
      comment: estimationForm.comment,
      lines: estimationForm.lines
    };

    setEstimations(prev => [...prev, newVersion]);
    setSelectedVersion(newVersion.id);
    setShowEstimationModal(false);
    showNotification(`Nouvelle estimation ${status === 'VALIDÉ' ? 'validée' : 'enregistrée en brouillon'}.`);
  };

  // EFP Handlers
  const handleOpenEFPModal = () => {
    const nextVersion = efpVersions.length + 1;
    setEfpForm({
      comment: '',
      posts: currentEFPVersion ? JSON.parse(JSON.stringify(currentEFPVersion.posts)) : [
        { nature: 'Études', amount: 0, yearBreakdown: {}, color: 'bg-blue-500' },
        { nature: 'MOE', amount: 0, yearBreakdown: {}, color: 'bg-indigo-500' },
        { nature: 'Travaux', amount: 0, yearBreakdown: {}, color: 'bg-[#fe740e]' },
        { nature: 'Contrôles', amount: 0, yearBreakdown: {}, color: 'bg-emerald-500' },
        { nature: 'Divers', amount: 0, yearBreakdown: {}, color: 'bg-gray-500' }
      ],
      annualBreakdownEnabled: false
    });
    setShowEFPModal(true);
  };

  const handleSaveEFP = (status: 'BROUILLON' | 'VALIDÉ') => {
    // Validation
    const travauxPost = efpForm.posts.find(p => p.nature === 'Travaux');
    if (!travauxPost || travauxPost.amount <= 0) {
      showNotification('Le poste Travaux est obligatoire et doit être supérieur à 0.', 'error');
      return;
    }
    if (efpVersions.length > 0 && !efpForm.comment) {
      showNotification('Le commentaire de recalage est obligatoire pour une révision.', 'error');
      return;
    }
    for (const post of efpForm.posts) {
      if (post.amount < 0) {
        showNotification('Les montants doivent être positifs.', 'error');
        return;
      }
    }

    const total = efpForm.posts.reduce((acc, curr) => acc + curr.amount, 0);
    const nextVersionNum = efpVersions.length + 1;
    const newVersion: EFPVersion = {
      id: `efp-v${nextVersionNum}`,
      opId: opId,
      versionNumber: nextVersionNum,
      date: new Date().toISOString().split('T')[0],
      author: 'Paul C.',
      status,
      total,
      comment: efpForm.comment,
      posts: efpForm.posts
    };

    setEfpVersions(prev => [...prev, newVersion]);
    setSelectedEFPVersion(newVersion.id);
    setShowEFPModal(false);
    showNotification(`Nouvelle version EFP ${status === 'VALIDÉ' ? 'validée' : 'enregistrée en brouillon'}.`);
  };

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
              <div className="animate-in fade-in duration-300 space-y-12">
                 {/* SECTION 1: ESTIMATION FINANCIERE */}
                 <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-6">
                       <div>
                          <h3 className="text-sm font-bold text-[#002E5A] uppercase tracking-widest flex items-center gap-3">
                             <i className="fas fa-history text-[#fe740e]"></i> Versions de l'Estimation Financière
                          </h3>
                          <p className="text-[10px] text-gray-400 mt-1 italic tracking-tight">RG1 : Toute modification d’une estimation validée crée une nouvelle version.</p>
                       </div>
                       <div className="flex gap-2">
                          <select 
                             value={selectedVersion}
                             onChange={(e) => setSelectedVersion(e.target.value)}
                             className="bg-[#f1f3f8] border-none rounded-xl text-[10px] font-bold px-4 py-2 outline-none focus:ring-2 focus:ring-[#002E5A]"
                          >
                             {estimations.map(v => <option key={v.id} value={v.id}>{v.name} ({v.date})</option>)}
                          </select>
                          <button 
                            onClick={handleOpenEstimationModal}
                            className="bg-[#fe740e] text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase shadow-lg transition hover:brightness-110"
                          >
                             <i className="fas fa-plus-circle mr-2"></i> Nouvelle Estimation
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
                                   <th className="px-6 py-4 text-center">Année</th>
                                   <th className="px-6 py-4 text-right rounded-r-2xl">Montant HT</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-gray-50">
                                {versionData?.lines.map((item, i) => (
                                  <tr key={i} className="group hover:bg-gray-50 transition border-b border-gray-100">
                                     <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                           <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-blue-500' : 'bg-[#fe740e]'}`}></div>
                                           <span className="text-[10px] font-bold text-gray-700">{item.nature}</span>
                                        </div>
                                     </td>
                                     <td className="px-6 py-5 text-center font-bold text-gray-400 text-[10px]">{item.year}</td>
                                     <td className="px-6 py-5 text-right font-black text-[#002E5A] text-[10px]">{item.amount.toLocaleString()} €</td>
                                  </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                       {versionData?.comment && (
                        <div className="p-4 bg-[#dbeafe]/30 rounded-2xl border border-blue-100 flex items-start gap-4">
                           <i className="fas fa-comment-dots text-[#2d5a8e] mt-1"></i>
                           <div>
                              <p className="text-[9px] font-bold text-[#2d5a8e] uppercase mb-1">Commentaire de version</p>
                              <p className="text-[10px] text-[#002E5A] italic">"{versionData.comment}"</p>
                           </div>
                        </div>
                       )}
                    </div>
                 </div>

                 {/* SECTION 2: EFP (HISTORIQUE) */}
                 <div className="space-y-6 pt-8 border-t border-gray-100">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-6">
                       <div>
                          <h3 className="text-sm font-bold text-[#002E5A] uppercase tracking-widest flex items-center gap-3">
                             <i className="fas fa-file-invoice-dollar text-[#fe740e]"></i> Historique des versions EFP
                          </h3>
                          <p className="text-[10px] text-gray-400 mt-1 italic tracking-tight">RG2 : L'EFP détaille les postes de dépenses par nature technique.</p>
                       </div>
                       <div className="flex gap-2">
                          <select 
                             value={selectedEFPVersion}
                             onChange={(e) => setSelectedEFPVersion(e.target.value)}
                             className="bg-[#f1f3f8] border-none rounded-xl text-[10px] font-bold px-4 py-2 outline-none focus:ring-2 focus:ring-[#002E5A]"
                          >
                             {efpVersions.map(v => <option key={v.id} value={v.id}>EFP Version {v.versionNumber} ({v.date})</option>)}
                          </select>
                          <button 
                            onClick={handleOpenEFPModal}
                            className="bg-[#002E5A] text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase shadow-lg transition hover:brightness-110"
                          >
                             <i className="fas fa-plus-circle mr-2"></i> {efpVersions.length === 0 ? 'Créer l\'EFP' : 'Nouvelle version EFP'}
                          </button>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="flex items-center justify-between px-4 py-3 bg-[#f1f3f8]/50 rounded-xl">
                          <div className="flex gap-8">
                             <div>
                                <p className="text-[8px] font-bold text-gray-400 uppercase">Statut</p>
                                <span className={`text-[9px] font-black uppercase tracking-widest ${currentEFPVersion?.status === 'VALIDÉ' ? 'text-green-600' : 'text-[#fe740e]'}`}>{currentEFPVersion?.status}</span>
                             </div>
                             <div>
                                <p className="text-[8px] font-bold text-gray-400 uppercase">Auteur</p>
                                <span className="text-[9px] font-black uppercase text-[#002E5A]">{currentEFPVersion?.author}</span>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-[8px] font-bold text-gray-400 uppercase">Total EFP</p>
                             <span className="text-lg font-black text-[#002E5A]">{currentEFPVersion?.total.toLocaleString()} €</span>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {currentEFPVersion?.posts.map((post, i) => (
                            <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center group hover:border-[#fe740e] transition">
                               <div className="flex items-center gap-3">
                                  <div className={`w-2 h-2 rounded-full ${post.color}`}></div>
                                  <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">{post.nature}</span>
                               </div>
                               <span className="text-[11px] font-black text-[#002E5A]">{post.amount.toLocaleString()} €</span>
                            </div>
                          ))}
                       </div>

                       {currentEFPVersion?.comment && (
                        <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-start gap-4">
                           <i className="fas fa-info-circle text-[#fe740e] mt-1"></i>
                           <div>
                              <p className="text-[9px] font-bold text-[#fe740e] uppercase mb-1">Commentaire de recalage</p>
                              <p className="text-[10px] text-orange-900 italic">"{currentEFPVersion.comment}"</p>
                           </div>
                        </div>
                       )}
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

      {/* MODAL: NOUVELLE ESTIMATION */}
      {showEstimationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#002E5A]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="bg-[#002E5A] p-6 flex justify-between items-center text-white">
              <h3 className="text-lg font-bold uppercase tracking-widest">Créer une estimation (Version {estimations.length + 1})</h3>
              <button onClick={() => setShowEstimationModal(false)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition"><i className="fas fa-times"></i></button>
            </div>
            <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#2d5a8e] uppercase tracking-wider">Nom de la version <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    className="w-full bg-[#f1f3f8] border-none rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-[#002E5A]" 
                    value={estimationForm.name}
                    onChange={(e) => setEstimationForm({...estimationForm, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#2d5a8e] uppercase tracking-wider">Commentaire de justification {estimations.length > 0 && <span className="text-red-500">*</span>}</label>
                  <input 
                    type="text" 
                    className="w-full bg-[#f1f3f8] border-none rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-[#002E5A]" 
                    placeholder="Ex: Mise à jour après CODIR..."
                    value={estimationForm.comment}
                    onChange={(e) => setEstimationForm({...estimationForm, comment: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-[#002E5A] uppercase tracking-widest">Ventilation par Nature</h4>
                  <button 
                    onClick={() => setEstimationForm({...estimationForm, lines: [...estimationForm.lines, { year: 2024, nature: 'Travaux', amount: 0 }]})}
                    className="text-[10px] font-bold text-[#fe740e] hover:underline"
                  >
                    <i className="fas fa-plus-circle mr-1"></i> Ajouter ligne
                  </button>
                </div>
                <div className="space-y-3">
                  {estimationForm.lines.map((line, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-3 items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div className="col-span-3">
                        <select 
                          className="w-full bg-white border-none rounded-lg p-2 text-[10px] font-bold outline-none focus:ring-2 focus:ring-[#002E5A]"
                          value={line.year}
                          onChange={(e) => {
                            const newLines = [...estimationForm.lines];
                            newLines[idx].year = Number(e.target.value);
                            setEstimationForm({...estimationForm, lines: newLines});
                          }}
                        >
                          <option value={2024}>2024</option>
                          <option value={2025}>2025</option>
                          <option value={2026}>2026</option>
                        </select>
                      </div>
                      <div className="col-span-4">
                        <select 
                          className="w-full bg-white border-none rounded-lg p-2 text-[10px] font-bold outline-none focus:ring-2 focus:ring-[#002E5A]"
                          value={line.nature}
                          onChange={(e) => {
                            const newLines = [...estimationForm.lines];
                            newLines[idx].nature = e.target.value;
                            setEstimationForm({...estimationForm, lines: newLines});
                          }}
                        >
                          <option value="Études">Études</option>
                          <option value="MOE">MOE</option>
                          <option value="Travaux">Travaux</option>
                          <option value="Contrôles">Contrôles</option>
                          <option value="Divers">Divers</option>
                        </select>
                      </div>
                      <div className="col-span-4">
                        <div className="relative">
                          <input 
                            type="number" 
                            className="w-full bg-white border-none rounded-lg p-2 text-[10px] font-bold outline-none focus:ring-2 focus:ring-[#002E5A] pr-8"
                            value={line.amount}
                            onChange={(e) => {
                              const newLines = [...estimationForm.lines];
                              newLines[idx].amount = Number(e.target.value);
                              setEstimationForm({...estimationForm, lines: newLines});
                            }}
                          />
                          <span className="absolute right-3 top-2 text-[10px] font-bold text-gray-400">€</span>
                        </div>
                      </div>
                      <div className="col-span-1 text-center">
                        <button 
                          onClick={() => {
                            const newLines = estimationForm.lines.filter((_, i) => i !== idx);
                            setEstimationForm({...estimationForm, lines: newLines});
                          }}
                          className="text-red-400 hover:text-red-600 transition"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                <div className="space-y-3">
                  <h5 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Récapitulatif par Année</h5>
                  <div className="space-y-1">
                    {[2024, 2025, 2026].map(year => {
                      const yearTotal = estimationForm.lines.filter(l => l.year === year).reduce((acc: number, curr: FinancialEstimationLine) => acc + curr.amount, 0);
                      if (yearTotal === 0) return null;
                      return (
                        <div key={year} className="flex justify-between text-[10px] font-bold">
                          <span className="text-gray-500">{year}</span>
                          <span className="text-[#002E5A]">{yearTotal.toLocaleString()} €</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="bg-[#002E5A] p-6 rounded-2xl text-white text-center shadow-xl">
                  <p className="text-[9px] font-bold text-blue-300 uppercase tracking-widest mb-1">Total Global Estimé</p>
                  <p className="text-2xl font-black">{estimationForm.lines.reduce((acc: number, curr: FinancialEstimationLine) => acc + curr.amount, 0).toLocaleString()} €</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowEstimationModal(false)} className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Annuler</button>
              <button onClick={() => handleSaveEstimation('BROUILLON')} className="bg-white border border-gray-200 text-[#002E5A] px-8 py-3 text-[10px] font-bold rounded-xl shadow-sm transition uppercase tracking-widest hover:bg-gray-50">Enregistrer (Brouillon)</button>
              <button onClick={() => handleSaveEstimation('VALIDÉ')} className="bg-[#fe740e] text-white px-8 py-3 text-[10px] font-bold rounded-xl shadow-lg transition uppercase tracking-widest hover:brightness-110">Valider l'Estimation</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NOUVELLE VERSION EFP */}
      {showEFPModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#002E5A]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="bg-[#002E5A] p-6 flex justify-between items-center text-white">
              <h3 className="text-lg font-bold uppercase tracking-widest">
                {efpVersions.length === 0 ? 'Créer l\'EFP (Version 1)' : `Réviser l'EFP (Version ${efpVersions.length + 1})`}
              </h3>
              <button onClick={() => setShowEFPModal(false)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition"><i className="fas fa-times"></i></button>
            </div>
            <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
              <div className="flex justify-between items-center">
                <div className="space-y-1 flex-1 mr-6">
                  <label className="text-[10px] font-bold text-[#2d5a8e] uppercase tracking-wider">Commentaire de recalage {efpVersions.length > 0 && <span className="text-red-500">*</span>}</label>
                  <input 
                    type="text" 
                    className="w-full bg-[#f1f3f8] border-none rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-[#002E5A]" 
                    placeholder="Ex: Ajustement après réception des devis..."
                    value={efpForm.comment}
                    onChange={(e) => setEfpForm({...efpForm, comment: e.target.value})}
                  />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-[10px] font-bold text-[#2d5a8e] uppercase tracking-wider">Ventilation annuelle</span>
                  <button 
                    onClick={() => setEfpForm({...efpForm, annualBreakdownEnabled: !efpForm.annualBreakdownEnabled})}
                    className={`w-12 h-6 rounded-full transition-colors relative ${efpForm.annualBreakdownEnabled ? 'bg-[#fe740e]' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${efpForm.annualBreakdownEnabled ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black text-[#002E5A] uppercase tracking-widest">Saisie des Postes</h4>
                <div className="space-y-3">
                  {efpForm.posts.map((post, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 group">
                      <div className={`w-3 h-3 rounded-full ${post.color}`}></div>
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-gray-700 uppercase tracking-tight">{post.nature}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {efpForm.annualBreakdownEnabled && (
                          <button 
                            onClick={() => setShowAnnualBreakdownDrawer(idx)}
                            className="text-[9px] font-bold text-[#2d5a8e] bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition uppercase tracking-widest"
                          >
                            <i className="fas fa-calendar-alt mr-2"></i> Ventiler
                          </button>
                        )}
                        <div className="relative w-32">
                          <input 
                            type="number" 
                            disabled={efpForm.annualBreakdownEnabled}
                            className={`w-full bg-white border-none rounded-xl p-2 text-xs font-black text-[#002E5A] outline-none focus:ring-2 focus:ring-[#002E5A] pr-8 text-right ${efpForm.annualBreakdownEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            value={post.amount}
                            onChange={(e) => {
                              const newPosts = [...efpForm.posts];
                              newPosts[idx].amount = Number(e.target.value);
                              setEfpForm({...efpForm, posts: newPosts});
                            }}
                          />
                          <span className="absolute right-3 top-2.5 text-[10px] font-bold text-gray-400">€</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#002E5A] p-8 rounded-3xl text-white flex justify-between items-center shadow-2xl">
                <div>
                  <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-1">Total EFP Version {efpVersions.length + 1}</p>
                  <p className="text-3xl font-black tracking-tighter">{efpForm.posts.reduce((acc: number, curr: EFPPost) => acc + curr.amount, 0).toLocaleString()} €</p>
                </div>
                {efpVersions.length > 0 && (
                  <div className="text-right border-l border-white/10 pl-8">
                    <p className="text-[9px] font-bold text-blue-300 uppercase tracking-widest mb-1">Écart vs Version {efpVersions.length}</p>
                    <p className={`text-lg font-black ${efpForm.posts.reduce((acc: number, curr: EFPPost) => acc + curr.amount, 0) - efpVersions[efpVersions.length-1].total >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {efpForm.posts.reduce((acc: number, curr: EFPPost) => acc + curr.amount, 0) - efpVersions[efpVersions.length-1].total >= 0 ? '+' : ''}
                      {(efpForm.posts.reduce((acc: number, curr: EFPPost) => acc + curr.amount, 0) - efpVersions[efpVersions.length-1].total).toLocaleString()} €
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowEFPModal(false)} className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Annuler</button>
              <button onClick={() => handleSaveEFP('BROUILLON')} className="bg-white border border-gray-200 text-[#002E5A] px-8 py-3 text-[10px] font-bold rounded-xl shadow-sm transition uppercase tracking-widest hover:bg-gray-50">Enregistrer (Brouillon)</button>
              <button onClick={() => handleSaveEFP('VALIDÉ')} className="bg-[#002E5A] text-white px-8 py-3 text-[10px] font-bold rounded-xl shadow-lg transition uppercase tracking-widest hover:brightness-110">Valider l'EFP</button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER: VENTILATION ANNUELLE POSTE */}
      {showAnnualBreakdownDrawer !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="bg-[#002E5A] p-6 text-white flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-1">Ventilation Annuelle</p>
                <h3 className="text-lg font-black uppercase tracking-tight">{efpForm.posts[showAnnualBreakdownDrawer].nature}</h3>
              </div>
              <button onClick={() => setShowAnnualBreakdownDrawer(null)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition"><i className="fas fa-times"></i></button>
            </div>
            <div className="p-8 flex-1 space-y-8 overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                {[2024, 2025, 2026].map(year => (
                  <div key={year} className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <span className="text-xs font-black text-[#002E5A]">{year}</span>
                    <div className="relative w-48">
                      <input 
                        type="number" 
                        className="w-full bg-white border-none rounded-xl p-3 text-xs font-black text-[#002E5A] outline-none focus:ring-2 focus:ring-[#002E5A] pr-8 text-right"
                        value={efpForm.posts[showAnnualBreakdownDrawer].yearBreakdown?.[year] || 0}
                        onChange={(e) => {
                          const newPosts = [...efpForm.posts];
                          const post = newPosts[showAnnualBreakdownDrawer];
                          if (!post.yearBreakdown) post.yearBreakdown = {};
                          post.yearBreakdown[year] = Number(e.target.value);
                          // Update total amount for the post
                          post.amount = Object.values(post.yearBreakdown || {}).reduce((acc: number, curr: number) => acc + curr, 0);
                          setEfpForm({...efpForm, posts: newPosts});
                        }}
                      />
                      <span className="absolute right-3 top-3.5 text-[10px] font-bold text-gray-400">€</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-center">
                <p className="text-[10px] font-bold text-[#2d5a8e] uppercase tracking-widest mb-1">Total Poste</p>
                <p className="text-2xl font-black text-[#002E5A]">{efpForm.posts[showAnnualBreakdownDrawer].amount.toLocaleString()} €</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100">
              <button 
                onClick={() => setShowAnnualBreakdownDrawer(null)}
                className="w-full py-4 bg-[#002E5A] text-white text-[10px] font-black rounded-2xl shadow-xl uppercase tracking-widest hover:brightness-110 transition"
              >
                Terminer la ventilation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialIntegration;
