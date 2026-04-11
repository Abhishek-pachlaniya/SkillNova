import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { 
  Loader2, MapPin, Briefcase, CheckCircle, 
  Terminal, Cpu, Zap, ArrowUpRight, User, 
  ShieldCheck, MessageSquare 
} from 'lucide-react'; 
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function ApplicantsList() {
  const { id } = useParams(); // Project ID
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  // === LOGIC PRESERVED: Fetch Data ===
  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/applications/project-applicants/${id}`);
      setApps(res.data);
    } catch (err) {
      console.error("Fetch failed:", err);
      toast.error("Data load nahi ho paya!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(id) fetchApplicants();
  }, [id]);

 const handleHire = async (engineerId) => {
    if (!window.confirm("Bhai, pakka hire karna hai is engineer ko?")) return;
    
    try {
      const res = await API.put(`/applications/hire-engineer`, { 
        projectId: id, 
        engineerId: engineerId
      });
      
      if (res.data) {
        toast.success("Mission Synced! Engineer Hired. 🚀");
        fetchApplicants(); // Reload UI
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Hiring fail ho gayi!");
    }
  };

  if (loading) return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-transparent">
      <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse italic">Connecting to Neural Node...</p>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="h-full flex flex-col gap-8 max-w-[1400px] mx-auto pb-10 font-sans"
    >
      <Toaster position="top-center" toastOptions={{ style: { background: '#020617', color: '#fff', border: '1px solid rgba(255,255,255,0.05)' }}} />

      {/* 🚀 PERMANENT DARK HEADER: matching image_1a9c7f.jpg style */}
      <div className="bg-slate-950/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div>
          <div className="flex items-center gap-2 text-indigo-500 font-black uppercase tracking-[0.4em] text-[9px] mb-3">
            <Cpu size={14} className="animate-pulse" /> Personnel Review Node
          </div>
          <h1 className="text-3xl md:text-5xl font-[1000] text-white tracking-tighter uppercase italic leading-none">
            Project <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">Applicants</span>
          </h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-3 flex items-center gap-2">
            <Terminal size={12} className="text-indigo-400" /> MISSION_ID: {id?.slice(-8).toUpperCase()}
          </p>
        </div>

        <div className="flex gap-4">
           <div className="px-6 py-4 bg-black/40 rounded-2xl border border-white/10 flex flex-col items-center shadow-inner">
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">DATA NODES</span>
             <span className="text-2xl font-[1000] text-white tracking-tight">{apps.length}</span>
           </div>
        </div>
      </div>

      {/* 📋 APPLICANTS MATRIX: Strictly Dark Bento Cards */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <div className="grid grid-cols-1 gap-5 pb-10">
          {apps && apps.length > 0 ? (
            apps.map((a, idx) => (
              <motion.div 
                key={a.user?._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-slate-950/40 backdrop-blur-xl p-6 rounded-[2rem] border border-white/5 flex flex-col md:flex-row md:items-center justify-between transition-all hover:border-indigo-500/20 relative overflow-hidden"
              >
                {/* Status Indicator Bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${a.status === 'accepted' ? 'bg-emerald-500' : 'bg-indigo-600'} opacity-30`} />

                <div className="flex-1 flex flex-col md:flex-row gap-8 items-start">
                  {/* Profile Node */}
                  <div className="relative shrink-0">
                    <img 
                      src={a.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${a.user?.name}`} 
                      className="w-20 h-20 rounded-2xl bg-slate-900 border border-white/5 shadow-2xl object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all"
                      alt={a.user?.name}
                    />
                    {a.status === 'accepted' && (
                      <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                        <CheckCircle size={14} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Link to={`/engineer-profile/${a.user?._id}`} className="font-[1000] text-white text-2xl hover:text-indigo-400 transition-all tracking-tight flex items-center gap-2 uppercase italic leading-none">
                        {a.user?.name || "ENCRYPTED_NODE"}
                        <ArrowUpRight size={18} className="text-slate-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </Link>
                      {a.status === 'accepted' && (
                        <span className="bg-emerald-500/10 text-emerald-500 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] border border-emerald-500/10 flex items-center gap-1.5">
                          <Zap size={10} fill="currentColor"/> SYNCED
                        </span>
                      )}
                    </div>
                    
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] line-clamp-1 mb-4 opacity-60">
                      {a.user?.bio || "No data briefing available."}
                    </p>
                    
                    {/* Dark Pitch Bubble */}
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/5 relative group-hover:bg-black/60 transition-colors shadow-inner">
                      <p className="text-[9px] text-indigo-400 font-[1000] uppercase mb-1.5 tracking-[0.3em] flex items-center gap-2">
                        <MessageSquare size={12} /> Communication Link
                      </p>
                      <p className="text-[13px] text-slate-300 leading-relaxed font-medium italic opacity-90">
                        "{a.proposalText || "Requesting permission to deploy."}"
                      </p>
                    </div>

                    <div className="flex items-center gap-6 mt-5 text-slate-500 font-black text-[9px] uppercase tracking-[0.3em]">
                       <span className="flex items-center gap-2"><MapPin size={14} className="text-indigo-500"/> {a.user?.location || 'REMOTE NODE'}</span>
                       <span className="flex items-center gap-2"><Briefcase size={14} className="text-indigo-500"/> {a.user?.experience || '0'} XP_VECTORS</span>
                    </div>
                  </div>
                </div>

                {/* Allocation Logic Center */}
                <div className="mt-8 md:mt-0 md:ml-12 flex flex-col items-center md:items-end gap-6 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-600 font-black block uppercase tracking-[0.4em] mb-1">NODE COST</span>
                    <span className="font-[1000] text-white text-5xl tracking-tighter italic">
                      <span className="text-indigo-500 text-2xl mr-1 opacity-50">$</span>{a.bidAmount}
                    </span>
                  </div>

                  <button 
                      onClick={() => handleHire(a.user?._id)}
                      disabled={a.status === 'hired'} // 🔥 Yahan 'hired' aayega
                      className={`w-full md:w-auto px-10 py-4 rounded-xl font-[1000] text-[10px] uppercase tracking-[0.4em] transition-all active:scale-95 shadow-2xl relative overflow-hidden ${
                        a.status === 'hired' // 🔥 Yahan bhi 'hired' aayega
                          ? 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-[0_0_20px_rgba(79,70,229,0.3)] group/btn'
                      }`}
                    >
                      {a.status === 'hired' ? ( // 🔥 Yahan bhi 'hired' aayega
                        <span className="flex items-center gap-2 opacity-60"><ShieldCheck size={16}/> DEPLOYED</span>
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                          <span className="relative z-10">INITIATE_SYNC</span>
                        </>
                      )}
                    </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-32 bg-slate-950/40 rounded-[3.5rem] border-2 border-dashed border-white/5 text-slate-700 font-black uppercase tracking-[0.5em] flex flex-col items-center gap-6">
              <User size={48} className="opacity-10" />
              NO NODES DETECTED
            </div>
          )}
        </div>
      </div>

      <p className="text-center text-[8px] font-[1000] text-slate-700 uppercase tracking-[0.6em] italic opacity-40">
        Secured Neural Data Link: Revision_4.02
      </p>
    </motion.div>
  );
}