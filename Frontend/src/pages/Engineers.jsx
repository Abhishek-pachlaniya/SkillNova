import { useState, useEffect } from 'react';
import API from '../api/axios';
import { Search, Sparkles, MapPin, Briefcase, UserPlus, Loader2, MessageSquare } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function Engineers() {
  const [prompt, setPrompt] = useState('');
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // ==========================================
  // 🚨 FIXED: handleMessageClick (State pass karne ka tareeka)
  // ==========================================
  // ==========================================
  // 🚨 FIXED: handleMessageClick (Using your custom API instance)
  // ==========================================
  const handleMessageClick = async (engineerId) => {
    try {
      console.log("🟢 Button Clicked! Engineer ID:", engineerId);
      
      // 1. Apne custom API instance ka use karo (Hardcoded URL aur Token ka lafda khatam)
      const res = await API.post('/conversations', {
        receiverId: engineerId
      });

      console.log("🟢 Room Data Received:", res.data);
      const conversationData = res.data;

      // 2. Redirect to Chat page
      navigate('/chat', { state: { newChat: conversationData } });

    } catch (error) {
      console.error("❌ Chat shuru karne mein gadbad:", error);
      alert("Chat start nahi ho payi! Apne keyboard pe F12 daba aur Console check kar ki kya error aayi hai.");
    }
  };

  // Normal fetch (sab engineers dikhane ke liye bina search ke)
  const fetchAllEngineers = async () => {
    try {
      const res = await API.get('/users/public/engineers').catch(() => ({ data: [] })); 
      setEngineers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllEngineers();
  }, []);

  // 🔥 MAIN MAGIC: AI Search Function
  const handleAISearch = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await API.post('/ai/search', { prompt });
      setEngineers(res.data);
    } catch (err) {
      console.error(err);
      alert("AI Search fail ho gaya lala! Check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 🧠 AI Search Header */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden border border-indigo-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20"></div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-indigo-300 font-black uppercase tracking-widest text-xs mb-4">
            <Sparkles size={16} /> RAG Vector Engine Active
          </div>
          <h1 className="text-3xl md:text-5xl font-[1000] tracking-tight mb-4">
            Find the perfect engineer with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">AI</span>
          </h1>
          <p className="text-slate-400 font-medium mb-8">
            Stop searching by basic tags. Just type what you need in natural language, and our AI will find the best matches using semantic vector search.
          </p>

          <form onSubmit={handleAISearch} className="relative group flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="e.g. 'I need a MERN stack dev with 2 years experience in React'" 
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-slate-400 pl-14 pr-6 py-4 rounded-2xl outline-none focus:bg-white/20 focus:border-indigo-400 transition-all font-medium"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black transition-all active:scale-95 flex items-center justify-center min-w-[140px] shadow-lg shadow-indigo-500/30"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : 'Search AI 🚀'}
            </button>
          </form>
        </div>
      </div>

      {/* 📋 Results Section */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-800">
          {hasSearched ? `AI Top Matches (${engineers.length})` : 'Explore Engineers'}
        </h3>
        {hasSearched && (
          <button onClick={() => { setPrompt(''); fetchAllEngineers(); setHasSearched(false); }} className="text-sm font-bold text-indigo-600 hover:underline">
            Clear Search
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           <div className="col-span-full py-20 text-center text-slate-400 font-bold flex flex-col items-center gap-3">
             <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
             AI is reading profiles...
           </div>
        ) : engineers.length > 0 ? (
          engineers.map((eng) => (
            <div key={eng._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <img 
                  src={eng.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${eng.name}`} 
                  alt={eng.name}
                  className="w-16 h-16 rounded-2xl object-cover bg-slate-50 border border-slate-100"
                />
                {eng.score && (
                  <span className="bg-green-100 text-green-700 font-black text-[10px] px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1">
                    <Sparkles size={12}/> {Math.round(eng.score * 100)}% Match
                  </span>
                )}
              </div>

              <h4 className="text-xl font-black text-slate-900">{eng.name}</h4>
              <p className="text-sm font-bold text-indigo-600 mb-3 line-clamp-1">{eng.bio || "Full Stack Developer"}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {eng.skills?.slice(0, 3).map((skill, idx) => (
                  <span key={idx} className="bg-slate-50 text-slate-500 border border-slate-100 px-2 py-1 rounded-lg text-[10px] font-black uppercase truncate max-w-[150px] inline-block">
                    {skill}
                  </span>
                ))}
                {eng.skills?.length > 3 && <span className="text-[10px] font-bold text-slate-400">+{eng.skills.length - 3}</span>}
              </div>

              <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-6">
                <span className="flex items-center gap-1"><MapPin size={14}/> {eng.location || 'Remote'}</span>
                <span className="flex items-center gap-1"><Briefcase size={14}/> {eng.experience || '0'} Yrs</span>
              </div>

              {/* 🚨 NAYA: 2 Buttons ka mast Layout */}
              <div className="flex gap-3 mt-auto">
                <button 
                  onClick={() => navigate(`/engineer-profile/${eng._id}`)}
                  className="flex-1 py-2.5 bg-slate-50 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 border border-slate-200"
                >
                  <UserPlus size={16} /> Profile
                </button>
                <button 
                  onClick={() => handleMessageClick(eng._id)}
                  className="flex-1 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 flex items-center justify-center gap-2 group-hover:scale-105"
                >
                  <MessageSquare size={16} /> Message
                </button>
              </div>

            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <h3 className="text-lg font-bold text-slate-400">No engineers found matching your prompt. 😅</h3>
          </div>
        )}
      </div>
    </div>
  );
}