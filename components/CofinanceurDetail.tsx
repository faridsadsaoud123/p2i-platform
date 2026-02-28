
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_COFINANCEURS, MOCK_OPERATION_COFINANCEURS, MOCK_OPERATIONS } from '../mockData';

const CofinanceurDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const cofinanceur = MOCK_COFINANCEURS.find(c => c.id === id);

  if (!cofinanceur) {
    return <div className="p-8 text-center text-[#002E5A] font-bold">Cofinanceur non trouvé.</div>;
  }

  const linkedOperations = MOCK_OPERATION_COFINANCEURS.filter(oc => oc.cofinanceurId === id);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button 
            onClick={() => navigate('/cofinanceurs')}
            className="text-[#002E5A] font-bold text-[10px] uppercase tracking-widest flex items-center hover:underline mb-4"
          >
            <i className="fas fa-arrow-left mr-2"></i> Retour à la liste
          </button>
          <h1 className="text-2xl font-bold text-[#002E5A]">{cofinanceur.nom}</h1>
          <p className="subtitle text-[#2d5a8e] mt-1 uppercase tracking-widest font-bold">Fiche détaillée du partenaire financier</p>
        </div>
        <Link 
          to={`/cofinanceurs/${cofinanceur.id}/edit`}
          className="bg-[#fe740e] hover:bg-orange-600 text-white px-6 py-3 rounded-xl flex items-center font-bold text-xs shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 uppercase tracking-widest"
        >
          <i className="fas fa-edit mr-2 text-lg"></i> Modifier
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-4">Informations Générales</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Identifiant</span>
                <span className="text-xs font-black text-[#002E5A]">{cofinanceur.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Type</span>
                <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-blue-50 text-[#002E5A]">{cofinanceur.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Statut</span>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black ${cofinanceur.actif ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{cofinanceur.actif ? 'ACTIF' : 'INACTIF'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Créé le</span>
                <span className="text-xs font-black text-[#002E5A]">{new Date(cofinanceur.createdAt).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Dernière MAJ</span>
                <span className="text-xs font-black text-[#002E5A]">{new Date(cofinanceur.updatedAt).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-4 mb-6">Opérations liées</h3>
            {linkedOperations.length === 0 ? (
              <p className="text-xs text-gray-500 italic">Aucune opération liée à ce cofinanceur.</p>
            ) : (
              <div className="space-y-4">
                {linkedOperations.map(oc => {
                  const op = MOCK_OPERATIONS.find(o => o.id === oc.operationId);
                  return (
                    <div key={oc.id} className="p-6 bg-[#f1f3f8]/50 rounded-2xl border border-gray-100 flex justify-between items-center hover:bg-[#dbeafe] transition">
                      <div>
                        <p className="text-xs font-black text-[#002E5A] uppercase">{op?.title || oc.operationId}</p>
                        <p className="text-[9px] text-gray-400 font-bold mt-1">ID: {oc.operationId}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-[#fe740e]">{oc.montantAccorde.toLocaleString()} €</p>
                        <p className="text-[9px] font-bold text-emerald-600 uppercase mt-1">Reçu: {oc.montantRecu.toLocaleString()} €</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CofinanceurDetail;
