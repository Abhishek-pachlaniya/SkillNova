import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, Users, ShieldCheck, Zap, Globe, Cpu, ArrowRight, Network, Rocket } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

// Helper component for animated lines
const TraceLine = ({ delay }) => (
  <motion.div 
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    transition={{ duration: 1.5, delay }}
    className="h-[1px] w-full bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent origin-left mb-6"
  />
);

const About = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 selection:bg-indigo-500/30 font-sans antialiased overflow-x-hidden">
      
      {/* 🌫️ Mesh Gradient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/10 rounded-full blur-[120px] opacity-40 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-fuchsia-600/10 rounded-full blur-[120px] opacity-30"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-24 relative z-10">
        
        {/* 🚀 Hero Section: High Impact */}
        <div className="text-center mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-xs font-black uppercase tracking-[0.25em] mb-10 shadow-2xl shadow-indigo-500/10"
          >
            <Sparkles size={14} className="animate-pulse" /> Re-defining The Future
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-[9rem] font-[1000] tracking-tighter mb-10 leading-[0.85] text-white"
          >
            NOT JUST <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400">
              A PLATFORM.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto text-slate-400 text-xl md:text-2xl font-medium leading-relaxed"
          >
            Humne banaya hai ek aisa intelligence layer jahan <span className='text-white font-bold'>RAG Technology</span> aur top-tier engineering talent milkar software ki duniya badal rahe hain.
          </motion.p>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-12 inline-flex items-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-500/20 group"
          >
            Join the Ecosystem
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {/* 📊 Stats Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-40">
          {[
            { label: 'AI Matches', value: '10M+', color: 'text-indigo-500' },
            { label: 'Engineers', value: '500K+', color: 'text-fuchsia-500' },
            { label: 'Accuracy', value: '99.9%', color: 'text-emerald-500' },
            { label: 'Countries', value: '140+', color: 'text-cyan-500' },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-[2.5rem] bg-white/5 border border-white/5 backdrop-blur-xl text-center group hover:bg-white/[0.08] transition-all"
            >
              <div className={`text-4xl md:text-6xl font-[1000] mb-3 tracking-tighter ${stat.color} group-hover:scale-110 transition-transform`}>
                {stat.value}
              </div>
              <div className="text-slate-500 text-xs font-black uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* 🧠 The "Brain" Section: RAG Technology Reveal */}
        <div className="grid md:grid-cols-2 gap-20 items-center mb-40">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3 text-indigo-400 font-black tracking-widest text-sm uppercase">
              <Cpu size={20} /> Neural Matching Engine
            </div>
            <h2 className="text-5xl md:text-7xl font-[1000] text-white tracking-tighter leading-none">
              The Mission: <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">Kill The Search.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              Traditional hiring manual filtering par chalti thi. Humne <span className='text-white'>Vector Semantic Search</span> ka use kiya hai. Client sirf apni problem likhta hai, aur humara AI hazaaron profiles scan karke wahi 1% nikalta hai jo perfect hain.
            </p>
            
            <div className="grid gap-4 pt-6">
               <div className="flex items-center gap-4 p-5 rounded-[1.5rem] bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400"><Zap size={24} /></div>
                  <span className="font-black text-white text-lg">Instant Vector Matching</span>
               </div>
               <div className="flex items-center gap-4 p-5 rounded-[1.5rem] bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400"><Target size={24} /></div>
                  <span className="font-black text-white text-lg">99% Technical Depth Accuracy</span>
               </div>
            </div>
          </motion.div>
          
          {/* Visual AI Brain Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-indigo-600/20 rounded-[4rem] blur-[60px]" />
            <div className="relative bg-slate-900/50 border border-white/10 rounded-[3.5rem] p-12 backdrop-blur-3xl overflow-hidden shadow-2xl">
                <div className="bg-gradient-to-br from-indigo-600 to-violet-600 w-20 h-20 rounded-2xl mb-10 flex items-center justify-center shadow-2xl shadow-indigo-500/40">
                  <Network size={40} className="text-white" />
                </div>
                <h3 className="text-3xl font-[1000] text-white tracking-tighter mb-8 leading-tight">
                  Analyzing 5M+ <br /> Code Signals 
                </h3>
                
                <div className="space-y-5">
                  <TraceLine delay={0.1} />
                  <TraceLine delay={0.3} />
                  <TraceLine delay={0.5} />
                  <TraceLine delay={0.7} />
                </div>

                <div className="mt-10 flex gap-4 overflow-hidden opacity-40">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="h-12 w-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex-shrink-0" />
                   ))}
                </div>
            </div>
          </motion.div>
        </div>

        {/* 🛡️ Values Section: Bento Grid Redesign */}
        <div className="text-center">
          <h2 className="text-3xl font-[1000] mb-20 uppercase tracking-[0.4em] text-white opacity-20">Our DNA</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Users />, title: 'Community First', desc: 'Hum engineers aur clients ka ek aisa parivaar bana rahe hain jahan growth sabki ho.', color: 'from-indigo-600/20' },
              { icon: <ShieldCheck />, title: 'Trust Built-in', desc: 'Verified profiles aur code-audits. Yahan sirf genuine talent hi survival kar sakta hai.', color: 'from-emerald-600/20' },
              { icon: <Rocket />, title: 'AI Driven', desc: 'Hum technology ki limits ko push kar rahe hain taaki hiring process instant ho.', color: 'from-fuchsia-600/20' },
            ].map((value, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className={`p-10 rounded-[3rem] bg-gradient-to-br ${value.color} to-slate-900/50 border border-white/5 text-left group transition-all relative overflow-hidden`}
              >
                <div className="relative z-10">
                  <div className="mb-8 w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                    {value.icon}
                  </div>
                  <h4 className="text-2xl font-[1000] mb-5 text-white tracking-tight">{value.title}</h4>
                  <p className="text-slate-500 text-base font-medium leading-relaxed">{value.desc}</p>
                </div>
                <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;