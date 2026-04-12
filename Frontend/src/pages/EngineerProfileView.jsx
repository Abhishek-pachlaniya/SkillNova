import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { 
  ArrowLeft, Sparkles, MapPin, Mail, Globe, 
  User, Code, Terminal, Cpu, Zap, MessageSquare, 
  Building2, Loader2 // 👈 Sirf stable icons rakhe hain
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

const StatusItem = ({ label, status }) => (
  <div className="flex items-center justify-between bg-white/5 p-2 rounded-xl border border-white/5">
    <span className="text-slate-500 font-black text-[8px] uppercase tracking-widest">{label}</span>
    {status ? (
      <span className="text-emerald-400 text-[8px] font-black px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">VERIFIED</span>
    ) : (
      <span className="text-slate-400 text-[8px] font-black px-2 py-0.5 rounded-md bg-white/5">PENDING</span>
    )}
  </div>
);

export default function EngineerProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestSending, setRequestSending] = useState(false);
 
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/users/public/${id}`);
        setProfile(res.data);
      } catch (err) {
        toast.error("Matrix error: Link broken!");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleAction = async () => {
    if (profile?.role === 'client') { navigate('/chat'); return; }
    try {
      setRequestSending(true);
      await API.post('/interviews/request-interview', { engineerId: id });
      toast.success("Request Sent! 🔥");
    } catch (err) {
      toast.error("Transmission Failed!");
    } finally { setRequestSending(false); }
  };
  
  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#020617]">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
    </div>
  );

  if (!profile) return <div className="h-screen bg-[#020617] text-white flex items-center justify-center font-black">NODE NOT FOUND</div>;

  const isEngineer = profile.role === 'engineer';

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans pb-10 selection:bg-indigo-500">
      <Toaster position="top-center" />
      
      {/* Header Area */}
      <div className="max-w-4xl mx-auto p-4 md:p-6 flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 font-black text-[9px] uppercase tracking-[0.3em] transition-all group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        {/* 🆕 SOCIAL BUTTONS (Icons Hata diye, sirf naam rakha hai) */}
        {isEngineer && (
          <div className="flex gap-2">
            {profile.githubUrl && (
              <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-white text-[9px] font-[1000] uppercase tracking-widest transition-all">
                GITHUB
              </a>
            )}
            {profile.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-lg hover:bg-indigo-600/20 text-indigo-400 text-[9px] font-[1000] uppercase tracking-widest transition-all">
                LINKEDIN
              </a>
            )}
          </div>
        )}
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto px-4">
        <div className="bg-slate-950/40 backdrop-blur-2xl rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden relative">
          
          <div className="h-28 bg-slate-900 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/10 via-transparent to-fuchsia-900/10"></div>
          </div>

          <div className="px-6 md:px-10 -mt-10 relative z-10 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded-[1.8rem] blur opacity-20"></div>
                <img 
                  src={profile.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`} 
                  className="relative w-28 h-28 rounded-[1.6rem] border-[5px] border-[#020617] bg-slate-900 shadow-2xl object-cover"
                  alt="profile"
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-5">
                <div>
                  <h1 className="text-2xl font-[1000] text-white tracking-tighter uppercase italic leading-none flex items-center gap-2">
                    {profile.name} <Sparkles className="text-indigo-500" size={20} />
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mt-3 text-[7px] font-black uppercase tracking-widest">
                    <span className="bg-indigo-500/5 px-2 py-1 rounded border border-indigo-500/10 flex items-center gap-1">
                      <Terminal size={10} /> {isEngineer ? 'Neural Architect' : 'Strategic Client'}
                    </span>
                    <span className="px-2 py-1 bg-white/5 rounded border border-white/5 flex items-center gap-1">
                      <MapPin size={10} className="text-indigo-500" /> {profile.location || 'Remote Node'}
                    </span>
                  </div>
                </div>

                <section className="bg-black/20 p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-slate-400 leading-relaxed font-bold italic">
                    "{profile.bio || "Data stream not initialized."}"
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-[8px] font-black uppercase text-slate-600 tracking-widest flex items-center gap-2">
                    {isEngineer ? <Code size={12} className="text-indigo-500" /> : <Building2 size={12} className="text-indigo-500" />}
                    {isEngineer ? 'Skill Vectors' : 'Associated Entity'}
                  </h3>
                  
                  {isEngineer ? (
                    <div className="flex flex-wrap gap-1">
                      {profile.skills?.map((skill, i) => (
                        <span key={i} className="px-2 py-1 text-[7px] font-black rounded bg-indigo-500/5 border border-indigo-500/10 text-indigo-400 uppercase tracking-widest transition-all">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white/5 border border-white/10 p-3 rounded-lg flex items-center gap-2 max-w-xs">
                      <Building2 size={16} className="text-indigo-500" />
                      <span className="text-white font-black uppercase text-xs">{profile.company || "Independent Entity"}</span>
                    </div>
                  )}
                </section>
              </div>

              {/* Action Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 shadow-xl text-center">
                  <h4 className="font-black text-white text-[8px] uppercase tracking-widest mb-4 flex justify-center gap-1.5">
                    <Cpu size={10} className="text-indigo-500" /> Node Status
                  </h4>
                  <div className="space-y-1.5 mb-6 text-left">
                    <StatusItem label="Identity Matrix" status={true} />
                    {isEngineer && <StatusItem label="Skills Mapped" status={profile.skills?.length > 0} />}
                  </div>
                  <button 
                    onClick={handleAction}
                    disabled={requestSending}
                    className={`w-full py-3 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg ${
                      requestSending 
                      ? 'bg-slate-800 text-slate-600' 
                      : isEngineer 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/10' 
                        : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/10'
                    }`}
                  >
                    {requestSending ? (
                      <Loader2 className="animate-spin" size={12} />
                    ) : isEngineer ? (
                      <><Zap size={14} /> Request Interview</>
                    ) : (
                      <><MessageSquare size={14} /> Contact Client</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}