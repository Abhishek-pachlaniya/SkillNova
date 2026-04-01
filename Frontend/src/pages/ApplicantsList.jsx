import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // 👈 Link import kiya
import API from '../api/axios';
import { CheckCircle, AlertCircle, Loader2, MapPin, Briefcase } from 'lucide-react'; // 👈 Icons cleanup

export default function ApplicantsList() {
  const { id } = useParams();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Applicants
  const fetchApplicants = async () => {
    try {
      const res = await API.get(`/applications/project/${id}`);
      setApps(res.data);
    } catch (err) {
      console.error("Error fetching applicants:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [id]);

  // 2. Hire Function
  const handleHire = async (applicationId) => {
    if (window.confirm("Bhai, kya aap is engineer ko hire karna chahte ho?")) {
      try {
        await API.put(`/applications/${applicationId}/status`, { status: 'accepted' });
        alert("Engineer hired successfully! 🎉");
        fetchApplicants(); 
      } catch (err) {
        alert(err.response?.data?.message || "Hiring failed!");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black mb-8 text-slate-800">Applicants List</h1>

        <div className="grid gap-6">
          {apps.length > 0 ? (
            apps.map((a) => (
              <div 
                key={a._id} 
                className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between transition-all hover:shadow-xl"
              >
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    {/* ✅ Ab naam clickable hai aur profile link par jayega */}
                    <Link 
                      to={`/engineer-profile/${a.engineer?._id}`} 
                      className="font-bold text-indigo-600 text-2xl hover:text-indigo-800 hover:underline transition-all cursor-pointer tracking-tight"
                    >
                      {a.engineer?.name || "Unknown Engineer"}
                    </Link>

                    {a.status === 'accepted' && (
                      <span className="bg-green-100 text-green-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                        Hired
                      </span>
                    )}
                  </div>
                  
                  {/* Skills Badges */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {a.engineer?.skills?.map((skill, idx) => (
                      <span key={idx} className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <p className="text-slate-500 mt-3 text-sm italic line-clamp-2">
                    {a.engineer?.bio || "Bhai ne abhi tak bio nahi likha hai."}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-4 text-slate-400">
                     <span className="text-xs font-bold flex items-center gap-1">
                       <MapPin size={14} className="text-indigo-400" /> {a.engineer?.location || 'Remote'}
                     </span>
                     <span className="text-xs font-bold flex items-center gap-1">
                       <Briefcase size={14} className="text-indigo-400" /> {a.engineer?.experience || '0'} Years Exp
                     </span>
                  </div>

                  {/* Proposal Message */}
                  <div className="mt-4 p-4 bg-slate-50 rounded-2xl border-l-4 border-indigo-200">
                    <p className="text-[10px] text-slate-400 font-black uppercase mb-1 tracking-widest">Proposal/Message</p>
                    <p className="text-sm text-slate-600 leading-relaxed italic">"{a.proposal}"</p>
                  </div>
                </div>

                {/* Right Side: Bid & Action */}
                <div className="mt-6 md:mt-0 md:ml-10 flex flex-col items-end gap-4 min-w-[150px]">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Bid Amount</span>
                    <span className="font-black text-slate-800 text-3xl">${a.bidAmount}</span>
                  </div>
                  
                  <button 
                    onClick={() => handleHire(a._id)}
                    disabled={a.status === 'accepted'}
                    className={`w-full md:w-auto px-8 py-4 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-lg ${
                      a.status === 'accepted'
                        ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
                        : 'bg-green-600 text-white hover:bg-green-700 shadow-green-100'
                    }`}
                  >
                    {a.status === 'accepted' ? 'Hired ✨' : 'Hire Engineer'}
                  </button>
                </div>

              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold text-xl font-mono">Bhai, koi applicant nahi hai abhi. 😅</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}