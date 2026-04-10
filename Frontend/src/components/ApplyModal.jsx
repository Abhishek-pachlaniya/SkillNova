import { useState } from 'react';
import { X, Send, DollarSign, MessageSquare, Zap } from 'lucide-react';
import API from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function ApplyModal({ project, isOpen, onClose, onApplySuccess }) {
  // === LOGIC & STATES: PRESERVED ===
  const [proposalText, setProposalText] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleApply = async (e) => {
    e.preventDefault();
    if (!proposalText || !bidAmount) return alert("Bhai, details toh bhar de!");

    setLoading(true);
    try {
      await API.post(`/projects/${project._id}/apply`, {
        proposalText,
        bidAmount: Number(bidAmount)
      });
      alert("Application Sent! 🚀");
      if (onApplySuccess) onApplySuccess(project._id);
      setProposalText('');
      setBidAmount('');
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Lafda ho gaya!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* 🌫️ Responsive Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* 🚀 Compact Modal Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-[#0f172a] w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl relative border border-white/10 z-10 overflow-hidden"
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-500 hover:text-white bg-white/5 p-1.5 rounded-full transition-all border border-white/5"
        >
          <X size={16} />
        </button>

        {/* Header Section (Tightened) */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 border border-indigo-500/20 px-2.5 py-1 rounded-full bg-indigo-500/5 text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-3">
             <Zap size={10} /> Secure Submission
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight leading-tight">
            Apply for <span className="text-indigo-500">{project.title.slice(0, 20)}...</span>
          </h2>
        </div>

        <form onSubmit={handleApply} className="space-y-5">
          {/* Proposal Input */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">
              <MessageSquare size={12} className="text-indigo-400" /> Pitch
            </label>
            <textarea 
              required
              value={proposalText}
              placeholder="Why are you the best fit?..."
              className="w-full p-4 bg-black/40 border border-white/5 rounded-xl focus:border-indigo-500/50 transition-all outline-none h-32 font-medium text-slate-300 text-xs resize-none"
              onChange={(e) => setProposalText(e.target.value)}
            />
          </div>

          {/* Bid Input */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">
              <DollarSign size={12} className="text-indigo-400" /> Bid Amount
            </label>
            <div className="relative group">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
              <input 
                type="number"
                required
                value={bidAmount}
                placeholder="0.00"
                className="w-full p-3.5 pl-10 bg-black/40 border border-white/5 rounded-xl focus:border-indigo-500/50 transition-all outline-none font-black text-lg text-white tracking-tighter"
                onChange={(e) => setBidAmount(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button (Compact) */}
          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-xl font-black flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 uppercase tracking-widest text-[10px] ${
              loading 
                ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5" 
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20"
            }`}
          >
            {loading ? "Processing..." : <>Deploy Proposal <Send size={14} /></>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}