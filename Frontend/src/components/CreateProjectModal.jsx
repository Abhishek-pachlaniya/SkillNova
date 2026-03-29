import { useState } from 'react';
import { X, Layout, AlignLeft, DollarSign, Tag, Calendar, Send } from 'lucide-react';
import axios from 'axios';

const CreateProjectModal = ({ isOpen, onClose, refreshProjects }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    tags: '',
    deadline: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Tags ko array mein convert kar rahe hain
      const projectData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim())
      };

      await axios.post('http://localhost:5000/api/projects', projectData, config);
      onClose(); // Modal band karo
      refreshProjects(); // List update karo
      setFormData({ title: '', description: '', budget: '', tags: '', deadline: '' }); // Reset
    } catch (err) {
      alert(err.response?.data?.message || "Post failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
             <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><Layout size={20}/></div>
             Post New Project
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Project Title</label>
            <div className="relative">
              <input 
                type="text" required placeholder="e.g. Build an AI-Powered Chatbot"
                className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
            <textarea 
              rows="3" required placeholder="Describe your requirements..."
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Budget ($)</label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-4 text-slate-400"/>
                <input 
                  type="number" required placeholder="500"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Deadline</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-4 text-slate-400"/>
                <input 
                  type="date"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Tags (Comma separated)</label>
            <div className="relative">
              <Tag size={16} className="absolute left-3 top-4 text-slate-400"/>
              <input 
                type="text" placeholder="React, Node, AI, Python"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2">
            Launch Project <Send size={20}/>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;