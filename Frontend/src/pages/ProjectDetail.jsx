import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, Edit3, Trash2, User, CheckCircle } from 'lucide-react';
import axios from 'axios';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProject(res.data);
    };
    fetchProject();
  }, [id]);

  if (!project) return <div className="p-10 text-center font-bold text-slate-400 animate-pulse">Loading Project Details...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Action Bar */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-3 rounded-2xl text-white"><CheckCircle/></div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 leading-none">{project.title}</h1>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-tighter">Status: {project.status}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate(`/projects/edit/${id}`)} className="p-3 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition">
            <Edit3 size={20}/>
          </button>
          <button className="p-3 bg-slate-100 hover:bg-red-50 hover:text-red-600 rounded-xl transition">
            <Trash2 size={20}/>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-4">Description</h3>
            <p className="text-slate-600 leading-relaxed text-lg font-light">{project.description}</p>
            
            <div className="mt-10 flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full font-bold text-xs uppercase tracking-widest">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Quick Stats */}
        <div className="space-y-6">
          <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100">
            <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-2">Total Budget</p>
            <h2 className="text-5xl font-black tracking-tighter">${project.budget}</h2>
            <div className="mt-6 pt-6 border-t border-indigo-500 flex items-center gap-3">
               <Calendar size={18} className="text-indigo-300"/>
               <span className="font-bold text-sm">Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;