import { useState, useEffect } from 'react';
import API from '../api/axios';
import { Plus, Briefcase, Clock, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ApplyModal from '../components/ApplyModal'; // 1. Ise import karo

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null); // 2. State for Modal
  const [isModalOpen, setModalOpen] = useState(false); // 3. State for Modal
  
  const navigate = useNavigate();
  const getSafeUser = () => {
  try {
    const storedUser = localStorage.getItem('user');
    // Check if it's null or the literal string "undefined"
    if (!storedUser || storedUser === "undefined") return {};
    return JSON.parse(storedUser);
  } catch (error) {
    console.error("User parsing failed:", error);
    return {};
  }
};

const user = getSafeUser();
  const isClient = user.role === 'client';

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get('/projects');
        setProjects(res.data);
      } catch (err) {
        console.error("Projects load nahi huye!", err);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-[1000] text-slate-900 tracking-tight">Available Projects</h1>
          <p className="text-slate-500 font-medium">Explore or post new opportunities in the AI ecosystem.</p>
        </div>
        
        {isClient && (
          <button 
            onClick={() => navigate('/projects/new')}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
          >
            <Plus size={20} /> Post New Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Briefcase size={24} />
                </div>
                <span className="text-xs font-black px-3 py-1 bg-slate-100 text-slate-500 rounded-full uppercase tracking-widest">
                  {project.budget || '$500 - $1000'}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {project.title}
              </h3>
              <p className="text-slate-500 text-sm line-clamp-2 mb-4 font-medium">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.skills?.map(skill => (
                  <span key={skill} className="text-[10px] font-bold bg-slate-50 text-slate-400 px-2 py-1 rounded-md border border-slate-100">
                    #{skill.toUpperCase()}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                  <Clock size={14} /> 2 days ago
                </div>

                <div className="flex items-center gap-4">
                   <Link 
                    to={`/projects/${project._id}`} 
                    className="text-slate-400 font-bold text-sm hover:text-indigo-600 transition-all"
                  >
                    View Details
                  </Link>

                  {/* 4. APPLY BUTTON SIRF ENGINEER KE LIYE */}
                  {!isClient && (
                    <button 
                      onClick={() => {
                        setSelectedProject(project);
                        setModalOpen(true);
                      }}
                      className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-black text-sm hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-slate-900">No projects found</h3>
          </div>
        )}
      </div>

      {/* 5. MODAL RENDER YAHAN HOGA */}
      {selectedProject && (
        <ApplyModal 
          project={selectedProject} 
          isOpen={isModalOpen} 
          onClose={() => {
            setModalOpen(false);
            setSelectedProject(null);
          }} 
        />
      )}
    </div>
  );
}