
import React, { useState } from 'react';
import { MOCK_PRESTATAIRES } from '../mockData';
import { Prestataire } from '../types';
import { useNotification } from './NotificationSystem';
import ConfirmationModal from './ConfirmationModal';

const PrestataireManagement: React.FC = () => {
  const [prestataires, setPrestataires] = useState<Prestataire[]>(MOCK_PRESTATAIRES);
  const [filter, setFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState<Partial<Prestataire>>({
    nom: '',
    siret: '',
    adresse: '',
    ville: '',
    codePostal: '',
    contactNom: '',
    contactEmail: '',
    contactTel: '',
    specialite: '',
    statut: 'ACTIF'
  });

  const filtered = prestataires.filter(p => 
    p.nom.toLowerCase().includes(filter.toLowerCase()) || 
    p.specialite.toLowerCase().includes(filter.toLowerCase()) ||
    p.ville.toLowerCase().includes(filter.toLowerCase())
  );

  const handleOpenCreate = () => {
    setIsEditing(false);
    setSelectedId(null);
    setFormData({
      nom: '',
      siret: '',
      adresse: '',
      ville: '',
      codePostal: '',
      contactNom: '',
      contactEmail: '',
      contactTel: '',
      specialite: '',
      statut: 'ACTIF'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p: Prestataire) => {
    setIsEditing(true);
    setSelectedId(p.id);
    setFormData({ ...p });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.nom || !formData.siret || !formData.contactEmail) {
      showNotification('Veuillez remplir les champs obligatoires (Nom, SIRET, Email).', 'error');
      return;
    }

    if (isEditing && selectedId) {
      setPrestataires(prev => prev.map(p => p.id === selectedId ? { ...p, ...formData } as Prestataire : p));
      showNotification('Prestataire mis à jour avec succès.');
    } else {
      const newP: Prestataire = {
        ...formData,
        id: `PRES-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        createdAt: new Date().toISOString().split('T')[0],
      } as Prestataire;
      setPrestataires(prev => [newP, ...prev]);
      showNotification('Prestataire ajouté avec succès.');
    }

    setShowModal(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setPrestataires(prev => prev.filter(p => p.id !== deleteId));
    showNotification('Prestataire supprimé avec succès.');
    setDeleteId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-[#002E5A] uppercase tracking-tighter">Gestion des Prestataires</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Annuaire des entreprises et intervenants</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="bg-[#fe740e] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-200 transition hover:scale-105 active:scale-95"
        >
          <i className="fas fa-plus-circle mr-2"></i> Ajouter un prestataire
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-100 border border-gray-50">
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
            <input 
              type="text" 
              placeholder="Rechercher par nom, spécialité, ville..." 
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#fe740e] transition"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-[#002E5A] uppercase tracking-widest border-b border-gray-100">
                <th className="px-6 py-4">Entreprise</th>
                <th className="px-6 py-4">Spécialité</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Localisation</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p) => (
                <tr key={p.id} className="group hover:bg-gray-50 transition">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-[#002E5A] uppercase">{p.nom}</span>
                      <span className="text-[9px] text-gray-400 font-bold">SIRET: {p.siret}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                      {p.specialite}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-700">{p.contactNom}</span>
                      <span className="text-[9px] text-gray-400">{p.contactEmail}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-700">{p.ville}</span>
                      <span className="text-[9px] text-gray-400">{p.codePostal}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      p.statut === 'ACTIF' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {p.statut}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button 
                        onClick={() => handleOpenEdit(p)}
                        className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition"
                      >
                        <i className="fas fa-edit text-[10px]"></i>
                      </button>
                      <button 
                        onClick={() => setDeleteId(p.id)}
                        className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition"
                      >
                        <i className="fas fa-trash text-[10px]"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: CREATE/EDIT */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#002E5A]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#002E5A] p-6 flex justify-between items-center text-white">
              <h3 className="text-sm font-black uppercase tracking-widest">
                {isEditing ? 'Modifier le prestataire' : 'Ajouter un prestataire'}
              </h3>
              <button onClick={() => setShowModal(false)} className="hover:bg-white/10 p-2 rounded-full transition">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom de l'entreprise *</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-[#fe740e]"
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">SIRET *</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-[#fe740e]"
                    value={formData.siret}
                    onChange={(e) => setFormData({...formData, siret: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Spécialité</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-[#fe740e]"
                    value={formData.specialite}
                    onChange={(e) => setFormData({...formData, specialite: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Statut</label>
                  <select 
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-[#fe740e]"
                    value={formData.statut}
                    onChange={(e) => setFormData({...formData, statut: e.target.value as any})}
                  >
                    <option value="ACTIF">ACTIF</option>
                    <option value="INACTIF">INACTIF</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Adresse</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-[#fe740e]"
                  value={formData.adresse}
                  onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Ville</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-[#fe740e]"
                    value={formData.ville}
                    onChange={(e) => setFormData({...formData, ville: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Code Postal</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-[#fe740e]"
                    value={formData.codePostal}
                    onChange={(e) => setFormData({...formData, codePostal: e.target.value})}
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl space-y-4">
                <p className="text-[10px] font-black text-[#002E5A] uppercase tracking-widest">Contact Principal</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-blue-400 uppercase tracking-widest ml-1">Nom du contact</label>
                    <input 
                      type="text" 
                      className="w-full bg-white border-none rounded-xl p-3 text-xs font-bold outline-none focus:ring-2 focus:ring-[#002E5A]"
                      value={formData.contactNom}
                      onChange={(e) => setFormData({...formData, contactNom: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-blue-400 uppercase tracking-widest ml-1">Email *</label>
                    <input 
                      type="email" 
                      className="w-full bg-white border-none rounded-xl p-3 text-xs font-bold outline-none focus:ring-2 focus:ring-[#002E5A]"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-blue-400 uppercase tracking-widest ml-1">Téléphone</label>
                  <input 
                    type="text" 
                    className="w-full bg-white border-none rounded-xl p-3 text-xs font-bold outline-none focus:ring-2 focus:ring-[#002E5A]"
                    value={formData.contactTel}
                    onChange={(e) => setFormData({...formData, contactTel: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition"
              >
                Annuler
              </button>
              <button 
                onClick={handleSave}
                className="bg-[#002E5A] text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 transition hover:scale-105 active:scale-95"
              >
                {isEditing ? 'Mettre à jour' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <ConfirmationModal 
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Supprimer le prestataire"
          message="Êtes-vous sûr de vouloir supprimer ce prestataire ? Cette action est irréversible."
        />
      )}
    </div>
  );
};

export default PrestataireManagement;
