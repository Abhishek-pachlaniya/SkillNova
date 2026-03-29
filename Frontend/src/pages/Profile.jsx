import { useState, useEffect } from 'react';
import API from '../api/axios'; // Tera naya Axios Instance
import { 
  FaUserCircle, FaGithub, FaLinkedin, FaGlobe, 
  FaMapMarkerAlt, FaSave, FaBriefcase, FaCode, FaLink, FaEdit 
} from 'react-icons/fa';
import { MdOutlineWorkHistory } from 'react-icons/md';

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState('engineer'); // Default 'engineer', updated on fetch
  const [formData, setFormData] = useState({
    name: '', bio: '', skills: '', location: '', githubUrl: '', 
    linkedinUrl: '', portfolioUrl: '', experience: '', company: ''
  });

  // Reusable fetch function
  const fetchProfile = async () => {
    try {
      const res = await API.get('/users/profile');
      const data = res.data;
      setUserRole(data.role || 'engineer'); 
      setFormData({
        ...data,
        // Backend handle karega string splitting, isliye skills direct access karo
        skills: data.skills ? data.skills.join(', ') : '', 
        experience: data.experience || '',
        company: data.company || ''
      });
    } catch (err) { console.error("Fetch Error:", err); }
  };

  useEffect(() => {
    fetchProfile(); // Initial fetch
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ No complex parsing in frontend anymore!
      await API.put('/users/profile', formData); 
      
      alert("Profile updated effectively! ✨");
      fetchProfile(); // 🔄 Re-fetch to update state from DB
    } catch (err) { alert(err.response?.data?.message || "Update failed!"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50">
        
        {/* 🎨 Theme Banner (Dynamic based on role) */}
        <div className={`h-32 md:h-44 bg-gradient-to-r ${userRole === 'engineer' ? 'from-indigo-600 to-violet-600' : 'from-emerald-500 to-teal-600'}`}></div>
        
        <div className="px-6 md:px-12 pb-12">
          <div className="relative -top-12 md:-top-16 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
            <img 
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${formData.name}`} 
              className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] border-8 border-white bg-slate-50 shadow-2xl"
              alt="profile initials"
            />
            <div className="mb-4">
              <h1 className="text-3xl md:text-4xl font-[1000] text-slate-900 tracking-tighter">{formData.name || "User Name"}</h1>
              <p className="text-indigo-600 font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center md:justify-start gap-2 pt-2">
                <FaBriefcase /> {userRole === 'engineer' ? 'Software Engineer' : 'Project Client'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 -mt-6 pt-4">
            
            {/* 👤 Left Column: Identity & Stack */}
            <div className="space-y-6">
              <SectionHeader icon={<FaUserCircle />} title="Core Profile Details" />
              <input 
                type="text" placeholder="Full Name" value={formData.name}
                className="input-style"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <textarea 
                placeholder="Describe your professional journey, philosophy, and expertise..." rows="5" value={formData.bio}
                className="input-style resize-none"
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
              />

              {userRole === 'engineer' && (
                <>
                  <SectionHeader icon={<FaCode />} title="Technical Stack" />
                  <input 
                    type="text" placeholder="React, Node.js, Python, AWS, RAG Matching, etc." value={formData.skills}
                    className="input-style font-bold text-indigo-600"
                    onChange={(e) => setFormData({...formData, skills: e.target.value})}
                  />
                </>
              )}
            </div>

            {/* 🔗 Right Column: Online Presence & Career context */}
            <div className="space-y-6">
              <SectionHeader icon={<FaGlobe />} title="Career Context & Presence" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <IconInputGroup icon={<FaMapMarkerAlt />} placeholder="Location (e.g. Remote, Mumbai)" value={formData.location}
                  onChange={(val) => setFormData({...formData, location: val})} />

                {userRole === 'engineer' ? (
                  <IconInputGroup icon={<MdOutlineWorkHistory />} placeholder="Exp. (Years)" value={formData.experience} type="number"
                    onChange={(val) => setFormData({...formData, experience: val})} />
                ) : (
                  <IconInputGroup icon={<FaBriefcase />} placeholder="Company Name" value={formData.company}
                    onChange={(val) => setFormData({...formData, company: val})} />
                )}
              </div>

              {/* Enhanced Social Links */}
              <div className="space-y-4 pt-2">
                <SocialInput icon={<FaGithub />} placeholder="GitHub Profile Link" value={formData.githubUrl} 
                  onChange={(val) => setFormData({...formData, githubUrl: val})} />
                
                <SocialInput icon={<FaLinkedin />} placeholder="LinkedIn Profile Link" value={formData.linkedinUrl} 
                  onChange={(val) => setFormData({...formData, linkedinUrl: val})} />

                {userRole === 'engineer' && (
                  <SocialInput icon={<FaLink />} placeholder="Portfolio Website Link" value={formData.portfolioUrl} 
                    onChange={(val) => setFormData({...formData, portfolioUrl: val})} />
                )}
              </div>

              <button 
                type="submit" disabled={loading}
                className={`w-full mt-10 py-5 rounded-2xl font-black text-lg transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 group
                ${userRole === 'engineer' ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 text-white' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100 text-white'}`}
              >
                {loading ? (
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <>Save Profile Details <FaSave size={20} className="group-hover:translate-x-1 transition-transform"/></>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components for Clean Code & Figma styling ---
const SectionHeader = ({ icon, title }) => (
  <h3 className="font-black text-slate-400 uppercase tracking-[0.2em] text-[10px] flex items-center gap-2 mb-2">
    <span className="text-indigo-500">{icon}</span> {title}
  </h3>
);

const IconInputGroup = ({ icon, placeholder, value, onChange, type="text" }) => (
    <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus-within:border-indigo-100 focus-within:bg-white transition-all group">
      <span className="text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0">{icon}</span>
      <input type={type} placeholder={placeholder} value={value}
        className="bg-transparent outline-none w-full text-sm font-bold text-slate-700"
        onChange={(e) => onChange(e.target.value)} />
    </div>
);

const SocialInput = ({ icon, placeholder, value, onChange }) => (
  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus-within:border-indigo-100 focus-within:bg-white transition-all group">
    <span className="text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0">{icon}</span>
    <input type="text" placeholder={placeholder} value={value}
      className="bg-transparent outline-none w-full text-sm font-bold text-slate-700"
      onChange={(e) => onChange(e.target.value)} />
  </div>
);

export default Profile;