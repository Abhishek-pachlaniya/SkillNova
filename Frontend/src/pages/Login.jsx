import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { Mail, Lock, LogIn, ShieldCheck, Zap, Globe } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'engineer' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await API.post('/auth/login', formData);
      const { user, token } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dashboard');
    } catch (err) {
      // Updated error message to be more professional
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8 font-sans">
      
      <div className="w-full max-w-[1000px] grid lg:grid-cols-2 bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-100">
        
        {/* === 🚀 LEFT SIDE: Enterprise Branding === */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-900 relative overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Zap className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">AI-HIRE</span>
            </div>
            <h1 className="text-4xl font-semibold text-white leading-tight mb-4">
              Scale your engineering <br />team seamlessly.
            </h1>
            <p className="text-slate-400 text-base leading-relaxed max-w-sm">
              Connect with world-class talent and streamline your hiring process through our intelligent platform.
            </p>
          </div>

          <div className="relative z-10 flex flex-col gap-6 mt-12">
            <div className="flex items-center gap-4">
              <div className="bg-slate-800 p-3 rounded-full">
                <Globe className="text-blue-400" size={20} />
              </div>
              <div>
                <h3 className="text-white font-medium text-sm">Global Talent Pool</h3>
                <p className="text-slate-400 text-xs mt-1">Access verified professionals worldwide.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-slate-800 p-3 rounded-full">
                <ShieldCheck className="text-blue-400" size={20} />
              </div>
              <div>
                <h3 className="text-white font-medium text-sm">Enterprise Security</h3>
                <p className="text-slate-400 text-xs mt-1">Bank-grade encryption for your data.</p>
              </div>
            </div>
          </div>
        </div>

        {/* === 🖊️ RIGHT SIDE: Clean Form Section === */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white">
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight mb-2">Welcome back</h2>
            <p className="text-slate-500 text-sm">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-medium flex items-center">
                {error}
              </div>
            )}

            {/* Role Switcher (Standard SaaS Pills) */}
            <div className="flex p-1 bg-slate-100 rounded-lg gap-1">
              {['engineer', 'client'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setFormData({...formData, role: r})}
                  className={`flex-1 py-2.5 rounded-md text-sm font-medium capitalize transition-all ${
                    formData.role === r 
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email" 
                    placeholder="name@company.com"
                    className="w-full bg-white border border-slate-300 px-4 py-2.5 pl-10 rounded-lg text-slate-900 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full bg-white border border-slate-300 px-4 py-2.5 pl-10 rounded-lg text-slate-900 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4" />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Sign In <LogIn size={16} /></>
              )}
            </button>

            <p className="text-center text-slate-600 text-sm mt-6">
              Don't have an account? <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;