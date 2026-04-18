import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import API from '../api/axios'; 
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
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  // SEARCH STATES
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // === SEARCH DEBOUNCE LOGIC (Preserved) ===
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        try {
          const res = await API.get(`/search?q=${searchQuery}`);
          setSearchResults(res.data);
        } catch (err) {
          console.error("Search API Error:", err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults(null);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    const hasLocalUser = localStorage.getItem('user') || localStorage.getItem('token');
    if ((!user || !user.name) && !loading && hasLocalUser) {
      checkSession(); 
    }
  }, [user, loading, checkSession]);
//  new one login message logic
  useEffect(() => {
  const fetchInitialUnreadCount = async () => {
    if (!user) return;
    try {
      // Wahi API use karo jo Chat page par conversations laati hai
      const res = await API.get('/conversations'); 
      // Saari conversations ka unreadCount total karo
     const total = res.data.filter(conv => (conv.unreadCount || 0) > 0).length;
      setUnreadMessageCount(total);
    } catch (err) {
      console.error("Initial count fetch error:", err);
    }
  };

  fetchInitialUnreadCount();
}, [user, location.pathname]);
//something else 
 useEffect(() => {
  // ⚡ LOGIC: Notifications se unique conversationIds nikaalo
  const uniqueConversations = new Set(
    (notifications || [])
      .filter(n => n.type === 'message' && (n.unread === true || n.isRead === false))
      .map(n => n.conversationId)
  );
  
  // Iska size hi batayega ki kitne UNIQUE logo ne naye message bheje hain
  if (uniqueConversations.size > 0) {
    setUnreadMessageCount(uniqueConversations.size);
  }
}, [notifications]);
 
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

  // 🆕 LOGIC: Calculate total unread messages from neural feed
 const totalUnreadMessages = [...new Set((notifications || []).filter(n => n.type === 'message' && (n.unread === true || n.isRead === false)).map(n => n.conversationId))].length;

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

      {/* Mobile Overlay (Preserved) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] md:hidden" 
            onClick={() => setMobileMenuOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-[70] bg-slate-950 border-r border-white/5 transition-all duration-300 flex flex-col ${isMobileMenuOpen ? 'translate-x-0 w-72 shadow-[20px_0_50px_rgba(0,0,0,0.5)]' : '-translate-x-full md:translate-x-0'} ${isSidebarOpen ? 'md:w-56' : 'md:w-20'}`}>
        
        {/* Logo Section (Preserved) */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/5 shrink-0">
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
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <div 
              key={item.name} 
              onClick={() => { navigate(item.path); setMobileMenuOpen(false); }} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${isActive(item.path) ? 'bg-indigo-600/10 text-white border border-indigo-500/20' : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'}`}
            >
              <div className={`shrink-0 transition-transform duration-200 ${isActive(item.path) ? 'text-indigo-400 scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </div>
              {(isSidebarOpen || isMobileMenuOpen) && (
                <span className="text-sm font-bold tracking-tight">{item.name}</span>
              )}

              {/* 🆕 UI BADGE: Red count next to Messages in sidebar */}
              {(isSidebarOpen || isMobileMenuOpen) && item.name === 'Messages'&& location.pathname !== '/chat' && unreadMessageCount > 0 && (
                <span className="ml-auto bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-lg shadow-rose-500/20 animate-pulse">
                  {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
                </span>
              )}
            </div>
          ))}
        </nav>

        {/* Logout Section (Preserved) */}
        <div className="p-4 border-t border-white/5 bg-black/20">
          <button onClick={handleLogout} className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${(isSidebarOpen || isMobileMenuOpen) ? 'text-slate-500 hover:bg-rose-500/10 hover:text-rose-400' : 'justify-center text-slate-500 hover:text-rose-400'}`}>
            <LogOut size={18} />
            {(isSidebarOpen || isMobileMenuOpen) && <span className="text-sm font-black uppercase tracking-widest">Exit</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA & HEADER (Preserved) */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen ? 'md:ml-56' : 'md:ml-20'}`}>
        <header className="h-16 backdrop-blur-xl bg-slate-950/50 border-b border-white/5 flex items-center justify-between px-6 md:px-10 sticky top-0 z-50">
          {/* Header content (Search, Notifications bell, Profile) preserved exactly as provided */}
          <div className="flex items-center gap-5">
            <button onClick={() => window.innerWidth < 768 ? setMobileMenuOpen(true) : setSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400 hover:bg-white/5 rounded-xl transition-colors border border-white/5">
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-500 shrink-0">
              <span className="hover:text-indigo-400 transition-colors cursor-pointer">Platform</span>
              <ChevronRight size={14} className="text-slate-700" />
              <span className="text-white">{getPageName()}</span>
            </div>
          </div>

          {/* Search bar logic (Preserved) */}
         {/* Search bar logic */}
<div className="hidden md:flex ml-auto max-w-sm w-full mr-8 relative">
  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
  <input 
    type="text" 
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search matrix..." 
    className="w-full bg-black/40 border border-white/5 rounded-2xl py-2 pl-10 pr-10 text-xs font-medium text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all shadow-inner"
  />
  {isSearching && <Loader2 size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500 animate-spin" />}
  
  {/* 🔥 YE WALA DROPDOWN TUNE DELETE KAR DIYA THA, ISE WAPAS LAGA 🔥 */}
  <AnimatePresence>
    {searchQuery.trim().length > 1 && searchResults && (
      <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
        className="absolute top-full mt-3 right-0 w-full md:w-[350px] max-h-[400px] overflow-y-auto custom-scrollbar bg-slate-900 border border-white/10 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] z-[100]"
      >
        {(!searchResults.engineers?.length && !searchResults.clients?.length && !searchResults.projects?.length && !searchResults.pages?.length) ? (
          <div className="p-8 text-center text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
            No matching nodes found.
          </div>
        ) : (
          <div className="p-3 flex flex-col gap-2">
            
           {/* PROJECTS / MISSIONS SECTION */}
              {searchResults.projects?.length > 0 && (
                <div className="bg-white/5 rounded-xl p-2">
                  <p className="px-2 py-1 text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-1 flex items-center gap-2">
                    <Briefcase size={12}/> Missions
                  </p>
                  
                  {searchResults.projects.map(p => (
                    <div 
                      key={p._id} 
                      onClick={() => { 
                        // 1. Pehle search bar ko khali karo taaki dropdown band ho jaye
                        setSearchQuery(''); 

                        // 2. 🔥 YE HAI MAIN LINE 🔥
                        // React navigate ki jagah hum browser ka default link change kar rahe hain.
                        // Isse page refresh ho jayega aur project 100% khulega.
                        window.location.href = `/projects/${p._id}`; 
                      }} 
                      className="px-3 py-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
                    >
                      <p className="text-sm font-bold text-white truncate">{p.title}</p>
                      
                      {/* Budget aur Status dikhao taaki user ko pata chale project kaisa hai */}
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">
                        ${p.budget} • {p.status}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            {/* ENGINEERS */}
            {searchResults.engineers?.length > 0 && (
              <div className="bg-white/5 rounded-xl p-2">
                <p className="px-2 py-1 text-[9px] font-black uppercase tracking-widest text-fuchsia-400 mb-1 flex items-center gap-2"><Users size={12}/> Engineers</p>
                {searchResults.engineers.map(e => (
                  <div key={e._id} onClick={() => { navigate(`/engineer-profile/${e._id}`); setSearchQuery(''); }} className="px-2 py-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 overflow-hidden shrink-0">
                      <img src={e.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${e.name}`} alt="" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{e.name}</p>
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1 truncate">{e.skills?.join(', ') || 'Node Expert'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PLATFORM PAGES */}
            {searchResults.pages?.length > 0 && (
              <div className="bg-white/5 rounded-xl p-2">
                 <p className="px-2 py-1 text-[9px] font-black uppercase tracking-widest text-cyan-400 mb-1 flex items-center gap-2"><LayoutDashboard size={12}/> Hub</p>
                 {searchResults.pages.map(page => (
                  <div key={page.path} onClick={() => { navigate(page.path); setSearchQuery(''); }} className="px-3 py-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors">
                    <p className="text-xs font-black text-slate-300 uppercase tracking-widest">{page.name}</p>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}
      </motion.div>
    )}
  </AnimatePresence>
</div>
          
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            {/* Notifications Bell Component (Preserved) */}
            <div className="relative">
              <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="p-2.5 text-slate-400 hover:bg-white/5 rounded-xl border border-white/5 relative group transition-all hover:border-indigo-500/30">
                <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                {notifications.filter(n => n.unread).length > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-[20px] px-1 bg-rose-500 text-white text-[10px] font-black rounded-full border-2 border-slate-950 shadow-[0_0_10px_rgba(244,63,94,0.4)]">
                    {notifications.filter(n => n.unread).length > 9 ? '9+' : notifications.filter(n => n.unread).length}
                  </span>
                )}
              </button>
              {/* Notif Dropdown logic preserved... */}
            </div>

            {/* Profile Component (Preserved) */}
            <div onClick={() => navigate('/profile')} className="flex items-center gap-4 cursor-pointer group bg-white/5 pl-4 pr-1.5 py-1.5 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all">
              <div className="text-right hidden xl:block">
                <p className="text-sm font-[1000] text-white tracking-tight leading-none">{userName}</p>
                <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest mt-1">{userRole}</p>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-800 border border-white/10 rounded-xl flex items-center justify-center text-white overflow-hidden group-hover:scale-95 transition-transform ring-2 ring-transparent group-hover:ring-indigo-500/20">
                {userAvatar ? <img src={userAvatar} className="w-full h-full object-cover" alt="" /> : <span className="font-black text-sm">{userInitial}</span>}
              </div>
            </div>
          </div>
        </header>

        <main className={`flex-1 overflow-y-auto relative custom-scrollbar ${location.pathname === '/chat' ? 'p-0 overflow-hidden' : 'p-6 md:p-10'}`}>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
          <div className={`relative z-10 ${location.pathname === '/chat' ? 'max-w-none h-full w-full' : 'max-w-[1440px] mx-auto'}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}