import React, { useState } from 'react';
import { useData } from './DataContext';
import { STATUS_COLORS } from '../constants';
import { useNavigate } from 'react-router-dom';

const IdentifierRegistry: React.FC = () => {
  const { operations } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOps = operations.filter(op => 
    op.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    op.pfiCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    op.nacresCodes?.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())) ||
    op.eotpCodes?.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#002E5A]">Référentiel des Identifiants</h1>
          <p className="subtitle text-[#2d5a8e] mt-1 uppercase tracking-widest font-bold">Vue globale PFI, NACRES & EOTP</p>
        </div>
        <div className="flex gap-2">
            <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                <span className="text-[8px] font-black text-gray-400 uppercase">Total PFI</span>
                <span className="text-sm font-black text-[#002E5A]">{operations.length}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                <span className="text-[8px] font-black text-gray-400 uppercase">Codes NACRES</span>
                <span className="text-sm font-black text-[#fe740e]">{operations.reduce((acc, op) => acc + (op.nacresCodes?.length || 0), 0)}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                <span className="text-[8px] font-black text-gray-400 uppercase">Codes EOTP</span>
                <span className="text-sm font-black text-emerald-600">{operations.reduce((acc, op) => acc + (op.eotpCodes?.length || 0), 0)}</span>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-[#f1f3f8]/30 flex flex-wrap gap-6 items-center">
            <div className="relative flex-1 min-w-[300px]">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none">
                    <i className="fas fa-search"></i>
                </span>
                <input 
                    type="text" 
                    placeholder="Rechercher par PFI, NACRES, EOTP ou Libellé Opération..." 
                    className="block w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-[#002E5A]/10 outline-none transition-all shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#002E5A] text-white text-[10px] uppercase font-black tracking-widest">
              <tr>
                <th className="px-8 py-6">Opération (Libellé)</th>
                <th className="px-6 py-6 text-center">Identifiant PFI</th>
                <th className="px-6 py-6">Codes NACRES</th>
                <th className="px-6 py-6">Codes EOTP</th>
                <th className="px-8 py-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium">
              {filteredOps.map((op) => (
                <tr key={op.id} className="hover:bg-blue-50/20 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="text-xs font-black text-[#002E5A] mb-1">{op.title}</div>
                    <div className="flex items-center gap-2">
                        <span className="text-[8px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-black uppercase">{op.id}</span>
                        <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase ${STATUS_COLORS[op.status]}`}>{op.status.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="bg-[#002E5A] text-[#fe740e] px-4 py-2 rounded-xl text-center font-mono font-black text-sm shadow-inner tracking-widest">
                        {op.pfiCode}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-wrap gap-1">
                        {(op.nacresCodes || []).map((c, i) => (
                            <span key={i} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg text-[9px] font-black border border-indigo-100">{c}</span>
                        ))}
                        {(!op.nacresCodes || op.nacresCodes.length === 0) && <span className="text-gray-300 italic text-[10px]">Aucun</span>}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-wrap gap-1">
                        {(op.eotpCodes || []).map((c, i) => (
                            <span key={i} className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg text-[9px] font-black border border-emerald-100">{c}</span>
                        ))}
                        {(!op.eotpCodes || op.eotpCodes.length === 0) && <span className="text-gray-300 italic text-[10px]">Aucun</span>}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                        onClick={() => navigate('/operations', { state: { selectedOpId: op.id } })}
                        className="text-[#002E5A] hover:text-[#fe740e] transition-colors p-2 bg-gray-50 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-gray-100"
                    >
                        <i className="fas fa-external-link-alt text-xs"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-10 bg-[#002E5A] rounded-[40px] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#fe740e]/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                  <h3 className="text-2xl font-black uppercase tracking-tight">Règles de synchronisation financière</h3>
                  <p className="text-blue-200 text-sm leading-relaxed font-medium">
                      Le référentiel des identifiants est synchronisé quotidiennement avec l'outil SIFAC. 
                      Les codes **PFI** sont générés lors de l'ouverture budgétaire, tandis que les codes **NACRES** 
                      et **EOTP** peuvent être ajustés pour la traçabilité analytique des marchés.
                  </p>
                  <div className="flex gap-4 pt-2">
                      <div className="flex items-center gap-2">
                          <i className="fas fa-check-circle text-emerald-400"></i>
                          <span className="text-[10px] font-black uppercase">Unicité garantie</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <i className="fas fa-check-circle text-emerald-400"></i>
                          <span className="text-[10px] font-black uppercase">Traçabilité auditée</span>
                      </div>
                  </div>
              </div>
              <button className="bg-[#fe740e] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
                  Exporter vers Excel/CSV
              </button>
          </div>
      </div>
    </div>
  );
};

export default IdentifierRegistry;
