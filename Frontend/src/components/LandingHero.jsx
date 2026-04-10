import { useState, useEffect } from 'react';
import { Zap, BrainCircuit, ShieldCheck, Search, Users, Sparkles, ArrowRight, CheckCircle2, Globe, Cpu, MessageSquare, Code2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';

const LandingHero = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 selection:bg-indigo-500/30 font-sans antialiased overflow-x-hidden">
      
      {/* ⚡ Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-indigo-600 z-[100] origin-left" style={{ scaleX }} />

      {/* 🌫️ Ambient Background Elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* 🟦 Navbar */}
      <nav className="fixed top-0 left-0 w-full z-[60] backdrop-blur-xl border-b border-white/5 bg-slate-950/50">
        <div className="flex justify-between items-center max-w-7xl mx-auto p-4 px-6 md:px-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
              <Sparkles className="text-white" size={22} />
            </div>
            <h1 className="text-2xl font-[1000] tracking-tighter text-white">
              AI-HIRE<span className="text-indigo-500">.</span>
            </h1>
          </motion.div>
          
          <div className="flex items-center gap-8">
            <div className="hidden lg:flex items-center gap-8 text-sm font-bold uppercase tracking-widest">
              <a href="#process" className="hover:text-white transition-colors">Process</a>
              <a href="#features" className="hover:text-white transition-colors">Engine</a>
              <a href="#talent" className="hover:text-white transition-colors">Talent</a>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/login')} className="text-sm font-bold hover:text-white transition px-2">Login</button>
              <button 
                onClick={() => navigate('/signup')} 
                className="bg-white text-black px-6 py-2.5 rounded-full font-black text-sm hover:bg-indigo-50 transition-all active:scale-95 shadow-lg shadow-white/5"
              >
                Join Now
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 🚀 Hero Section */}
      <section className="relative z-10 pt-32 pb-20 md:pt-52 md:pb-32 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 inline-flex items-center gap-2 border border-white/10 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md shadow-2xl text-[10px] md:text-xs font-black text-indigo-400 uppercase tracking-[0.2em]"
        >
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
          RAG-Powered Semantic Matching
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-8xl font-[1000] mb-8 tracking-tighter leading-[0.9] text-white"
        >
          Hire the top 1% <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-fuchsia-400 to-cyan-400">
            AI & MERN Talent.
          </span>
        </motion.h2 >

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl text-slate-400 text-lg md:text-xl mb-12 leading-relaxed"
        >
          Traditional hiring is broken. Our AI engine uses <b>Vector Embeddings</b> to scan codebases, 
          GitHub activity, and technical depth to match you with vetted engineers in seconds.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto"
        >
          <button className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition shadow-2xl shadow-indigo-500/20 flex items-center justify-center gap-3 group">
            Hire Now <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="bg-white/5 border border-white/10 backdrop-blur-sm text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/10 transition flex items-center justify-center">
            View Profiles
          </button>
        </motion.div>
      </section>

      {/* 🧩 Bento Grid Features */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Card */}
          <div className="md:col-span-2 bg-gradient-to-br from-indigo-900/20 to-slate-900/50 p-10 rounded-[3rem] border border-white/10 flex flex-col justify-between">
            <div className="max-w-md">
              <Cpu className="text-indigo-400 mb-6" size={48} />
              <h3 className="text-3xl font-black text-white mb-4">Neural Matching Engine</h3>
              <p className="text-slate-400 font-medium">Our RAG system doesn't just search keywords. It understands project requirements, tech debt, and developer expertise semantically.</p>
            </div>
            <div className="mt-12 bg-black/40 p-6 rounded-2xl border border-white/5">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                <div className="w-3 h-3 rounded-full bg-slate-700" />
                <div className="w-3 h-3 rounded-full bg-slate-700" />
              </div>
              <p className="font-mono text-xs text-indigo-300">{'>>'} Vector Search: find_engineer(skills=['React', 'RAG'], experience='senior')</p>
            </div>
          </div>
          
          <div className="bg-slate-900/50 p-10 rounded-[3rem] border border-white/10 flex flex-col justify-center text-center">
            <Globe className="text-cyan-400 mx-auto mb-6" size={48} />
            <h3 className="text-2xl font-black text-white mb-2">100% Remote</h3>
            <p className="text-slate-500">Direct access to the world's most talented developers across 50+ countries.</p>
          </div>

          <div className="bg-slate-900/50 p-10 rounded-[3rem] border border-white/10 flex flex-col justify-center text-center">
            <ShieldCheck className="text-emerald-400 mx-auto mb-6" size={48} />
            <h3 className="text-2xl font-black text-white mb-2">Vetted Code</h3>
            <p className="text-slate-500">Every engineer goes through a rigorous technical audit of their production code.</p>
          </div>

          <div className="md:col-span-2 bg-gradient-to-tr from-fuchsia-900/20 to-indigo-900/20 p-10 rounded-[3rem] border border-white/10 flex items-center gap-10">
            <div className="hidden lg:block">
               <MessageSquare size={80} className="text-fuchsia-500 opacity-50" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-white mb-4">Real-time Collaboration</h3>
              <p className="text-slate-400">Integrated chat and project management. From first hello to final commit, everything happens in one place.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 📊 The "Process" Scroll Section */}
      <section id="process" className="relative z-10 py-32 bg-white/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">How it works?</h2>
            <p className="text-slate-500 mt-4 font-bold">From prompt to production in 3 simple steps.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
             {/* Connectors (hidden on mobile) */}
             <div className="hidden md:block absolute top-1/4 left-1/3 w-1/3 h-[2px] bg-gradient-to-r from-indigo-500 to-transparent opacity-20" />
             <div className="hidden md:block absolute top-1/4 left-2/3 w-1/3 h-[2px] bg-gradient-to-r from-indigo-500 to-transparent opacity-20" />

             {[
               {step: "01", title: "Describe Needs", desc: "Just tell our AI who you need in plain English. No complex forms."},
               {step: "02", title: "AI Audit", desc: "Our engine scans the global talent pool using vector semantic search."},
               {step: "03", title: "Instant Hire", desc: "Interview and hire the top 3 matches directly from the dashboard."}
             ].map((item, idx) => (
               <div key={idx} className="relative text-center">
                 <div className="text-7xl font-black text-white/5 absolute -top-12 left-1/2 -translate-x-1/2">{item.step}</div>
                 <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white font-black shadow-xl shadow-indigo-600/20">
                   {idx === 0 ? <Search /> : idx === 1 ? <BrainCircuit /> : <CheckCircle2 />}
                 </div>
                 <h3 className="text-2xl font-black text-white mb-4">{item.title}</h3>
                 <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* ⚡ Final Call to Action */}
      <section className="relative z-10 py-40 flex flex-col items-center px-6">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 w-full max-w-5xl rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-indigo-500/20">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
          <h2 className="text-4xl md:text-7xl font-[1000] text-white tracking-tighter leading-none relative z-10">
            Ready to build <br /> something great?
          </h2>
          <p className="mt-8 text-indigo-100 text-lg md:text-xl font-medium relative z-10 max-w-xl mx-auto opacity-80">
            Stop screening, start building. Join 500+ companies hiring through AI-HIRE.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <button className="bg-white text-indigo-600 px-10 py-5 rounded-3xl font-black text-xl hover:scale-105 transition-transform">
              Get Started for Free
            </button>
            <button className="bg-indigo-900/30 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-3xl font-black text-xl hover:bg-white/10 transition-colors">
              Talk to Sales
            </button>
          </div>
        </div>
      </section>

      {/* 🌑 Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-6">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-slate-800 p-2 rounded-lg">
                <Sparkles className="text-indigo-400" size={20} />
              </div>
              <span className="font-black text-white tracking-tighter">AI-HIRE</span>
            </div>
            <p className="text-slate-600 text-sm font-bold uppercase tracking-widest">© 2026 Built with Passion & AI</p>
            <div className="flex gap-6 text-slate-500 font-bold text-xs uppercase tracking-widest">
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Terms</a>
              <a href="#" className="hover:text-white transition">GitHub</a>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default LandingHero;