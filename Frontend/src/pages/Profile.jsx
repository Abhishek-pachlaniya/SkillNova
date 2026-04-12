import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  FaUserCircle, FaGithub, FaLinkedin, FaGlobe, 
  FaMapMarkerAlt, FaSave, FaBriefcase, FaCode, FaCamera, FaEdit
} from 'react-icons/fa';
import { MdOutlineWorkHistory } from 'react-icons/md';
import { Sparkles, Terminal, Zap, Globe, Loader2 } from 'lucide-react'; 
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import CreatableSelect from 'react-select/creatable'; 

const TECH_SKILLS = [
  "React", "Node.js", "Express.js", "MongoDB", "JavaScript", "TypeScript", "Python", 
  "Next.js", "Tailwind CSS", "AWS", "Docker", "Kubernetes", "GraphQL", "PostgreSQL", 
  "MySQL", "Redis", "Firebase", "Supabase", "Prisma", "Java", "C++", "C#", "Go", 
  "Rust", "Vue.js", "Angular", "Svelte", "Framer Motion", "Linux", "Git", "Machine Learning", 
  "TensorFlow", "PyTorch", "RAG", "LangChain"
];

const Profile = () => {
  const { updateUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false); 
  const [userRole, setUserRole] = useState('engineer');
  const [imageFile, setImageFile] = useState(null); 
  const [previewUrl, setPreviewUrl] = useState(null); 
  const [isEditing, setIsEditing] = useState(false); 

  const [formData, setFormData] = useState({
    name: '', bio: '', skills: '', location: '', githubUrl: '', 
    linkedinUrl: '', portfolioUrl: '', experience: '', company: '',
    avatar: ''
  });

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
      toast.success(`${skillToAdd} added!`, { icon: '✨', style: { background: '#020617', color: '#fff' } });
    }
  };

  const handleSelectChange = (selectedOptions) => {
    const skillsString = selectedOptions ? selectedOptions.map(option => option.value).join(', ') : '';
    setFormData({ ...formData, skills: skillsString });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    const githubRegex = /^https?:\/\/(www\.)?github\.com\/.+/i;
    const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/.+/i;
    const generalUrlRegex = /^https?:\/\/.+/i; 

    const errorToastStyle = { background: '#0f172a', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' };

    if (formData.githubUrl && !githubRegex.test(formData.githubUrl)) {
      toast.error("Invalid GitHub URL! Must start with https://github.com/", { style: errorToastStyle });
      return; 
    }

    if (formData.linkedinUrl && !linkedinRegex.test(formData.linkedinUrl)) {
      toast.error("Invalid LinkedIn URL! Must start with https://linkedin.com/in/", { style: errorToastStyle });
      return; 
    }

    if (formData.portfolioUrl && !generalUrlRegex.test(formData.portfolioUrl)) {
      toast.error("Invalid Portfolio URL! Must start with http:// or https://", { style: errorToastStyle });
      return; 
    }

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
        setIsEditing(false); 
        resolve(res.data);
      } catch (err) { reject(err); }
      finally { setLoading(false); }
    });
    toast.promise(savePromise, { loading: 'Syncing Matrix...', success: 'Profile Saved! ✨', error: 'Save Failed!' }, { style: { background: '#020617', color: '#fff', border: '1px solid rgba(255,255,255,0.05)' }});
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
    toast.promise(aiPromise, { loading: 'Indexing to RAG...', success: 'Profile Added to RAG! 🚀', error: 'Indexing failed!' }, { style: { background: '#020617', color: '#fff', border: '1px solid rgba(255,255,255,0.05)' }});
  };

  const currentSkillsArray = formData.skills 
    ? formData.skills.split(',').map(s => ({ value: s.trim(), label: s.trim() })).filter(s => s.value) 
    : [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col gap-5 max-w-[1400px] mx-auto pb-6">
      {/* 🆕 UPDATED TOASTER COMPONENT */}
      <Toaster 
        position="top-center" 
        containerStyle={{
          zIndex: 999999, // Sabse aage
          top: '100px',    // Navbar ke niche
        }}
      />

      {/* 📁 TOP HEADER */}
      <div className="bg-slate-950/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 p-6 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden shrink-0">
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative group shrink-0">
            <img 
              src={previewUrl || formData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${formData.name}`} 
              className="w-24 h-24 md:w-28 md:h-28 rounded-3xl border-4 border-slate-900 bg-slate-900 shadow-2xl object-cover transition-transform group-hover:scale-105"
              alt="profile"
            />
            {isEditing && (
              <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 p-2 bg-indigo-600 text-white rounded-xl shadow-xl border border-slate-950 cursor-pointer hover:bg-indigo-700 transition-all">
                <FaCamera size={14} />
                <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            )}
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-3xl font-[1000] text-white tracking-tighter uppercase italic leading-none">{formData.name || "UNIDENTIFIED NODE"}</h1>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/10 flex items-center gap-2">
                <Terminal size={12} /> {userRole === 'engineer' ? 'Neural Architect' : 'Strategic Client'}
              </span>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Globe size={12} className="text-indigo-500" /> {formData.location || 'Remote Node'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 relative z-10 mt-6 md:mt-0">
          {userRole === 'engineer' && (
            <button type="button" onClick={handleGenerateAI} disabled={aiLoading} className="px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:scale-105 transition-all flex items-center gap-2.5">
              {aiLoading ? <Loader2 size={16} className="animate-spin" /> : <><Sparkles size={16} /> RAG INDEX</>}
            </button>
          )}
          <button type="submit" onClick={handleSubmit} disabled={loading} className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2.5 shadow-2xl ${isEditing ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'bg-white text-black hover:bg-slate-200'}`}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : isEditing ? <><FaSave size={16}/> Save Node</> : <><FaEdit size={16}/> Edit Profile</>}
          </button>
        </div>
      </div>

      {/* 🛠️ BENTO FORM GRID */}
      <form onSubmit={handleSubmit} className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        
        {/* Identity Section */}
        <div className="bg-slate-950/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 p-8 flex flex-col gap-6 shadow-2xl overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <SectionHeader icon={<FaUserCircle />} title="Identity Matrix" />
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Subject Designation</label>
              {isEditing ? (
                <input type="text" placeholder="Full Name" value={formData.name} className={inputStyle} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              ) : (
                <ReadOnlyField value={formData.name} placeholder="Not Specified" />
              )}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Neural briefing (Bio)</label>
              {isEditing ? (
                <textarea placeholder="Describe your mission goals..." rows="4" value={formData.bio} className={`${inputStyle} resize-none`} onChange={(e) => setFormData({...formData, bio: e.target.value})} />
              ) : (
                <ReadOnlyField value={formData.bio} placeholder="No briefing available." isTextarea />
              )}
            </div>
          </div>

          {userRole === 'engineer' && (
            <div className="mt-4 pt-8 border-t border-white/5">
              <SectionHeader icon={<FaCode />} title="Skill Vectors" />
              
              {isEditing ? (
                <div className="space-y-4 mb-4">
                  <CreatableSelect
                    isMulti
                    options={TECH_SKILLS.map(s => ({ value: s, label: s }))}
                    value={currentSkillsArray}
                    onChange={handleSelectChange}
                    placeholder="Search or type custom skills..."
                    formatCreateLabel={(inputValue) => `Inject "${inputValue}"`}
                    styles={selectStyles}
                  />
                  <div className="flex flex-wrap gap-2">
                    {["React", "Node.js", "Python", "AWS", "MongoDB"].map((s) => (
                      <button key={s} type="button" onClick={() => handleAddSkill(s)} className="px-3.5 py-2 text-[9px] font-black rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-all uppercase">
                        + {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentSkillsArray.length > 0 ? currentSkillsArray.map((skill, idx) => (
                    <span key={idx} className="px-4 py-2 text-[10px] font-black rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 uppercase tracking-wider">
                      + {skill.label}
                    </span>
                  )) : (
                    <span className="text-slate-600 text-xs font-bold uppercase tracking-widest mt-2 ml-2">NO SKILLS MAPPED</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Network Section */}
        <div className="bg-slate-950/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 p-8 flex flex-col gap-6 shadow-2xl overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <SectionHeader icon={<FaGlobe />} title="Network Presence" />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Node Location</label>
              {isEditing ? (
                <IconInputGroup icon={<FaMapMarkerAlt />} placeholder="City/Remote" value={formData.location} onChange={(val) => setFormData({...formData, location: val})} />
              ) : (
                <ReadOnlyField value={formData.location} placeholder="Unknown" icon={<FaMapMarkerAlt className="text-slate-500" />} />
              )}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">{userRole === 'engineer' ? 'Service Years' : 'Entity Name'}</label>
              {isEditing ? (
                <IconInputGroup 
                  icon={userRole === 'engineer' ? <MdOutlineWorkHistory /> : <FaBriefcase />} 
                  placeholder={userRole === 'engineer' ? "Experience" : "Company"}
                  value={userRole === 'engineer' ? formData.experience : formData.company} 
                  onChange={(val) => setFormData(userRole === 'engineer' ? {...formData, experience: val} : {...formData, company: val})} 
                />
              ) : (
                 <ReadOnlyField 
                   value={userRole === 'engineer' ? formData.experience : formData.company} 
                   placeholder="Not Specified" 
                   icon={userRole === 'engineer' ? <MdOutlineWorkHistory className="text-slate-500" /> : <FaBriefcase className="text-slate-500" />} 
                 />
              )}
            </div>
          </div>

          <div className="space-y-6 mt-4 pt-8 border-t border-white/5">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">GitHub Repository</label>
                {isEditing ? <SocialInput icon={<FaGithub />} placeholder="https://github.com/username" value={formData.githubUrl} onChange={(val) => setFormData({...formData, githubUrl: val})} /> : <ReadOnlyField value={formData.githubUrl} placeholder="Not Connected" icon={<FaGithub className="text-slate-500" />} isLink />}
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">LinkedIn Professional</label>
                {isEditing ? <SocialInput icon={<FaLinkedin />} placeholder="https://linkedin.com/in/username" value={formData.linkedinUrl} onChange={(val) => setFormData({...formData, linkedinUrl: val})} /> : <ReadOnlyField value={formData.linkedinUrl} placeholder="Not Connected" icon={<FaLinkedin className="text-slate-500" />} isLink />}
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Neural Portfolio</label>
                {isEditing ? <SocialInput icon={<Globe size={18} />} placeholder="https://portfolio.com" value={formData.portfolioUrl} onChange={(val) => setFormData({...formData, portfolioUrl: val})} /> : <ReadOnlyField value={formData.portfolioUrl} placeholder="Not Connected" icon={<Globe size={18} className="text-slate-500" />} isLink />}
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

const SectionHeader = ({ icon, title }) => (
  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2.5 mb-2">
    <span className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl border border-indigo-500/10">{icon}</span> {title}
  </h3>
);

const IconInputGroup = ({ icon, placeholder, value, onChange }) => (
  <div className="flex items-center gap-3 bg-black/40 p-4 rounded-2xl border border-white/5 focus-within:border-indigo-500/30 transition-all shadow-inner">
    <span className="text-slate-500 shrink-0 text-lg">{icon}</span>
    <input type="text" placeholder={placeholder} value={value} className="bg-transparent outline-none w-full text-[14px] font-bold text-white placeholder:text-slate-700" onChange={(e) => onChange(e.target.value)} />
  </div>
);

const SocialInput = ({ icon, placeholder, value, onChange }) => (
  <div className="flex items-center gap-4 bg-black/40 p-4.5 rounded-2xl border border-white/5 focus-within:border-indigo-500/30 transition-all shadow-inner">
    <span className="text-slate-500 shrink-0 text-xl">{icon}</span>
    <input type="url" placeholder={placeholder} value={value} className="bg-transparent outline-none w-full text-[14px] font-bold text-white placeholder:text-slate-700" onChange={(e) => onChange(e.target.value)} />
  </div>
);

const ReadOnlyField = ({ value, placeholder, isTextarea, icon, isLink }) => (
  <div className={`flex items-center gap-3 bg-black/20 p-4.5 rounded-2xl border border-transparent ${isTextarea ? 'min-h-[100px] items-start' : ''}`}>
    {icon && <span className="shrink-0 text-lg">{icon}</span>}
    {value ? (
      isLink ? (
        <a href={value} target="_blank" rel="noreferrer" className="text-[14px] font-bold text-indigo-400 hover:underline truncate">{value}</a>
      ) : (
        <span className="text-[14px] font-bold text-white">{value}</span>
      )
    ) : (
      <span className="text-[14px] font-bold text-slate-600">{placeholder}</span>
    )}
  </div>
);

const inputStyle = "w-full p-4.5 bg-black/40 rounded-2xl border border-white/5 focus:border-indigo-500/30 outline-none text-[14px] font-bold text-white transition-all placeholder:text-slate-700 shadow-inner";

const selectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderColor: state.isFocused ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.05)',
    borderRadius: '1rem',
    padding: '0.25rem',
    boxShadow: 'none',
    '&:hover': { borderColor: 'rgba(99, 102, 241, 0.3)' }
  }),
  menuList: (base) => ({ 
    ...base, 
    '::-webkit-scrollbar': { display: 'none' },
    msOverflowStyle: 'none',
    scrollbarWidth: 'none'
  }),
  menu: (base) => ({ ...base, backgroundColor: '#020617', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '1rem', overflow: 'hidden' }),
  option: (base, state) => ({ 
    ...base, 
    backgroundColor: state.isFocused ? 'rgba(99, 102, 241, 0.1)' : 'transparent', 
    color: state.isFocused ? '#fff' : '#94a3b8', 
    cursor: 'pointer' 
  }),
  multiValue: (base) => ({ ...base, backgroundColor: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '0.5rem' }),
  multiValueLabel: (base) => ({ ...base, color: '#818cf8', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }),
  multiValueRemove: (base) => ({ ...base, color: '#818cf8', ':hover': { backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#fff' } }),
  input: (base) => ({ ...base, color: '#fff' }),
};

export default Profile;