import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Edit3, Trash2, CheckCircle, X, Send } from 'lucide-react'; // X aur Send add kiya
import axios from 'axios';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  // 🔥 NEW STATES FOR MODAL
  const [showModal, setShowModal] = useState(false);
  const [proposalText, setProposalText] = useState("");
  const [bidAmount, setBidAmount] = useState("");

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

  // 🔥 SEND PROPOSAL LOGIC
  // 🔥 SEND PROPOSAL LOGIC (UPDATED)
  const handleSendProposal = async () => {
    if (!proposalText || !bidAmount) {
      return alert("Bhai, details toh bhar de pehle!");
    }

    try {
      const token = localStorage.getItem('token');
      // 👉 YAHAN CHANGE KIYA HAI: Sahi endpoint aur body bheji hai
      await axios.post(`http://localhost:5000/api/projects/${id}/apply`, 
        { 
          proposalText: proposalText, 
          bidAmount: Number(bidAmount) // Backend ko number chahiye
        }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Bhai, proposal chala gaya! 🚀");
      setShowModal(false); 
      setProposalText("");
      setBidAmount("");
    } catch (err) {
      alert(err.response?.data?.message || "Proposal bhejne mein gadbad hui!");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Bhai, pakka delete karna hai?")) {
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

  if (!project) return (
    <div className="p-20 text-center space-y-4">
      <div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      <p className="font-black text-slate-400 tracking-widest text-xs uppercase">Fetching Details...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* --- ACTION BAR --- */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600"><CheckCircle/></div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 leading-none">{project.title}</h1>
            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Status: {project.status}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          {user && project.client === user._id && (
            <button onClick={() => navigate(`/edit-project/${project._id}`)} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold">
              Edit Project
            </button>
          )}

          {/* 🔥 ENGINEER APPLY BUTTON */}
          {user && user.role === 'engineer' && (
            <button 
              onClick={() => setShowModal(true)} 
              className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-700 transition-all"
            >
              Apply for this Project
            </button>
          )}
          
          <button onClick={handleDelete} className="p-3 bg-slate-50 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all">
            <Trash2 size={20}/>
          </button>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Detailed Description</h3>
            <p className="text-slate-600 leading-relaxed text-lg font-medium whitespace-pre-wrap">{project.description}</p>
            <div className="mt-12 pt-8 border-t border-slate-50 flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="px-4 py-2 bg-slate-50 text-slate-500 border border-slate-100 rounded-xl font-bold text-[10px] uppercase tracking-widest">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
            <p className="text-indigo-200 text-[10px] font-black uppercase mb-2">Project Budget</p>
            <h2 className="text-5xl font-black tracking-tighter">${project.budget}</h2>
            <div className="mt-10 pt-8 border-t border-indigo-500/50 flex items-center gap-3">
               <Calendar size={18} className="text-indigo-100"/>
               <div>
                 <p className="text-[9px] font-bold text-indigo-300 uppercase">Deadline</p>
                 <span className="font-black text-sm">{new Date(project.deadline).toLocaleDateString('en-GB')}</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 PROPOSAL MODAL UI (Image 2 logic) */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-lg shadow-2xl relative animate-in zoom-in duration-300">
            <button onClick={() => setShowModal(false)} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition-colors">
              <X size={24} />
            </button>

            <h2 className="text-2xl font-black text-slate-900 mb-1">Apply for {project.title}</h2>
            <p className="text-slate-400 text-sm font-bold mb-6 italic">Write a killer proposal to get hired!</p>

            <div className="space-y-4">
              <textarea 
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl h-40 outline-none focus:ring-2 ring-indigo-500/20 text-slate-700 font-medium"
                placeholder="Why are you the best fit for this project?"
                value={proposalText}
                onChange={(e) => setProposalText(e.target.value)}
              />
              
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input 
                  type="number"
                  className="w-full p-4 pl-8 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-indigo-500/20 font-bold"
                  placeholder="Your Bid Amount"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                />
              </div>

              <button 
                onClick={handleSendProposal}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-100"
              >
                Send Proposal <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;