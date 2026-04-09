import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function VerifyEmail() {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const { token } = useParams();
  const navigate = useNavigate();
  
  // 🚨 NAYA: Ye guard banayega taaki API 2 baar call na ho
  const hasVerified = useRef(false); 

  useEffect(() => {
    // Agar API pehle call ho chuki hai, toh yahin se wapas mud jao
    if (hasVerified.current) return; 
    hasVerified.current = true;

    const verifyUserEmail = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/verify-email/${token}`);
        setStatus('success');
        setMessage(res.data.message);
        
        // 3 second baad khud login pe bhej do
        setTimeout(() => navigate('/login'), 3000);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || "Verification failed.");
      }
    };

    verifyUserEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100 text-center animate-in zoom-in duration-300">
        
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 size={48} className="text-indigo-500 animate-spin mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">Verifying...</h2>
            <p className="text-slate-500 text-sm">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircle size={56} className="text-emerald-500 mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Email Verified!</h2>
            <p className="text-slate-500 text-sm mb-6">{message}</p>
            <p className="text-xs text-slate-400">Redirecting to login...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <XCircle size={56} className="text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Verification Failed</h2>
            <p className="text-slate-500 text-sm mb-6">{message}</p>
            <Link to="/login" className="bg-[#0f172a] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-slate-800 transition-colors">
              Go to Login
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}