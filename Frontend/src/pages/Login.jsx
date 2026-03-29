import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios'; // 1. Localhost ki jagah apna axios instance use karo
import { Mail, Lock, Loader2 } from 'lucide-react'; // Ek loader icon bhi add kar diya

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // 2. Loading state for UX
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 3. Simple URL (Base URL .env se aayega)
      const res = await API.post('/auth/login', { email, password });
      
      // 4. Sabse important: Token aur User dono save karo
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user)); 
      
      navigate('/dashboard');
    } catch (err) {
      // Backend se jo error message aaye wahi dikhao
      alert(err.response?.data?.message || "Bhai, credentials check kar le!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl p-8 md:p-10 border border-slate-100 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <div className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-100">
            <span className="text-white text-2xl">🚀</span>
          </div>
          <h2 className="text-3xl font-[1000] text-slate-900 tracking-tight">Welcome Back 👋</h2>
          <p className="text-slate-500 mt-2 font-medium">Login to manage your projects</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative group">
            <Mail className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
            <input 
              type="email" 
              placeholder="Email Address" 
              required 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-indigo-100 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-slate-700" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              required 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-indigo-100 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-slate-700" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Login to Dashboard'}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 font-bold text-sm">
          Don't have an account? <Link to="/signup" className="text-indigo-600 hover:text-indigo-800 transition-colors underline decoration-2 underline-offset-4">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;