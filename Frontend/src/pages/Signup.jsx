import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios'; 
import { Loader2, Sparkles, BrainCircuit, Rocket } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast'; 
import { motion } from 'framer-motion';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'engineer' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/signup', formData);
      toast.success(res.data.message || "Signup Successful! Check your email to verify.", { duration: 8000 });
      navigate('/login');
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Signup failed! Try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 flex items-center justify-center p-4 sm:p-8 font-sans relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[100px] opacity-40"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-fuchsia-600/10 rounded-full blur-[100px] opacity-30"></div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[1100px] grid lg:grid-cols-2 bg-slate-950 rounded-[2rem] overflow-hidden shadow-[0_0_80px_rgba(79,70,229,0.15)] border border-white/5 relative z-10">
        <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-900/50 relative overflow-hidden border-r border-white/5">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-10">
              <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 p-2 rounded-xl"><Rocket className="text-white" size={26} /></div>
              <span className="text-2xl font-[1000] tracking-tighter text-white">AI-HIRE<span className='text-indigo-500'>.</span></span>
            </div>
            <h1 className="text-4xl font-[1000] text-white tracking-tighter leading-[1] mb-4">Start your technical <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-fuchsia-400 to-cyan-400">hiring revolution.</span></h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md font-medium">Access MERN & AI engineers globally. Our RAG engine reduces vetting time to seconds.</p>
          </div>
          <div className="relative z-10 flex flex-col gap-8 mt-12 border-t border-white/5 pt-8">
            <div className="flex gap-4 group">
              <div className="shrink-0 bg-slate-800 p-3.5 h-14 w-14 flex items-center justify-center rounded-2xl border border-white/5"><BrainCircuit className="text-indigo-400" size={30} /></div>
              <div><h3 className="text-white font-black text-lg tracking-tight">Vetted Technical Depth</h3><p className="text-slate-500 text-base mt-1">AI cross-checks GitHub activity for genuine mastery.</p></div>
            </div>
          </div>
        </div>

        <div className="p-10 sm:p-16 lg:p-20 flex flex-col justify-center bg-black/30">
          <div className="mb-8">
             <div className="inline-flex items-center gap-2 border border-white/10 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-md text-[10px] md:text-xs font-black text-indigo-400 uppercase tracking-widest mb-3"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />Next-Gen Matching Engine</div>
            <h2 className="text-4xl font-[1000] text-white tracking-tighter mb-2">Create Account</h2>
            <p className="text-slate-500 text-base font-medium">Please enter your enterprise details to get started.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2 p-1 bg-slate-900 rounded-xl mb-4 border border-white/5">
              <button type="button" onClick={() => setFormData({...formData, role: 'engineer'})} className={`flex-1 py-3 rounded-lg text-sm font-black transition-all ${formData.role === 'engineer' ? 'bg-slate-800 text-white shadow-lg border border-white/10' : 'text-slate-500 hover:text-white'}`}>👨‍💻 Engineer</button>
              <button type="button" onClick={() => setFormData({...formData, role: 'client'})} className={`flex-1 py-3 rounded-lg text-sm font-black transition-all ${formData.role === 'client' ? 'bg-slate-800 text-white shadow-lg border border-white/10' : 'text-slate-500 hover:text-white'}`}>🏢 Client</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-1 tracking-tight">Full Name</label>
                <div className="relative group">
                  {/* 🚨 Logo Removed, Padding Updated to px-4 */}
                  <input type="text" placeholder="Enter your name" required className="w-full bg-black/40 border border-white/5 px-4 py-3 rounded-xl text-white text-base outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-600 font-medium" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-1 tracking-tight">Work Email</label>
                <div className="relative group">
                  {/* 🚨 Logo Removed, Padding Updated to px-4 */}
                  <input type="email" placeholder="name@company.com" required className="w-full bg-black/40 border border-white/5 px-4 py-3 rounded-xl text-white text-base outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-600 font-medium" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-1 tracking-tight">Password</label>
                <div className="relative group">
                  {/* 🚨 Logo Removed, Padding Updated to px-4 */}
                  <input type="password" placeholder="Create a strong password" required className="w-full bg-black/40 border border-white/5 px-4 py-3 rounded-xl text-white text-base outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-600 font-medium" onChange={(e) => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-70 group">
              {loading ? <Loader2 className="animate-spin" /> : <>Join the hiring revolution 🚀</>}
            </button>
            <p className="text-center text-slate-500 text-base font-medium mt-8">Member? <Link to="/login" className="font-bold text-indigo-500 hover:text-indigo-400">Login here Securely</Link></p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;