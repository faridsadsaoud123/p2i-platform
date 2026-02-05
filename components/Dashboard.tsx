
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MOCK_OPERATIONS, MOCK_REQUESTS } from '../mockData';

const Dashboard: React.FC = () => {
  const totalAE = MOCK_OPERATIONS.reduce((sum, op) => sum + op.aeOpen, 0);
  const totalCP = MOCK_OPERATIONS.reduce((sum, op) => sum + op.cpPaid, 0);
  const pendingRequests = MOCK_REQUESTS.filter(r => r.status === 'EN_ATTENTE').length;

  const budgetData = [
    { name: 'AE Ouvertes', val: totalAE },
    { name: 'AE Engagées', val: MOCK_OPERATIONS.reduce((sum, op) => sum + op.aeEngaged, 0) },
    { name: 'CP Mandatés', val: totalCP },
    { name: 'CP Prévis.', val: MOCK_OPERATIONS.reduce((sum, op) => sum + op.cpForecast, 0) },
  ];

  const statusData = [
    { name: 'En cours', value: 12 },
    { name: 'Terminées', value: 4 },
    { name: 'En étude', value: 8 },
    { name: 'Suspendues', value: 2 },
  ];

  const COLORS = ['#002E5A', '#fe740e', '#2d5a8e', '#ff3131'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#002E5A]">Pilotage Stratégique P2I</h1>
          <p className="subtitle text-[#2d5a8e] mt-1 uppercase tracking-widest font-bold">Vue consolidée du patrimoine immobilier</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-xs font-semibold text-gray-500">
          <i className="far fa-clock mr-2 text-[#fe740e]"></i>
          Situation au {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-[#002E5A] flex flex-col group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-[#002E5A] rounded-xl group-hover:scale-110 transition-transform">
              <i className="fas fa-euro-sign text-xl"></i>
            </div>
            <span className="text-[10px] font-bold text-gray-400">GLOBAL</span>
          </div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-tight">Total AE Ouvertes</p>
          <p className="text-2xl font-bold text-[#002E5A]">{(totalAE / 1000000).toFixed(2)} M€</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-[#fe740e] flex flex-col group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 text-[#fe740e] rounded-xl group-hover:scale-110 transition-transform">
              <i className="fas fa-chart-line text-xl"></i>
            </div>
            <span className="text-[10px] font-bold text-gray-400">CONSOMMATION</span>
          </div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-tight">CP Mandatés</p>
          <p className="text-2xl font-bold text-[#fe740e]">{(totalCP / 1000).toFixed(0)} k€</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-[#2d5a8e] flex flex-col group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-50 text-[#2d5a8e] rounded-xl group-hover:scale-110 transition-transform">
              <i className="fas fa-file-contract text-xl"></i>
            </div>
            <span className="text-[10px] font-bold text-gray-400">FLUX</span>
          </div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-tight">Arbitrages en attente</p>
          <p className="text-2xl font-bold text-[#2d5a8e]">{pendingRequests}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-[#ff3131] flex flex-col group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-50 text-[#ff3131] rounded-xl group-hover:scale-110 transition-transform">
              <i className="fas fa-exclamation-circle text-xl"></i>
            </div>
            <span className="text-[10px] font-bold text-gray-400">ALERTES</span>
          </div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-tight">Retards Critiques</p>
          <p className="text-2xl font-bold text-[#ff3131]">2</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-bold text-[#002E5A] uppercase tracking-wider">Trajectoire Budgétaire</h2>
            <select className="text-[10px] font-bold bg-[#f1f3f8] border-none rounded-lg px-3 py-1 outline-none">
              <option>EXERCICE 2024</option>
              <option>PLAN PLURIANNUEL</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f8" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 600, fill: '#64748b'}} />
                <YAxis hide />
                <Tooltip 
                   cursor={{fill: '#f1f3f8'}}
                   contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px'}}
                   formatter={(value: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)} 
                />
                <Bar dataKey="val" fill="#002E5A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-bold text-[#002E5A] uppercase tracking-wider">État du Parc d'Opérations</h2>
            <i className="fas fa-ellipsis-h text-gray-300"></i>
          </div>
          <div className="h-72 flex flex-col md:flex-row items-center">
            <div className="flex-1 w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-48 space-y-3 mt-4 md:mt-0">
               {statusData.map((item, i) => (
                 <div key={item.name} className="flex items-center justify-between">
                   <div className="flex items-center">
                     <div className="w-2 h-2 rounded-full mr-3" style={{backgroundColor: COLORS[i]}}></div>
                     <span className="text-[10px] font-bold text-gray-600">{item.name}</span>
                   </div>
                   <span className="text-[10px] font-bold text-[#002E5A]">{item.value}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* Critical Actions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-[#002E5A]">
               <h2 className="text-xs font-bold text-white uppercase tracking-widest">Activité Récente du P2I</h2>
               <button className="text-[10px] font-bold text-blue-200 hover:text-white transition">VOIR TOUT</button>
            </div>
            <div className="divide-y divide-gray-50">
               {[
                 { user: 'Marie D.', action: 'a validé la demande', target: 'REQ-2024-001', time: 'il y a 2h', color: 'bg-[#d1fae5]' },
                 { user: 'Paul C.', action: 'a importé les données', target: 'SIFAC', time: 'il y a 4h', color: 'bg-[#dbeafe]' },
                 { user: 'Jean A.', action: 'a modifié le planning', target: 'OP-24-001', time: 'il y a 6h', color: 'bg-orange-50' },
               ].map((item, i) => (
                 <div key={i} className="p-4 hover:bg-gray-50 transition flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center font-bold text-xs`}>
                      {item.user.substring(0, 1)}
                    </div>
                    <div className="flex-1">
                       <p className="text-xs font-bold text-gray-800">
                          {item.user} <span className="font-normal text-gray-500">{item.action}</span> {item.target}
                       </p>
                       <p className="text-[10px] text-gray-400">{item.time}</p>
                    </div>
                    <button className="p-2 text-gray-300 hover:text-[#002E5A]"><i className="fas fa-chevron-right text-xs"></i></button>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-[#fe740e] rounded-2xl shadow-xl p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-700">
              <i className="fas fa-rocket fa-8x -rotate-12"></i>
            </div>
            <div className="relative z-10 h-full flex flex-col">
              <h3 className="text-lg font-bold mb-2">Arbitrage Flash</h3>
              <p className="text-xs text-orange-100 mb-6">Il reste 8 demandes en attente de validation pour le prochain CODIR.</p>
              
              <div className="mt-auto space-y-4">
                 <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[10px] font-bold">Progression Annuelle</span>
                       <span className="text-[10px] font-bold">78%</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/10 rounded-full">
                       <div className="h-full bg-white rounded-full" style={{width: '78%'}}></div>
                    </div>
                 </div>
                 <button className="w-full bg-white text-[#fe740e] font-bold py-3 rounded-xl shadow-lg hover:shadow-2xl transition-all">
                    Lancer l'Arbitrage
                 </button>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
