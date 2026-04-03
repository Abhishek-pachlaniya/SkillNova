import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LogOut, LayoutDashboard, Users, FileText, Settings, 
  Menu, Bell, Search, ChevronRight, X, Briefcase, Zap
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userName = user?.name || 'Guest';
  const userRole = user?.role || 'User';
  const userInitial = userName.charAt(0).toUpperCase();
  const userAvatar = user?.avatar;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
    { name: 'Projects', icon: <FileText size={18} />, path: '/projects' },
    { name: 'My Projects', icon: <Briefcase size={18} />, path: '/my-projects' },
    { name: 'Engineers', icon: <Users size={18} />, path: '/engineers' },
    { name: 'Settings', icon: <Settings size={18} />, path: '/settings' },
  ];

  const isActive = (path) => location.pathname === path;

  // Helper to format path to breadcrumb name
  const getPageName = () => {
    const item = menuItems.find(i => i.path === location.pathname);
    return item ? item.name : 'Overview';
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* MOBILE SIDEBAR OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60] md:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] bg-white border-r border-slate-200 transition-all duration-300 flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0 w-72 shadow-2xl' : '-translate-x-full md:translate-x-0'}
        ${isSidebarOpen ? 'md:w-64' : 'md:w-20'}
      `}>
        
        {/* Logo Area */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-1.5 rounded-md shrink-0">
              <Zap className="text-white" size={18} />
            </div>
            {(isSidebarOpen || isMobileMenuOpen) && (
              <span className="font-semibold text-base tracking-tight text-slate-900 whitespace-nowrap">
                AI-HIRE
              </span>
            )}
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="md:hidden p-1 text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <div 
              key={item.name} 
              onClick={() => {
                navigate(item.path);
                setMobileMenuOpen(false);
              }}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-colors
                ${isActive(item.path) 
                  ? 'bg-slate-100 text-slate-900 font-medium' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <div className="shrink-0">
                {item.icon}
              </div>
              {(isSidebarOpen || isMobileMenuOpen) && (
                <span className="text-sm whitespace-nowrap">{item.name}</span>
              )}
            </div>
          ))}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className={`
              flex items-center gap-3 w-full px-3 py-2.5 rounded-md transition-colors
              ${(isSidebarOpen || isMobileMenuOpen) 
                ? 'text-slate-500 hover:bg-red-50 hover:text-red-600' 
                : 'justify-center text-slate-400 hover:text-red-600 hover:bg-red-50'}
            `}
          >
            <LogOut size={18} className="shrink-0" />
            {(isSidebarOpen || isMobileMenuOpen) && <span className="text-sm font-medium">Log out</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-50">
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if(window.innerWidth < 768) setMobileMenuOpen(true);
                else setSidebarOpen(!isSidebarOpen);
              }} 
              className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
            >
              <Menu size={20} />
            </button>
            
            {/* Clean Breadcrumbs */}
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="text-slate-500">Dashboard</span>
              <ChevronRight size={14} className="text-slate-400" />
              <span className="text-slate-900 font-medium">{getPageName()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-5">
            {/* Enterprise Search Bar */}
            <div className="hidden lg:flex items-center bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <Search size={16} className="text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent border-none outline-none ml-2 text-sm text-slate-700 w-48 placeholder:text-slate-400" 
                />
            </div>

            {/* Notification Bell */}
            <div className="relative cursor-pointer p-1.5 text-slate-500 hover:bg-slate-100 rounded-md transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 bg-blue-600 w-2 h-2 rounded-full border-2 border-white"></span>
            </div>

            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            {/* User Profile */}
            <div 
              onClick={() => navigate('/profile')} 
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-slate-900 leading-none mb-1">
                  {userName}
                </p>
                <p className="text-xs text-slate-500 capitalize">
                  {userRole}
                </p>
              </div>
              
              <div className="w-9 h-9 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-600 font-medium overflow-hidden group-hover:ring-2 group-hover:ring-blue-100 transition-all">
                {userAvatar ? (
                  <img 
                    src={userAvatar} 
                    alt="profile" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  userInitial
                )}
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}