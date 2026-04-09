import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Trash2, CheckCircle, X, Send, DollarSign, MessageSquare } from 'lucide-react';
import axios from 'axios';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // States
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [proposalText, setProposalText] = useState("");
  const [bidAmount, setBidAmount] = useState("");

  // Get User from LocalStorage
  const user = JSON.parse(localStorage.getItem('user'));

  // 1. Fetch Project Details
  const fetchProject = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProject(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  // Logic Checks
  const isOwner = user && project && project.clientId === user._id;
  const isEngineer = user && user.role === 'engineer';
  const isClient = user && user.role === 'client';
  const hasApplied = project?.applications?.includes(user?._id);

  // 2. Handle Application Submit
  const handleSendProposal = async () => {
    if (!proposalText || !bidAmount) return alert("Bhai, saari details bharo!");

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/projects/${id}/apply`, 
        { proposalText, bidAmount: Number(bidAmount) }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Proposal bhej diya gaya hai! 🚀");
      setShowModal(false);
      setProposalText("");
      setBidAmount("");
      fetchProject(); // Refresh data to show "Applied" status
    } catch (err) {
      alert(err.response?.data?.message || "Kuch lafda ho gaya!");
    }
  };

  // 3. Handle Delete (Only for Owner)
  const handleDelete = async () => {
    if (window.confirm("Bhai, pakka delete karna hai? Ye wapas nahi aayega!")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Project uda diya! 🚀");
        navigate('/dashboard');
      } catch (err) {
        alert("Delete fail ho gaya lala");
      }
    }
  };

  if (loading) return (
    <div className="p-20 text-center space-y-4">
      <div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      <p className="font-black text-slate-400 tracking-widest text-xs uppercase">Loading Details...</p>
    </div>
  );

  if (!project) return <div className="p-20 text-center font-bold">Project not found!</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* --- ACTION BAR --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600">
            <CheckCircle size={28}/>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-[1000] text-slate-900 leading-tight">{project.title}</h1>
            <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-[0.2em]">Status: {project.status}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Client Actions: Edit & Delete */}
          {isOwner && (
            <>
              <button 
                onClick={() => navigate(`/projects/edit/${project._id}`)}
                className="flex-1 md:flex-none bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all"
              >
                Edit
              </button>
              <button 
                onClick={handleDelete}
                className="p-3.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all border border-red-100"
              >
                <Trash2 size={20}/>
              </button>
            </>
          )}

          {/* Engineer Actions: Apply / Applied */}
          {isEngineer && (
            hasApplied ? (
              <div className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 px-8 py-3.5 rounded-2xl font-black text-sm border border-emerald-100 cursor-default">
                <CheckCircle size={18} /> Applied
              </div>
            ) : (
              <button 
                onClick={() => setShowModal(true)} 
                className="flex-1 md:flex-none bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
              >
                Apply for this Project
              </button>
            )
          )}
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Description */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm min-h-[400px]">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Detailed Description</h3>
            <p className="text-slate-600 leading-relaxed text-lg font-medium whitespace-pre-wrap">{project.description}</p>
            
            <div className="mt-16 pt-10 border-t border-slate-50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Required Skills</p>
              <div className="flex flex-wrap gap-2">
                {project.tags?.map(tag => (
                  <span key={tag} className="px-4 py-2 bg-slate-50 text-slate-500 border border-slate-100 rounded-xl font-bold text-[10px] uppercase tracking-widest">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Sidebar Stats */}
        <div className="space-y-6">
          <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <p className="text-indigo-200 text-[10px] font-black uppercase mb-2 tracking-widest">Project Budget</p>
            <h2 className="text-5xl font-black tracking-tighter">${project.budget}</h2>
            
            <div className="mt-12 pt-8 border-t border-indigo-500/50 flex items-center gap-4">
               <div className="bg-indigo-500/30 p-3 rounded-2xl"><Calendar size={20}/></div>
               <div>
                 <p className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest">Deadline</p>
                 <span className="font-black text-sm">{new Date(project.deadline).toLocaleDateString('en-GB')}</span>
               </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Client Info</p>
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400">
                  {project.clientId?.name ? project.clientId.name.charAt(0).toUpperCase() : "C"}
                </div>
                <div>
                   <p className="font-bold text-slate-800 italic text-sm">Verified Client</p>
                   <p className="text-xs text-slate-400">5+ Projects Posted</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* --- APPLICATION MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-8 md:p-10 rounded-[3rem] w-full max-w-xl shadow-2xl relative animate-in zoom-in duration-300">
            <button 
               onClick={() => setShowModal(false)} 
               className="absolute right-8 top-8 text-slate-400 hover:text-slate-900 bg-slate-50 p-2 rounded-full transition-all"
            >
              <X size={20} />
            </button>

            <div className="mb-8">
              <h2 className="text-3xl font-[1000] text-slate-900 leading-tight">Apply for this Project</h2>
              <p className="text-slate-500 mt-2 font-medium">Your proposal is the first thing the client sees.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <MessageSquare size={14}/> Why you?
                </label>
                <textarea 
                  className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] h-44 outline-none focus:border-indigo-100 focus:bg-white transition-all text-slate-700 font-medium resize-none"
                  placeholder="Tell the client about your experience with similar projects..."
                  value={proposalText}
                  onChange={(e) => setProposalText(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <DollarSign size={14}/> Your Bid ($)
                </label>
                <input 
                  type="number"
                  className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-100 focus:bg-white transition-all font-bold text-lg"
                  placeholder="e.g. 500"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                />
              </div>

              <button 
                onClick={handleSendProposal}
                className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-indigo-100 hover:bg-indigo-700 mt-4"
              >
                Submit Proposal <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;