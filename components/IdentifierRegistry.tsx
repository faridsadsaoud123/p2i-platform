import React, { useState } from 'react';
import { useData } from './DataContext';
import { useNavigate } from 'react-router-dom';
import { useNotification } from './NotificationSystem';
import { Operation } from '../types';

const IdentifierRegistry: React.FC = () => {
  const { operations, updateOperation } = useData();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCodeModal, setShowAddCodeModal] = useState(false);
  const [editingCode, setEditingCode] = useState<{ code: string; type: 'PFI' | 'NACRES' | 'EOTP'; opId: string } | null>(null);
  const [formData, setFormData] = useState({ codeType: 'NACRES' as 'PFI' | 'NACRES' | 'EOTP', codeValue: '', operationId: '' });

  // Flatten all identifiers into a single list
  const allIdentifiers = operations.flatMap(op => {
    const ids: { code: string; type: 'PFI' | 'NACRES' | 'EOTP'; opId: string; opTitle: string }[] = [];
    
    // PFI is mandatory and unique per operation
    if (op.pfiCode) {
      ids.push({ code: op.pfiCode, type: 'PFI', opId: op.id, opTitle: op.title });
    }
    
    // NACRES can be multiple
    (op.nacresCodes || []).forEach(code => {
      ids.push({ code, type: 'NACRES', opId: op.id, opTitle: op.title });
    });
    
    // EOTP can be multiple
    (op.eotpCodes || []).forEach(code => {
      ids.push({ code, type: 'EOTP', opId: op.id, opTitle: op.title });
    });
    
    return ids;
  });

  const filteredIds = allIdentifiers.filter(id =>
    id.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    id.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveCode = () => {
    const trimmedValue = formData.codeValue.trim().toUpperCase();
    if (!trimmedValue) {
      showNotification('Le code ne peut pas être vide', 'error');
      return;
    }
    if (!formData.operationId && !editingCode) {
      showNotification('Veuillez sélectionner une opération', 'error');
      return;
    }

    const opId = editingCode ? editingCode.opId : formData.operationId;
    const operation = operations.find(op => op.id === opId);
    if (!operation) {
      showNotification('Opération non trouvée', 'error');
      return;
    }

    // Check for duplicates
    const allCodes = operations.flatMap(op => {
      const codes = [];
      if (formData.codeType === 'PFI' && op.pfiCode) codes.push(op.pfiCode);
      if (formData.codeType === 'NACRES') codes.push(...(op.nacresCodes || []));
      if (formData.codeType === 'EOTP') codes.push(...(op.eotpCodes || []));
      return codes;
    });

    if (editingCode) {
      // Edit mode - remove old code from duplicate check
      if (trimmedValue !== editingCode.code && allCodes.includes(trimmedValue)) {
        showNotification(`Ce code ${formData.codeType} existe déjà`, 'error');
        return;
      }

      const updateData: Partial<Operation> = {};
      if (editingCode.type === 'PFI') {
        updateData.pfiCode = trimmedValue;
      } else if (editingCode.type === 'NACRES') {
        updateData.nacresCodes = operation.nacresCodes?.map(c => c === editingCode.code ? trimmedValue : c) || [];
      } else if (editingCode.type === 'EOTP') {
        updateData.eotpCodes = operation.eotpCodes?.map(c => c === editingCode.code ? trimmedValue : c) || [];
      }

      updateData.history = [
        {
          date: new Date().toLocaleDateString('fr-FR'),
          user: 'Admin',
          title: `Modification ${editingCode.type}`,
          desc: `Code modifié: ${editingCode.code} → ${trimmedValue}`
        },
        ...(operation.history || [])
      ];

      updateOperation(opId, updateData);
      showNotification(`Code ${editingCode.type} modifié avec succès`);
    } else {
      // Add mode
      if (allCodes.includes(trimmedValue)) {
        showNotification(`Ce code ${formData.codeType} existe déjà`, 'error');
        return;
      }

      const updateData: Partial<Operation> = {};
      if (formData.codeType === 'PFI') {
        updateData.pfiCode = trimmedValue;
      } else if (formData.codeType === 'NACRES') {
        updateData.nacresCodes = [...(operation.nacresCodes || []), trimmedValue];
      } else if (formData.codeType === 'EOTP') {
        updateData.eotpCodes = [...(operation.eotpCodes || []), trimmedValue];
      }

      updateData.history = [
        {
          date: new Date().toLocaleDateString('fr-FR'),
          user: 'Admin',
          title: `Ajout ${formData.codeType}`,
          desc: `Nouvel identifiant: ${trimmedValue}`
        },
        ...(operation.history || [])
      ];

      updateOperation(opId, updateData);
      showNotification(`Code ${formData.codeType} ajouté avec succès`);
    }

    setShowAddCodeModal(false);
    setEditingCode(null);
    setFormData({ codeType: 'NACRES', codeValue: '', operationId: '' });
  };

  const handleDeleteCode = (id: { code: string; type: 'PFI' | 'NACRES' | 'EOTP'; opId: string }) => {
    if (id.type === 'PFI') {
      showNotification('Impossible de supprimer le code PFI - identifiant unique requis', 'error');
      return;
    }

    if (!confirm(`Êtes-vous sûr de vouloir supprimer le code ${id.type} "${id.code}" ?`)) {
      return;
    }

    const operation = operations.find(op => op.id === id.opId);
    if (!operation) return;

    const updateData: Partial<Operation> = {};
    if (id.type === 'NACRES') {
      updateData.nacresCodes = operation.nacresCodes?.filter(c => c !== id.code) || [];
    } else if (id.type === 'EOTP') {
      updateData.eotpCodes = operation.eotpCodes?.filter(c => c !== id.code) || [];
    }

    updateData.history = [
      {
        date: new Date().toLocaleDateString('fr-FR'),
        user: 'Admin',
        title: `Suppression ${id.type}`,
        desc: `Code supprimé: ${id.code}`
      },
      ...(operation.history || [])
    ];

    updateOperation(id.opId, updateData);
    showNotification(`Code ${id.type} supprimé avec succès`);
  };

  const openEditModal = (id: { code: string; type: 'PFI' | 'NACRES' | 'EOTP'; opId: string }) => {
    setEditingCode(id);
    setFormData({ codeType: id.type, codeValue: id.code, operationId: id.opId });
    setShowAddCodeModal(true);
  };

  const openAddModal = () => {
    setEditingCode(null);
    setFormData({ codeType: 'NACRES', codeValue: '', operationId: '' });
    setShowAddCodeModal(true);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 font-medium">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#002E5A]">Référentiel des Identifiants</h1>
          <p className="subtitle text-[#2d5a8e] mt-1 uppercase tracking-widest font-bold text-[10px]">Indexation PFI, NACRES & EOTP</p>
        </div>
        <div className="flex gap-4">
            <div className="bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm text-center">
                <span className="text-[9px] font-black text-gray-400 uppercase block mb-1">Total Codes</span>
                <span className="text-xl font-black text-[#002E5A]">{allIdentifiers.length}</span>
            </div>
            <button
              onClick={openAddModal}
              className="bg-[#fe740e] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all whitespace-nowrap"
            >
              <i className="fas fa-plus mr-2"></i> Ajouter Code
            </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-[#f1f3f8]/30">
            <div className="relative max-w-xl mx-auto">
                <span className="absolute inset-y-0 left-0 pl-5 flex items-center text-gray-400 pointer-events-none">
                    <i className="fas fa-search"></i>
                </span>
                <input 
                    type="text" 
                    placeholder="Rechercher par code ou type..." 
                    className="block w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-[#002E5A]/10 outline-none transition-all shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#002E5A] text-white text-[11px] uppercase font-black tracking-widest">
              <tr>
                <th className="px-10 py-6">Code / Identifiant</th>
                <th className="px-10 py-6">Type Code</th>
                <th className="px-10 py-6">Opération</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredIds.map((id, idx) => (
                <tr key={`${id.opId}-${id.type}-${id.code}-${idx}`} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="bg-white border-2 border-gray-100 text-[#002E5A] px-4 py-2 rounded-xl inline-block font-mono font-black text-sm tracking-widest shadow-sm group-hover:border-[#fe740e]/30 group-hover:text-[#fe740e] transition-all">
                        {id.code}
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      id.type === 'PFI' ? 'bg-[#002E5A] text-[#fe740e]' :
                      id.type === 'NACRES' ? 'bg-indigo-50 text-indigo-700' :
                      'bg-emerald-50 text-emerald-700'
                    }`}>
                        {id.type}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <button
                      onClick={() => navigate('/operations', { state: { selectedOpId: id.opId } })}
                      className="text-[10px] font-bold text-gray-500 hover:text-[#002E5A] transition"
                    >
                      {id.opTitle}
                    </button>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(id)}
                        className="w-10 h-10 rounded-xl bg-blue-50 text-[#2d5a8e] flex items-center justify-center hover:bg-[#002E5A] hover:text-white transition-all shadow-sm"
                      >
                        <i className="fas fa-pencil-alt text-xs"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteCode(id)}
                        className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={id.type === 'PFI'}
                      >
                        <i className="fas fa-trash-alt text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredIds.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-10 py-20 text-center opacity-30">
                    <i className="fas fa-fingerprint text-5xl mb-4 block"></i>
                    <p className="text-sm font-black uppercase tracking-widest">Aucun identifiant trouvé</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-12 bg-white rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
          <div className="w-20 h-20 bg-blue-50 text-[#002E5A] rounded-3xl flex items-center justify-center text-4xl shadow-inner shrink-0"><i className="fas fa-info-circle"></i></div>
          <div className="flex-1 space-y-2 text-center md:text-left">
              <h3 className="text-lg font-black text-[#002E5A] uppercase tracking-tight">Utilisation du Référentiel</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  Cette vue permet de lister chaque identifiant financier indépendamment. Utilisez les boutons d'actions pour modifier ou supprimer les codes (sauf PFI qui est unique et obligatoire).
              </p>
          </div>
          <button
            onClick={() => navigate('/operations')}
            className="bg-[#002E5A] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all whitespace-nowrap"
          >
              Retour aux Opérations
          </button>
      </div>

      {showAddCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#002E5A]/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
            <div className="bg-[#002E5A] p-6 flex justify-between items-center text-white">
              <h3 className="text-sm font-black uppercase tracking-widest">{editingCode ? 'Modifier' : 'Ajouter'} un Code</h3>
              <button
                onClick={() => {
                  setShowAddCodeModal(false);
                  setEditingCode(null);
                  setFormData({ codeType: 'NACRES', codeValue: '', operationId: '' });
                }}
                className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#2d5a8e] uppercase tracking-wider">Type de Code</label>
                <select
                  className="w-full bg-white border border-gray-200 rounded-xl p-4 text-xs outline-none focus:ring-2 focus:ring-[#002E5A] font-medium"
                  value={formData.codeType}
                  onChange={(e) => setFormData({...formData, codeType: e.target.value as 'PFI' | 'NACRES' | 'EOTP'})}
                  disabled={!!editingCode}
                >
                  <option value="PFI">PFI (Identifiant Principal)</option>
                  <option value="NACRES">NACRES (Nomenclature Achats)</option>
                  <option value="EOTP">EOTP (Élément d'OTP)</option>
                </select>
              </div>

              

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#2d5a8e] uppercase tracking-wider">Valeur du Code</label>
                <input
                  autoFocus
                  type="text"
                  className="w-full bg-[#f1f3f8] border-none rounded-2xl p-4 text-lg font-black font-mono tracking-widest text-[#002E5A] outline-none focus:ring-4 focus:ring-[#fe740e] transition-all"
                  placeholder={formData.codeType === 'PFI' ? 'Ex: PFI-2024-001' : formData.codeType === 'NACRES' ? 'Ex: NAC-80-01' : 'Ex: EOTP-2024-X'}
                  value={formData.codeValue}
                  onChange={(e) => setFormData({...formData, codeValue: e.target.value})}
                />
              </div>

              <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                <p className="text-[10px] font-bold text-[#fe740e] leading-relaxed italic">Une vérification d'unicité sera effectuée avant validation.</p>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddCodeModal(false);
                  setEditingCode(null);
                  setFormData({ codeType: 'NACRES', codeValue: '', operationId: '' });
                }}
                className="px-6 py-3 text-[10px] font-black text-gray-500 uppercase hover:bg-gray-100 transition rounded-xl"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveCode}
                className="bg-[#002E5A] text-white px-8 py-4 text-[10px] font-black rounded-2xl shadow-lg transition uppercase tracking-widest hover:scale-105 active:scale-95"
              >
                {editingCode ? 'Mettre à Jour' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdentifierRegistry;
