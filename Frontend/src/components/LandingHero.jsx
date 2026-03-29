import { Zap, BrainCircuit, ShieldCheck, Search, Users, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingHero = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 relative overflow-hidden font-sans antialiased">
      
      {/* 🌫️ Background Soft Gradients (Dynamic size for mobile) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[80%] md:w-[50%] h-[50%] bg-indigo-100 rounded-full blur-[80px] md:blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[70%] md:w-[40%] h-[40%] bg-cyan-50 rounded-full blur-[80px] md:blur-[100px] opacity-70"></div>
      </div>

      {/* 🟦 Navbar - Responsive adjustments */}
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b border-slate-200/60 bg-white/70">
        <div className="flex justify-between items-center p-4 max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg shrink-0">
                <Sparkles className="text-white" size={18} md:size={20} />
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tighter text-slate-900">
              AI-HIRE<span className='text-indigo-600'>.</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition hidden lg:block">Process</a>
            <button onClick={() => navigate('/login')} className="text-xs md:text-sm font-bold text-slate-700 hover:text-indigo-600 transition px-2">Login</button>
            <button 
              onClick={() => navigate('/signup')} 
              className="bg-indigo-600 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-bold text-xs md:text-sm hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* 🚀 Hero Section - Better padding and font scaling */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center mt-28 md:mt-44 px-4 md:px-6 max-w-5xl mx-auto">
        
        {/* ✨ AI Badge - Flexible size */}
        <div className="mb-6 md:mb-8 inline-flex items-center gap-2 border border-indigo-100 px-3 md:px-4 py-1.5 rounded-full bg-white shadow-sm text-[10px] md:text-xs font-bold text-indigo-600 uppercase tracking-widest animate-fade-in">
          <BrainCircuit size={14} className="md:w-4 md:h-4" />
          <span>Next-Gen RAG Matching Engine</span>
        </div>

        {/* 🏔️ Clean Bold Headline - Significant scaling for mobile */}
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-[1000] mb-6 md:mb-8 tracking-tighter leading-[1.1] text-slate-900">
          The Intelligent Way to <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">Hire Top Engineers.</span>
        </h2>

        {/* 📝 Professional Description */}
        <p className="max-w-2xl text-slate-500 text-base md:text-xl mb-10 md:mb-12 leading-relaxed px-2">
          Skip the endless manual screening. Our AI analyzes technical depth using 
          <span className="text-indigo-600 font-semibold"> Vector Embeddings </span> 
          to match you with vetted engineers who actually fit your tech stack.
        </p>

        {/* 🔘 CTAs - Full width on mobile */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16 md:mb-24 w-full sm:w-auto px-4 sm:px-0">
          <button className="w-full sm:w-auto bg-indigo-600 text-white px-8 md:px-10 py-4 rounded-2xl font-black text-base md:text-lg hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 active:scale-95">
            Post a Project <ArrowRight size={20} />
          </button>
          <button className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 px-8 md:px-10 py-4 rounded-2xl font-black text-base md:text-lg hover:bg-slate-50 transition shadow-sm active:scale-95">
            Browse Talent
          </button>
        </div>

        {/* 📱 Mini Dashboard Preview - Hidden on small mobile devices to save space, or kept for tablet */}
        <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-3 md:p-4 rotate-x-6 md:rotate-x-12 transform perspective-1000 hidden sm:block">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
                <div className="flex gap-1.5 md:gap-2">
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="h-2 w-24 md:w-32 bg-slate-100 rounded-full"></div>
            </div>
            <div className="grid grid-cols-3 gap-3 md:gap-4 h-32 md:h-48">
                <div className="bg-slate-50 rounded-xl border border-dashed border-slate-200"></div>
                <div className="col-span-2 bg-indigo-50/50 rounded-xl border border-indigo-100 flex flex-col items-center justify-center">
                   <div className="text-indigo-300 flex flex-col items-center gap-2">
                        <Search size={24} md:size={32} />
                        <span className="text-[10px] md:text-xs font-mono font-bold">Scanning 10k+ Profiles...</span>
                   </div>
                </div>
            </div>
        </div>
      </section>

      {/* 📊 Trust Section - Grid layout changes per screen size */}
      <section className="relative z-10 bg-white border-t border-slate-100 py-16 md:py-24 mt-10 md:mt-20">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                {[
                    {icon: <ShieldCheck size={32}/>, title: "Verified Skills", desc: "No more fake resumes. AI cross-checks GitHub and portfolio data."},
                    {icon: <Zap size={32}/>, title: "Instant Match", desc: "Our RAG system reduces hiring time from weeks to literally seconds."},
                    {icon: <Users size={32}/>, title: "Elite Network", desc: "Access a curated pool of top 1% MERN and AI engineers globally."}
                ].map((item, idx) => (
                    <div key={idx} className="group">
                        <div className="mb-5 inline-block p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                            {item.icon}
                        </div>
                        <h3 className="text-xl font-black mb-3 text-slate-900 tracking-tight">{item.title}</h3>
                        <p className="text-slate-500 leading-relaxed text-sm md:text-base">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
};

export default LandingHero;