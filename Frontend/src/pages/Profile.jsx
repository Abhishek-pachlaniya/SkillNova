import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  FaUserCircle, FaGithub, FaLinkedin, FaGlobe, 
  FaMapMarkerAlt, FaSave, FaBriefcase, FaCode, FaCamera, FaPlus
} from 'react-icons/fa';
import { MdOutlineWorkHistory } from 'react-icons/md';
import { Sparkles } from 'lucide-react'; 
import toast, { Toaster } from 'react-hot-toast'; // 🔥 Toast import kiya

// 🔥 Predefined List of Famous Skills
const POPULAR_SKILLS = [
  "React", "Node.js", "Express.js", "MongoDB", "JavaScript", 
  "TypeScript", "Python", "C++", "Next.js", "Tailwind CSS", 
  "Docker", "AWS", "Socket.io", "GraphQL"
];

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

  const fetchProfile = async () => {
    try {
      const res = await API.get('/users/profile');
      const data = res.data;
      
      // 🔥 FIX 1: Backend se data aate hi Global Context update kar do!
      // Isse "Guest" turant hat jayega aur Chat unlock ho jayegi.
      if (data) {
        updateUserData(data);
      }

      setUserRole(data.role || 'engineer'); 
      
      let parsedSkills = '';
      if (Array.isArray(data.skills)) {
         parsedSkills = data.skills.join(', ');
      } else if (typeof data.skills === 'string') {
         try {
             const jsonSkills = JSON.parse(data.skills);
             if(Array.isArray(jsonSkills)){
                 parsedSkills = jsonSkills.join(', ');
             } else {
                 parsedSkills = data.skills;
             }
         } catch(e) {
             parsedSkills = data.skills; 
         }
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
    const currentSkills = formData.skills 
      ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) 
      : [];
    
    const isDuplicate = currentSkills.some(s => s.toLowerCase() === skillToAdd.toLowerCase());
    
    if (!isDuplicate) {
      const updatedSkills = [...currentSkills, skillToAdd].join(', ');
      setFormData({ ...formData, skills: updatedSkills });
      // Optional: Chota sa toast dikha sakte hain jab skill add ho
      toast.success(`${skillToAdd} added!`, { icon: '✨', duration: 1500 });
    } else {
      toast.error(`${skillToAdd} is already added!`, { duration: 1500 });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // 🔥 Saving ka loading toast (Promisified toast for better UX)
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
          // 🔥 FIX 2: Ensure processedSkills is definitely an array of strings
          const processedSkills = formData.skills
             ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
             : [];
          
          data.append('skills', JSON.stringify(processedSkills));
          data.append('experience', formData.experience);
        } else {
          data.append('company', formData.company);
        }

        if (imageFile) {
          data.append('avatar', imageFile);
        }

        const res = await API.put('/users/profile', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        updateUserData(res.data);
        resolve(res.data);
      } catch (err) {
        reject(err);
      } finally {
        setLoading(false);
      }
    });

    toast.promise(savePromise, {
      loading: 'Saving profile details...',
      success: 'Profile updated successfully! ✨',
      error: (err) => err.response?.data?.message || "Update failed!"
    });
  };

  const handleGenerateAI = async () => {
    setAiLoading(true);
    
    // 🔥 AI Sync ke liye bhi Promise based toast
    const aiPromise = new Promise(async (resolve, reject) => {
      try {
        const res = await API.post('/ai/index-profile');
        resolve(res.data);
      } catch (err) {
        reject(err);
      } finally {
        setAiLoading(false);
      }
    });

    toast.promise(aiPromise, {
      loading: 'Syncing profile with AI Engine... 🤖',
      success: (data) => data.message || "AI Profile Indexed Successfully! 🚀",
      error: (err) => err.response?.data?.message || "AI Sync failed. Pura form save karo pehle!"
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      {/* 🔥 Toaster component zaroori hai UI mein render karne ke liye */}
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '1rem',
            padding: '16px',
            fontWeight: '600',
          },
          success: {
            iconTheme: { primary: '#10B981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: '#fff' },
          },
        }} 
      />

      <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] md:rounded-[3rem] overflow-hidden border border-slate-100/50 shadow-2xl shadow-slate-200/40 transition-all">
        {/* Top Banner Gradient */}
        <div className={`h-36 md:h-48 bg-gradient-to-br relative overflow-hidden ${userRole === 'engineer' ? 'from-indigo-600 via-purple-600 to-violet-800' : 'from-emerald-500 via-teal-500 to-emerald-800'}`}>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>
        
        <div className="px-6 md:px-14 pb-14">
          <div className="relative -top-16 md:-top-20 flex flex-col md:flex-row items-center md:items-end gap-8 text-center md:text-left">
            
            {/* Avatar Section */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[2.5rem] blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-500"></div>
              <img 
                src={previewUrl || formData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${formData.name}`} 
                className="relative w-36 h-36 md:w-44 md:h-44 rounded-[2.5rem] border-[6px] border-white bg-slate-50 shadow-xl object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                alt="profile"
              />
              <label htmlFor="avatar-upload" className="absolute bottom-2 right-2 p-3.5 bg-white rounded-2xl shadow-xl border border-slate-100 cursor-pointer hover:scale-110 hover:text-indigo-700 hover:shadow-indigo-200 transition-all text-indigo-600 z-10">
                <FaCamera size={20} />
                <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>

            {/* Title Section */}
            <div className="mb-4 md:mb-6">
              <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">{formData.name || "User Name"}</h1>
              <div className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-bold uppercase text-[11px] tracking-widest shadow-sm">
                <FaBriefcase className={userRole === 'engineer' ? 'text-indigo-500' : 'text-emerald-500'} /> 
                {userRole === 'engineer' ? 'Software Engineer' : 'Project Client'}
              </div>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 -mt-4">
            {/* Left Column */}
            <div className="space-y-7">
              <div>
                <SectionHeader icon={<FaUserCircle />} title="Core Profile Details" />
                <div className="space-y-4">
                  <input type="text" placeholder="Full Name" value={formData.name} className={inputStyle}
                    onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  <textarea placeholder="Tell us a bit about yourself..." rows="4" value={formData.bio} className={`${inputStyle} resize-none leading-relaxed`}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})} />
                </div>
              </div>

              {/* Technical Stack Section */}
              {userRole === 'engineer' && (
                <div className="pt-2">
                  <SectionHeader icon={<FaCode />} title="Technical Stack" />
                  <input type="text" placeholder="React, Node.js, Python (comma separated)" value={formData.skills} className={`${inputStyle} font-bold text-indigo-600 placeholder:font-normal`}
                    onChange={(e) => setFormData({...formData, skills: e.target.value})} />
                  
                  {/* Clickable Skill Suggestions */}
                  <div className="mt-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Suggestions</p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SKILLS.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleAddSkill(skill)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all duration-200 active:scale-95"
                        >
                          <FaPlus size={10} /> {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-7">
              <div>
                <SectionHeader icon={<FaGlobe />} title="Career Context & Presence" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <IconInputGroup icon={<FaMapMarkerAlt />} placeholder="Location" value={formData.location}
                    onChange={(val) => setFormData({...formData, location: val})} />
                  {userRole === 'engineer' ? (
                    <IconInputGroup icon={<MdOutlineWorkHistory />} placeholder="Exp (Years)" value={formData.experience} type="number"
                      onChange={(val) => setFormData({...formData, experience: val})} />
                  ) : (
                    <IconInputGroup icon={<FaBriefcase />} placeholder="Company Name" value={formData.company}
                      onChange={(val) => setFormData({...formData, company: val})} />
                  )}
                </div>
                <div className="space-y-4">
                  <SocialInput icon={<FaGithub />} placeholder="GitHub URL" value={formData.githubUrl} onChange={(val) => setFormData({...formData, githubUrl: val})} />
                  <SocialInput icon={<FaLinkedin />} placeholder="LinkedIn URL" value={formData.linkedinUrl} onChange={(val) => setFormData({...formData, linkedinUrl: val})} />
                </div>
              </div>
              
              {/* Buttons */}
              <div className="pt-6 space-y-4">
                <button type="submit" disabled={loading} className={`w-full py-4 rounded-2xl font-black text-lg shadow-lg flex items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-1 active:scale-95 group ${userRole === 'engineer' ? 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-200 text-white' : 'bg-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-200 text-white'}`}>
                  {loading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : <>Save Profile Details <FaSave className="group-hover:scale-110 transition-transform" /></>}
                </button>

                {userRole === 'engineer' && (
                  <button 
                    type="button" 
                    onClick={handleGenerateAI}
                    disabled={aiLoading} 
                    className="relative w-full py-4 rounded-2xl font-black text-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-200/50 flex items-center justify-center gap-3 active:scale-95 group hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-300 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                    {aiLoading ? (
                      <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin relative z-10"></div>
                    ) : (
                      <span className="relative z-10 flex items-center gap-3">
                        Sync Profile with AI Engine <Sparkles size={22} className="text-amber-300 animate-pulse group-hover:rotate-12 transition-transform" />
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const SectionHeader = ({ icon, title }) => (
  <h3 className="font-black text-slate-400 uppercase tracking-[0.25em] text-[11px] flex items-center gap-2.5 mb-4">
    <span className="p-1.5 bg-indigo-50 text-indigo-500 rounded-lg">{icon}</span> {title}
  </h3>
);

const IconInputGroup = ({ icon, placeholder, value, onChange, type="text" }) => (
  <div className="flex items-center gap-3 bg-slate-50/70 p-4 rounded-2xl border-2 border-slate-100 hover:border-slate-200 focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-50 transition-all duration-300 group shadow-sm">
    <span className="text-slate-400 group-focus-within:text-indigo-500 shrink-0 text-lg transition-colors">{icon}</span>
    <input type={type} placeholder={placeholder} value={value} className="bg-transparent outline-none w-full text-[15px] font-semibold text-slate-700 placeholder:text-slate-400 placeholder:font-medium" onChange={(e) => onChange(e.target.value)} />
  </div>
);

const SocialInput = ({ icon, placeholder, value, onChange }) => (
  <div className="flex items-center gap-4 bg-slate-50/70 p-4 rounded-2xl border-2 border-slate-100 hover:border-slate-200 focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-50 transition-all duration-300 group shadow-sm">
    <span className="text-slate-400 group-focus-within:text-indigo-500 shrink-0 text-xl transition-colors">{icon}</span>
    <input type="text" placeholder={placeholder} value={value} className="bg-transparent outline-none w-full text-[15px] font-semibold text-slate-700 placeholder:text-slate-400 placeholder:font-medium" onChange={(e) => onChange(e.target.value)} />
  </div>
);

const inputStyle = "w-full p-4 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all duration-300 text-[15px] font-semibold text-slate-700 placeholder:text-slate-400 placeholder:font-medium shadow-sm";

export default Profile;