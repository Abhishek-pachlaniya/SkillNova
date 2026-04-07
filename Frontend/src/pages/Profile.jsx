import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  FaUserCircle, FaGithub, FaLinkedin, FaGlobe, 
  FaMapMarkerAlt, FaSave, FaBriefcase, FaCode, FaCamera 
} from 'react-icons/fa';
import { MdOutlineWorkHistory } from 'react-icons/md';
import { Sparkles } from 'lucide-react'; // 🔥 Naya Icon import kiya

const Profile = () => {
  const { updateUserData, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false); // 🔥 Nayi state AI loading ke liye
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
      setUserRole(data.role || 'engineer'); 
      setFormData({
        ...data,
        avatar: data.avatar || '', // Load avatar from DB
        skills: data.skills ? data.skills.join(', ') : '', 
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('bio', formData.bio);
      data.append('location', formData.location);
      data.append('githubUrl', formData.githubUrl);
      data.append('linkedinUrl', formData.linkedinUrl);
      data.append('portfolioUrl', formData.portfolioUrl);

      if (userRole === 'engineer') {
        const processedSkills = typeof formData.skills === 'string' 
          ? formData.skills.split(',').map(s => s.trim()).filter(s => s !== "") 
          : formData.skills;
        
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

      // Update both LocalStorage and Context State
      updateUserData(res.data);
      alert("Profile updated successfully! ✨");
    } catch (err) { 
      console.error(err);
      alert(err.response?.data?.message || "Update failed!"); 
    } finally { setLoading(false); }
  };

  // 🔥 NAYA FUNCTION: AI Embedding generate karne ke liye
  const handleGenerateAI = async () => {
    try {
      setAiLoading(true);
      // Backend ke AI route par request bhej rahe hain
      const res = await API.post('/ai/index-profile');
      alert(res.data.message || "AI Profile Indexed Successfully! 🚀");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "AI Sync failed. Pura form save karo pehle!");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50">
        <div className={`h-32 md:h-44 bg-gradient-to-r ${userRole === 'engineer' ? 'from-indigo-600 to-violet-600' : 'from-emerald-500 to-teal-600'}`}></div>
        
        <div className="px-6 md:px-12 pb-12">
          <div className="relative -top-12 md:-top-16 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
            
            <div className="relative group">
              <img 
                src={previewUrl || formData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${formData.name}`} 
                className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] border-8 border-white bg-slate-50 shadow-2xl object-cover"
                alt="profile"
              />
              <label htmlFor="avatar-upload" className="absolute bottom-2 right-2 p-3 bg-white rounded-2xl shadow-lg border border-slate-100 cursor-pointer hover:scale-110 transition-all text-indigo-600">
                <FaCamera size={18} />
                <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>

            <div className="mb-4">
              <h1 className="text-3xl md:text-4xl font-[1000] text-slate-900 tracking-tighter">{formData.name || "User Name"}</h1>
              <p className="text-indigo-600 font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center md:justify-start gap-2 pt-2">
                <FaBriefcase /> {userRole === 'engineer' ? 'Software Engineer' : 'Project Client'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 -mt-6 pt-4">
            <div className="space-y-6">
              <SectionHeader icon={<FaUserCircle />} title="Core Profile Details" />
              <input type="text" placeholder="Full Name" value={formData.name} className="input-style"
                onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <textarea placeholder="Bio..." rows="5" value={formData.bio} className="input-style resize-none"
                onChange={(e) => setFormData({...formData, bio: e.target.value})} />
              {userRole === 'engineer' && (
                <>
                  <SectionHeader icon={<FaCode />} title="Technical Stack" />
                  <input type="text" placeholder="Skills (comma separated)" value={formData.skills} className="input-style font-bold text-indigo-600"
                    onChange={(e) => setFormData({...formData, skills: e.target.value})} />
                </>
              )}
            </div>

            <div className="space-y-6">
              <SectionHeader icon={<FaGlobe />} title="Career Context & Presence" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <IconInputGroup icon={<FaMapMarkerAlt />} placeholder="Location" value={formData.location}
                  onChange={(val) => setFormData({...formData, location: val})} />
                {userRole === 'engineer' ? (
                  <IconInputGroup icon={<MdOutlineWorkHistory />} placeholder="Experience (Years)" value={formData.experience} type="number"
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
              
              <button type="submit" disabled={loading} className={`w-full mt-10 py-5 rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-3 active:scale-95 group ${userRole === 'engineer' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'}`}>
                {loading ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : <>Save Details <FaSave /></>}
              </button>

              {/* 🔥 AI SYNC BUTTON (Sirf Engineers ke liye) 🔥 */}
              {userRole === 'engineer' && (
                <button 
                  type="button" 
                  onClick={handleGenerateAI}
                  disabled={aiLoading} 
                  className="w-full mt-4 py-5 rounded-2xl font-black text-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-200 flex items-center justify-center gap-3 active:scale-95 group hover:from-purple-700 hover:to-indigo-700 transition-all"
                >
                  {aiLoading ? (
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>Sync Profile with AI Engine <Sparkles size={20} className="text-amber-300" /></>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const SectionHeader = ({ icon, title }) => (<h3 className="font-black text-slate-400 uppercase tracking-[0.2em] text-[10px] flex items-center gap-2 mb-2"><span className="text-indigo-500">{icon}</span> {title}</h3>);
const IconInputGroup = ({ icon, placeholder, value, onChange, type="text" }) => (<div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus-within:border-indigo-100 group"><span className="text-slate-400 group-hover:text-indigo-500 shrink-0">{icon}</span><input type={type} placeholder={placeholder} value={value} className="bg-transparent outline-none w-full text-sm font-bold text-slate-700" onChange={(e) => onChange(e.target.value)} /></div>);
const SocialInput = ({ icon, placeholder, value, onChange }) => (<div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus-within:border-indigo-100 group"><span className="text-slate-400 group-hover:text-indigo-500 shrink-0">{icon}</span><input type="text" placeholder={placeholder} value={value} className="bg-transparent outline-none w-full text-sm font-bold text-slate-700" onChange={(e) => onChange(e.target.value)} /></div>);

const inputStyle = "w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-100 focus:bg-white outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400";

export default Profile;