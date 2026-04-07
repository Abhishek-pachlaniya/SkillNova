import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

// 🚨 FIX 1: Humne explicit icons import kiye hain, wildcard (*) hata diya hai
import { ArrowLeft, Sparkles, Briefcase, MapPin, Mail, Globe, User, Code } from 'lucide-react';

// 🚨 FIX 2: Helper component ko top par rakh diya taaki undefined na aaye
const StatusItem = ({ label, status }) => (
  <div className="flex items-center justify-between">
    <span className="text-slate-500 font-bold text-sm">{label}</span>
    {status ? (
      <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black px-2 py-1 rounded-md">VERIFIED</span>
    ) : (
      <span className="bg-slate-200 text-slate-500 text-[10px] font-black px-2 py-1 rounded-md">PENDING</span>
    )}
  </div>
);

export default function EngineerProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [engineer, setEngineer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestSending, setRequestSending] = useState(false);

  useEffect(() => {
    const fetchEngineer = async () => {
      try {
        const res = await API.get(`/users/public/${id}`);
        setEngineer(res.data);
      } catch (err) {
        console.error("Profile load nahi hui!");
      } finally {
        setLoading(false);
      }
    };
    
    fetchEngineer();
  }, [id]);
  

  const handleRequestInterview = async () => {
    try {
      setRequestSending(true);
      const res = await API.post('/interviews/request-interview', { 
        engineerId: id 
      });
      alert(res.data.msg || "Request bhej di gayi hai!");
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.msg || "Kuch gadbad ho gayi!";
      alert(errorMsg);
    } finally {
      setRequestSending(false);
    }
  };
  
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Fetching Talent...</p>
    </div>
  );

  if (!engineer) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h2 className="text-2xl font-black text-slate-800">Bhai, ye banda nahi mila! 😅</h2>
      <button onClick={() => navigate(-1)} className="mt-4 text-indigo-600 font-bold underline">Wapas Jao</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* --- Top Navigation --- */}
      <div className="max-w-5xl mx-auto p-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Applicants
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-white">
          
          {/* --- Banner Section --- */}
          <div className="h-60 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 relative">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="absolute -bottom-1 px-12 w-full flex justify-between items-end">
               <div className="relative">
                  <img 
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${engineer.name}&backgroundColor=f8fafc`} 
                    className="w-44 h-44 rounded-[3rem] border-[10px] border-white bg-slate-50 shadow-2xl object-cover"
                    alt="profile"
                  />
                  <div className="absolute bottom-4 right-4 bg-green-500 w-6 h-6 border-4 border-white rounded-full"></div>
               </div>
            </div>
          </div>

          {/* --- Profile Content --- */}
          <div className="px-12 pt-12 pb-16">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div>
                <h1 className="text-5xl font-[1000] text-slate-900 tracking-tight flex items-center gap-3">
                  {engineer.name} <Sparkles className="text-amber-400" size={32} />
                </h1>
                <div className="flex flex-wrap items-center gap-6 mt-4 text-slate-500 font-bold">
                  <span className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-sm">
                    <Briefcase size={16} className="text-indigo-600" /> {engineer.experience || '0'} Years Experience
                  </span>
                  <span className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-sm">
                    <MapPin size={16} className="text-rose-500" /> {engineer.location || 'Remote'}
                  </span>
                  <span className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-sm">
                    <Mail size={16} className="text-emerald-500" /> {engineer.email}
                  </span>
                </div>
              </div>
              {/* Social Links */}
              <div className="flex gap-3">
                {engineer.githubUrl && (
                  <a href={engineer.githubUrl} target="_blank" rel="noreferrer" className="p-4 bg-slate-900 text-white rounded-2xl hover:scale-110 transition-transform flex items-center gap-2 font-bold">
                    <Code size={20} /> GitHub
                  </a>
                )}
                {engineer.linkedinUrl && (
                  <a href={engineer.linkedinUrl} target="_blank" rel="noreferrer" className="p-4 bg-[#0077b5] text-white rounded-2xl hover:scale-110 transition-transform flex items-center gap-2 font-bold">
                    <Globe size={20} /> LinkedIn
                  </a>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-16">
              {/* Left Side: Bio & Skills */}
              <div className="lg:col-span-2 space-y-12">
                <section>
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600 mb-4 flex items-center gap-2">
                    <User size={16} /> Professional Bio
                  </h3>
                  <p className="text-xl text-slate-600 leading-relaxed font-medium">
                    {engineer.bio || "Bhai ne abhi tak kuch likha nahi hai apne baare mein."}
                  </p>
                </section>

                <section>
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600 mb-6 flex items-center gap-2">
                    <Code size={16} /> Tech Stack & Mastery
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {engineer.skills?.length > 0 ? (
                      engineer.skills.map((skill, i) => (
                        <div key={i} className="group relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                          <span className="relative bg-white border-2 border-slate-100 text-slate-700 px-6 py-3 rounded-2xl font-black text-sm block shadow-sm truncate max-w-[250px] inline-block">
                            {skill}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 italic">No skills listed.</p>
                    )}
                  </div>
                </section>
              </div>

              {/* Right Side: Action Card */}
              <div className="space-y-6">
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                  <h4 className="font-black text-slate-900 text-lg mb-6">Verification Status</h4>
                  <div className="space-y-4">
                    <StatusItem label="Identity Verified" status={true} />
                    <StatusItem label="Email Confirmed" status={true} />
                    <StatusItem label="Skills Validated" status={engineer.skills?.length > 0} />
                  </div>
                  
                  <button 
                    onClick={handleRequestInterview}
                    disabled={requestSending}
                    className={`w-full mt-10 text-white py-5 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 ${
                        requestSending 
                        ? 'bg-slate-400 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
                    }`}
                    >
                    {requestSending ? 'Sending Request...' : 'Request for Interview'}
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}