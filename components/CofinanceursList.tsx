
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_COFINANCEURS } from '../mockData';
import { Cofinanceur } from '../types';
import ConfirmationModal from './ConfirmationModal';
import { useNotification } from './NotificationSystem';

const CofinanceursList: React.FC = () => {
  const [cofinanceurs, setCofinanceurs] = useState<Cofinanceur[]>(MOCK_COFINANCEURS);
  const [filter, setFilter] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { showNotification } = useNotification();

  const filtered = cofinanceurs.filter(c => 
    c.nom.toLowerCase().includes(filter.toLowerCase()) || 
    c.type.toLowerCase().includes(filter.toLowerCase())
  );

  const handleDelete = () => {
    if (!deleteId) return;
    // In a real app, check if linked to operations
    setCofinanceurs(prev => prev.filter(c => c.id !== deleteId));
    showNotification('Cofinanceur supprimé avec succès');
    setDeleteId(null);
  };

  const typeColors = {
    ETAT: 'bg-blue-100 text-blue-800',
    REGION: 'bg-indigo-100 text-indigo-800',
    COLLECTIVITE: 'bg-emerald-100 text-emerald-800',
    AUTRE: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#002E5A]">Gestion des Cofinanceurs</h1>
          <p className="subtitle text-[#2d5a8e] mt-1 uppercase tracking-widest font-bold">Répertoire des partenaires financiers</p>
        </div>
        <Link 
          to="/cofinanceurs/new"
          className="bg-[#002E5A] hover:bg-[#2d5a8e] text-white px-6 py-3 rounded-xl flex items-center font-bold text-xs shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 uppercase tracking-widest"
        >
          <i className="fas fa-plus-circle mr-2 text-lg"></i> Nouveau Cofinanceur
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-wrap gap-4 items-center bg-[#f1f3f8]/50">
          <div className="relative flex-1 min-w-[280px]">
             <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none">
                <i className="fas fa-search text-xs"></i>
              </span>
              <input 
                type="text" 
                placeholder="Rechercher par nom ou type..." 
                className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#002E5A] outline-none transition shadow-sm font-medium"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#002E5A] text-white text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="px-8 py-5">Identité</th>
                <th className="px-6 py-5">Type</th>
                <th className="px-6 py-5">Statut</th>
                <th className="px-6 py-5">Créé le</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filtered.map((cof) => (
                <tr key={cof.id} className="group hover:bg-blue-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="font-bold text-[#002E5A] text-sm group-hover:text-[#fe740e] transition-colors">{cof.nom}</div>
                    <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">
                       <span className="bg-gray-100 px-2 py-0.5 rounded mr-2">{cof.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${typeColors[cof.type]}`}>
                      {cof.type}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold ${cof.actif ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {cof.actif ? 'ACTIF' : 'INACTIF'}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-xs text-gray-600">{new Date(cof.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <Link to={`/cofinanceurs/${cof.id}`} className="w-8 h-8 flex items-center justify-center text-[#002E5A] bg-blue-50 rounded-lg hover:bg-blue-100 transition shadow-sm"><i className="fas fa-eye text-xs"></i></Link>
                      <Link to={`/cofinanceurs/${cof.id}/edit`} className="w-8 h-8 flex items-center justify-center text-[#fe740e] bg-orange-50 rounded-lg hover:bg-orange-100 transition shadow-sm"><i className="fas fa-edit text-xs"></i></Link>
                      <button 
                        onClick={() => setDeleteId(cof.id)}
                        className="w-8 h-8 flex items-center justify-center text-[#ff3131] bg-red-50 rounded-lg hover:bg-red-100 transition shadow-sm"
                      >
                        <i className="fas fa-trash-alt text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer ce cofinanceur ? Cette action est irréversible."
        variant="danger"
      />
    </div>
  );
};

export default CofinanceursList;
