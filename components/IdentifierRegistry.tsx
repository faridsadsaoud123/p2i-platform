import React, { useState } from 'react';
import { useData } from './DataContext';
import { useNavigate } from 'react-router-dom';

const IdentifierRegistry: React.FC = () => {
  const { operations } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

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
                <th className="px-10 py-6 text-right">Navigation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredIds.map((id, idx) => (
                <tr key={`${id.opId}-${id.type}-${id.code}-${idx}`} className="hover:bg-blue-50/30 transition-colors group cursor-pointer" onClick={() => navigate('/operations', { state: { selectedOpId: id.opId } })}>
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
                  <td className="px-10 py-6 text-right">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#002E5A] group-hover:text-white transition-all ml-auto shadow-sm">
                        <i className="fas fa-chevron-right text-xs"></i>
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
                  Cette vue permet de lister chaque identifiant financier indépendamment. Cliquez sur une ligne pour être redirigé vers l'opération correspondante et gérer l'identifiant (modification ou suppression).
              </p>
          </div>
          <button 
            onClick={() => navigate('/operations')}
            className="bg-[#002E5A] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all whitespace-nowrap"
          >
              Retour aux Opérations
          </button>
      </div>
    </div>
  );
};

export default IdentifierRegistry;
