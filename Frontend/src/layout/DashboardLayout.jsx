import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import toast, { Toaster } from 'react-hot-toast'; 
import { 
  LogOut, LayoutDashboard, Users, FileText, Settings, 
  Menu, Bell, Search, ChevronRight, X, Briefcase, Zap,
  MessageSquare, Info, Loader2, Sparkles 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({ children }) {
  const { user, logout, loading, checkSession } = useAuth();
  const { notifications, setNotifications } = useChat(); 
  
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const prevNotifCount = useRef(notifications?.length || 0);

  // === LOGIC PRESERVED: Session Check ===
  useEffect(() => {
    const hasLocalUser = localStorage.getItem('user') || localStorage.getItem('token');
    if ((!user || !user.name) && !loading && hasLocalUser) {
      checkSession(); 
    }
  }, [user, loading, checkSession]);

  // === LOGIC PRESERVED: Notifications Toast ===
  useEffect(() => {
    if (notifications && notifications.length > prevNotifCount.current) {
      const newNotif = notifications.find(n => n.unread) || notifications[0];
      if (newNotif) {
        toast(newNotif.text || 'You have a new message!', {
          icon: '🔔',
          duration: 4000,
          style: {
            borderRadius: '1rem',
            background: '#0f172a', 
            color: '#fff',
            fontWeight: '600',
            fontSize: '14px',
            border: '1px solid rgba(255,255,255,0.1)'
          },
        });
      }
    }
    prevNotifCount.current = notifications?.length || 0;
  }, [notifications]);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#020617]">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Initializing Neural Link...</p>
      </div>
    );
  }

  const userName = user?.name || 'Guest';
  const userRole = user?.role || 'User';
  const userInitial = userName.charAt(0).toUpperCase();
  const userAvatar = user?.avatar;

  const handleLogout = () => logout();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
    { name: 'Projects', icon: <FileText size={18} />, path: '/projects' },
    { name: 'My Projects', icon: <Briefcase size={18} />, path: '/my-projects' },
    { name: 'Engineers', icon: <Users size={18} />, path: '/engineers' },
    { name: 'Messages', icon: <MessageSquare size={18} />, path: '/chat' },
    { name: 'About Us', icon: <Info size={18} />, path: '/about' },
    { name: 'Settings', icon: <Settings size={18} />, path: '/settings' },
  ];

  const isActive = (path) => location.pathname === path;
  const getPageName = () => menuItems.find(i => i.path === location.pathname)?.name || 'Overview';

  const handleClearNotifications = () => {
    setNotifications([]);
    setIsNotifOpen(false);
    toast.success("All caught up!", { id: 'notif-clear' });
  };

  return (
    <div className="flex h-screen bg-[#020617] font-sans text-slate-300 overflow-hidden">
      
      <Toaster position="top-center" reverseOrder={false} />

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] md:hidden" 
            onClick={() => setMobileMenuOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* === SIDEBAR: World-Class Dark Style === */}
      <aside className={`fixed inset-y-0 left-0 z-[70] bg-slate-950 border-r border-white/5 transition-all duration-300 flex flex-col ${isMobileMenuOpen ? 'translate-x-0 w-72 shadow-[20px_0_50px_rgba(0,0,0,0.5)]' : '-translate-x-full md:translate-x-0'} ${isSidebarOpen ? 'md:w-64' : 'md:w-20'}`}>
        
        {/* Logo Section */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
              <Sparkles className="text-white" size={18} />
            </div>
            {(isSidebarOpen || isMobileMenuOpen) && (
              <span className="font-black text-lg tracking-tighter text-white uppercase">AI-HIRE<span className="text-indigo-500">.</span></span>
            )}
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-white"><X size={20} /></button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <div 
              key={item.name} 
              onClick={() => { navigate(item.path); setMobileMenuOpen(false); }} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${isActive(item.path) ? 'bg-indigo-600/10 text-white border border-indigo-500/20' : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'}`}
            >
              <div className={`shrink-0 transition-transform duration-200 ${isActive(item.path) ? 'text-indigo-400 scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </div>
              {(isSidebarOpen || isMobileMenuOpen) && <span className="text-sm font-bold tracking-tight">{item.name}</span>}
            </div>
          ))}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-white/5 bg-black/20">
          <button onClick={handleLogout} className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${(isSidebarOpen || isMobileMenuOpen) ? 'text-slate-500 hover:bg-rose-500/10 hover:text-rose-400' : 'justify-center text-slate-500 hover:text-rose-400'}`}>
            <LogOut size={18} />
            {(isSidebarOpen || isMobileMenuOpen) && <span className="text-sm font-black uppercase tracking-widest">Exit</span>}
          </button>
        </div>
      </aside>

      {/* === MAIN CONTENT AREA === */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        
        {/* === HEADER: Glassmorphism Style === */}
        <header className="h-20 backdrop-blur-xl bg-slate-950/50 border-b border-white/5 flex items-center justify-between px-6 md:px-10 sticky top-0 z-50">
          <div className="flex items-center gap-5">
            <button onClick={() => window.innerWidth < 768 ? setMobileMenuOpen(true) : setSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400 hover:bg-white/5 rounded-xl transition-colors border border-white/5">
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              <span className="hover:text-indigo-400 transition-colors cursor-pointer">Platform</span>
              <ChevronRight size={14} className="text-slate-700" />
              <span className="text-white">{getPageName()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="p-2.5 text-slate-400 hover:bg-white/5 rounded-xl border border-white/5 relative group transition-all hover:border-indigo-500/30">
                <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                {notifications.filter(n => n.unread).length > 0 && (
                  <span className="absolute top-2 right-2.5 bg-indigo-500 w-2 h-2 rounded-full border border-slate-950 animate-pulse"></span>
                )}
              </button>

              <AnimatePresence>
                {isNotifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)}></div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-80 bg-slate-900 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-white/5 flex justify-between bg-black/20">
                        <h3 className="font-black text-xs uppercase tracking-widest text-white">Neural Feed</h3>
                        {notifications.length > 0 && (
                          <button onClick={handleClearNotifications} className="text-[10px] text-indigo-400 font-black uppercase hover:text-indigo-300 transition-colors">Clear all</button>
                        )}
                      </div>
                      <div className="max-h-[320px] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-10 text-center flex flex-col items-center gap-3">
                            <Zap size={24} className="text-slate-700" />
                            <p className="text-xs text-slate-500 font-bold">No active signals</p>
                          </div>
                        ) : (
                          notifications.map(notif => (
                            <div key={notif.id} className={`p-5 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${notif.unread ? 'bg-indigo-500/5' : ''}`}>
                              <p className="text-sm text-slate-300 font-medium leading-relaxed">{notif.text}</p>
                              <p className="text-[10px] text-slate-500 mt-2 font-black uppercase tracking-tighter italic">{notif.time}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div onClick={() => navigate('/profile')} className="flex items-center gap-4 cursor-pointer group bg-white/5 pl-4 pr-1.5 py-1.5 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-[1000] text-white tracking-tight">{userName}</p>
                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">{userRole}</p>
              </div>
              <div className="w-10 h-10 bg-slate-800 border border-white/10 rounded-xl flex items-center justify-center text-white overflow-hidden group-hover:scale-95 transition-transform ring-2 ring-transparent group-hover:ring-indigo-500/20">
                {userAvatar ? <img src={userAvatar} className="w-full h-full object-cover" alt="" /> : <span className="font-black">{userInitial}</span>}
              </div>
            </div>
          </div>
        </header>

        {/* === MAIN SCROLLABLE AREA: Expanded Width Fix === */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 relative">
          {/* Subtle background glow for main content */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
          
          {/* 🚨 WIDTH FIX: Changed max-w-7xl to max-w-[1440px] and added wider padding */}
          <div className="max-w-[1440px] mx-auto relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}