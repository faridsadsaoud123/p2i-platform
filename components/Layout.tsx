
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Tableau de bord', icon: 'fa-chart-pie' },
    { path: '/requests', label: 'Recensement', icon: 'fa-file-signature' },
    { path: '/operations', label: 'Opérations P2I', icon: 'fa-tasks' },
    { path: '/finance', label: 'Finance & SIFAC', icon: 'fa-file-invoice-dollar' },
    { path: '/planning', label: 'Planning & Trésorerie', icon: 'fa-calendar-alt' },
    { path: '/users', label: 'Accès & Comptes', icon: 'fa-users-cog' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f1f3f8]">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#002E5A] text-white transition-all duration-300 hidden md:flex flex-col shadow-xl z-20`}>
        <div className="p-6 flex items-center justify-between border-b border-blue-900/50">
          {isSidebarOpen ? (
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-wider">UPJV</span>
              <span className="text-[10px] uppercase tracking-widest text-blue-200">Plateforme P2I</span>
            </div>
          ) : (
            <span className="font-bold text-center w-full">U</span>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-blue-800 rounded transition">
            <i className={`fas ${isSidebarOpen ? 'fa-indent' : 'fa-outdent'}`}></i>
          </button>
        </div>
        
        <nav className="flex-1 mt-6 space-y-1 px-3">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-3 rounded-xl transition-all duration-200 ${
                location.pathname === item.path 
                ? 'bg-[#fe740e] text-white shadow-lg' 
                : 'text-blue-100 hover:bg-blue-800 hover:text-white'
              }`}
            >
              <i className={`fas ${item.icon} w-6 text-center text-lg`}></i>
              {isSidebarOpen && <span className="ml-3 font-medium text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-blue-900/50">
          <div className="flex items-center p-2 bg-blue-900/30 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-[#fe740e] flex items-center justify-center text-white font-bold shadow-inner">JD</div>
            {isSidebarOpen && (
              <div className="ml-3 overflow-hidden">
                <p className="text-xs font-bold truncate">Jean Dupont</p>
                <p className="text-[10px] text-blue-300 truncate italic">Administrateur</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center">
             <div className="flex md:hidden mr-4">
                <span className="font-bold text-[#002E5A] text-xl">UPJV</span>
             </div>
             <h2 className="text-sm font-bold text-[#002E5A] hidden sm:block">Gestion du Patrimoine et des Investissements</h2>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative hidden lg:block">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <i className="fas fa-search text-xs"></i>
              </span>
              <input 
                type="text" 
                placeholder="Identifiant PFI..." 
                className="bg-[#f1f3f8] border-none text-xs rounded-full py-2 pl-9 pr-4 w-48 focus:ring-2 focus:ring-[#002E5A] outline-none transition-all"
              />
            </div>
            
            <div className="flex items-center space-x-2 border-l border-gray-100 pl-4">
              <button className="p-2 text-gray-400 hover:text-[#fe740e] transition relative">
                <i className="fas fa-bell"></i>
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#ff3131] rounded-full ring-2 ring-white"></span>
              </button>
              <button className="p-2 text-gray-400 hover:text-[#002E5A] transition">
                <i className="fas fa-cog"></i>
              </button>
              <button className="ml-2 flex items-center text-xs font-bold text-[#ff3131] hover:bg-red-50 px-3 py-2 rounded-lg transition">
                <i className="fas fa-sign-out-alt mr-2"></i>
                <span>Quitter</span>
              </button>
            </div>
          </div>
        </header>

        {/* Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
