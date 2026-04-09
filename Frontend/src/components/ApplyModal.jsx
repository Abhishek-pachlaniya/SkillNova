import { useState } from 'react';
import { X, Send, DollarSign, MessageSquare } from 'lucide-react';
import API from '../api/axios';

export default function ApplyModal({ project, isOpen, onClose, onApplySuccess }) {
  const [proposalText, setProposalText] = useState(''); // Model name sync
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleApply = async (e) => {
    e.preventDefault();
    if (!proposalText || !bidAmount) return alert("Bhai, details toh bhar de!");

    setLoading(true);
    try {
      // 🟢 API Endpoint: Ensure ye tere backend route se match kare
      // Payload mein 'proposalText' aur 'bidAmount' bhej rahe hain
      await API.post(`/projects/${project._id}/apply`, {
        proposalText,
        bidAmount: Number(bidAmount)
      });

      alert("Application Sent! Database update ho gaya 🚀");
      
      // 🔵 Parent (Projects.jsx) ko notify karo taki UI turant 'Applied' ho jaye
      if (onApplySuccess) onApplySuccess(project._id);
      
      // Cleanup
      setProposalText('');
      setBidAmount('');
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Apply karne mein lafda ho gaya!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative animate-in zoom-in duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 p-2 rounded-full"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-[1000] text-slate-900 leading-tight">
            Apply for <span className="text-indigo-600">{project.title}</span>
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            Explain why you're the perfect engineer for this.
          </p>
        </div>

        <form onSubmit={handleApply} className="space-y-6">
          {/* Proposal Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
              <MessageSquare size={14} /> Your Proposal
            </label>
            <textarea 
              required
              value={proposalText}
              placeholder="I can build this using MERN stack and integrate the AI features you need..."
              className="w-full p-5 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] focus:border-indigo-100 focus:bg-white transition-all outline-none h-44 font-medium text-slate-700 resize-none"
              onChange={(e) => setProposalText(e.target.value)}
            />
          </div>

          {/* Bid Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
              <DollarSign size={14} /> Your Bid ($)
            </label>
            <input 
              type="number"
              required
              value={bidAmount}
              placeholder="e.g. 500"
              className="w-full p-5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-100 focus:bg-white transition-all outline-none font-bold text-slate-900"
              onChange={(e) => setBidAmount(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-[1.5rem] font-black flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 ${
              loading 
                ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100"
            }`}
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                Send Application <Send size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}