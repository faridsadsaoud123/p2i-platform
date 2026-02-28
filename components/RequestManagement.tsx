import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from './DataContext';
import { STATUS_COLORS, PRIORITY_COLORS } from '../constants';
import { RequestItem, RequestStatus, Priority } from '../types';
import ConfirmationModal from './ConfirmationModal';
import { useNotification } from './NotificationSystem';

const RequestManagement: React.FC = () => {
  const { requests, setRequests, transformRequestToOperation } = useData();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  const [arbitrationAction, setArbitrationAction] = useState<'VALIDATE' | 'REJECT' | 'CLARIFY' | null>(null);
  const [arbitrationComment, setArbitrationComment] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState<Partial<RequestItem>>({
    title: '',
    description: '',
    site: 'Campus Centre',
    priority: 'P3',
    estimatedCost: 0,
    type: 'TRAVAUX'
  });

  const filteredRequests = requests.filter(r => 
    r.title.toLowerCase().includes(filter.toLowerCase()) || 
    r.site.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSaveRequest = (status: RequestStatus) => {
    if (!formData.title || !formData.description || !formData.site || !formData.priority || !formData.type) {
      showNotification('Veuillez compléter tous les champs obligatoires.', 'error');
      return;
    }

    if (isEditing && selectedRequest) {
      setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, ...formData, status } : r));
      showNotification(status === 'BROUILLON' ? 'La demande a été mise à jour avec succès.' : 'La demande a été soumise à validation.');
    } else {
      const newReq: RequestItem = {
        id: `REQ-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        title: formData.title!,
        description: formData.description!,
        site: formData.site!,
        building: '',
        type: formData.type!,
        estimatedCost: formData.estimatedCost || 0,
        priority: formData.priority!,
        status: status,
        createdAt: new Date().toISOString().split('T')[0],
        creatorId: 'u3'
      };
      setRequests(prev => [newReq, ...prev]);
      showNotification(status === 'BROUILLON' ? 'La demande a été enregistrée en brouillon.' : 'La demande a été soumise pour validation.');
    }

    setShowCreateModal(false);
    setIsEditing(false);
    setFormData({ title: '', description: '', site: 'Campus Centre', priority: 'P3', estimatedCost: 0, type: 'TRAVAUX' });
  };

  const handleDeleteRequest = () => {
    if (!deleteId) return;
    const req = requests.find(r => r.id === deleteId);
    if (req && req.status !== 'BROUILLON') {
      showNotification('Cette demande ne peut pas être supprimée car elle est déjà validée ou liée à une opération.', 'error');
      setDeleteId(null);
      return;
    }
    setRequests(prev => prev.filter(r => r.id !== deleteId));
    showNotification('La demande a été supprimée avec succès.');
    setDeleteId(null);
  };

  const handleArbitration = () => {
    if (!selectedRequest || !arbitrationAction) return;
    if ((arbitrationAction === 'REJECT' || arbitrationAction === 'CLARIFY') && !arbitrationComment) {
      showNotification(arbitrationAction === 'REJECT' ? "Le motif de rejet est obligatoire." : "Veuillez préciser les informations attendues.", 'error');
      return;
    }

    if (arbitrationAction === 'VALIDATE') {
      const opId = transformRequestToOperation(selectedRequest.id, arbitrationComment);
      if (opId) {
        showNotification('Demande validée et transformée en opération ! Redirection...', 'success');
        setSelectedRequest(null);
        setArbitrationAction(null);
        setArbitrationComment('');
        setTimeout(() => {
          navigate('/operations', { state: { selectedOpId: opId } });
        }, 1000);
        return;
      }
    }

    const updated = requests.map(r => {
      if (r.id === selectedRequest.id) {
        let newStatus = r.status;
        if (arbitrationAction === 'REJECT') newStatus = 'REJETE';
        if (arbitrationAction === 'CLARIFY') newStatus = 'PRECISION';

        return {
          ...r,
          status: newStatus,
          rejectionReason: arbitrationAction === 'REJECT' ? arbitrationComment : r.rejectionReason,
          clarificationRequest: arbitrationAction === 'CLARIFY' ? arbitrationComment : r.clarificationRequest
        };
      }
      return r;
    });

    setRequests(updated);
    showNotification(
      arbitrationAction === 'VALIDATE' ? 'La demande a été validée avec succès.' : 
      arbitrationAction === 'REJECT' ? 'La demande a été rejetée.' : 
      'La demande est désormais en attente de précisions.'
    );
    setSelectedRequest(null);
    setArbitrationAction(null);
    setArbitrationComment('');
  };

  const openEditModal = (req: RequestItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRequest(req);
    setFormData(req);
    setIsEditing(true);
    setShowCreateModal(true);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#002E5A]">Recensement & Arbitrage</h1>
          <p className="subtitle text-[#2d5a8e] mt-1 uppercase tracking-widest font-bold">Gestion des nouveaux besoins et programmation</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-[#002E5A] hover:bg-[#2d5a8e] text-white px-6 py-3 rounded-xl flex items-center font-bold text-xs shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 uppercase tracking-widest"
        >
          <i className="fas fa-plus-circle mr-2 text-lg"></i> Créer une demande
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-wrap gap-4 items-center bg-[#f1f3f8]/50">
          <div className="relative flex-1 min-w-[280px]">
             <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none">
                <i className="fas fa-search"></i>
              </span>
              <input 
                type="text" 
                placeholder="Rechercher par titre, identifiant ou site..." 
                className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#002E5A] outline-none transition shadow-sm font-medium"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
          </div>
          <div className="flex gap-2">
            <select className="bg-white border border-gray-200 rounded-xl text-[10px] font-bold p-3 outline-none focus:ring-2 focus:ring-[#002E5A] shadow-sm uppercase">
              <option>Tous les statuts</option>
              <option>En attente</option>
              <option>Validé</option>
              <option>Précision</option>
              <option>Rejeté</option>
            </select>
            <select className="bg-white border border-gray-200 rounded-xl text-[10px] font-bold p-3 outline-none focus:ring-2 focus:ring-[#002E5A] shadow-sm uppercase">
              <option>Tous les sites</option>
              <option>Campus Centre</option>
              <option>Campus Nord</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#002E5A] text-white text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="px-8 py-5">Identité Demande</th>
                <th className="px-6 py-5">Site</th>
                <th className="px-6 py-5">Estimation</th>
                <th className="px-6 py-5">Priorité</th>
                <th className="px-6 py-5">Statut</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="group hover:bg-blue-50/30 transition-colors cursor-pointer" onClick={() => setSelectedRequest(req)}>
                  <td className="px-8 py-6">
                    <div className="font-bold text-[#002E5A] text-sm group-hover:text-[#fe740e] transition-colors">{req.title}</div>
                    <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">
                       <span className="bg-gray-100 px-2 py-0.5 rounded mr-2">{req.id}</span>
                       <span className="italic">{req.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-xs text-gray-600">{req.site}</td>
                  <td className="px-6 py-6 text-xs font-bold text-[#002E5A]">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(req.estimatedCost)}
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${PRIORITY_COLORS[req.priority === 'CRITIQUE' ? 'CRITIQUE' : req.priority === 'HAUTE' ? 'HAUTE' : req.priority === 'P1' ? 'CRITIQUE' : 'MOYENNE']}`}>
                      {req.priority}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold ${STATUS_COLORS[req.status]}`}>
                      {req.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedRequest(req); }}
                        className="w-8 h-8 flex items-center justify-center text-[#002E5A] bg-blue-50 rounded-lg hover:bg-blue-100 transition shadow-sm"
                      >
                        <i className="fas fa-eye text-xs"></i>
                      </button>
                      {(req.status === 'BROUILLON' || req.status === 'PRECISION') && (
                        <button 
                          onClick={(e) => openEditModal(req, e)}
                          className="w-8 h-8 flex items-center justify-center text-[#fe740e] bg-orange-50 rounded-lg hover:bg-orange-100 transition shadow-sm"
                        >
                          <i className="fas fa-pencil-alt text-xs"></i>
                        </button>
                      )}
                      {req.status === 'BROUILLON' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); setDeleteId(req.id); }}
                          className="w-8 h-8 flex items-center justify-center text-[#ff3131] bg-red-50 rounded-lg hover:bg-red-100 transition shadow-sm"
                        >
                          <i className="fas fa-trash-alt text-xs"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#002E5A]/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="bg-[#002E5A] p-6 flex justify-between items-center text-white">
                 <h3 className="text-lg font-bold uppercase tracking-widest">{isEditing ? 'Modifier la Demande' : 'Nouvelle Demande P2I'}</h3>
                 <button onClick={() => { setShowCreateModal(false); setIsEditing(false); }} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition"><i className="fas fa-times"></i></button>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                 <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-[#2d5a8e] uppercase tracking-wider">Titre du Projet <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required 
                      className="w-full bg-[#f1f3f8] border-none rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-[#002E5A]" 
                      placeholder="Ex: Travaux étanchéité Amphi..." 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                     />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#2d5a8e] uppercase tracking-wider">Site / Campus <span className="text-red-500">*</span></label>
                    <select className="w-full bg-[#f1f3f8] border-none rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-[#002E5A]">
                       <option>Campus Centre</option><option>Campus Nord</option><option>Pôle Cathédrale</option>
                    </select>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#2d5a8e] uppercase tracking-wider">Priorité <span className="text-red-500">*</span></label>
                    <select className="w-full bg-[#f1f3f8] border-none rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-[#002E5A]">
                       <option value="P1">P1 - Critique (Sécurité/Continuité)</option>
                       <option value="P2">P2 - Haute</option>
                       <option value="P3">P3 - Moyenne</option>
                       <option value="P4">P4 - Basse</option>
                    </select>
                 </div>
                 <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-[#2d5a8e] uppercase tracking-wider">Description détaillée <span className="text-red-500">*</span></label>
                    <textarea 
                      required 
                      className="w-full bg-[#f1f3f8] border-none rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-[#002E5A] h-24" 
                      placeholder="Description du besoin..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                     ></textarea>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#2d5a8e] uppercase tracking-wider">Estimation (€)</label>
                    <input 
                      type="number" 
                      className="w-full bg-[#f1f3f8] border-none rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-[#002E5A]" 
                      placeholder="Montant HT indicatif..." 
                      value={formData.estimatedCost}
                      onChange={(e) => setFormData({...formData, estimatedCost: Number(e.target.value)})}
                     />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#2d5a8e] uppercase tracking-wider">Type de besoin <span className="text-red-500">*</span></label>
                    <select className="w-full bg-[#f1f3f8] border-none rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-[#002E5A]">
                       <option>Diagnostic</option><option>Travaux</option><option>Sécurité</option><option>Maintenance</option>
                    </select>
                 </div>
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                 <button onClick={() => { setShowCreateModal(false); setIsEditing(false); }} className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase">Annuler</button>
                 <button onClick={() => handleSaveRequest('BROUILLON')} className="bg-[#fe740e] text-white px-8 py-3 text-[10px] font-bold rounded-xl shadow-lg transition uppercase tracking-widest">Enregistrer Brouillon</button>
                 <button onClick={() => handleSaveRequest('EN_ATTENTE')} className="bg-[#002E5A] text-white px-8 py-3 text-[10px] font-bold rounded-xl shadow-lg transition uppercase tracking-widest">Soumettre Validation</button>
              </div>
           </div>
        </div>
      )}

      {/* Detail & Arbitration Modal */}
      {selectedRequest && !isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#002E5A]/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300 flex flex-col max-h-[90vh]">
              <div className="bg-[#002E5A] p-6 text-white flex justify-between items-start">
                 <div>
                    <span className="text-[10px] bg-[#fe740e] text-white px-3 py-1 rounded-lg font-bold uppercase tracking-widest mb-2 inline-block">{selectedRequest.id}</span>
                    <h3 className="text-xl font-bold uppercase tracking-tight">{selectedRequest.title}</h3>
                 </div>
                 <button onClick={() => {setSelectedRequest(null); setArbitrationAction(null);}} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"><i className="fas fa-times"></i></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 lg:grid-cols-3 gap-10 custom-scrollbar">
                 <div className="lg:col-span-2 space-y-8">
                    <section>
                       <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Description du besoin</h4>
                       <p className="text-xs text-gray-700 leading-relaxed font-medium">{selectedRequest.description}</p>
                    </section>
                    
                    {selectedRequest.clarificationRequest && (
                      <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
                         <h5 className="text-[10px] font-black text-[#2d5a8e] uppercase tracking-widest mb-2">Précisions demandées</h5>
                         <p className="text-xs text-[#002E5A] italic">"{selectedRequest.clarificationRequest}"</p>
                      </div>
                    )}

                    {selectedRequest.rejectionReason && (
                      <div className="p-5 bg-red-50 rounded-2xl border border-red-100">
                         <h5 className="text-[10px] font-black text-[#ff3131] uppercase tracking-widest mb-2">Motif de rejet</h5>
                         <p className="text-xs text-red-900 italic">"{selectedRequest.rejectionReason}"</p>
                      </div>
                    )}

                    <section className="bg-[#f1f3f8]/50 p-6 rounded-3xl border border-gray-50">
                       <h4 className="text-[10px] font-black text-[#002E5A] uppercase tracking-widest mb-4">Informations Complémentaires</h4>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col">
                             <span className="text-[8px] font-bold text-gray-400 uppercase">Créé le</span>
                             <span className="text-xs font-bold text-[#002E5A]">{selectedRequest.createdAt}</span>
                          </div>
                          {selectedRequest.date_validation && (
                            <div className="flex flex-col">
                               <span className="text-[8px] font-bold text-gray-400 uppercase">Validé le</span>
                               <span className="text-xs font-bold text-[#002E5A]">{selectedRequest.date_validation}</span>
                            </div>
                          )}
                          <div className="flex flex-col">
                             <span className="text-[8px] font-bold text-gray-400 uppercase">Demandeur</span>
                             <span className="text-xs font-bold text-[#002E5A]">ID {selectedRequest.creatorId}</span>
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[8px] font-bold text-gray-400 uppercase">Bâtiment</span>
                             <span className="text-xs font-bold text-[#002E5A]">{selectedRequest.building || 'N/A'}</span>
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[8px] font-bold text-gray-400 uppercase">Type</span>
                             <span className="text-xs font-bold text-[#002E5A]">{selectedRequest.type}</span>
                          </div>
                       </div>
                    </section>
                 </div>

                 <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-3">Statut & Priorité</p>
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-gray-500 uppercase">Actuel</span>
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black ${STATUS_COLORS[selectedRequest.status]}`}>{selectedRequest.status}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-gray-500 uppercase">Niveau</span>
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black ${PRIORITY_COLORS[selectedRequest.priority === 'CRITIQUE' ? 'CRITIQUE' : selectedRequest.priority === 'P1' ? 'CRITIQUE' : 'MOYENNE']}`}>{selectedRequest.priority}</span>
                       </div>
                       <div className="pt-4 mt-2 border-t border-gray-50 text-center">
                          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Estimation initiale</p>
                          <p className="text-2xl font-black text-[#002E5A]">{selectedRequest.estimatedCost.toLocaleString()} €</p>
                       </div>
                    </div>

                    {selectedRequest.status === 'EN_ATTENTE' && !arbitrationAction && (
                       <div className="grid grid-cols-1 gap-3">
                          <button onClick={() => setArbitrationAction('VALIDATE')} className="w-full bg-[#d1fae5] text-green-800 font-bold text-[10px] py-4 rounded-2xl uppercase tracking-widest hover:brightness-95 transition">Valider la demande</button>
                          <button onClick={() => setArbitrationAction('CLARIFY')} className="w-full bg-[#dbeafe] text-[#2d5a8e] font-bold text-[10px] py-4 rounded-2xl uppercase tracking-widest hover:brightness-95 transition">Demander précisions</button>
                          <button onClick={() => setArbitrationAction('REJECT')} className="w-full bg-red-50 text-[#ff3131] font-bold text-[10px] py-4 rounded-2xl uppercase tracking-widest hover:brightness-95 transition">Rejeter la demande</button>
                       </div>
                    )}

                    {arbitrationAction && (
                      <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                         <label className="text-[10px] font-bold text-[#fe740e] uppercase tracking-widest">
                            {arbitrationAction === 'VALIDATE' ? 'Confirmation de validation' : arbitrationAction === 'REJECT' ? 'Motif du rejet (Obligatoire)' : 'Précisions attendues (Obligatoire)'}
                         </label>
                         <textarea 
                           className="w-full bg-[#f1f3f8] border-none rounded-2xl p-4 text-xs font-medium outline-none focus:ring-2 focus:ring-[#002E5A] h-28 shadow-inner" 
                           placeholder="Saisissez ici le motif ou commentaire..."
                           value={arbitrationComment}
                           onChange={(e) => setArbitrationComment(e.target.value)}
                         ></textarea>
                         <div className="flex gap-2">
                            <button onClick={() => {setArbitrationAction(null); setArbitrationComment('');}} className="flex-1 bg-gray-100 text-gray-400 font-bold text-[9px] py-3 rounded-xl uppercase">Annuler</button>
                            <button onClick={handleArbitration} className="flex-1 bg-[#002E5A] text-white font-bold text-[9px] py-3 rounded-xl uppercase tracking-widest shadow-lg">Confirmer</button>
                         </div>
                      </div>
                    )}

                    {selectedRequest.status === 'VALIDE' && !selectedRequest.operationId && (
                       <button
                        onClick={() => {
                          const opId = transformRequestToOperation(selectedRequest.id);
                          if (opId) {
                            showNotification('Demande transformée en opération ! Redirection...', 'success');
                            setTimeout(() => {
                              navigate('/operations', { state: { selectedOpId: opId } });
                            }, 1500);
                          }
                        }}
                        className="w-full bg-[#fe740e] text-white font-black text-[10px] py-5 rounded-2xl uppercase tracking-widest shadow-xl hover:brightness-110 transition animate-bounce"
                       >
                          Transformer en Opération <i className="fas fa-magic ml-2"></i>
                       </button>
                    )}
                 </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center shrink-0">
                 <div className="flex items-center gap-3">
                    <i className="fas fa-info-circle text-gray-400"></i>
                    <p className="text-[9px] font-bold text-gray-400 uppercase italic">Toutes les actions d'arbitrage sont historisées et signées.</p>
                 </div>
                 <button onClick={() => {setSelectedRequest(null); setArbitrationAction(null);}} className="text-[10px] font-bold text-[#002E5A] uppercase tracking-widest hover:underline">Fermer la fiche</button>
              </div>
           </div>
        </div>
      )}
      <ConfirmationModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteRequest}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cette demande ? Cette action est irréversible."
        variant="danger"
      />
    </div>
  );
};

export default RequestManagement;
