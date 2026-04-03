import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';
import API from '../api/axios'; // 👈 Custom axios instance import kiya

const ProjectForm = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', budget: '', tags: '', deadline: ''
  });

  useEffect(() => {
    if (id) {
      const fetchProject = async () => {
        try {
          // 👈 Ab seedha API.get use karo
          const res = await API.get(`/projects/${id}`);
          const data = res.data;
          setFormData({
            title: data.title,
            description: data.description,
            budget: data.budget,
            tags: data.tags.join(', '),
            deadline: data.deadline ? data.deadline.split('T')[0] : ''
          });
        } catch (err) {
          console.error("Error fetching project", err);
        }
      };
      fetchProject();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...formData, tags: formData.tags.split(',').map(t => t.trim()) };

      // 👈 Localhost hata kar apna API instance lagaya
      if (id) {
        await API.put(`/projects/${id}`, data);
      } else {
        await API.post('/projects', data);
      }
      navigate('/dashboard'); // Post hone ke baad wapas bhej do
    } catch (err) {
      alert("Error saving project lala!");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition">
        <ArrowLeft size={20}/> Back
      </button>

      <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
        <h2 className="text-3xl font-[1000] text-slate-900 mb-8 tracking-tighter">
          {id ? 'Update Project' : 'Launch New Project'} <span className="text-indigo-600">.</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Project Title</label>
              <input type="text" required value={formData.title} 
                className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Detailed Description</label>
              <textarea rows="5" required value={formData.description}
                className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>

            {/* 3 Columns kar diye taaki Budget, Tags aur Deadline teeno aa jayein */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Budget ($)</label>
                <input type="number" required value={formData.budget}
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                  onChange={(e) => setFormData({...formData, budget: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Tags (Skills)</label>
                <input type="text" placeholder="React, Node, AI" value={formData.tags}
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                  onChange={(e) => setFormData({...formData, tags: e.target.value})} />
              </div>
              {/* 👈 YAHAN ADD KIYA HAI DEADLINE INPUT */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Deadline</label>
                <input type="date" value={formData.deadline}
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-600"
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})} />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-indigo-700 transition shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3">
            {loading ? 'Processing...' : id ? 'Update Changes' : 'Post Project'} <Sparkles size={24}/>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;