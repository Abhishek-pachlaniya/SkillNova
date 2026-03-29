import { Zap, BrainCircuit, ShieldCheck, Search, Users, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingHero = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 relative overflow-hidden font-sans antialiased">
      
      {/* 🌫️ Background Soft Gradients (Light Vibe) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-indigo-100 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-cyan-50 rounded-full blur-[100px] opacity-70"></div>
      </div>

      {/* 🟦 Glassmorphism Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b border-slate-200/60 bg-white/70">
        <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Sparkles className="text-white" size={20} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900">
              AI-HIRE<span className='text-indigo-600'>.</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition hidden md:block">Process</a>
            <button onClick={() => navigate('/login')} className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition">Login</button>
            <button onClick={() => navigate('/signup')} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* 🚀 Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center mt-32 md:mt-44 px-6 max-w-5xl mx-auto">
        
        {/* ✨ AI Badge */}
        <div className="mb-8 inline-flex items-center gap-2 border border-indigo-100 px-4 py-1.5 rounded-full bg-white shadow-sm text-xs md:text-sm font-semibold text-indigo-600 uppercase tracking-wider">
          <BrainCircuit size={16} />
          <span>Next-Gen RAG Matching Engine</span>
        </div>

        {/* 🏔️ Clean Bold Headline */}
        <h2 className="text-5xl md:text-7xl font-[900] mb-8 tracking-tight leading-[1.05] text-slate-900">
          The Intelligent Way to <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">Hire Top Engineers.</span>
        </h2>

        {/* 📝 Professional Description */}
        <p className="max-w-2xl text-slate-600 text-lg md:text-xl mb-12 leading-relaxed">
          Skip the endless manual screening. Our AI analyzes technical depth using 
          <span className="text-indigo-600 font-semibold"> Vector Embeddings </span> 
          to match you with vetted engineers who actually fit your tech stack.
        </p>

        {/* 🔘 CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-24">
          <button className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-extrabold text-lg hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 flex items-center gap-2">
            Post a Project <ArrowRight size={20} />
          </button>
          <button className="bg-white border border-slate-200 text-slate-700 px-10 py-4 rounded-2xl font-extrabold text-lg hover:bg-slate-50 transition shadow-sm">
            Browse Talent
          </button>
        </div>

        {/* 📱 Mini Dashboard Preview (Visual Interest) */}
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 rotate-x-12 transform perspective-1000 hidden md:block">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="h-2 w-32 bg-slate-100 rounded-full"></div>
            </div>
            <div className="grid grid-cols-3 gap-4 h-48">
                <div className="bg-slate-50 rounded-xl border border-dashed border-slate-200"></div>
                <div className="col-span-2 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-center">
                   <div className="text-indigo-300 flex flex-col items-center gap-2">
                        <Search size={32} />
                        <span className="text-xs font-mono">Scanning 10,000+ Profiles...</span>
                   </div>
                </div>
            </div>
        </div>
      </section>

      {/* 📊 Trust Section */}
      <section className="relative z-10 bg-white border-t border-slate-100 py-24 mt-20">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                    {icon: <ShieldCheck size={32} className="text-indigo-600"/>, title: "Verified Skills", desc: "No more fake resumes. AI cross-checks GitHub and portfolio data."},
                    {icon: <Zap size={32} className="text-cyan-500"/>, title: "Instant Match", desc: "Our RAG system reduces hiring time from weeks to literally seconds."},
                    {icon: <Users size={32} className="text-indigo-500"/>, title: "Elite Network", desc: "Access a curated pool of top 1% MERN and AI engineers globally."}
                ].map((item, idx) => (
                    <div key={idx} className="group">
                        <div className="mb-5 inline-block p-4 bg-indigo-50 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                            {item.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-slate-900">{item.title}</h3>
                        <p className="text-slate-500 leading-relaxed leading-snug">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
};

export default LandingHero;