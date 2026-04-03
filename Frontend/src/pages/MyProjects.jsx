import { useState, useEffect } from 'react';
import API from '../api/axios';
import { Users, Trash2, Clock, CheckCircle, Send } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MyProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const isClient = user?.role?.toLowerCase() === 'client';

 useEffect(() => {
    // 1. Agar user ka data ya role abhi tak nahi aaya, toh wait karo
    if (!user || !user.role) {
      return; 
    }

    const fetchProjects = async () => {
      try {
        setLoading(true);
        // Smart Logic: Role ke hisaab se API decide karo
        const endpoint = user.role === 'engineer' ? '/projects/my-applied' : '/projects/my-projects';
        
        const res = await API.get(endpoint);
        setProjects(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false); // API call complete hone ke baad loading band karo
      }
    };

    // 2. Function call karo
    fetchProjects();

  }, [user]); // 👈 Ye [user] sabse important hai! Jab bhi user load hoga, ye chalega.

  if (loading) return <div className="p-10 font-black text-center animate-pulse text-indigo-600">LOADING PROJECTS... 🚀</div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-[1000] text-slate-900 tracking-tighter">
            {isClient ? "Managed Projects 📁" : "Applied Opportunities 💼"}
          </h1>
          <p className="text-slate-500 font-medium">
            {isClient ? "Aapke post kiye huye saare projects." : "Projects jahan aapne apni kismat azmayi hai."}
          </p>
        </div>
        
        {isClient && (
          <Link to="/projects/add" className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:scale-105 transition-all">
            + Post New
          </Link>
        )}
      </div>

      {/* Projects List */}
      <div className="grid gap-6">
        {projects.length > 0 ? projects.map((p) => (
          <div key={p._id} className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row md:items-center justify-between hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
            
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{p.title}</h3>
              <div className="flex flex-wrap gap-3">
                <span className="flex items-center gap-1 text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl uppercase">
                  💰 Budget: {p.budget}
                </span>
                {/* Engineer View Status Badge */}
                {!isClient && (
                  <span className="flex items-center gap-1 text-xs font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl uppercase">
                    <Clock size={12}/> Status: Pending
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4 md:mt-0">
              {isClient ? (
                <>
                  <Link to={`/projects/${p._id}/applicants`} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-black text-sm hover:bg-indigo-600 transition-all">
                    <Users size={18} /> Applicants
                  </Link>
                  <button onClick={() => handleDelete(p._id)} className="p-3.5 text-red-400 hover:bg-red-50 rounded-2xl transition-all">
                    <Trash2 size={22}/>
                  </button>
                </>
              ) : (
                <Link to={`/projects/${p._id}`} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-black text-sm hover:bg-slate-900 transition-all">
                  <Send size={18} /> View Job Details
                </Link>
              )}
            </div>
          </div>
        )) : (
          <div className="text-center py-24 bg-white rounded-[3.5rem] border-2 border-dashed border-slate-100">
             <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Clock size={40} />
             </div>
             <h2 className="text-xl font-black text-slate-400 uppercase tracking-widest">
               {isClient ? "Bhai, naya project post karo!" : "Abhi tak kahin apply nahi kiya lala!"}
             </h2>
          </div>
        )}
      </div>
    </div>
  );
}