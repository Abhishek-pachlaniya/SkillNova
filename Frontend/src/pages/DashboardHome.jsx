import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Briefcase, Clock, Users, Edit3, Trash2, ChevronRight, Sparkles, LayoutGrid, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardHome = () => {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
    } catch (err) { console.log(err); }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Bhai, pakka delete karna hai? Ye wapas nahi aayega!")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProjects();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 pb-20"
    >
      {/* 🚀 Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-[1000] text-white tracking-tighter leading-none">
            Project <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">Control Center</span>
          </h1>
          <p className="text-slate-500 font-bold mt-4 flex items-center gap-2 tracking-wide uppercase text-xs">
            <Sparkles size={14} className="text-indigo-500" />
            {user?.role === 'client' ? 'Manage your requirements' : 'Explore available projects'}
          </p>
        </div>

        {user?.role === 'client' && (
          <button 
            onClick={() => navigate('/projects/add')}
            className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-[1.5rem] font-black flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-500/20 active:scale-95 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" /> 
            <span>Post New Project</span>
          </button>
        )}
      </div>

      {/* 📊 Bento Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard icon={<Briefcase size={24}/>} label="Total Projects" value={projects.length} color="indigo" />
        <StatCard icon={<Clock size={24}/>} label="In Progress" value="0" color="fuchsia" />
        <StatCard icon={<Users size={24}/>} label="Total Applicants" value="0" color="cyan" />
      </div>

      {/* 📋 Project List Container */}
      <div className="bg-slate-950/50 rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden backdrop-blur-md">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <LayoutGrid size={20} className="text-indigo-500" />
            <h3 className="font-black text-white tracking-tight text-xl">Recent Projects</h3>
          </div>
        </div>
        
        <div className="divide-y divide-white/5">
          {projects.length === 0 ? (
            <div className="p-20 text-center">
               <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                  <Briefcase className="text-slate-700" size={32} />
               </div>
               <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No active signals found...</p>
            </div>
          ) : (
            projects.map(p => (
              <div 
                key={p._id} 
                className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-white/[0.03] transition-all group cursor-pointer gap-6"
                onClick={() => navigate(`/projects/${p._id}`)}
              >
                <div className="flex items-center gap-6 w-full sm:w-auto">
                   <div className="flex shrink-0 w-14 h-14 bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/20 rounded-2xl items-center justify-center text-indigo-400 font-black text-xl shadow-inner">
                      {p.title.charAt(0).toUpperCase()}
                   </div>
                   <div className="min-w-0 flex-1">
                    <h4 className="font-black text-white group-hover:text-indigo-400 transition-colors text-lg leading-tight truncate tracking-tight">
                      {p.title}
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {p.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] bg-indigo-500/5 border border-indigo-500/10 px-3 py-1 rounded-full font-black text-indigo-400/80 uppercase tracking-widest">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-8 border-t border-white/5 sm:border-t-0 pt-5 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <p className="text-xl font-black text-white flex items-center gap-1">
                      <DollarSign size={16} className="text-emerald-500" />
                      {p.budget}
                    </p>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1 italic">{p.status}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {user?.role === 'client' && (
                      <>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation(); 
                            navigate(`/projects/edit/${p._id}`);
                          }}
                          className="p-3 bg-white/5 hover:bg-indigo-600 hover:text-white rounded-xl text-slate-400 transition-all border border-white/5"
                        >
                          <Edit3 size={18} />
                        </button>

                        <button 
                          onClick={(e) => handleDelete(e, p._id)}
                          className="p-3 bg-white/5 hover:bg-rose-600 hover:text-white rounded-xl text-slate-400 transition-all border border-white/5"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                    <ChevronRight size={20} className="hidden md:block text-slate-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  const colorMap = {
    indigo: "from-indigo-600/20 text-indigo-400 border-indigo-500/20",
    fuchsia: "from-fuchsia-600/20 text-fuchsia-400 border-fuchsia-500/20",
    cyan: "from-cyan-600/20 text-cyan-400 border-cyan-500/20",
  };
  const colorClasses = colorMap[color] || "from-slate-600/20 text-slate-400 border-white/5";
  
  return (
    <div className={`bg-gradient-to-br ${colorClasses} to-slate-950/50 p-6 rounded-[2rem] border backdrop-blur-xl flex items-center gap-6 group hover:scale-[1.02] transition-all duration-300`}>
      <div className="p-4 bg-slate-950 rounded-2xl flex-shrink-0 border border-white/5 shadow-2xl group-hover:border-white/10 transition-colors">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] truncate mb-1">{label}</p>
        <h3 className="text-3xl font-[1000] text-white tracking-tighter">{value}</h3>
      </div>
    </div>
  );
};

export default DashboardHome;