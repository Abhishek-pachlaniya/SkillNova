import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { Loader2, MapPin, Briefcase, CheckCircle } from 'lucide-react'; 
import toast, { Toaster } from 'react-hot-toast';

export default function ApplicantsList() {
  const { id } = useParams(); // Project ID
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      // 🟢 Wahi endpoint jisme data aa raha hai
      const res = await API.get(`/applications/project-applicants/${id}`);
      setApps(res.data);
    } catch (err) {
      console.error("Fetch failed:", err);
      toast.error("Data load nahi ho paya!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(id) fetchApplicants();
  }, [id]);

  // 🔥 Hiring Logic: Hum projectId aur engineerId bhejenge
  const handleHire = async (engineerId) => {
    if (!window.confirm("Bhai, pakka hire karna hai is engineer ko?")) return;
    
    try {
      // 🟢 Naya approach: Project ID aur Engineer ID ke through hire kar rahe hain
      const res = await API.put(`/applications/hire-engineer`, { 
        projectId: id, 
        engineerId: engineerId,
        status: 'accepted' 
      });
      
      if (res.data) {
        toast.success("Engineer hired successfully! 🎉");
        fetchApplicants(); 
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Hiring fail ho gayi!");
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <Toaster />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-[1000] mb-8 text-slate-900 italic tracking-tighter">Project Applicants</h1>

        <div className="grid gap-6">
          {apps && apps.length > 0 ? (
            apps.map((a) => (
              <div key={a.user?._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between transition-all hover:shadow-xl hover:border-indigo-100">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <Link to={`/engineer-profile/${a.user?._id}`} className="font-black text-slate-900 text-2xl hover:text-indigo-600 transition-all tracking-tight">
                      {a.user?.name || "Unknown Engineer"}
                    </Link>
                    {a.status === 'accepted' && (
                      <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-200 flex items-center gap-1">
                        <CheckCircle size={12}/> Hired ✨
                      </span>
                    )}
                  </div>
                  
                  <p className="text-slate-500 mt-2 text-sm font-medium">{a.user?.bio || "No bio provided."}</p>
                  
                  <div className="mt-6 p-5 bg-indigo-50/50 rounded-3xl border border-indigo-50">
                    <p className="text-[10px] text-indigo-400 font-black uppercase mb-2 tracking-widest">The Pitch</p>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium italic">
                        "{a.proposalText || "Interested in this project."}"
                    </p>
                  </div>

                  <div className="flex items-center gap-6 mt-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                     <span className="flex items-center gap-1.5"><MapPin size={14} className="text-indigo-500"/> {a.user?.location || 'Remote'}</span>
                     <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-indigo-500"/> {a.user?.experience || '0'} Yrs Exp</span>
                  </div>
                </div>

                <div className="mt-8 md:mt-0 md:ml-12 flex flex-col items-center md:items-end gap-5">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-black block uppercase tracking-wider mb-1">Bid Price</span>
                    <span className="font-black text-slate-900 text-4xl tracking-tighter">${a.bidAmount}</span>
                  </div>

                  <button 
                    onClick={() => handleHire(a.user?._id)}
                    disabled={a.status === 'accepted'}
                    className={`w-full md:w-auto px-10 py-4 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-xl ${
                      a.status === 'accepted'
                        ? 'bg-emerald-50 text-emerald-300 cursor-not-allowed border border-emerald-100 shadow-none'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                    }`}
                  >
                    {a.status === 'accepted' ? 'Hired' : 'Hire Engineer'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-32 bg-white rounded-[3.5rem] border-2 border-dashed border-slate-200 text-slate-400 font-black">
              No applicants found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}