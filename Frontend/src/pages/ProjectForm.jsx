import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, Terminal, Cpu, Zap, Globe, Loader2 } from 'lucide-react';
import API from '../api/axios'; 
import { motion } from 'framer-motion';

const ProjectForm = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', budget: '', tags: '', deadline: ''
  });

  // === LOGIC PRESERVED ===
  useEffect(() => {
    if (id) {
      const fetchProject = async () => {
        try {
          const res = await API.get(`/projects/${id}`);
          const data = res.data;
          setFormData({
            title: data.title,
            description: data.description,
            budget: data.budget,
            tags: data.tags.join(', '),
            deadline: data.deadline ? data.deadline.split('T')[0] : ''
          });
        } catch (err) { console.error("Error fetching project", err); }
      };
      fetchProject();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...formData, tags: formData.tags.split(',').map(t => t.trim()) };
      if (id) { await API.put(`/projects/${id}`, data); } 
      else { await API.post('/projects', data); }
      navigate('/dashboard'); 
    } catch (err) { alert("Error saving project!"); } 
    finally { setLoading(false); }
  };

  return (
    // COMPACT: Adjusted max-width and padding for screen-fit
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-4 pb-8 font-sans">
      
      {/* 🔙 COMPACT BACK NAV */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 font-black uppercase text-[8px] tracking-[0.3em] transition-all group">
        <div className="p-1.5 bg-slate-900/40 rounded-lg border border-white/5 group-hover:scale-110 transition-transform">
          <ArrowLeft size={12}/> 
        </div>
        Exit Console
      </button>

      {/* 🚀 DEEP DARK CONSOLE CARD */}
      <div className="bg-[#050b1a] dark:bg-slate-950/60 backdrop-blur-3xl rounded-[2rem] p-6 md:p-8 shadow-2xl border border-white/5 relative overflow-hidden">
        
        <div className="relative z-10 mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-500 font-black uppercase tracking-[0.4em] text-[8px] mb-1">
              <Cpu size={12} className="animate-pulse" /> Mission Data
            </div>
            <h2 className="text-2xl md:text-3xl font-[1000] text-white tracking-tighter uppercase italic leading-none">
              {id ? 'Sync' : 'Launch'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">Project</span>
            </h2>
          </div>
          <div className="bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/10 flex items-center gap-2">
            <Zap size={14} className="text-amber-400" />
            <span className="text-[8px] font-[1000] text-indigo-300 uppercase tracking-widest">Active Link</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="grid gap-5">
            {/* Project Title Node */}
            <div className="space-y-2">
              <label className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] ml-1">Designation</label>
              <div className="relative flex items-center">
                <Terminal className="absolute left-4 text-slate-700" size={16} />
                <input type="text" required value={formData.title} placeholder="PROJECT_ID_01" className={inputStyle}
                  onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>
            </div>

            {/* Description Node */}
            <div className="space-y-2">
              <label className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] ml-1">Objective Briefing</label>
              <textarea rows="3" required value={formData.description} placeholder="Mission parameters..." className={`${inputStyle} resize-none pt-3 px-6`}
                onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>

            {/* 📊 TIGHT BENTO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] ml-1">Budget ($)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-indigo-500 font-black text-xs">$</span>
                  <input type="number" required value={formData.budget} className={`${inputStyle} pl-8 text-sm font-black text-indigo-400`}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] ml-1">Tags</label>
                <div className="relative flex items-center">
                  <Globe className="absolute left-4 text-slate-700" size={16} />
                  <input type="text" placeholder="AI, React" value={formData.tags} className={`${inputStyle} pl-10 text-xs`}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] ml-1">Deadline</label>
                <input type="date" value={formData.deadline} className={`${inputStyle} text-[10px] font-black uppercase text-slate-400`}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})} />
              </div>
            </div>
          </div>

          {/* 🔘 EXECUTE BUTTON */}
          <div className="pt-4">
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-[1000] uppercase text-[10px] tracking-[0.4em] hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3">
              {loading ? <Loader2 className="animate-spin" size={16} /> : <>{id ? 'Synchronize' : 'Initiate Deployment'} <Sparkles size={16}/></>}
            </button>
            <p className="text-center text-[7px] font-black text-slate-700 uppercase tracking-[0.4em] mt-4 italic">
              Terminal Security: Layer-7 Encrypted
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

// --- TIGHT DARK INPUT STYLES ---
const inputStyle = "w-full p-3 pl-12 bg-black/40 border border-white/5 text-white rounded-xl outline-none focus:border-indigo-500/30 transition-all font-bold tracking-tight shadow-inner placeholder:text-slate-800 text-sm";

export default ProjectForm;