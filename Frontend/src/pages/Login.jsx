import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Welcome Back 👋</h2>
          <p className="text-slate-500 mt-2">Login to manage your projects</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
            <input type="email" placeholder="Email Address" required className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition" 
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
            <input type="password" placeholder="Password" required className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition" 
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">Login</button>
        </form>

        <p className="text-center mt-6 text-slate-600 text-sm">Don't have an account? <Link to="/signup" className="text-indigo-600 font-bold hover:underline">Sign Up</Link></p>
      </div>
    </div>
  );
};

export default Login;