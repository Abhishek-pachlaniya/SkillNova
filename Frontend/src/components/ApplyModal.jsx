import { useState } from 'react';
import { X, Send } from 'lucide-react';
import API from '../api/axios';

export default function ApplyModal({ project,  isOpen, onClose }) {
  const [proposal, setProposal] = useState('');
  const [bid, setBid] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleApply = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/applications/apply', {
        projectId: project._id,
        proposal,
        bidAmount: bid
      });
      alert("Application Sent! Best of luck 🚀");
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Kuch galat ho gaya!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative animate-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-black text-slate-900 mb-2">Apply for {project.title}</h2>
        <p className="text-slate-500 mb-6 font-medium">Write a killer proposal to get hired!</p>

        <form onSubmit={handleApply} className="space-y-4">
          <textarea 
            required
            placeholder="Why are you the best fit for this project?"
            className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-indigo-100 outline-none h-40 font-medium"
            onChange={(e) => setProposal(e.target.value)}
          />
          <input 
            type="number"
            placeholder="Your Bid Amount ($)"
            className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-indigo-100 outline-none font-bold"
            onChange={(e) => setBid(e.target.value)}
          />
          <button 
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
          >
            {loading ? "Sending..." : <>Send Proposal <Send size={18} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}