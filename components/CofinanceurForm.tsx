
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MOCK_COFINANCEURS } from '../mockData';
import { Cofinanceur, CofinanceurType } from '../types';
import { useNotification } from './NotificationSystem';

const CofinanceurForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const isEdit = !!id;

  const [formData, setFormData] = useState<Partial<Cofinanceur>>({
    nom: '',
    type: 'AUTRE',
    actif: true,
  });

  useEffect(() => {
    if (isEdit) {
      const existing = MOCK_COFINANCEURS.find(c => c.id === id);
      if (existing) {
        setFormData(existing);
      }
    }
  }, [id, isEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom || !formData.type) {
      showNotification('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    // In a real app, send to API
    showNotification(isEdit ? 'Cofinanceur mis à jour avec succès' : 'Cofinanceur créé avec succès');
    navigate('/cofinanceurs');
  };

  return (
    <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <button 
          onClick={() => navigate('/cofinanceurs')}
          className="text-[#002E5A] font-bold text-[10px] uppercase tracking-widest flex items-center hover:underline mb-4"
        >
          <i className="fas fa-arrow-left mr-2"></i> Retour à la liste
        </button>
        <h1 className="text-2xl font-bold text-[#002E5A]">{isEdit ? 'Modifier le Cofinanceur' : 'Nouveau Cofinanceur'}</h1>
        <p className="subtitle text-[#2d5a8e] mt-1 uppercase tracking-widest font-bold">Informations administratives et financières</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-2 space-y-1">
            <label className="text-[10px] font-bold text-[#2d5a8e] uppercase tracking-wider">Nom de l'organisme <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              required 
              className="w-full bg-[#f1f3f8] border-none rounded-xl p-4 text-xs outline-none focus:ring-2 focus:ring-[#002E5A] font-medium" 
              placeholder="Ex: Région Hauts-de-France..." 
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#2d5a8e] uppercase tracking-wider">Type de structure <span className="text-red-500">*</span></label>
            <select 
              className="w-full bg-[#f1f3f8] border-none rounded-xl p-4 text-xs outline-none focus:ring-2 focus:ring-[#002E5A] font-medium"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as CofinanceurType })}
            >
              <option value="ETAT">État</option>
              <option value="REGION">Région</option>
              <option value="COLLECTIVITE">Collectivité</option>
              <option value="AUTRE">Autre</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#2d5a8e] uppercase tracking-wider">Statut</label>
            <div className="flex items-center gap-4 p-4 bg-[#f1f3f8] rounded-xl">
               <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={formData.actif}
                    onChange={(e) => setFormData({ ...formData, actif: e.target.checked })}
                  />
                  <div className={`w-10 h-5 rounded-full transition-colors relative ${formData.actif ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                     <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.actif ? 'left-6' : 'left-1'}`}></div>
                  </div>
                  <span className="ml-3 text-[10px] font-bold uppercase text-[#002E5A]">{formData.actif ? 'Actif' : 'Inactif'}</span>
               </label>
            </div>
          </div>
        </div>

        <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button 
            type="button"
            onClick={() => navigate('/cofinanceurs')} 
            className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase hover:underline"
          >
            Annuler
          </button>
          <button 
            type="submit"
            className="bg-[#002E5A] text-white px-10 py-4 text-[10px] font-bold rounded-xl shadow-lg transition uppercase tracking-widest hover:bg-[#2d5a8e]"
          >
            {isEdit ? 'Mettre à jour' : 'Créer le cofinanceur'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CofinanceurForm;
