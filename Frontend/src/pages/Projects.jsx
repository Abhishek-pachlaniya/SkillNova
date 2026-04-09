import { useState, useEffect } from 'react';
import API from '../api/axios';
import { Plus, Briefcase, Clock, Check, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ApplyModal from '../components/ApplyModal';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  // 🟢 User data nikalne ka safe tareeka
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

  // 🔵 Projects fetch karne ka function
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
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-[1000] text-slate-900 tracking-tight">Available Projects</h1>
          <p className="text-slate-500 font-medium">Explore or post new opportunities in the AI ecosystem.</p>
        </div>
        
        {isClient && (
          <button 
            onClick={() => navigate('/projects/add')}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
          >
            <Plus size={20} /> Post New Project
          </button>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          // Simple Skeleton Loader
          <div className="col-span-full py-20 text-center font-bold text-slate-400">Loading projects...</div>
        ) : projects.length > 0 ? (
          projects.map((project) => {
            // 🟠 YE HAI MAIN LOGIC: 
            // Refresh ke baad bhi backend se project.applications mein user._id aayega
            const hasApplied = project.applications?.includes(user._id);

            return (
              <div key={project._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Briefcase size={24} />
                  </div>
                  <span className="text-xs font-black px-3 py-1 bg-slate-100 text-slate-500 rounded-full uppercase tracking-widest">
                    ${project.budget}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4 font-medium">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags?.map(tag => (
                    <span key={tag} className="text-[10px] font-bold bg-slate-50 text-slate-400 px-2 py-1 rounded-md border border-slate-100">
                      #{tag.toUpperCase()}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                    <Clock size={14} /> Active
                  </div>

                  <div className="flex items-center gap-4">
                    <Link 
                      to={`/projects/${project._id}`} 
                      className="text-slate-400 font-bold text-sm hover:text-indigo-600 transition-all"
                    >
                      View Details
                    </Link>

                    {/* 🟠 Apply Button Logic */}
                    {!isClient && (
                      hasApplied ? (
                        <button 
                          disabled
                          className="bg-green-50 text-green-600 px-5 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 cursor-default border border-green-100"
                        >
                          <Check size={16} strokeWidth={3} /> Applied
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            setSelectedProject(project);
                            setModalOpen(true);
                          }}
                          className="bg-indigo-50 text-indigo-600 px-5 py-2.5 rounded-xl font-black text-sm hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95"
                        >
                          Apply Now
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-900">No projects found</h3>
          </div>
        )}
      </div>

      {/* 🔴 Apply Modal */}
      {selectedProject && (
        <ApplyModal 
          project={selectedProject} 
          isOpen={isModalOpen} 
          onClose={() => {
            setModalOpen(false);
            setSelectedProject(null);
          }}
          // Success hone par local state update karo taki Bina Refresh ke status change ho
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
    </div>
  );
}