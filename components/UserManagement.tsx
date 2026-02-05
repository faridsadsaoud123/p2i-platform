
import React, { useState } from 'react';
import { MOCK_USERS, MOCK_ROLES } from '../mockData';
import { ROLE_LABELS } from '../constants';

type TabType = 'USERS' | 'ROLES' | 'PERMISSIONS';

const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('USERS');
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = MOCK_USERS.filter(u => 
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#002E5A]">Gestion des accès & Comptes</h1>
          <p className="subtitle text-[#2d5a8e] mt-1 uppercase tracking-widest font-bold">Sécurité, rôles et privilèges d'administration</p>
        </div>
        {activeTab === 'USERS' && (
          <button 
            onClick={() => setShowUserModal(true)}
            className="bg-[#002E5A] text-white px-8 py-3 rounded-xl flex items-center font-bold text-[10px] shadow-lg hover:-translate-y-1 transition transform active:scale-95 uppercase tracking-widest"
          >
            <i className="fas fa-user-plus mr-3 text-lg"></i> Créer un compte
          </button>
        )}
        {activeTab === 'ROLES' && (
          <button className="bg-[#fe740e] text-white px-8 py-3 rounded-xl flex items-center font-bold text-[10px] shadow-lg hover:-translate-y-1 transition transform active:scale-95 uppercase tracking-widest">
            <i className="fas fa-plus mr-3 text-lg"></i> Nouveau rôle
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'USERS', label: 'Utilisateurs', icon: 'fa-users' },
          { id: 'ROLES', label: 'Rôles & Métiers', icon: 'fa-user-shield' },
          { id: 'PERMISSIONS', label: 'Droits d\'accès', icon: 'fa-key' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
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

      {/* Content based on Tab */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {activeTab === 'USERS' && (
          <>
            <div className="p-6 bg-[#f1f3f8]/50 flex gap-4">
              <div className="relative flex-1">
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher par nom, e-mail..." 
                  className="w-full pl-11 pr-4 py-3 text-xs bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002E5A] outline-none transition shadow-sm"
                />
              </div>
              <button className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-[#002E5A] transition">
                <i className="fas fa-filter"></i>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#002E5A] text-white text-[10px] uppercase font-bold tracking-widest">
                  <tr>
                    <th className="px-8 py-5">Collaborateur</th>
                    <th className="px-6 py-5">Rôle</th>
                    <th className="px-6 py-5">Service</th>
                    <th className="px-6 py-5">Statut</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="group hover:bg-gray-50 transition">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-[#dbeafe] text-[#002E5A] flex items-center justify-center font-bold text-xs shadow-inner">
                            {user.firstName[0]}{user.lastName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#002E5A]">{user.firstName} {user.lastName}</p>
                            <p className="text-[10px] text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-[10px] font-bold text-[#2d5a8e] uppercase">{ROLE_LABELS[user.role]}</span>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-[10px] font-semibold text-gray-500 italic">{user.service}</span>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${user.status === 'ACTIVE' ? 'bg-[#d1fae5] text-green-700' : 'bg-red-50 text-[#ff3131]'}`}>
                          {user.status === 'ACTIVE' ? 'ACTIF' : 'INACTIF'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-[#002E5A] hover:bg-blue-50 rounded-lg transition"><i className="fas fa-edit"></i></button>
                          <button className="p-2 text-[#ff3131] hover:bg-red-50 rounded-lg transition"><i className="fas fa-user-slash"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Affichage 1 à {filteredUsers.length} sur {MOCK_USERS.length}</p>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-white border border-gray-200 rounded text-xs text-gray-400 hover:text-[#002E5A] disabled:opacity-50" disabled>Précédent</button>
                <button className="px-3 py-1 bg-[#002E5A] text-white rounded text-xs font-bold">1</button>
                <button className="px-3 py-1 bg-white border border-gray-200 rounded text-xs text-gray-400 hover:text-[#002E5A]">Suivant</button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'ROLES' && (
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_ROLES.map(role => (
                <div key={role.id} className="p-6 bg-[#f1f3f8]/30 rounded-2xl border border-gray-100 hover:border-[#fe740e] transition group relative">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-[#fe740e] group-hover:text-white transition">
                      <i className="fas fa-shield-alt text-xl"></i>
                    </div>
                    {role.protected && (
                      <span className="text-[8px] bg-red-100 text-red-600 px-2 py-1 rounded font-bold uppercase"><i className="fas fa-lock mr-1"></i> Protégé</span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-[#002E5A] uppercase tracking-wider mb-2">{role.name}</h3>
                  <p className="text-[11px] text-gray-500 leading-relaxed mb-6 h-12 overflow-hidden">{role.description}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-[9px] font-bold text-gray-400">4 UTILISATEURS</span>
                    <div className="flex gap-2">
                      <button className="text-[#002E5A] hover:underline text-[10px] font-bold uppercase">Éditer</button>
                      {!role.protected && (
                        <button className="text-[#ff3131] hover:underline text-[10px] font-bold uppercase ml-2">Supprimer</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'PERMISSIONS' && (
          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
               <div className="w-full lg:w-64 space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">SÉLECTIONNER UN RÔLE</p>
                  {MOCK_ROLES.map(role => (
                    <button key={role.id} className="w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase transition hover:bg-gray-50 text-[#002E5A] flex justify-between items-center group">
                      {role.name}
                      <i className="fas fa-chevron-right opacity-0 group-hover:opacity-100 transition text-[10px]"></i>
                    </button>
                  ))}
               </div>
               <div className="flex-1 bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-bold text-[#002E5A] uppercase tracking-widest">CONFIGURATION DES DROITS</h3>
                    <button className="bg-[#002E5A] text-white px-6 py-2 rounded-xl text-[10px] font-bold uppercase shadow-md transition hover:brightness-110">Sauvegarder</button>
                  </div>
                  <div className="space-y-4">
                    {['Demandes (Arbitrage)', 'Opérations P2I', 'Finances & SIFAC', 'Marchés Publics', 'Planning & Trésorerie', 'Gestion Utilisateurs'].map(module => (
                      <div key={module} className="bg-white p-4 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <span className="text-xs font-bold text-[#2d5a8e]">{module}</span>
                        <div className="flex flex-wrap gap-6">
                           {['Lecture', 'Modification', 'Validation'].map(action => (
                             <label key={action} className="flex items-center gap-2 cursor-pointer group">
                                <div className="w-5 h-5 rounded border-2 border-gray-200 group-hover:border-[#fe740e] transition flex items-center justify-center">
                                   <input type="checkbox" className="hidden" />
                                   <div className="w-3 h-3 bg-[#fe740e] rounded-sm hidden"></div>
                                </div>
                                <span className="text-[10px] font-semibold text-gray-500 group-hover:text-gray-900 transition">{action}</span>
                             </label>
                           ))}
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#002E5A]/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="bg-[#002E5A] p-6 text-white flex justify-between items-center">
                 <h3 className="text-lg font-bold uppercase tracking-widest">Ajouter un nouveau collaborateur</h3>
                 <button onClick={() => setShowUserModal(false)} className="hover:bg-white/10 p-2 rounded-full transition">
                    <i className="fas fa-times"></i>
                 </button>
              </div>
              <div className="p-8 space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                       <label className="text-[10px] font-bold text-[#2d5a8e] uppercase tracking-wider">Prénom <span className="text-red-500">*</span></label>
                       <input type="text" required className="w-full bg-[#f1f3f8] border-none rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-[#002E5A]" placeholder="Ex: Marie" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-bold text-[#2d5a8e] uppercase tracking-wider">Nom <span className="text-red-500">*</span></label>
                       <input type="text" required className="w-full bg-[#f1f3f8] border-none rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-[#002E5A]" placeholder="Ex: CURIE" />
                    </div>
                    <div className="col-span-2 space-y-1">
                       <label className="text-[10px] font-bold text-[#2d5a8e] uppercase tracking-wider">Email Professionnel <span className="text-red-500">*</span></label>
                       <input type="email" required className="w-full bg-[#f1f3f8] border-none rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-[#002E5A]" placeholder="nom.prenom@univ-picardie.fr" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-bold text-[#2d5a8e] uppercase tracking-wider">Rôle Principal <span className="text-red-500">*</span></label>
                       <select className="w-full bg-[#f1f3f8] border-none rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-[#002E5A]">
                          {MOCK_ROLES.map(r => <option key={r.id}>{r.name}</option>)}
                       </select>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-bold text-[#2d5a8e] uppercase tracking-wider">Direction / Service</label>
                       <input type="text" className="w-full bg-[#f1f3f8] border-none rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-[#002E5A]" placeholder="Ex: DSI - SMILE" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-bold text-[#2d5a8e] uppercase tracking-wider">Fonction</label>
                       <input type="text" className="w-full bg-[#f1f3f8] border-none rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-[#002E5A]" placeholder="Ex: Responsable Technique" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-bold text-[#2d5a8e] uppercase tracking-wider">Téléphone</label>
                       <input type="text" className="w-full bg-[#f1f3f8] border-none rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-[#002E5A]" placeholder="03 22 ..." />
                    </div>
                 </div>

                 <div className="bg-[#d1fae5] p-4 rounded-xl border border-green-200">
                    <p className="text-[10px] font-bold text-green-800 leading-relaxed italic">
                       <i className="fas fa-magic mr-2"></i> Le mot de passe ne sera pas défini par vous. Un lien d'activation sécurisé sera envoyé à l'adresse e-mail renseignée.
                    </p>
                 </div>
              </div>
              <div className="p-6 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
                 <button onClick={() => setShowUserModal(false)} className="px-6 py-3 text-[10px] font-bold text-gray-400 hover:bg-gray-100 rounded-xl transition uppercase">Abandonner</button>
                 <button className="bg-[#fe740e] text-white px-8 py-3 text-[10px] font-bold rounded-xl shadow-lg hover:brightness-110 transition uppercase tracking-widest">Valider & Inviter</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
