import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios'; // 1. Axios instance use karo
import { User, Mail, Lock, Loader2, Sparkles } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'engineer' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 2. Base URL apne aap API instance se lag jayega
      const res = await API.post('/auth/signup', formData);
      
      // 3. CRITICAL: Token aur User data dono save karo
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user)); 
      
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed! Email check karo bhai.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-10 border border-slate-100 animate-in fade-in zoom-in duration-500">
        
        <div className="text-center mb-8">
          <div className="bg-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-200">
            <Sparkles className="text-white" size={28} />
          </div>
          <h2 className="text-3xl font-[1000] text-slate-900 tracking-tight leading-none">Create Account</h2>
          <p className="text-slate-500 mt-3 font-medium">Join the AI-powered hiring revolution</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection Tabs */}
          <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl mb-6">
            <button 
              type="button" 
              onClick={() => setFormData({...formData, role: 'engineer'})}
              className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${formData.role === 'engineer' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              👨‍💻 Engineer
            </button>
            <button 
              type="button" 
              onClick={() => setFormData({...formData, role: 'client'})}
              className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${formData.role === 'client' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              🏢 Client
            </button>
          </div>

          <div className="relative group">
            <User className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
            <input 
              type="text" placeholder="Full Name" required 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-indigo-100 focus:bg-white outline-none transition-all font-bold text-slate-700 placeholder:font-medium" 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
          </div>

          <div className="relative group">
            <Mail className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
            <input 
              type="email" placeholder="Email Address" required 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-indigo-100 focus:bg-white outline-none transition-all font-bold text-slate-700 placeholder:font-medium" 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
            <input 
              type="password" placeholder="Create Password" required 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-indigo-100 focus:bg-white outline-none transition-all font-bold text-slate-700 placeholder:font-medium" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 mt-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Get Started Now 🚀'}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 font-bold text-sm">
          Already a member? <Link to="/login" className="text-indigo-600 hover:text-indigo-800 transition-colors underline decoration-2 underline-offset-4">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;