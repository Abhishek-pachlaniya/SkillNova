import React, { useState, useEffect } from 'react';
import { User, Lock, Bell, Shield, Save, Camera, Cpu, Wallet, Globe, AlertTriangle, Activity, Moon, Sun } from 'lucide-react';
import API from '../api/axios'; // Tera custom Axios instance

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // 🧠 State Initialization
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    bio: '',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    hourlyRate: '',
    openToAiMatches: true,
    availability: 'Full-time',
    currentPassword: '',
    newPassword: '',
    emailNotifs: true,
  });

  // 🚀 1. Fetch Real Data from Database on Load
  useEffect(() => {
    // Check if body already has dark-theme class (persisting user preference)
    setIsDarkMode(document.body.classList.contains('dark-theme'));

    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/users/profile');
        
        // Data aane ke baad state update karo
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
          // Passwords DB se fetch nahi hote, inhe empty hi rehne do
          currentPassword: '',
          newPassword: '',
        }));
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    };
    fetchProfile();
  }, []);

  // 🌙 Dark Mode Toggle Logic
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-theme');
  };

  // 🔄 2. Handle Inputs (Text, Numbers, and Checkboxes)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  // 📤 3. Submit Updated Data to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await API.put('/users/settings', formData); 
      alert(response.data.message || "Settings ekdum makhan ki tarah update ho gayi! 🚀");
      
      // Update hone ke baad passwords clear kar do
      setFormData((prev) => ({ ...prev, currentPassword: '', newPassword: '' }));
    } catch (error) {
      console.error("Update error:", error);
      const errorMsg = error.response?.data?.message || "Kuch toh gadbad hai daya!";
      alert("Error: " + errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // 📑 Sidebar Config
  const tabs = [
    { id: 'profile', icon: <User size={18} />, label: 'Public Profile', desc: 'Manage your public persona' },
    { id: 'ai-preferences', icon: <Cpu size={18} />, label: 'AI Matching', desc: 'RAG system preferences' },
    { id: 'billing', icon: <Wallet size={18} />, label: 'Billing & Payouts', desc: 'Manage Razorpay details' },
    { id: 'security', icon: <Lock size={18} />, label: 'Security', desc: 'Passwords & Danger Zone' },
  ];

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 font-sans transition-colors duration-300">
      <div className="max-w-6xl mx-auto animate-fade-in">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Settings Console</h1>
            <p className="text-slate-500 font-medium">Control your ecosystem, preferences, and AI interactions.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full font-bold text-sm shadow-sm border border-indigo-200">
            <Activity size={16} className="animate-pulse" />
            System Status: Connected
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* 📑 Premium Sidebar */}
          <div className="w-full lg:w-72 flex-shrink-0 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white shadow-lg shadow-slate-200/50 border border-indigo-100 ring-1 ring-indigo-50'
                    : 'hover:bg-slate-200/50 text-slate-600 border border-transparent'
                }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-slate-200 text-slate-500'}`}>
                  {tab.icon}
                </div>
                <div>
                  <h3 className={`font-bold transition-colors ${activeTab === tab.id ? 'text-indigo-950' : 'text-slate-700'}`}>{tab.label}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{tab.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* ⚙️ Form Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 md:p-10 relative overflow-hidden transition-colors duration-300">
              
              {/* Subtle background glow effect */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-3xl -z-10 pointer-events-none"></div>

              <form onSubmit={handleSubmit}>
                
                {/* 🧑‍💻 PROFILE TAB */}
                {activeTab === 'profile' && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="flex items-center gap-8 border-b border-slate-100 pb-8">
                      <div className="relative group cursor-pointer">
                        <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-indigo-200 group-hover:scale-105 transition-transform duration-300">
                          {formData.name ? formData.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                          <Camera className="text-white" size={28} />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900">Avatar & Identity</h3>
                        <p className="text-sm text-slate-500 mt-1">Upload a professional photo. Recommended size 500x500px.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium outline-none" placeholder="Your Name" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium outline-none" placeholder="you@example.com" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-slate-700">Professional Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Senior MERN Stack Developer & AI Enthusiast" className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium outline-none" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-slate-700">Bio</label>
                        <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" placeholder="Tell clients about yourself..." className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium outline-none resize-none" />
                      </div>
                    </div>
                    
                    {/* Digital Footprint */}
                    <div className="pt-6 border-t border-slate-100">
                      <h4 className="font-black text-slate-900 mb-4">Digital Footprint</h4>
                      <div className="space-y-4">
                        <div className="flex relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Globe size={18} className="text-slate-400" /></div>
                          <input type="text" name="githubUrl" value={formData.githubUrl} onChange={handleChange} placeholder="GitHub Profile URL" className="w-full pl-12 pr-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 transition-all outline-none" />
                        </div>
                        <div className="flex relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Globe size={18} className="text-slate-400" /></div>
                          <input type="text" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} placeholder="LinkedIn Profile URL" className="w-full pl-12 pr-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 transition-all outline-none" />
                        </div>
                        <div className="flex relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Globe size={18} className="text-slate-400" /></div>
                          <input type="text" name="portfolioUrl" value={formData.portfolioUrl} onChange={handleChange} placeholder="Personal Portfolio URL" className="w-full pl-12 pr-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 transition-all outline-none" />
                        </div>
                      </div>
                    </div>

                    {/* 🌙 APPEARANCE & THEME TOGGLE (Naya Section Yahan Hai) */}
                    <div className="pt-6 border-t border-slate-100">
                      <h4 className="font-black text-slate-900 mb-4">Appearance</h4>
                      <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-200 rounded-2xl transition-colors duration-300">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl transition-colors duration-300 ${isDarkMode ? 'bg-indigo-900/20 text-indigo-600' : 'bg-white text-amber-500 shadow-sm border border-slate-200'}`}>
                            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">Dark Mode</h4>
                            <p className="text-xs text-slate-500 mt-1">Switch between light and dark themes globally.</p>
                          </div>
                        </div>
                        
                        {/* Custom Toggle Switch for Theme */}
                        <div className="relative inline-block w-14 mr-2 align-middle select-none">
                          <input 
                            type="checkbox" 
                            checked={isDarkMode} 
                            onChange={toggleTheme} 
                            className="toggle-checkbox absolute block w-7 h-7 rounded-full bg-white border-4 appearance-none cursor-pointer border-indigo-200 z-10" 
                            style={{ right: isDarkMode ? '0' : '1.75rem', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
                          />
                          <label className={`toggle-label block overflow-hidden h-7 rounded-full cursor-pointer transition-colors duration-300 ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}></label>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
                
                {/* 🤖 AI PREFERENCES TAB */}
                {activeTab === 'ai-preferences' && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="p-6 bg-gradient-to-r from-indigo-950 to-slate-900 rounded-3xl text-white shadow-xl shadow-indigo-900/20">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-black mb-2 flex items-center gap-2"><Cpu className="text-indigo-400" /> RAG Auto-Match Engine</h3>
                          <p className="text-slate-400 text-sm max-w-md leading-relaxed">When active, our AI scans client requirements and automatically pitches your profile for perfect matches.</p>
                        </div>
                        
                        {/* Custom Toggle Switch */}
                        <div className="relative inline-block w-14 mr-2 align-middle select-none">
                          <input type="checkbox" name="openToAiMatches" checked={formData.openToAiMatches} onChange={handleChange} className="toggle-checkbox absolute block w-7 h-7 rounded-full bg-white border-4 appearance-none cursor-pointer border-indigo-200 z-10" style={{ right: formData.openToAiMatches ? '0' : '1.75rem', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}/>
                          <label className={`toggle-label block overflow-hidden h-7 rounded-full cursor-pointer transition-colors duration-300 ${formData.openToAiMatches ? 'bg-indigo-500' : 'bg-slate-300'}`}></label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Expected Hourly Rate ($)</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-5 flex items-center text-slate-400 font-bold">$</span>
                          <input type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleChange} placeholder="50" className="w-full pl-10 pr-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold outline-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Availability</label>
                        <select name="availability" value={formData.availability} onChange={handleChange} className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium outline-none appearance-none cursor-pointer">
                          <option value="Full-time">Full-time (40h/week)</option>
                          <option value="Part-time">Part-time (20h/week)</option>
                          <option value="Contract">Contract / Project based</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* 💳 BILLING TAB */}
                {activeTab === 'billing' && (
                  <div className="space-y-8 animate-fade-in">
                    <h3 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-4">Payment Methods</h3>
                    
                    <div className="p-6 border border-slate-200 rounded-3xl bg-slate-50 flex items-center justify-between hover:border-indigo-300 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600">
                          <Wallet size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">Razorpay Connected</h4>
                          <p className="text-sm text-slate-500">Payouts enabled for *********4321</p>
                        </div>
                      </div>
                      <button type="button" className="text-sm font-bold text-indigo-600 hover:text-indigo-800">Edit</button>
                    </div>

                    <div className="p-6 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center gap-3 cursor-pointer hover:bg-slate-50 hover:border-indigo-300 transition-all">
                       <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center"><Wallet size={18}/></div>
                       <h4 className="font-bold text-slate-900">Add New Bank Account</h4>
                       <p className="text-xs text-slate-500 max-w-xs">Link another bank account to receive your project earnings securely.</p>
                    </div>
                  </div>
                )}

                {/* 🔒 SECURITY TAB */}
                {activeTab === 'security' && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="flex items-start gap-4 p-5 bg-amber-50 text-amber-800 border border-amber-200 rounded-2xl">
                      <Shield className="flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <h4 className="font-bold text-sm">Security Best Practices</h4>
                        <p className="text-xs font-medium opacity-80 mt-1 leading-relaxed">To update your password, you must enter your current password first. Use at least 8 characters.</p>
                      </div>
                    </div>
                    
                    <div className="space-y-5 max-w-md">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Current Password</label>
                        <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none" placeholder="••••••••" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">New Password</label>
                        <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none" placeholder="Create new password" />
                      </div>
                    </div>

                    {/* DANGER ZONE */}
                    <div className="pt-10 mt-10 border-t border-red-100">
                      <h4 className="text-red-600 font-black mb-4 flex items-center gap-2"><AlertTriangle size={18} /> Danger Zone</h4>
                      <div className="p-6 border border-red-200 bg-red-50 rounded-3xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                          <h5 className="font-bold text-red-900">Delete Account</h5>
                          <p className="text-sm text-red-700 mt-1">Permanently remove your account, projects, and all data.</p>
                        </div>
                        <button type="button" className="px-5 py-2.5 bg-white text-red-600 font-bold border border-red-200 rounded-xl hover:bg-red-600 hover:text-white transition-colors shadow-sm">Delete Account</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 💾 Form Actions (Sticky Bottom Style) */}
                <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-slate-400 font-medium text-center sm:text-left">Changes will be saved securely to the database.</p>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black tracking-wide hover:bg-indigo-700 hover:scale-[1.02] focus:ring-4 focus:ring-indigo-500/20 active:scale-[0.98] transition-all shadow-lg shadow-indigo-600/25 disabled:opacity-70 disabled:pointer-events-none w-full sm:w-auto justify-center"
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <><Save size={20} /> Save Configuration</>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;