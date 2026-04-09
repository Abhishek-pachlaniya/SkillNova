import { useState } from 'react';
import axios from 'axios';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage(res.data.message);
      setEmail(''); // Send hone ke baad field clear kar do
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100 animate-in fade-in zoom-in-95 duration-300">
        
        <button 
          onClick={() => navigate('/login')} 
          className="flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1.5" /> Back to Login
        </button>
        
        <h2 className="text-2xl font-black text-slate-800 mb-2">Forgot Password? 🔒</h2>
        <p className="text-slate-500 text-sm mb-8 font-medium">
          No worries! Enter your registered email address and we'll send you instructions to reset your password.
        </p>

        {message && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-xl text-sm font-semibold mb-6 flex items-start">
            <span className="mr-2">✅</span> {message}
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-semibold mb-6 flex items-start">
            <span className="mr-2">❌</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading || !email.trim()}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-200 transition-all flex justify-center items-center disabled:opacity-50 disabled:hover:shadow-none disabled:cursor-not-allowed transform active:scale-[0.98]"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
}