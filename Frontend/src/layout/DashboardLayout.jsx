import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import toast, { Toaster } from 'react-hot-toast'; 
import { 
  LogOut, LayoutDashboard, Users, FileText, Settings, 
  Menu, Bell, Search, ChevronRight, X, Briefcase, Zap,
  MessageSquare, Info, Loader2 
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { user, logout, loading, checkSession } = useAuth();
  const { notifications, setNotifications } = useChat(); 
  
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const prevNotifCount = useRef(notifications?.length || 0);

  useEffect(() => {
    const hasLocalUser = localStorage.getItem('user') || localStorage.getItem('token');
    if ((!user || !user.name) && !loading && hasLocalUser) {
      checkSession(); 
    }
  }, [user, loading, checkSession]);

  useEffect(() => {
    if (notifications && notifications.length > prevNotifCount.current) {
      const newNotif = notifications.find(n => n.unread) || notifications[0];
      
      if (newNotif) {
        toast(newNotif.text || 'You have a new message!', {
          icon: '🔔',
          duration: 4000,
          style: {
            borderRadius: '1rem',
            background: '#1e293b', 
            color: '#fff',
            fontWeight: '600',
            fontSize: '14px',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
          },
        });
      }
    }
    prevNotifCount.current = notifications?.length || 0;
  }, [notifications]);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium italic">Getting things ready...</p>
      </div>
    );
  }

  const userName = user?.name || 'Guest';
  const userRole = user?.role || 'User';
  const userInitial = userName.charAt(0).toUpperCase();
  const userAvatar = user?.avatar;

  const handleLogout = () => {
    logout();
  };

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

  // 🔥 NAYA FUNCTION: Notifications clear karne ke liye
  const handleClearNotifications = () => {
    setNotifications([]); // Sab notifications hata do
    setIsNotifOpen(false); // Dropdown bhi band kar do
    toast.success("All caught up!", { id: 'notif-clear' }); // Optional mast toast
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* 🔥 POSITION TOP-CENTER KAR DIYA TAAKI BEECH MEIN AAYE */}
      <Toaster position="top-center" reverseOrder={false} />

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60] md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-[70] bg-white border-r border-slate-200 transition-all duration-300 flex flex-col ${isMobileMenuOpen ? 'translate-x-0 w-72 shadow-2xl' : '-translate-x-full md:translate-x-0'} ${isSidebarOpen ? 'md:w-64' : 'md:w-20'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-1.5 rounded-md"><Zap className="text-white" size={18} /></div>
            {(isSidebarOpen || isMobileMenuOpen) && <span className="font-semibold text-base tracking-tight">AI-HIRE</span>}
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="md:hidden"><X size={20} /></button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.name} onClick={() => { navigate(item.path); setMobileMenuOpen(false); }} className={`flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-colors ${isActive(item.path) ? 'bg-slate-100 text-slate-900 font-medium' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
              <div className="shrink-0">{item.icon}</div>
              {(isSidebarOpen || isMobileMenuOpen) && <span className="text-sm">{item.name}</span>}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout} className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-md transition-colors ${(isSidebarOpen || isMobileMenuOpen) ? 'text-slate-500 hover:bg-red-50 hover:text-red-600' : 'justify-center text-slate-400 hover:text-red-600'}`}>
            <LogOut size={18} />
            {(isSidebarOpen || isMobileMenuOpen) && <span className="text-sm font-medium">Log out</span>}
          </button>
        </div>
      </aside>

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button onClick={() => window.innerWidth < 768 ? setMobileMenuOpen(true) : setSidebarOpen(!isSidebarOpen)} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-md">
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
              <span>Dashboard</span>
              <ChevronRight size={14} />
              <span className="text-slate-900 font-medium">{getPageName()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-5">
            <div className="relative">
              <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-md relative">
                <Bell size={20} />
                {notifications.filter(n => n.unread).length > 0 && <span className="absolute top-1 right-1.5 bg-blue-600 w-2.5 h-2.5 rounded-full border-2 border-white animate-pulse"></span>}
              </button>

              {isNotifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)}></div>
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
                    <div className="p-4 border-b flex justify-between bg-slate-50/50">
                      <h3 className="font-semibold">Notifications</h3>
                      
                      {/* 🔥 YE BUTTON AB SAB KUCH CLEAR KAR DEGA */}
                      {notifications.length > 0 && (
                        <button 
                          onClick={handleClearNotifications} 
                          className="text-xs text-blue-600 font-medium hover:text-blue-800 transition-colors"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    <div className="max-h-[320px] overflow-y-auto">
                      {notifications.length === 0 ? <div className="p-6 text-center text-slate-400">No new notifications</div> : 
                        notifications.map(notif => (
                          <div key={notif.id} className={`p-4 border-b hover:bg-slate-50 transition-colors cursor-pointer ${notif.unread ? 'bg-blue-50/30' : ''}`}>
                            <p className="text-sm text-slate-800">{notif.text}</p>
                            <p className="text-[10px] text-slate-400 mt-1 font-medium">{notif.time}</p>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </>
              )}
            </div>

            <div onClick={() => navigate('/profile')} className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-slate-900">{userName}</p>
                <p className="text-xs text-slate-500 capitalize">{userRole}</p>
              </div>
              <div className="w-9 h-9 bg-slate-100 border rounded-full flex items-center justify-center text-slate-600 overflow-hidden group-hover:ring-2 group-hover:ring-blue-100 transition-all">
                {userAvatar ? <img src={userAvatar} className="w-full h-full object-cover" alt="" /> : userInitial}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}