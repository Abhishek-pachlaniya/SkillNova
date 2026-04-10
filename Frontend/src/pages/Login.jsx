import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { LogIn, ShieldCheck, Zap, Globe, Sparkles } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast'; 
import { motion } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'engineer' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/login', formData);
      const { user, token } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Invalid email or password.';
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
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[1100px] grid lg:grid-cols-2 bg-slate-950 rounded-[2rem] overflow-hidden shadow-[0_0_80px_rgba(79,70,229,0.15)] border border-white/5 relative z-10"
      >
        <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-900/50 relative overflow-hidden border-r border-white/5">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-10">
              <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 p-2 rounded-xl">
                <Sparkles className="text-white" size={26} />
              </div>
              <span className="text-2xl font-[1000] tracking-tighter text-white">AI-HIRE<span className='text-indigo-500'>.</span></span>
            </div>
            <h1 className="text-4xl font-[1000] text-white tracking-tighter leading-[1] mb-4">Scale your engineering <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-fuchsia-400 to-cyan-400">team seamlessly.</span></h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md font-medium">Connect with vetted talent. Skip the manual screening with semantic matching.</p>
          </div>
          <div className="relative z-10 flex flex-col gap-6 mt-12 border-t border-white/5 pt-8">
            <div className="flex items-center gap-4 group">
              <div className="bg-slate-800 p-3.5 h-14 w-14 flex items-center justify-center rounded-2xl border border-white/5"><Globe className="text-blue-400" size={20} /></div>
              <div><h3 className="text-white font-black text-base tracking-tight">Global Talent Pool</h3><p className="text-slate-500 text-sm mt-1">Access production-ready professionals worldwide.</p></div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="bg-slate-800 p-3.5 h-14 w-14 flex items-center justify-center rounded-2xl border border-white/5"><ShieldCheck className="text-emerald-400" size={20} /></div>
              <div><h3 className="text-white font-black text-base tracking-tight">AI Skills Audit</h3><p className="text-slate-500 text-sm mt-1">Technical depth validated by vector analysis.</p></div>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-black/30">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 border border-white/10 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-md text-[10px] md:text-xs font-black text-indigo-400 uppercase tracking-widest mb-3">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />Vetted MERN & AI Network
            </div>
            <h2 className="text-4xl font-[1000] text-white tracking-tighter mb-2">Welcome Back</h2>
            <p className="text-slate-500 text-base font-medium">Enter your enterprise details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex p-1 bg-slate-900 rounded-xl gap-1 border border-white/5">
              {['engineer', 'client'].map((r) => (
                <button key={r} type="button" onClick={() => setFormData({...formData, role: r})} className={`flex-1 py-3 rounded-lg text-sm font-black capitalize transition-all ${formData.role === r ? 'bg-slate-800 text-white shadow-lg border border-white/10' : 'text-slate-500 hover:text-white'}`}>{r}</button>
              ))}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-1 tracking-tight">Work Email</label>
                <div className="relative group">
                  {/* 🚨 Logo Removed, Padding Updated to px-4 */}
                  <input 
                    type="email" 
                    placeholder="name@company.com"
                    className="w-full bg-black/40 border border-white/5 px-4 py-3 rounded-xl text-white text-base outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-600 font-medium"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-bold text-slate-300 tracking-tight">Password</label>
                    <Link to="/forgot-password" className="text-indigo-500 text-sm font-bold hover:text-indigo-400">Forgot?</Link>
                </div>
                <div className="relative group">
                  {/* 🚨 Logo Removed, Padding Updated to px-4 */}
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-white/5 px-4 py-3 rounded-xl text-white text-base outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-600 font-medium"
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 cursor-pointer pb-2">
                <input type="checkbox" className="rounded border-white/10 text-indigo-600 focus:ring-indigo-500 w-5 h-5 bg-black/30" />
                <span className="text-sm font-bold text-slate-400">Remember this device</span>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-70 group">
              {loading ? <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div> : <>Sign In Securely <LogIn size={20} className="group-hover:translate-x-1 transition-transform" /></>}
            </button>
            <p className="text-center text-slate-500 text-base font-medium mt-8">New here? <Link to="/Signup" className="font-bold text-indigo-500 hover:text-indigo-400">Start Hiring Now</Link></p>
          </form>
        </div>
      </motion.div>
    </div> 
  );
};

export default Login;