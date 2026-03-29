import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, Briefcase } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'engineer' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Create Account 🚀</h2>
          <p className="text-slate-500 mt-2">Join the AI-powered hiring revolution</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <User className="absolute left-3 top-3 text-slate-400" size={20} />
            <input type="text" placeholder="Full Name" required className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition" 
              onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
            <input type="email" placeholder="Email Address" required className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition" 
              onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
            <input type="password" placeholder="Password" required className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>

          <div className="flex gap-4 p-1 bg-slate-100 rounded-xl">
            <button type="button" onClick={() => setFormData({...formData, role: 'engineer'})}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${formData.role === 'engineer' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>Engineer</button>
            <button type="button" onClick={() => setFormData({...formData, role: 'client'})}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${formData.role === 'client' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>Client</button>
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">Sign Up</button>
        </form>

        <p className="text-center mt-6 text-slate-600 text-sm">Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Login</Link></p>
      </div>
    </div>
  );
};

export default Signup;