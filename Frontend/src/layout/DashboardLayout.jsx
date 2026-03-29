import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LogOut, LayoutDashboard, Users, FileText, Settings, 
  Menu, Bell, Search, ChevronRight, X 
} from 'lucide-react';

// 1. Helper function ko component ke bahar rakho
const getSafeUser = () => {
  try {
    const savedUser = localStorage.getItem('user');
    if (!savedUser || savedUser === "undefined" || savedUser === "null") {
      return { name: 'Guest', role: 'User' };
    }
    return JSON.parse(savedUser);
  } catch (err) {
    return { name: 'Guest', role: 'User' };
  }
};

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 2. Component ke andar data yahan se uthao
  const userData = getSafeUser();
  const userName = userData.name || 'User';
  const userRole = userData.role || 'Member';
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Projects', icon: <FileText size={20} />, path: '/projects' },
    { name: 'Engineers', icon: <Users size={20} />, path: '/engineers' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
      
      {/* MOBILE SIDEBAR OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] bg-white border-r border-slate-200 transition-all duration-300 flex flex-col shadow-xl md:shadow-sm
        ${isMobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'}
        ${isSidebarOpen ? 'md:w-64' : 'md:w-20'}
      `}>
        
        <div className="flex items-center justify-between p-6 mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100 shrink-0">
              <span className="text-white font-bold text-lg text-center block w-5">🚀</span>
            </div>
            {(isSidebarOpen || isMobileMenuOpen) && (
              <span className="font-black text-xl tracking-tighter text-slate-900 whitespace-nowrap">
                AI-HIRE<span className="text-indigo-600">.</span>
              </span>
            )}
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="md:hidden p-2 text-slate-400">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <div 
              key={item.name} 
              onClick={() => {
                navigate(item.path);
                setMobileMenuOpen(false);
              }}
              className={`
                flex items-center gap-4 p-3.5 rounded-xl cursor-pointer transition-all duration-200 group
                ${isActive(item.path) 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                  : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'}
              `}
            >
              <div className={`${!isActive(item.path) && 'group-hover:scale-110'} transition-transform shrink-0`}>
                {item.icon}
              </div>
              {(isSidebarOpen || isMobileMenuOpen) && (
                <span className="font-bold text-sm whitespace-nowrap">{item.name}</span>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className={`
              flex items-center gap-4 w-full p-3.5 rounded-xl transition-all duration-200 group
              ${(isSidebarOpen || isMobileMenuOpen) 
                ? 'hover:bg-red-50 text-slate-500 hover:text-red-600' 
                : 'justify-center text-slate-400 hover:text-red-600'}
            `}
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform shrink-0" />
            {(isSidebarOpen || isMobileMenuOpen) && <span className="font-bold text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 
        ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        
        <header className="h-20 bg-white/80 border-b border-slate-200 flex items-center justify-between px-4 md:px-8 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => {
                if(window.innerWidth < 768) setMobileMenuOpen(true);
                else setSidebarOpen(!isSidebarOpen);
              }} 
              className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"
            >
              <Menu size={22} />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <span>Pages</span> <ChevronRight size={12} /> <span className="text-indigo-600">Dashboard</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden lg:flex items-center bg-slate-100 px-4 py-2 rounded-xl border border-transparent focus-within:border-indigo-200 focus-within:bg-white transition-all">
                <Search size={18} className="text-slate-400" />
                <input type="text" placeholder="AI Search..." className="bg-transparent border-none outline-none ml-3 text-sm text-slate-600 w-32 xl:w-48" />
            </div>

            <div className="relative cursor-pointer p-2.5 hover:bg-slate-50 rounded-xl transition-colors group">
              <Bell size={20} className="text-slate-500 group-hover:text-indigo-600" />
              <span className="absolute top-2.5 right-2.5 bg-red-500 w-2 h-2 rounded-full border-2 border-white"></span>
            </div>

            <div 
              onClick={() => navigate('/profile')} 
              className="flex items-center gap-3 sm:border-l border-slate-200 sm:pl-6 group cursor-pointer active:scale-95 transition-all"
            >
              <div className="text-right hidden md:block">
                <p className="text-sm font-black text-slate-900 leading-none mb-1 group-hover:text-indigo-600 transition-colors">
                  {userName}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-indigo-500">
                  {userRole}
                </p>
              </div>
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100 group-hover:rotate-6 transition-transform">
                {userInitial}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}