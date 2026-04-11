import { useState, useEffect } from 'react';
import API from '../api/axios';
import { 
  Users, Trash2, Clock, Send, Sparkles, Briefcase, LayoutGrid, 
  DollarSign, CheckCircle2, AlertCircle, Plus, Loader2, Terminal
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

  useEffect(() => {
    if (!user || !user.role) return; 

    const fetchProjects = async () => {
      try {
        setLoading(true);
        const endpoint = user.role === 'engineer' ? '/projects/my-applied' : '/projects/my-projects';
        const res = await API.get(endpoint);
        setProjects(res.data);
      } catch (err) {
        toast.error("Data fetch fail ho gaya!");
      } finally {
        setLoading(false); 
      }
    };
    fetchProjects();
  }, [user]); 

  const executeDelete = async (projectId) => {
    try {
      await API.delete(`/projects/${projectId}`);
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
      toast.success("Project deleted!");
    } catch (err) {
      toast.error("Delete failed!");
    }
  };

  const handleDelete = (projectId) => {
    if (window.confirm("Bhai, pakka delete karna hai?")) executeDelete(projectId);
  };

  if (loading) return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-[#020617]">
      <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
      <p className="font-black text-slate-500 tracking-[0.4em] text-[10px] uppercase animate-pulse">Scanning Neural Core...</p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col gap-8 max-w-[1400px] mx-auto pb-10 font-sans">
      <Toaster position="top-center" />

      {/* 🚀 HEADER: Strictly Dark */}
      <div className="bg-slate-950/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shrink-0">
        <div className="text-left">
          <h1 className="text-4xl md:text-5xl font-[1000] text-white tracking-tighter uppercase italic leading-none">
            Mission <span className="text-indigo-500">Inventory</span>
          </h1>
          <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] mt-3">
             System Node: {user?.role} • Total Entities: {projects.length}
          </p>
        </div>

        {isClient && (
          <Link to="/projects/add" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all flex items-center gap-3 uppercase text-xs tracking-widest">
            <Plus size={18} /> New Mission
          </Link>
        )}
      </div>

      {/* 📋 LIST LOGIC: Row style preserved */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {projects.map((p, index) => (
              <motion.div 
                key={p._id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="group bg-slate-900/30 backdrop-blur-xl p-6 rounded-[2rem] border border-white/5 flex flex-col lg:flex-row lg:items-center justify-between hover:border-indigo-500/20 transition-all shadow-xl"
              >
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center flex-1">
                  <div className="bg-indigo-600/10 p-4 rounded-2xl text-indigo-400 border border-indigo-500/10">
                    <Briefcase size={24} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-black text-white uppercase italic tracking-tight truncate">{p.title}</h3>
                      
                      {/* 🔥 LOGIC 1: PROJECT CLOSED/OPEN BADGE */}
                      <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                        p.status === 'closed' 
                          ? 'bg-rose-500/10 text-rose-500 border-rose-500/10' 
                          : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10'
                      }`}>
                        {p.status === 'closed' ? '• Closed' : '• Open'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {/* 🔥 LOGIC 2: BUDGET SYNC */}
                      <span className="flex items-center gap-2 text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/10 uppercase">
                        <DollarSign size={12} /> Allocation: ${p.budget}
                      </span>
                      
                      {/* 🔥 LOGIC 3: ENGINEER ANALYSIS STATUS */}
                      {!isClient && (
                        <span className={`flex items-center gap-2 text-[9px] font-black px-3 py-1.5 rounded-lg border uppercase tracking-widest ${
                          p.myStatus === 'accepted' || p.myStatus === 'hired'
                            ? 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' 
                            : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        }`}>
                          {p.myStatus === 'accepted' || p.myStatus === 'hired' ? (
                            <><CheckCircle2 size={12}/> Analysis: Hired</>
                          ) : (
                            <><Clock size={12}/> Analysis: Pending</>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* ACTION HUB */}
                <div className="flex items-center gap-3 mt-6 lg:mt-0 lg:ml-8">
                  {isClient ? (
                    <>
                      <Link to={`/projects/${p._id}/applicants`} className="bg-white text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2">
                        <Users size={14} /> Applicants
                      </Link>
                      <button onClick={() => handleDelete(p._id)} className="p-3 text-rose-500 bg-rose-500/10 hover:bg-rose-600 hover:text-white rounded-xl border border-rose-500/10 transition-all">
                        <Trash2 size={18} />
                      </button>
                    </>
                  ) : (
                    <Link to={`/projects/${p._id}`} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20">
                      Details <Send size={14} />
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}