import { useState, useEffect } from 'react';
import API from '../api/axios';
import { 
  Users, Trash2, Clock, CheckCircle, Send, 
  Sparkles, Briefcase, LayoutGrid, DollarSign, X, 
  CheckCircle2, AlertCircle, Plus 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function MyProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const isClient = user?.role?.toLowerCase() === 'client';

  // === LOGIC PRESERVED: Fetching Projects ===
  useEffect(() => {
    if (!user || !user.role) return; 

    const fetchProjects = async () => {
      try {
        setLoading(true);
        const endpoint = user.role === 'engineer' ? '/projects/my-applied' : '/projects/my-projects';
        const res = await API.get(endpoint);
        setProjects(res.data);
      } catch (err) {
        toast.error("Projects fetch karne mein dikkat aayi!");
      } finally {
        setLoading(false); 
      }
    };

    fetchProjects();
  }, [user]); 

  // === LOGIC PRESERVED: Delete Functionality ===
  const executeDelete = async (projectId) => {
    const deletePromise = new Promise(async (resolve, reject) => {
      try {
        await API.delete(`/projects/${projectId}`);
        setProjects((prevProjects) => prevProjects.filter((p) => p._id !== projectId));
        resolve("Project successfully archived! 🚀");
      } catch (err) {
        reject(err.response?.data?.message || "Operation failed!");
      }
    });

    toast.promise(deletePromise, {
      loading: 'Archiving project...',
      success: (msg) => msg,
      error: (errMsg) => errMsg
    }, {
      style: { background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
    });
  };

  const handleDelete = (projectId) => {
    toast((t) => (
      <div className="flex flex-col gap-4 p-2 bg-[#0f172a] text-white rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="bg-rose-500/20 p-2 rounded-lg text-rose-500"><AlertCircle size={20} /></div>
          <span className="font-black tracking-tight">Confirm Deletion?</span>
        </div>
        <p className="text-slate-400 text-xs font-medium">This project data will be permanently wiped from the neural core.</p>
        <div className="flex justify-end gap-3 mt-2">
          <button onClick={() => toast.dismiss(t.id)} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">Cancel</button>
          <button onClick={() => { toast.dismiss(t.id); executeDelete(projectId); }} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-rose-600/20">Wipe Data</button>
        </div>
      </div>
    ), { duration: 5000, id: `confirm-delete-${projectId}`, style: { padding: 0, background: 'transparent' } });
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      <p className="font-black text-slate-500 tracking-[0.4em] text-[10px] uppercase italic">Querying Local Clusters...</p>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-[1440px] mx-auto space-y-10 pb-24"
    >
      <Toaster position="top-center" />

      {/* 🚀 Header Section: Wide and Premium */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-[1000] text-white tracking-tighter leading-none mb-3">
            {isClient ? "Managed " : "Applied "} 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-fuchsia-400 to-cyan-400">Inventory</span>
          </h1>
          <p className="text-slate-500 font-bold flex items-center gap-2 uppercase text-xs tracking-[0.2em]">
            <Sparkles size={14} className="text-indigo-400" />
            {isClient ? "Comprehensive list of your active mission briefings." : "Tracking your deployments across the ecosystem."}
          </p>
        </div>
        {isClient && (
          <Link to="/projects/add" className="w-full md:w-auto bg-indigo-600 text-white px-8 py-4 rounded-[1.5rem] font-[1000] shadow-2xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest group">
            <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Post New
          </Link>
        )}
      </div>

      {/* 📋 Project Inventory List */}
      <div className="grid gap-6">
        <AnimatePresence>
          {projects.length > 0 ? projects.map((p, index) => (
            <motion.div 
              key={p._id} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-slate-950/50 backdrop-blur-md p-6 md:p-8 rounded-[2.5rem] border border-white/5 flex flex-col lg:flex-row lg:items-center justify-between hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden shadow-2xl"
            >
              {/* Background Accent Glow */}
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-600/0 via-indigo-600 to-indigo-600/0 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                   <div className="bg-indigo-600/10 p-3 rounded-2xl text-indigo-400 border border-indigo-500/10 group-hover:scale-110 transition-transform">
                      <Briefcase size={22} />
                   </div>
                   <h3 className="text-2xl font-[1000] text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors">
                     {p.title}
                   </h3>
                </div>

                <div className="flex flex-wrap gap-3 ml-14">
                  <span className="flex items-center gap-2 text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl uppercase tracking-widest border border-emerald-500/20">
                    <DollarSign size={12} /> Allocation: ${p.budget}
                  </span>
                  
                  {!isClient && (
                   <span className={`flex items-center gap-2 text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest border transition-all ${
                      p.myStatus === 'hired' 
                        ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' 
                        : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                    }`}>
                      {p.myStatus === 'hired' ? (
                        <><CheckCircle2 size={12}/> Deployment: Successful</>
                      ) : (
                        <><Clock size={12}/> Analysis: Pending</>
                      )}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Hub */}
              <div className="flex items-center gap-4 mt-8 lg:mt-0 lg:ml-8 relative z-10">
                {isClient ? (
                  <>
                    <Link to={`/projects/${p._id}/applicants`} className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white text-black px-6 py-3.5 rounded-2xl font-[1000] text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-all shadow-xl">
                      <Users size={16} /> Applicants
                    </Link>
                    <button onClick={() => handleDelete(p._id)} className="p-4 text-rose-500 bg-rose-500/10 hover:bg-rose-600 hover:text-white rounded-2xl transition-all border border-rose-500/10 group/del">
                      <Trash2 size={20} className="group-hover/del:scale-110 transition-transform" />
                    </button>
                  </>
                ) : (
                  <Link to={`/projects/${p._id}`} className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-[1000] text-[11px] uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/20 group/btn">
                    Details <Send size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </Link>
                )}
              </div>
            </motion.div>
          )) : (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-32 bg-slate-950/50 rounded-[3.5rem] border-2 border-dashed border-white/5 backdrop-blur-md"
            >
               <div className="bg-slate-900 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-slate-700 border border-white/5">
                  <LayoutGrid size={44} />
               </div>
               <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em] mb-3">Inventory Empty</h2>
               <p className="text-slate-500 font-medium max-w-sm mx-auto">
                 {isClient ? "The network is quiet. Post a briefing to initialize matching." : "No active deployments found in your current node."}
               </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}