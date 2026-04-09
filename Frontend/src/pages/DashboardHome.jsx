import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Briefcase, Clock, Users, Edit3, Trash2, ChevronRight } from 'lucide-react';

const DashboardHome = () => {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null); // 🟢 User state add kiya
  const navigate = useNavigate();

  useEffect(() => {
    // 🟢 LocalStorage se user info nikaali (parse karke)
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
        alert("Project udd gaya! 🚀");
      } catch (err) {
        alert(err.response?.data?.message || "Delete fail ho gaya lala");
      }
    }
  };

  return (
    <div className="space-y-6 md:space-y-10 p-4 md:p-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-[1000] text-slate-900 tracking-tighter italic leading-none">
            Project Control Center
          </h1>
          <p className="text-slate-500 font-medium mt-2 text-sm md:text-base">
            {user?.role === 'client' ? 'Manage your requirements' : 'Explore available projects'}
          </p>
        </div>

        {/* 🟠 Logic: Agar role 'client' hai tabhi "Post New Project" dikhega */}
        {user?.role === 'client' && (
          <button 
            onClick={() => navigate('/projects/add')}
            className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 active:scale-95"
          >
            <Plus size={20}/> <span>Post New Project</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
         <StatCard icon={<Briefcase/>} label="Total Projects" value={projects.length} color="indigo"/>
         <StatCard icon={<Clock/>} label="In Progress" value="0" color="orange"/>
         <StatCard icon={<Users/>} label="Total Applicants" value="0" color="green"/>
      </div>

      <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h3 className="font-black text-slate-800 tracking-tight text-lg md:text-xl">Recent Projects</h3>
        </div>
        
        <div className="divide-y divide-slate-50">
          {projects.length === 0 ? (
            <p className="p-10 text-center text-slate-400 font-medium">No projects posted yet. 🚀</p>
          ) : (
            projects.map(p => (
              <div 
                key={p._id} 
                className="p-4 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-slate-50/80 transition group cursor-pointer gap-4"
                onClick={() => navigate(`/projects/${p._id}`)}
              >
                <div className="flex items-center gap-4 md:gap-6 w-full sm:w-auto">
                   <div className="flex shrink-0 w-12 h-12 bg-indigo-50 rounded-2xl items-center justify-center text-indigo-600 font-bold">
                      {p.title.charAt(0).toUpperCase()}
                   </div>
                   <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition text-base md:text-lg leading-tight truncate">
                      {p.title}
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {p.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[8px] md:text-[9px] bg-white border border-slate-200 px-2 py-0.5 rounded-lg font-black text-slate-400 uppercase tracking-widest">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 md:gap-8 border-t sm:border-t-0 pt-3 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <p className="text-sm font-black text-slate-900">${p.budget}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{p.status}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* 🟠 Logic: Edit aur Delete bhi sirf Client hi kar sake */}
                    {user?.role === 'client' && (
                      <>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation(); 
                            navigate(`/projects/edit/${p._id}`);
                          }}
                          className="p-2.5 md:p-3 bg-slate-50 sm:bg-transparent hover:bg-white hover:shadow-md rounded-xl text-slate-400 hover:text-indigo-600 transition"
                        >
                          <Edit3 size={18} />
                        </button>

                        <button 
                          onClick={(e) => handleDelete(e, p._id)}
                          className="p-2.5 md:p-3 bg-slate-50 sm:bg-transparent hover:bg-red-50 hover:shadow-md rounded-xl text-slate-400 hover:text-red-600 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}

                    <ChevronRight size={20} className="hidden md:block text-slate-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-green-600",
  };
  const colorClasses = colorMap[color] || "bg-slate-50 text-slate-600";
  return (
    <div className="bg-white p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 md:gap-5 hover:border-indigo-100 transition">
      <div className={`p-3 md:p-4 rounded-2xl flex-shrink-0 ${colorClasses}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest truncate">{label}</p>
        <h3 className="text-2xl md:text-3xl font-black text-slate-900">{value}</h3>
      </div>
    </div>
  );
};

export default DashboardHome;