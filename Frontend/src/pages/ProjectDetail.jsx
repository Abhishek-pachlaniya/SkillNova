import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Edit3, Trash2, CheckCircle } from 'lucide-react';
import axios from 'axios';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProject(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchProject();
  }, [id]);

  // 🗑️ Delete Function
  const handleDelete = async () => {
    if (window.confirm("Bhai, pakka delete karna hai? Ye page bhi gayab ho jayega!")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        alert("Project successfully uda diya! 🚀");
        navigate('/dashboard'); // 👈 Delete ke baad wapas dashboard bhej do
      } catch (err) {
        alert(err.response?.data?.message || "Delete fail ho gaya lala");
      }
    }
  };

  if (!project) return (
    <div className="p-20 text-center space-y-4">
      <div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Fetching Details...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Action Bar */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600"><CheckCircle/></div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 leading-none">{project.title}</h1>
            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest leading-none">Status: {project.status}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          {/* Edit Button */}
          <button 
            onClick={() => navigate(`/projects/edit/${id}`)} 
            className="p-3 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all"
          >
            <Edit3 size={20}/>
          </button>
          
          {/* 🗑️ Trash Button connected to handleDelete */}
          <button 
            onClick={handleDelete} 
            className="p-3 bg-slate-50 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
          >
            <Trash2 size={20}/>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Detailed Description</h3>
            <p className="text-slate-600 leading-relaxed text-lg font-medium whitespace-pre-wrap">
              {project.description}
            </p>
            
            <div className="mt-12 pt-8 border-t border-slate-50 flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="px-4 py-2 bg-slate-50 text-slate-500 border border-slate-100 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-colors cursor-default">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Quick Stats */}
        <div className="space-y-6">
          <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            
            <p className="text-indigo-200 text-[10px] font-black uppercase tracking-[0.2em] mb-2 relative z-10">Project Budget</p>
            <h2 className="text-5xl font-black tracking-tighter relative z-10">${project.budget}</h2>
            
            <div className="mt-10 pt-8 border-t border-indigo-500/50 flex items-center gap-3 relative z-10">
               <div className="p-2 bg-white/10 rounded-lg"><Calendar size={18} className="text-indigo-100"/></div>
               <div>
                 <p className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest">Expected Deadline</p>
                 <span className="font-black text-sm">{new Date(project.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
               </div>
            </div>
          </div>
          
          {/* Quick Tip / Info Card */}
          <div className="bg-white p-6 rounded-3xl border border-dashed border-slate-200">
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              💡 <span className="font-bold text-slate-600">Pro Tip:</span> Projects with clear descriptions and realistic budgets attract 40% more engineers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;