import { useState, useEffect } from 'react';
import API from '../api/axios';
import { Users, Trash2, Clock, CheckCircle, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

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
        toast.error("Projects fetch karne mein dikkat aayi!");
      } finally {
        setLoading(false); 
      }
    };

    fetchProjects();
  }, [user]); 

  const executeDelete = async (projectId) => {
    const deletePromise = new Promise(async (resolve, reject) => {
      try {
        await API.delete(`/projects/${projectId}`);
        setProjects((prevProjects) => prevProjects.filter((p) => p._id !== projectId));
        resolve("Project deleted successfully!");
      } catch (err) {
        reject(err.response?.data?.message || "Delete fail ho gaya lala!");
      }
    });

    toast.promise(deletePromise, {
      loading: 'Deleting project...',
      success: (msg) => msg,
      error: (errMsg) => errMsg
    });
  };

  const handleDelete = (projectId) => {
    toast((t) => (
      <div className="flex flex-col gap-4 p-1">
        <span className="font-bold text-slate-800 text-[15px]">
          Are you sure you want to delete this project?<br/>
          <span className="text-red-500 text-sm">Ye wapas nahi aayega bhai!</span>
        </span>
        <div className="flex justify-end gap-3 mt-2">
          <button onClick={() => toast.dismiss(t.id)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm">Cancel</button>
          <button onClick={() => { toast.dismiss(t.id); executeDelete(projectId); }} className="px-4 py-2 bg-red-500 text-white rounded-xl font-bold text-sm">Yes, Delete it!</button>
        </div>
      </div>
    ), { duration: 5000, id: `confirm-delete-${projectId}` });
  };

  if (loading) return <div className="p-10 font-black text-center animate-pulse text-indigo-600">LOADING PROJECTS... 🚀</div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <Toaster position="top-center" />

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-[1000] text-slate-900 tracking-tighter">
            {isClient ? "Managed Projects 📁" : "Applied Opportunities 💼"}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            {isClient ? "Aapke post kiye huye saare projects." : "Projects jahan aapne apni kismat azmayi hai."}
          </p>
        </div>
        {isClient && (
          <Link to="/projects/add" className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black shadow-lg">
            + Post New
          </Link>
        )}
      </div>

      <div className="grid gap-6">
        {projects.length > 0 ? projects.map((p) => (
          <div key={p._id} className="group bg-white p-6 rounded-[2.5rem] border-2 border-slate-100/50 flex flex-col md:flex-row md:items-center justify-between hover:shadow-xl transition-all duration-300">
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{p.title}</h3>
              <div className="flex flex-wrap gap-3">
                <span className="flex items-center gap-1.5 text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl uppercase tracking-wider">
                  💰 Budget: ${p.budget}
                </span>
                
                {!isClient && (
                 <span className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl uppercase tracking-wider transition-all ${
                    p.myStatus === 'hired' 
                      ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' 
                      : 'text-amber-600 bg-amber-50 border border-amber-100'
                  }`}>
                    {p.myStatus === 'hired' ? (
                      <><CheckCircle size={14}/> Status: Hired ✨</>
                    ) : (
                      <><Clock size={14}/> Status: Pending ⏳</>
                    )}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6 md:mt-0">
              {isClient ? (
                <>
                  <Link to={`/projects/${p._id}/applicants`} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-indigo-600 transition-all">
                    <Users size={18} /> Applicants
                  </Link>
                  <button onClick={() => handleDelete(p._id)} className="p-3.5 text-red-400 bg-red-50 hover:bg-red-500 hover:text-white rounded-2xl transition-all">
                    <Trash2 size={20}/>
                  </button>
                </>
              ) : (
                <Link to={`/projects/${p._id}`} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all">
                  <Send size={18} /> View Job Details
                </Link>
              )}
            </div>
          </div>
        )) : (
          <div className="text-center py-24 bg-white rounded-[3.5rem] border-2 border-dashed border-slate-200">
             <div className="bg-slate-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Clock size={40} />
             </div>
             <h2 className="text-xl font-black text-slate-400 uppercase tracking-[0.15em]">
               {isClient ? "Bhai, naya project post karo!" : "Abhi tak kahin apply nahi kiya lala!"}
             </h2>
          </div>
        )}
      </div>
    </div>
  );
}