import React, { useState, useEffect } from 'react';
import { 
  User, Lock, Bell, Shield, Save, Camera, Cpu, 
  Wallet, Globe, AlertTriangle, Activity, Moon, Sun,
  CheckCircle2, Terminal, ChevronRight, Zap
} from 'lucide-react';
import API from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default Dark for the vibe

  const [formData, setFormData] = useState({
    name: '', email: '', title: '', bio: '',
    githubUrl: '', linkedinUrl: '', portfolioUrl: '',
    hourlyRate: '', openToAiMatches: true,
    availability: 'Full-time', currentPassword: '',
    newPassword: '', emailNotifs: true,
  });

  // === LOGIC PRESERVED: Fetch Data ===
  useEffect(() => {
    setIsDarkMode(document.body.classList.contains('dark-theme'));
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/users/profile');
        setFormData((prev) => ({
          ...prev,
          name: data.name || '',
          email: data.email || '',
          title: data.companyDetails || (data.skills ? data.skills.join(', ') : ''),
          bio: data.bio || '',
          githubUrl: data.githubUrl || '',
          linkedinUrl: data.linkedinUrl || '',
          portfolioUrl: data.portfolioUrl || '',
          hourlyRate: data.hourlyRate || '',
          openToAiMatches: data.openToAiMatches ?? true,
          availability: data.availability || 'Full-time',
          emailNotifs: data.notifications?.email ?? true,
        }));
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    };
    fetchProfile();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-theme');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await API.put('/users/settings', formData); 
      setFormData((prev) => ({ ...prev, currentPassword: '', newPassword: '' }));
      // Using a modern style instead of standard alert could be better, 
      // but keeping logic same as per instructions.
      alert(response.data.message || "Configuration Synchronized! 🚀");
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || "Link Failure!"));
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', icon: <User size={18} />, label: 'Neural Profile', desc: 'Identity core' },
    { id: 'ai-preferences', icon: <Cpu size={18} />, label: 'AI Logic', desc: 'Matching parameters' },
    { id: 'billing', icon: <Wallet size={18} />, label: 'Financials', desc: 'Payment gateways' },
    { id: 'security', icon: <Lock size={18} />, label: 'Firewall', desc: 'Access control' },
  ];

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* 🚀 Header: Mission Control Style */}
        <div className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <h1 className="text-5xl font-[1000] text-white tracking-tighter italic uppercase leading-none mb-3">
              Settings <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">Console</span>
            </h1>
            <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.4em] flex items-center gap-2">
              <Terminal size={14} className="text-indigo-500" /> Authorized Core Access Only
            </p>
          </motion.div>
          
          <div className="flex items-center gap-4 bg-slate-950/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/5 shadow-2xl">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Network Status</span>
              <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5 uppercase">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Linked
              </span>
            </div>
            <div className="w-px h-8 bg-white/10 mx-2" />
            <button onClick={toggleTheme} className="p-3 bg-white/5 hover:bg-indigo-600 hover:text-white rounded-xl transition-all border border-white/5 group">
              {isDarkMode ? <Moon size={20} className="group-hover:rotate-12 transition-transform" /> : <Sun size={20} className="text-amber-400 group-hover:rotate-90 transition-transform" />}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* 📑 Sidebar: Glassmorphism Style */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-6 py-5 rounded-[1.5rem] text-left transition-all duration-500 border relative group
                  ${activeTab === tab.id
                    ? 'bg-indigo-600/10 border-indigo-500/30 shadow-2xl shadow-indigo-600/10'
                    : 'bg-transparent border-transparent hover:bg-white/[0.03] text-slate-500 hover:text-slate-300'
                }`}
              >
                {activeTab === tab.id && <motion.div layoutId="activeTab" className="absolute inset-0 bg-indigo-600/5 rounded-[1.5rem] -z-10" />}
                <div className={`p-3 rounded-xl transition-all duration-500 shadow-xl ${activeTab === tab.id ? 'bg-indigo-600 text-white scale-110 shadow-indigo-600/40' : 'bg-slate-900 text-slate-600 border border-white/5'}`}>
                  {tab.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-[1000] text-sm uppercase tracking-widest ${activeTab === tab.id ? 'text-white' : 'text-slate-600'}`}>{tab.label}</h3>
                  <p className="text-[9px] font-black text-slate-600 mt-1 uppercase tracking-tighter">{tab.desc}</p>
                </div>
                <ChevronRight size={16} className={`transition-all duration-500 ${activeTab === tab.id ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
              </button>
            ))}
          </div>

          {/* ⚙️ Main Console Area */}
          <div className="flex-1 min-w-0">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-950/40 backdrop-blur-3xl rounded-[3rem] border border-white/5 shadow-2xl p-8 md:p-12 relative overflow-hidden"
            >
              {/* Animated Glow Background */}
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

              <form onSubmit={handleSubmit} className="relative z-10">
                
                {/* 🧑‍💻 NEURAL PROFILE TAB */}
                {activeTab === 'profile' && (
                  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex flex-col md:flex-row items-center gap-10 pb-10 border-b border-white/5">
                      <div className="relative group">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white text-5xl font-[1000] shadow-2xl group-hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden relative">
                          {formData.name ? formData.name.charAt(0).toUpperCase() : 'A'}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Camera size={32} />
                          </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-slate-950 p-3 rounded-2xl border border-white/10 shadow-xl text-indigo-400">
                          <Zap size={16} fill="currentColor" />
                        </div>
                      </div>
                      <div className="text-center md:text-left">
                        <h3 className="text-2xl font-[1000] text-white uppercase tracking-tight">Identity Matrix</h3>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-2 leading-relaxed">Modify your avatar and global meta-data for the ecosystem.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3 group">
                        <label className="text-[10px] font-[1000] text-slate-500 uppercase tracking-[0.3em] ml-2">Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-black/40 border-2 border-white/5 text-white px-6 py-4 rounded-2xl outline-none focus:border-indigo-500/30 focus:bg-black/60 transition-all font-bold tracking-tight shadow-inner" placeholder="Subject Name" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-[1000] text-slate-500 uppercase tracking-[0.3em] ml-2">Email Node</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-black/40 border-2 border-white/5 text-white px-6 py-4 rounded-2xl outline-none focus:border-indigo-500/30 focus:bg-black/60 transition-all font-bold tracking-tight shadow-inner" placeholder="core@network.com" />
                      </div>
                      <div className="md:col-span-2 space-y-3">
                        <label className="text-[10px] font-[1000] text-slate-500 uppercase tracking-[0.3em] ml-2">Mission Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-black/40 border-2 border-white/5 text-white px-6 py-4 rounded-2xl outline-none focus:border-indigo-500/30 focus:bg-black/60 transition-all font-bold tracking-tight shadow-inner" placeholder="Lead Systems Engineer" />
                      </div>
                      <div className="md:col-span-2 space-y-3">
                        <label className="text-[10px] font-[1000] text-slate-500 uppercase tracking-[0.3em] ml-2">Bio / Briefing</label>
                        <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" className="w-full bg-black/40 border-2 border-white/5 text-white px-6 py-4 rounded-2xl outline-none focus:border-indigo-500/30 focus:bg-black/60 transition-all font-bold tracking-tight shadow-inner resize-none" placeholder="Encrypted transmission details..." />
                      </div>
                    </div>

                    <div className="pt-10 border-t border-white/5">
                      <h4 className="text-[11px] font-[1000] text-indigo-400 uppercase tracking-[0.4em] mb-6">Social Handshakes</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {['githubUrl', 'linkedinUrl', 'portfolioUrl'].map((field) => (
                          <div key={field} className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-600 group-focus-within:text-indigo-500 transition-colors">
                              <Globe size={18} />
                            </div>
                            <input type="text" name={field} value={formData[field]} onChange={handleChange} placeholder={field.replace('Url', '').toUpperCase()} className="w-full bg-black/40 border-2 border-white/5 text-white pl-14 pr-5 py-4 rounded-2xl outline-none focus:border-indigo-500/30 transition-all font-bold text-xs uppercase tracking-widest" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* 🤖 AI PREFERENCES TAB */}
                {activeTab === 'ai-preferences' && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="p-8 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                      <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl transition-all group-hover:scale-125" />
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                        <div>
                          <h3 className="text-2xl font-[1000] uppercase tracking-tighter flex items-center gap-3">
                            <Cpu size={24} className="text-cyan-400 animate-spin-slow" /> RAG Auto-Match Core
                          </h3>
                          <p className="text-indigo-100/70 text-xs font-black uppercase tracking-widest mt-2 leading-relaxed max-w-lg">
                            Activate neural scanning to automatically pitch your profile against high-priority project vectors.
                          </p>
                        </div>
                        <div onClick={() => setFormData({...formData, openToAiMatches: !formData.openToAiMatches})} className={`w-16 h-8 rounded-full cursor-pointer p-1 transition-all duration-500 flex items-center ${formData.openToAiMatches ? 'bg-cyan-400' : 'bg-black/40'}`}>
                          <motion.div animate={{ x: formData.openToAiMatches ? 32 : 0 }} className="w-6 h-6 bg-white rounded-full shadow-lg" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-[1000] text-slate-500 uppercase tracking-[0.3em] ml-2">Allocation Rate ($/H)</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-6 flex items-center text-indigo-500 font-black">$</span>
                          <input type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleChange} className="w-full bg-black/40 border-2 border-white/5 text-white pl-12 pr-6 py-4 rounded-2xl outline-none focus:border-indigo-500/30 font-[1000] text-xl" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-[1000] text-slate-500 uppercase tracking-[0.3em] ml-2">Operation Mode</label>
                        <select name="availability" value={formData.availability} onChange={handleChange} className="w-full bg-black/40 border-2 border-white/5 text-white px-6 py-4 rounded-2xl outline-none focus:border-indigo-500/30 font-bold uppercase tracking-widest appearance-none cursor-pointer">
                          <option value="Full-time">Full Deployment</option>
                          <option value="Part-time">Partial Deployment</option>
                          <option value="Contract">On-Demand Sync</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* 💳 FINANCIALS TAB (BILLING) */}
                {activeTab === 'billing' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h3 className="text-[11px] font-[1000] text-indigo-400 uppercase tracking-[0.4em] mb-6">Payment Infrastructure</h3>
                    
                    <div className="p-8 bg-slate-900/50 border border-indigo-500/20 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-slate-900/80 transition-all duration-500">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-500 border border-white/5 shadow-2xl">
                          <Wallet size={32} />
                        </div>
                        <div>
                          <h4 className="text-xl font-[1000] text-white uppercase tracking-tight">Razorpay Master Node</h4>
                          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">Status: Linked and Operational (****4321)</p>
                        </div>
                      </div>
                      <button type="button" className="px-6 py-3 bg-white/5 text-slate-300 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-white hover:text-black transition-all">Re-Configure</button>
                    </div>

                    <div className="p-10 border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-5 cursor-pointer hover:bg-white/[0.02] hover:border-indigo-500/20 transition-all group">
                       <div className="w-14 h-14 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform"><Plus size={24}/></div>
                       <h4 className="text-lg font-black text-white uppercase tracking-widest">Register Alternate Gateway</h4>
                       <p className="text-[10px] font-black text-slate-600 max-w-xs leading-loose uppercase tracking-tighter">Add additional bank entities for multi-channel earnings distribution.</p>
                    </div>
                  </div>
                )}

                {/* 🔒 FIREWALL TAB (SECURITY) */}
                {activeTab === 'security' && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-start gap-5 p-6 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-[1.5rem] backdrop-blur-md">
                      <Shield className="flex-shrink-0 mt-1" size={20} />
                      <div>
                        <h4 className="font-black text-xs uppercase tracking-widest">Protocol Verification Required</h4>
                        <p className="text-[10px] font-bold opacity-70 mt-1 uppercase tracking-tighter leading-relaxed">Current password required for all credential shifts. Multi-factor authentication is globally enforced.</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-[1000] text-slate-500 uppercase tracking-[0.3em] ml-2">Old Key</label>
                        <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} className="w-full bg-black/40 border-2 border-white/5 text-white px-6 py-4 rounded-2xl outline-none focus:border-indigo-500/30 font-bold" placeholder="••••••••" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-[1000] text-slate-500 uppercase tracking-[0.3em] ml-2">New Key</label>
                        <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} className="w-full bg-black/40 border-2 border-white/5 text-white px-6 py-4 rounded-2xl outline-none focus:border-indigo-500/30 font-bold" placeholder="Generate New Node Key" />
                      </div>
                    </div>

                    <div className="pt-12 border-t border-rose-900/20">
                      <h4 className="text-rose-600 font-[1000] mb-6 flex items-center gap-3 uppercase text-xs tracking-[0.3em]">
                        <AlertTriangle size={18} /> Terminal Deletion Zone
                      </h4>
                      <div className="p-8 border border-rose-600/20 bg-rose-600/5 rounded-[2rem] flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
                        <div>
                          <h5 className="font-black text-white uppercase tracking-tight">Wipe Global Profile</h5>
                          <p className="text-[10px] font-black text-rose-700 mt-1 uppercase tracking-tighter">This action is irreversible. All mission logs and credentials will be purged.</p>
                        </div>
                        <button type="button" className="px-8 py-3 bg-rose-600 text-white font-[1000] text-[10px] uppercase tracking-widest rounded-xl hover:bg-rose-700 transition-all shadow-xl shadow-rose-600/20">Execute Wipe</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 💾 Footer Actions: Sticky Floating Style */}
                <div className="mt-16 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-3 opacity-40">
                    <CheckCircle2 size={16} className="text-indigo-500" />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Encryption: AES-256 Validated</p>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="relative group overflow-hidden bg-indigo-600 text-white px-10 py-5 rounded-2xl font-[1000] uppercase text-xs tracking-[0.3em] shadow-2xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all w-full md:w-auto flex items-center justify-center gap-3"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <><Save size={18} /> Update System Config</>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Logic for Plus icon in billing (needs to be defined since I added a plus icon) */}
      {/* If Lucide Plus is not imported, you can add it to the import list or remove the icon */}
    </div>
  );
};

// Internal Helper for Animations (optional, but makes it smooth)
const Plus = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;

export default Settings;