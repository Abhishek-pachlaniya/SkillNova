import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, Trash2, CheckCircle, X, Send, DollarSign, 
  MessageSquare, Sparkles, ArrowLeft, ShieldCheck, Clock, 
  Cpu, Target, Zap, Globe, Layout
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // === LOGIC & STATES: PRESERVED ===
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [proposalText, setProposalText] = useState("");
  const [bidAmount, setBidAmount] = useState("");

  const user = JSON.parse(localStorage.getItem('user'));

  const fetchProject = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProject(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  // Logic Checks (Variable names preserved)
  const isOwner = user && project && (project.clientId === user._id || project.clientId?._id === user._id);
  const isEngineer = user && user.role === 'engineer';
  const hasApplied = project?.applications?.includes(user?._id);

  const handleSendProposal = async () => {
    if (!proposalText || !bidAmount) return alert("Bhai, saari details bharo!");
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/projects/${id}/apply`, 
        { proposalText, bidAmount: Number(bidAmount) }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Proposal bhej diya gaya hai! 🚀");
      setShowModal(false);
      setProposalText("");
      setBidAmount("");
      fetchProject(); 
    } catch (err) {
      alert(err.response?.data?.message || "Kuch lafda ho gaya!");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Bhai, pakka delete karna hai? Ye wapas nahi aayega!")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Project uda diya! 🚀");
        navigate('/dashboard');
      } catch (err) {
        alert("Delete fail ho gaya lala");
      }
    }
  };

  if (loading) return (
    <div className="h-[50vh] flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Fetching Brief...</p>
    </div>
  );

  if (!project) return <div className="p-20 text-center text-white font-bold">Data Error.</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto space-y-6 pb-20" 
    >
      {/* 🔙 Back Button */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest group">
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Network
      </button>

      {/* 🚀 COMPACT HEADER */}
      <div className="bg-slate-950/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
        <div className="flex items-center gap-5">
          <div className="bg-indigo-600/10 p-3 rounded-2xl text-indigo-400 border border-indigo-500/20">
            <Layout size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-[1000] text-white tracking-tight leading-none mb-2">{project.title}</h1>
            <div className="flex items-center gap-3">
               <span className="text-[9px] font-black bg-white/5 text-slate-400 px-2 py-0.5 rounded border border-white/5 uppercase tracking-widest">#{id.slice(-6)}</span>
               <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                 <div className="w-1 h-1 bg-emerald-500 rounded-full animate-ping" /> {project.status}
               </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isOwner && (
            <>
              <button onClick={() => navigate(`/projects/edit/${project._id}`)} className="bg-white text-black px-5 py-2.5 rounded-xl font-black text-xs hover:bg-slate-200 transition-all uppercase tracking-widest">Edit</button>
              <button onClick={handleDelete} className="p-2.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all border border-rose-500/10"><Trash2 size={18}/></button>
            </>
          )}
          {isEngineer && (
            hasApplied ? (
              <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-6 py-2.5 rounded-xl font-black text-xs border border-emerald-500/20 uppercase tracking-widest">
                <CheckCircle size={16} /> Applied
              </div>
            ) : (
              <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 uppercase tracking-[0.1em] flex items-center gap-2 group">
                Apply Now <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
              </button>
            )
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 📝 DESCRIPTION (Sleek) */}
        <div className="lg:col-span-2">
          <div className="bg-slate-950/40 backdrop-blur-md p-8 md:p-10 rounded-[2rem] border border-white/5 shadow-sm min-h-[300px]">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
               Objectives
            </h3>
            <p className="text-slate-300 leading-relaxed text-base md:text-lg font-medium whitespace-pre-wrap">{project.description}</p>
            
            <div className="mt-12 pt-8 border-t border-white/5">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Required Stack</p>
              <div className="flex flex-wrap gap-2">
                {project.tags?.map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-white/5 text-slate-400 border border-white/10 rounded-lg font-black text-[9px] uppercase tracking-widest hover:text-white transition-all cursor-default">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 📊 STATS SIDEBAR (Sleek) */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
            <div className="absolute -right-5 -top-5 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            <p className="text-indigo-200 text-[10px] font-black uppercase mb-1 tracking-widest opacity-70">Budget Allocation</p>
            <h2 className="text-4xl font-[1000] tracking-tighter flex items-center gap-1">
              <span className="text-xl font-black text-indigo-300">$</span>{project.budget}
            </h2>
            
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-4">
               <div className="bg-black/20 p-2.5 rounded-xl border border-white/5"><Clock size={16} className="text-indigo-300"/></div>
               <div>
                 <p className="text-[9px] font-black text-indigo-200 uppercase tracking-widest">Deadline</p>
                 <span className="font-bold text-sm">{new Date(project.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
               </div>
            </div>
          </div>

          <div className="bg-slate-950/40 p-6 rounded-[2rem] border border-white/5">
             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Client Hub</p>
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center font-black text-lg text-indigo-400">
                  {project.clientId?.name ? project.clientId.name.charAt(0).toUpperCase() : "C"}
                </div>
                <div>
                   <p className="font-black text-white text-sm tracking-tight leading-none">{project.clientId?.name || "Member"}</p>
                   <p className="text-[9px] text-emerald-500 font-black mt-1.5 uppercase tracking-widest flex items-center gap-1">
                     <ShieldCheck size={10} /> Neural Vetted
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* 🚨 APPLICATION MODAL (Compact & Responsive) */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="bg-[#0f172a] p-8 md:p-10 rounded-[2.5rem] w-full max-w-lg shadow-2xl relative border border-white/10 z-10">
              <button onClick={() => setShowModal(false)} className="absolute right-6 top-6 text-slate-500 hover:text-white bg-white/5 p-2 rounded-full transition-all border border-white/5"><X size={18} /></button>

              <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-2 border border-indigo-500/20 px-3 py-1 rounded-full bg-indigo-500/5 text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-3"><Zap size={10} /> Secure Link</div>
                <h2 className="text-3xl font-black text-white tracking-tight">Submit Proposal</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Pitch Overview</label>
                  <textarea className="w-full p-5 bg-black/40 border border-white/5 rounded-2xl h-40 outline-none focus:border-indigo-500/50 transition-all text-white font-medium resize-none text-sm" placeholder="Why are you a match?..." value={proposalText} onChange={(e) => setProposalText(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Bid Amount ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input type="number" className="w-full p-4 pl-12 bg-black/40 border border-white/5 rounded-xl outline-none focus:border-indigo-500/50 transition-all font-black text-xl text-white tracking-tighter" placeholder="00" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} />
                  </div>
                </div>
                <button onClick={handleSendProposal} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 uppercase tracking-widest">
                  Deploy Proposal <Send size={16} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectDetail;