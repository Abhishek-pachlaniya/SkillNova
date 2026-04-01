import { useState, useEffect } from 'react';
import API from '../api/axios';
import { Users, Trash2 } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';

export default function MyProjects() {
  // 1. 🛡️ Safe JSON Parse: Pehle check karo ki data hai ya nahi
  const savedUser = localStorage.getItem('user');
  let user = null;

  try {
    if (savedUser && savedUser !== "undefined") {
      user = JSON.parse(savedUser);
    }
  } catch (err) {
    console.error("User parsing error", err);
  }
// Role check ko case-insensitive banao
if (!user || user.role?.toLowerCase() !== 'client') {
    console.log("Redirecting... User role is:", user?.role); // Debugging ke liye
    return <Navigate to="/dashboard" replace />;
}

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        const res = await API.get('/projects/my-projects');
        setProjects(res.data);
      } catch (err) {
        console.error("Error loading projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyProjects();
  }, []);
const handleDelete = async (id) => {
  if (window.confirm("Bhai, kya aap pakka is project ko delete karna chahte ho?")) {
    try {
      await API.delete(`/projects/${id}`); // Backend API call
      // Delete hone ke baad UI se bhi hatao
      setProjects(projects.filter(p => p._id !== id));
      alert("Project successfully delete ho gaya! ✨");
    } catch (err) {
      alert(err.response?.data?.message || "Delete karne mein error aaya!");
    }
  }
};
  if (loading) return <div className="p-10 font-bold text-center">Loading your projects... 🚀</div>;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-slate-900">My Projects 📁</h1>
        <Link to="/projects/add" className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold text-sm">
          + Post New
        </Link>
      </div>

      <div className="grid gap-4">
        {projects.length > 0 ? projects.map((p) => (
          <div key={p._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row md:items-center justify-between hover:shadow-md transition-all">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-slate-800">{p.title}</h3>
              <div className="flex gap-4 mt-1">
                <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg">Budget: {p.budget}</span>
                <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">Posted: Just Now</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link 
                to={`/projects/${p._id}/applicants`}
                className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-100"
              >
                <Users size={18} /> View Applicants
              </Link>
              <button 
                onClick={() => handleDelete(p._id)} // 👈 Ye line add karein
                className="p-3 text-red-400 hover:bg-red-50 rounded-2xl transition-all"
              >
                <Trash2 size={20}/>
              </button>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
            <p className="text-slate-400 font-bold">Abhi tak koi project post nahi kiya hai, bhai!</p>
          </div>
        )}
      </div>
    </div>
  );
}