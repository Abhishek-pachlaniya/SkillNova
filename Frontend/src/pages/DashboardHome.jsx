import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 👈 Navigate import kiya
import { Plus, Briefcase, Clock, Users, Edit3, ChevronRight } from 'lucide-react';

const DashboardHome = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate(); // 👈 Hook initialize kiya

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
    } catch (err) { console.log(err); }
  };

  useEffect(() => { fetchProjects(); }, []);

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-[1000] text-slate-900 tracking-tighter italic">Project Control Center</h1>
          <p className="text-slate-500 font-medium">Manage your requirements and AI matches</p>
        </div>
        {/* Modal ki jagah seedha Add Page ka link */}
        <button 
          onClick={() => navigate('/projects/add')}
          className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black flex items-center gap-2 hover:bg-indigo-700 transition shadow-xl shadow-indigo-100"
        >
          <Plus size={20}/> Post New Project
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         <StatCard icon={<Briefcase/>} label="Total Projects" value={projects.length} color="indigo"/>
         <StatCard icon={<Clock/>} label="In Progress" value="0" color="orange"/>
         <StatCard icon={<Users/>} label="Total Applicants" value="0" color="green"/>
      </div>

      {/* Projects Table/List */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h3 className="font-black text-slate-800 tracking-tight text-xl">Recent Projects</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {projects.length === 0 ? (
            <p className="p-10 text-center text-slate-400 font-medium">No projects posted yet. Click the button above to start! 🚀</p>
          ) : (
            projects.map(p => (
              <div 
                key={p._id} 
                className="p-6 flex justify-between items-center hover:bg-slate-50/80 transition group cursor-pointer"
                onClick={() => navigate(`/projects/${p._id}`)} // 👈 Click pe Detail page
              >
                <div className="flex items-center gap-6">
                   <div className="hidden sm:flex w-12 h-12 bg-indigo-50 rounded-2xl items-center justify-center text-indigo-600 font-bold">
                      {p.title.charAt(0)}
                   </div>
                   <div>
                    <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition text-lg leading-tight">{p.title}</h4>
                    <div className="flex gap-2 mt-2">
                      {p.tags.map(tag => (
                        <span key={tag} className="text-[9px] bg-white border border-slate-200 px-2 py-0.5 rounded-lg font-black text-slate-400 uppercase tracking-widest">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-black text-slate-900">${p.budget}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{p.status}</p>
                  </div>
                  
                  {/* Edit Button - StopPropagation zaroori hai taaki sirf edit khule detail nahi */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); 
                      navigate(`/projects/edit/${p._id}`);
                    }}
                    className="p-3 hover:bg-white hover:shadow-md rounded-xl text-slate-400 hover:text-indigo-600 transition"
                  >
                    <Edit3 size={18} />
                  </button>

                  <ChevronRight size={20} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable StatCard Component
const StatCard = ({icon, label, value, color}) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:border-indigo-100 transition">
    <div className={`p-4 bg-slate-50 text-indigo-600 rounded-2xl`}>{icon}</div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <h3 className="text-3xl font-black text-slate-900">{value}</h3>
    </div>
  </div>
);

export default DashboardHome;