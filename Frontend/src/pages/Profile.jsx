import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  FaUserCircle, FaGithub, FaLinkedin, FaGlobe, 
  FaMapMarkerAlt, FaSave, FaBriefcase, FaCode, FaCamera
} from 'react-icons/fa';
import { MdOutlineWorkHistory } from 'react-icons/md';
import { Sparkles, Cpu, Terminal, Zap, ArrowUpRight, Globe, Loader2, Plus } from 'lucide-react'; 
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
const POPULAR_SKILLS = ["React", "Node.js", "Express.js", "MongoDB", "JavaScript", "TypeScript", "Python", "Next.js", "Tailwind"];

const Profile = () => {
  const { updateUserData, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false); 
  const [userRole, setUserRole] = useState('engineer');
  const [imageFile, setImageFile] = useState(null); 
  const [previewUrl, setPreviewUrl] = useState(null); 

  const [formData, setFormData] = useState({
    name: '', bio: '', skills: '', location: '', githubUrl: '', 
    linkedinUrl: '', portfolioUrl: '', experience: '', company: '',
    avatar: ''
  });

  // === LOGIC PRESERVED ===
  const fetchProfile = async () => {
    try {
      const res = await API.get('/users/profile');
      const data = res.data;
      if (data) { updateUserData(data); }
      setUserRole(data.role || 'engineer'); 
      
      let parsedSkills = '';
      if (Array.isArray(data.skills)) { parsedSkills = data.skills.join(', '); }
      else if (typeof data.skills === 'string') {
          try {
              const jsonSkills = JSON.parse(data.skills);
              if(Array.isArray(jsonSkills)){ parsedSkills = jsonSkills.join(', '); }
              else { parsedSkills = data.skills; }
          } catch(e) { parsedSkills = data.skills; }
      }

      setFormData({
        ...data,
        avatar: data.avatar || '', 
        skills: parsedSkills, 
        experience: data.experience || '',
        company: data.company || ''
      });
    } catch (err) { console.error("Fetch Error:", err); }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const handleAddSkill = (skillToAdd) => {
    const currentSkills = formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
    if (!currentSkills.some(s => s.toLowerCase() === skillToAdd.toLowerCase())) {
      setFormData({ ...formData, skills: [...currentSkills, skillToAdd].join(', ') });
      toast.success(`${skillToAdd} added!`, { icon: '✨' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const savePromise = new Promise(async (resolve, reject) => {
      try {
        const data = new FormData();
        data.append('name', formData.name);
        data.append('bio', formData.bio);
        data.append('location', formData.location);
        data.append('githubUrl', formData.githubUrl);
        data.append('linkedinUrl', formData.linkedinUrl);
        data.append('portfolioUrl', formData.portfolioUrl);
        if (userRole === 'engineer') {
          const processedSkills = formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
          data.append('skills', JSON.stringify(processedSkills));
          data.append('experience', formData.experience);
        } else { data.append('company', formData.company); }
        if (imageFile) { data.append('avatar', imageFile); }
        const res = await API.put('/users/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        updateUserData(res.data);
        resolve(res.data);
      } catch (err) { reject(err); }
      finally { setLoading(false); }
    });
    toast.promise(savePromise, { loading: 'Syncing Matrix...', success: 'Profile Saved! ✨', error: 'Save Failed!' });
  };

  const handleGenerateAI = async () => {
    setAiLoading(true);
    const aiPromise = new Promise(async (resolve, reject) => {
      try {
        const res = await API.post('/ai/index-profile');
        resolve(res.data);
      } catch (err) { reject(err); }
      finally { setAiLoading(false); }
    });
    toast.promise(aiPromise, { loading: 'RAG Engine Syncing...', success: 'AI Profile Indexed! 🚀', error: 'Sync failed!' });
  };

  return (
    // 🚀 PERMANENT DARK CONTAINER: Fit to screen
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col gap-5 max-w-[1400px] mx-auto pb-6">
      <Toaster position="top-center" toastOptions={{ style: { background: '#020617', color: '#fff', border: '1px solid rgba(255,255,255,0.05)' }}} />

      {/* 📁 TOP HEADER: Enterprise Dark Glassmorphism */}
      <div className="bg-slate-950/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 p-6 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden shrink-0">
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative group shrink-0">
            <img 
              src={previewUrl || formData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${formData.name}`} 
              className="w-24 h-24 md:w-28 md:h-28 rounded-3xl border-4 border-slate-900 bg-slate-900 shadow-2xl object-cover transition-transform group-hover:scale-105"
              alt="profile"
            />
            <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 p-2 bg-indigo-600 text-white rounded-xl shadow-xl border border-slate-950 cursor-pointer hover:bg-indigo-700 transition-all">
              <FaCamera size={14} />
              <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-3xl font-[1000] text-white tracking-tighter uppercase italic leading-none">{formData.name || "UNIDENTIFIED NODE"}</h1>
            <div className="flex items-center gap-3 mt-4">
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/10 flex items-center gap-2">
                <Terminal size={12} /> {userRole === 'engineer' ? 'Neural Architect' : 'Strategic Client'}
              </span>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Globe size={12} className="text-indigo-500" /> {formData.location || 'Remote Node'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 relative z-10">
          {userRole === 'engineer' && (
            <button onClick={handleGenerateAI} disabled={aiLoading} className="px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:scale-105 transition-all flex items-center gap-2.5">
              {aiLoading ? <Loader2 size={16} className="animate-spin" /> : <><Sparkles size={16} /> AI Sync</>}
            </button>
          )}
          <button onClick={handleSubmit} disabled={loading} className="px-6 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2.5 shadow-2xl">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <><FaSave size={16}/> Save Node</>}
          </button>
        </div>
      </div>

      {/* 🛠️ BENTO FORM GRID: No-scroll design */}
      <form onSubmit={handleSubmit} className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        
        {/* Identity Section */}
        <div className="bg-slate-950/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 p-8 flex flex-col gap-6 shadow-2xl overflow-y-auto custom-scrollbar">
          <SectionHeader icon={<FaUserCircle />} title="Identity Matrix" />
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Subject Designation</label>
              <input type="text" placeholder="Full Name" value={formData.name} className={inputStyle} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Neural briefing (Bio)</label>
              <textarea placeholder="Describe your mission goals..." rows="4" value={formData.bio} className={`${inputStyle} resize-none`} onChange={(e) => setFormData({...formData, bio: e.target.value})} />
            </div>
          </div>

          {userRole === 'engineer' && (
            <div className="mt-4 pt-8 border-t border-white/5">
              <SectionHeader icon={<FaCode />} title="Skill Vectors" />
              <input type="text" placeholder="React, Python, AWS..." value={formData.skills} className={`${inputStyle} text-indigo-400 font-black mb-4`} onChange={(e) => setFormData({...formData, skills: e.target.value})} />
              <div className="flex flex-wrap gap-2">
                {POPULAR_SKILLS.map((s) => (
                  <button key={s} type="button" onClick={() => handleAddSkill(s)} className="px-3.5 py-2 text-[9px] font-black rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-all uppercase">
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Network Section */}
        <div className="bg-slate-950/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 p-8 flex flex-col gap-6 shadow-2xl overflow-y-auto custom-scrollbar">
          <SectionHeader icon={<FaGlobe />} title="Network Presence" />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Node Location</label>
              <IconInputGroup icon={<FaMapMarkerAlt />} placeholder="City/Remote" value={formData.location} onChange={(val) => setFormData({...formData, location: val})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">{userRole === 'engineer' ? 'Service Years' : 'Entity Name'}</label>
              <IconInputGroup 
                icon={userRole === 'engineer' ? <MdOutlineWorkHistory /> : <FaBriefcase />} 
                placeholder={userRole === 'engineer' ? "Experience" : "Company"}
                value={userRole === 'engineer' ? formData.experience : formData.company} 
                onChange={(val) => setFormData(userRole === 'engineer' ? {...formData, experience: val} : {...formData, company: val})} 
              />
            </div>
          </div>

          <div className="space-y-6 mt-4 pt-8 border-t border-white/5">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">GitHub Repository</label>
                <SocialInput icon={<FaGithub />} placeholder="https://github.com/..." value={formData.githubUrl} onChange={(val) => setFormData({...formData, githubUrl: val})} />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">LinkedIn Professional</label>
                <SocialInput icon={<FaLinkedin />} placeholder="https://linkedin.com/in/..." value={formData.linkedinUrl} onChange={(val) => setFormData({...formData, linkedinUrl: val})} />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Neural Portfolio</label>
                <SocialInput icon={<Globe size={18} />} placeholder="https://portfolio.com" value={formData.portfolioUrl} onChange={(val) => setFormData({...formData, portfolioUrl: val})} />
             </div>
          </div>

          <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between opacity-30 italic">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
               <Zap size={14} className="text-indigo-500" /> Data Transmission Encrypted
            </span>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

// --- PERMANENT DARK UI COMPONENTS ---

const SectionHeader = ({ icon, title }) => (
  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2.5 mb-2">
    <span className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl border border-indigo-500/10">{icon}</span> {title}
  </h3>
);

const IconInputGroup = ({ icon, placeholder, value, onChange }) => (
  <div className="flex items-center gap-3 bg-black/40 p-4 rounded-2xl border border-white/5 focus-within:border-indigo-500/30 transition-all shadow-inner">
    <span className="text-slate-500 shrink-0 text-lg">{icon}</span>
    <input placeholder={placeholder} value={value} className="bg-transparent outline-none w-full text-[14px] font-bold text-white placeholder:text-slate-700" onChange={(e) => onChange(e.target.value)} />
  </div>
);

const SocialInput = ({ icon, placeholder, value, onChange }) => (
  <div className="flex items-center gap-4 bg-black/40 p-4.5 rounded-2xl border border-white/5 focus-within:border-indigo-500/30 transition-all shadow-inner">
    <span className="text-slate-500 shrink-0 text-xl">{icon}</span>
    <input placeholder={placeholder} value={value} className="bg-transparent outline-none w-full text-[14px] font-bold text-white placeholder:text-slate-700" onChange={(e) => onChange(e.target.value)} />
  </div>
);

const inputStyle = "w-full p-4.5 bg-black/40 rounded-2xl border border-white/5 focus:border-indigo-500/30 outline-none text-[14px] font-bold text-white transition-all placeholder:text-slate-700 shadow-inner";

export default Profile;