import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 Important import
import { 
  LogOut, 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  Menu, 
  Bell, 
  UserCircle,
  Search,
  ChevronRight
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate(); // 👈 Navigation hook

  const handleLogout = () => {
   localStorage.clear();// Token clear
    navigate('/'); // Redirect to login
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Projects', icon: <FileText size={20} />, path: '/projects' },
    { name: 'Engineers', icon: <Users size={20} />, path: '/engineers' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900">
      
      {/* --- SIDEBAR --- */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-200 transition-all duration-300 hidden md:flex flex-col shadow-sm`}>
        
        {/* Logo Section */}
        <div className="flex items-center gap-3 p-6 mb-4">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
            <span className="text-white font-bold text-lg">🚀</span>
          </div>
          {isSidebarOpen && (
            <span className="font-black text-xl tracking-tighter text-slate-900">
              AI-HIRE<span className="text-indigo-600">.</span>
            </span>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <div 
              key={item.name} 
              onClick={() => navigate(item.path)}
              className="flex items-center gap-4 p-3 hover:bg-indigo-50 rounded-xl cursor-pointer transition-all duration-200 text-slate-500 hover:text-indigo-600 group"
            >
              <div className="group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              {isSidebarOpen && <span className="font-bold text-sm">{item.name}</span>}
            </div>
          ))}
        </nav>

        {/* 🚪 Logout Button (Bottom) */}
        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className={`flex items-center gap-4 w-full p-3 rounded-xl transition-all duration-200 group
              ${isSidebarOpen ? 'hover:bg-red-50 text-slate-500 hover:text-red-600' : 'justify-center text-slate-400 hover:text-red-600'}`}
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            {isSidebarOpen && <span className="font-bold text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOPBAR */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 backdrop-blur-md bg-white/80 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)} 
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
            >
              <Menu size={22} />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-slate-400 text-sm font-medium">
               <span>Pages</span> <ChevronRight size={14} /> <span className="text-slate-900">Dashboard</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Search Bar (Subtle) */}
            <div className="hidden lg:flex items-center bg-slate-100 px-4 py-2 rounded-xl border border-transparent focus-within:border-indigo-200 focus-within:bg-white transition-all">
               <Search size={18} className="text-slate-400" />
               <input type="text" placeholder="AI Search..." className="bg-transparent border-none outline-none ml-3 text-sm text-slate-600 w-48" />
            </div>

            {/* Notification */}
            <div className="relative cursor-pointer p-2 hover:bg-slate-50 rounded-lg transition-colors group">
              <Bell size={22} className="text-slate-500 group-hover:text-indigo-600" />
              <span className="absolute top-2 right-2 bg-indigo-600 w-2 h-2 rounded-full border-2 border-white"></span>
            </div>

            {/* Profile Dropdown Simulation */}
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6 group cursor-pointer relative">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 leading-none mb-1">Aryan Engineer</p>
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Engineer</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold border border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                AE
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
}