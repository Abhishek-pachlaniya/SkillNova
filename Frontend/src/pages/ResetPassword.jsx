import { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, KeyRound } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { token } = useParams(); // URL se token nikalne ke liye
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Backend ko PUT request bhej rahe hain token ke sath
      const res = await axios.put(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
      
      setMessage(res.data.message);
      
      // 3 second baad user ko automatic login screen pe bhej do
      setTimeout(() => navigate('/login'), 3000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired token. Please request a new link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100 animate-in fade-in zoom-in-95 duration-300">
        
        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
          <KeyRound size={24} />
        </div>
        
        <h2 className="text-2xl font-black text-slate-800 mb-2">Set New Password</h2>
        <p className="text-slate-500 text-sm mb-8 font-medium">
          Your new password must be different from previously used passwords.
        </p>

        {message && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-xl text-sm font-semibold mb-6 flex items-start">
            <span className="mr-2">✅</span> 
            <div>
              <p>{message}</p>
              <p className="text-emerald-600 text-xs mt-1">Redirecting to login...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-semibold mb-6 flex items-start">
            <span className="mr-2">❌</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">New Password</label>
            <input 
              type="password" 
              required
              minLength="6"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-xs text-slate-400 mt-2 font-medium">Must be at least 6 characters long.</p>
          </div>
          
          <button 
            type="submit" 
            disabled={loading || password.length < 6}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-200 transition-all flex justify-center items-center disabled:opacity-50 disabled:hover:shadow-none disabled:cursor-not-allowed transform active:scale-[0.98]"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}