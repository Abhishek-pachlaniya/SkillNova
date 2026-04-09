import React from 'react';
import { Sparkles, Target, Users, ShieldCheck, Zap, Globe, Cpu, ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-hidden relative font-sans">
      
      {/* 🌌 Refined Background "Magic" Elements for Light Theme */}
      <div className="absolute top-[-5%] left-[-5%] w-[400px] h-[400px] bg-indigo-100/30 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-cyan-100/20 rounded-full blur-[130px]"></div>
      <div className="absolute bottom-[-10%] left-[10%] w-[450px] h-[450px] bg-emerald-100/20 rounded-full blur-[110px]"></div>

      {/* Thin Geometric Grid Pattern Overlay (Very subtle) */}
      <svg width="100%" height="100%" className="absolute inset-0 opacity-[0.015] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        
        {/* 🔥 Hero Section: Refined and Impactful */}
        <div className="text-center mb-28">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-slate-100 border border-slate-200 text-indigo-700 text-sm font-semibold uppercase tracking-[0.15em] mb-8 animate-bounce">
            <Sparkles size={16} /> Re-defining The Future
          </div>
          <h1 className="text-6xl md:text-9xl font-[1000] tracking-tighter mb-10 leading-[0.9] text-slate-950">
            We Are <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-500">Not Just</span> A Platform.
          </h1>
          <p className="max-w-3xl mx-auto text-slate-700 text-xl md:text-2xl font-normal leading-relaxed">
            Humne banaya hai ek aisa ecosystem jahan <span className='font-semibold text-slate-900'>AI aur human intelligence</span> milkar kaam karte hain. 
            No more boring searches—sirf <span className='font-semibold text-slate-900'>perfect matching</span>.
          </p>
          
          <button className="mt-12 inline-flex items-center gap-2 px-8 py-4 bg-slate-950 text-white rounded-full font-bold text-lg hover:bg-slate-800 transition-colors group">
            Explore Ecosystem
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* ⚡ Stats Grid: Numbers that Flex, cleaner look */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-36">
          {[
            { label: 'AI Matches', value: '10M+' },
            { label: 'Active Engineers', value: '500K+' },
            { label: 'Project Success', value: '99.9%' },
            { label: 'Global Reach', value: '140+' },
          ].map((stat, i) => (
            <div key={i} className="p-10 rounded-[2rem] bg-slate-50 border border-slate-100 backdrop-blur-sm text-center group hover:border-indigo-300 hover:shadow-xl transition-all">
              <div className="text-4xl md:text-6xl font-[1000] text-slate-950 mb-3 group-hover:scale-110 group-hover:text-indigo-700 transition-all">{stat.value}</div>
              <div className="text-slate-600 text-sm font-bold uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 🧠 The "Brain" Section: Elegant & Advanced */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-36">
          <div className="space-y-8">
            <h2 className="text-5xl md:text-6xl font-black text-slate-950 tracking-tighter leading-tight">
              Our Mission: <br /> <span className="text-indigo-600">Kill The Search.</span>
            </h2>
            <p className="text-slate-700 text-lg leading-relaxed">
              Freelancing market mein sabse badi problem thi "Kise choose karein?". Humne <span className='font-semibold text-slate-900'>RAG (Retrieval-Augmented Generation) technology</span> ka use karke usse solve kar diya. 
              Client sirf apni zarurat bolta hai, aur humara AI uske liye <span className='font-semibold text-slate-900'>best engineer</span> nikal leta hai.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-8">
              <div className="flex items-center gap-3.5 p-5 rounded-2xl bg-slate-100 border border-slate-200">
                <Zap className="text-yellow-600" /> <span className="font-bold text-slate-900">Lightning Fast Matching</span>
              </div>
              <div className="flex items-center gap-3.5 p-5 rounded-2xl bg-slate-100 border border-slate-200">
                <Target className="text-emerald-600" /> <span className="font-bold text-slate-900">Precision Talent Selection</span>
              </div>
               <div className="flex items-center gap-3.5 p-5 rounded-2xl bg-slate-100 border border-slate-200 col-span-1 sm:col-span-2">
                <Cpu className="text-indigo-600" /> <span className="font-bold text-slate-900">Powered by Advanced RAG Technology</span>
              </div>
            </div>
          </div>
          
          {/* Refined Animated Visual Card with Node Connections */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-300 to-cyan-300 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative bg-white border border-slate-100 rounded-[3rem] p-12 overflow-hidden shadow-2xl shadow-indigo-100">
               <div className="w-20 h-20 bg-indigo-600 rounded-2xl mb-8 flex items-center justify-center shadow-xl shadow-indigo-300">
                  <Globe size={40} className="text-white" />
               </div>
               <h3 className="text-2xl font-black mb-6 uppercase text-slate-950">Connecting the Global Dots.</h3>
               
               {/* Complex Visual representation (e.g., connected nodes) */}
               <div className="space-y-4 relative">
                    {[
                        {color: 'indigo', width: '75%', delay: '0s'},
                        {color: 'cyan', width: '90%', delay: '0.1s'},
                        {color: 'emerald', width: '60%', delay: '0.2s'},
                         {color: 'yellow', width: '80%', delay: '0.3s'},
                    ].map((line, idx) => (
                        <div key={idx} className={`h-2.5 w-full bg-slate-100 rounded-full overflow-hidden`}>
                            <div className={`h-full bg-${line.color}-500 animate-pulse`} style={{ width: line.width, animationDelay: line.delay }}></div>
                        </div>
                    ))}
                    
                    {/* Floating connected dots (decorative SVG) */}
                    <svg className='absolute inset-0 top-0 left-0 h-full w-full pointer-events-none opacity-40' viewBox='0 0 100 100'>
                        <circle cx="20" cy="10" r="1.5" fill="indigo"/>
                        <circle cx="80" cy="20" r="1.5" fill="cyan"/>
                        <circle cx="50" cy="50" r="2.5" fill="emerald"/>
                        <circle cx="10" cy="90" r="1.5" fill="yellow"/>
                        <path d="M20 10 L80 20 M80 20 L50 50 M50 50 L10 90 M10 90 L20 10" stroke="slate-300" strokeWidth="0.5" fill="none" />
                    </svg>
               </div>
            </div>
          </div>
        </div>

        {/* 🛡️ Core Values Section: Clean, Colorful Accents */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-16 uppercase tracking-widest text-slate-950">Our Core DNA</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: <Users />, title: 'Community First', desc: 'Hum engineers aur clients ka ek aisa parivaar bana rahe hain jahan growth sabki ho.', accent: 'indigo' },
              { icon: <ShieldCheck />, title: 'Trust Built-in', desc: 'Secure payments aur verified profiles. Yahan dhoka-dhadi ka scene hi nahi hai.', accent: 'emerald' },
              { icon: <Zap />, title: 'AI Driven', desc: 'Hum technology ki limits ko push kar rahe hain taaki aapko mile best experience.', accent: 'cyan' },
            ].map((value, i) => (
              <div key={i} className={`p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-${value.accent}-300 hover:shadow-xl transition-all text-left group`}>
                <div className={`text-${value.accent}-600 mb-8 w-14 h-14 bg-${value.accent}-50 rounded-2xl flex items-center justify-center border border-${value.accent}-100 group-hover:scale-110 transition-transform`}>{value.icon}</div>
                <h4 className="text-2xl font-black mb-5 text-slate-950">{value.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{value.desc}</p>
                <div className={`mt-6 h-1 w-10 bg-${value.accent}-500 rounded-full group-hover:w-full transition-all duration-300`}></div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;