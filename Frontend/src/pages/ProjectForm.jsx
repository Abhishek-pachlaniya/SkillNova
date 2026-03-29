import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';
import axios from 'axios';

const ProjectForm = () => {
  const { id } = useParams(); // Agar update hai toh id milegi
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', budget: '', tags: '', deadline: ''
  });

  useEffect(() => {
    if (id) {
      // Edit mode: Purana data fetch karo
      const fetchProject = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = res.data;
        setFormData({
          title: data.title,
          description: data.description,
          budget: data.budget,
          tags: data.tags.join(', '),
          deadline: data.deadline ? data.deadline.split('T')[0] : ''
        });
      };
      fetchProject();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const data = { ...formData, tags: formData.tags.split(',').map(t => t.trim()) };

      if (id) {
        await axios.put(`http://localhost:5000/api/projects/${id}`, data, config);
      } else {
        await axios.post('http://localhost:5000/api/projects', data, config);
      }
      navigate('/dashboard');
    } catch (err) {
      alert("Error saving project");
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

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Budget ($)</label>
                <input type="number" required value={formData.budget}
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                  onChange={(e) => setFormData({...formData, budget: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Tags (Skills)</label>
                <input type="text" value={formData.tags}
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                  onChange={(e) => setFormData({...formData, tags: e.target.value})} />
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