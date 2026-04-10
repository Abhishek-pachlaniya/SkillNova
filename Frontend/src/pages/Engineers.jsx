import { useEffect, useState } from 'react';
import API from '../api/axios';
import { 
  Search, Sparkles, MapPin, Briefcase, 
  UserPlus, Loader2, MessageSquare, Cpu, 
  ArrowUpRight, Globe 
} from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function Engineers() {
  const [prompt, setPrompt] = useState('');
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  // === LOGIC PRESERVED: Chat Start ===
  const handleMessageClick = async (engineerId) => {
    try {
      const res = await API.post('/conversations', { receiverId: engineerId });
      navigate('/chat', { state: { newChat: res.data } });
    } catch (error) {
      toast.error("Chat start nahi ho payi!");
    }
  };

  // === LOGIC PRESERVED: Fetch Initial Data ===
  const fetchAllEngineers = async () => {
    try {
      const res = await API.get('/users/public/engineers');
      setEngineers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllEngineers();
  }, []);

  // === LOGIC PRESERVED: AI Search Execution ===
  const handleAISearch = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await API.post('/ai/search', { prompt });
      setEngineers(res.data);
    } catch (err) {
      toast.error("AI Search fail ho gaya!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-10 pb-20"
    >
      <Toaster position="top-center" />
      
      {/* 🧠 AI Search Header: Sleek Dark Glassmorphism */}
      <div className="bg-slate-950/40 backdrop-blur-xl rounded-[3rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none opacity-50"></div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px] mb-6">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            Neural RAG Engine Active
          </div>
          
          <h1 className="text-4xl md:text-6xl font-[1000] tracking-tighter mb-8 leading-[0.9]">
            Hire the best <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">Engineers</span> with AI
          </h1>

          <form onSubmit={handleAISearch} className="relative group flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="e.g. 'I need a MERN dev for a fintech project...'" 
                className="w-full bg-black/40 border-2 border-white/5 text-white pl-16 pr-8 py-5 rounded-[1.5rem] outline-none focus:border-indigo-500/30 focus:bg-black/60 transition-all font-medium"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-[1.5rem] font-black transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-3 uppercase text-[11px] tracking-widest whitespace-nowrap"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><Sparkles size={18}/> Search AI</>}
            </button>
          </form>
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <Cpu className="text-indigo-500" size={18} />
          <h3 className="text-lg font-black text-white tracking-widest uppercase">
            {hasSearched ? `AI Intelligence Results (${engineers.length})` : 'Expert Directory'}
          </h3>
        </div>
      </div>

      {/* 👷 Engineer Grid: Ultra-Thin Sleek Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        <AnimatePresence>
          {loading ? (
             <div className="col-span-full py-32 text-center flex flex-col items-center gap-4">
               <div className="w-10 h-10 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Interrogating user vectors...</p>
             </div>
          ) : engineers.length > 0 ? (
            engineers.map((eng, idx) => (
              <motion.div 
                key={eng._id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-slate-950/40 backdrop-blur-md p-7 rounded-[2.5rem] border border-white/5 shadow-2xl hover:border-indigo-500/30 transition-all duration-500 flex flex-col h-full relative overflow-hidden"
              >
                {/* Score Badge */}
                {eng.score && (
                  <div className="absolute top-6 right-6">
                    <span className="bg-emerald-500/10 text-emerald-400 font-black text-[9px] px-3 py-1.5 rounded-full border border-emerald-500/20 uppercase tracking-widest flex items-center gap-1 shadow-lg">
                      <Sparkles size={10} className="animate-pulse" /> {Math.round(eng.score * 100)}% Match
                    </span>
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="relative">
                      <img 
                        src={eng.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${eng.name}`} 
                        className="w-16 h-16 rounded-2xl object-cover bg-slate-900 border border-white/10 group-hover:scale-105 transition-transform"
                        alt={eng.name}
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-slate-950 rounded-full" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white tracking-tight leading-none mb-1">{eng.name}</h4>
                      <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest line-clamp-1">{eng.bio || "Full Stack Systems Engineer"}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {(eng.skills || []).slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="bg-white/5 text-slate-400 border border-white/5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest group-hover:text-white transition-colors">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">
                    <span className="flex items-center gap-1.5"><MapPin size={12} className="text-indigo-500"/> {eng.location || 'Remote'}</span>
                    <span className="flex items-center gap-1.5"><Globe size={12} className="text-indigo-500"/> {eng.experience || '0'} YRS XP</span>
                  </div>
                </div>

                {/* Actions: Replaced UserPlus with ArrowUpRight for 'Profile' feel */}
                <div className="flex gap-3 mt-auto pt-6 border-t border-white/5">
                  <button 
                    onClick={() => navigate(`/engineer-profile/${eng._id}`)}
                    className="flex-1 py-3 bg-white/5 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-white hover:text-black transition-all border border-white/5 flex items-center justify-center gap-2"
                  >
                    Profile <ArrowUpRight size={14} />
                  </button>
                  <button 
                    onClick={() => handleMessageClick(eng._id)}
                    className="flex-1 py-3 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={14} /> Message
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center bg-slate-950/50 rounded-[3.5rem] border-2 border-dashed border-white/5 backdrop-blur-md">
              <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-700">
                <Search size={32} />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-[0.2em]">Inventory Exhausted</h3>
              <p className="text-slate-500 text-xs mt-2 font-medium">No engineers found matching your current neural briefing.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}