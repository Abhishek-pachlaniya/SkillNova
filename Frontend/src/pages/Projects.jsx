import { useState, useEffect } from 'react';
import API from '../api/axios';
import { Plus, Briefcase, Clock, Check, Search, Sparkles, DollarSign, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ApplyModal from '../components/ApplyModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  // 🟢 User data nikalne ka safe tareeka (Logic Preserved)
  const getSafeUser = () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser || storedUser === "undefined") return {};
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("User parsing failed:", error);
      return {};
    }
  };

  const user = getSafeUser();
  const isClient = user.role === 'client';

  // 🔵 Projects fetch karne ka function (Logic Preserved)
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await API.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error("Projects load nahi huye!", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 pb-20"
    >
      {/* 🚀 Header Section: Wide & Grand */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-[1000] text-white tracking-tighter leading-none">
            Available <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">Opportunities</span>
          </h1>
          <p className="text-slate-500 font-bold mt-4 flex items-center gap-2 tracking-wide uppercase text-xs">
            <Sparkles size={14} className="text-indigo-500" />
            Explore or post new projects in the neural ecosystem.
          </p>
        </div>
        
        {isClient && (
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/projects/add')}
            className="flex items-center justify-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-[1.5rem] font-black shadow-2xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Post New Project
          </motion.button>
        )}
      </div>

      {/* 📋 Projects Grid: Bento Design */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading ? (
          // 🦴 Futuristic Skeleton Loader
          [1, 2, 3, 4].map(i => (
            <div key={i} className="h-[280px] bg-white/5 rounded-[2.5rem] border border-white/5 animate-pulse" />
          ))
        ) : projects.length > 0 ? (
          projects.map((project) => {
            const hasApplied = project.applications?.includes(user._id);

            return (
              <motion.div 
                key={project._id} 
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-950/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 shadow-2xl hover:border-indigo-500/30 transition-all group relative overflow-hidden"
              >
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl group-hover:bg-indigo-600/10 transition-colors" />

                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="bg-gradient-to-br from-indigo-600/20 to-violet-600/20 p-4 rounded-2xl text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                    <Briefcase size={28} />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xl font-[1000] text-white tracking-tighter flex items-center gap-1">
                      <DollarSign size={18} className="text-emerald-500" /> {project.budget}
                    </span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1 italic">
                       Fixed Price
                    </span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-[1000] text-white mb-3 tracking-tight group-hover:text-indigo-400 transition-colors leading-none">
                  {project.title}
                </h3>
                <p className="text-slate-400 text-base line-clamp-2 mb-6 font-medium leading-relaxed">
                  {project.description}
                </p>

                {/* Tags Section */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags?.map(tag => (
                    <span key={tag} className="text-[10px] font-black bg-white/5 text-slate-400 px-3 py-1 rounded-full border border-white/5 uppercase tracking-widest hover:text-white transition-colors">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-widest">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    Neural Active
                  </div>

                  <div className="flex items-center gap-6">
                    <Link 
                      to={`/projects/${project._id}`} 
                      className="text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all flex items-center gap-1 group/link"
                    >
                      Details <ArrowUpRight size={14} className="group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-transform" />
                    </Link>

                    {/* 🟠 Apply Button Logic (Logic Preserved) */}
                    {!isClient && (
                      hasApplied ? (
                        <div className="bg-emerald-500/10 text-emerald-400 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 border border-emerald-500/20">
                          <CheckCircle2 size={16} /> Applied
                        </div>
                      ) : (
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedProject(project);
                            setModalOpen(true);
                          }}
                          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
                        >
                          Apply Now
                        </motion.button>
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full py-32 text-center bg-slate-950/50 rounded-[3rem] border border-white/5 backdrop-blur-md">
            <div className="bg-slate-900 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5">
              <Search className="text-slate-700" size={40} />
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">No projects found in the network</h3>
            <p className="text-slate-500 mt-2 font-medium">Try broadening your search or check back later.</p>
          </div>
        )}
      </div>

      {/* 🔴 Apply Modal (Logic Preserved) */}
      <AnimatePresence>
        {selectedProject && (
          <ApplyModal 
            project={selectedProject} 
            isOpen={isModalOpen} 
            onClose={() => {
              setModalOpen(false);
              setSelectedProject(null);
            }}
            onApplySuccess={(projectId) => {
               setProjects(prevProjects => 
                 prevProjects.map(p => 
                   p._id === projectId 
                   ? { ...p, applications: [...(p.applications || []), user._id] } 
                   : p
                 )
               );
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}