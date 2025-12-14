// src/pages/LandingPage.js
import React, { useState } from 'react';
import { Mail, Linkedin, Instagram, Youtube, Pin, Activity, ExternalLink, X, Menu } from 'lucide-react';

export default function LandingPage({ onLogin }) {
  const [activeModal, setActiveModal] = useState(null);
  const [authMode, setAuthMode] = useState(null); // 'login' | 'signup' | null

  const contactLinks = [
    { name: "Email", value: "contact@yoursurgicalcareer.com", icon: <Mail size={20} className="text-white" />, bg: "bg-blue-500", link: "mailto:contact@yoursurgicalcareer.com" },
    { name: "LinkedIn", value: "Your Surgical Career Professional", icon: <Linkedin size={20} className="text-white" />, bg: "bg-[#0077b5]", link: "#" },
    { name: "Instagram", value: "@YourSurgicalCareer", icon: <Instagram size={20} className="text-white" />, bg: "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500", link: "#" },
    { name: "YouTube", value: "Surgical Training Channel", icon: <Youtube size={20} className="text-white" />, bg: "bg-[#FF0000]", link: "#" },
    { name: "Pinterest", value: "Surgical Resources", icon: <Pin size={20} className="text-white" />, bg: "bg-[#E60023]", link: "#" },
  ];

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    onLogin(); // Trigger the Firebase login
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans selection:bg-teal-500/30 relative overflow-hidden">
      
      {/* Navbar */}
      <nav className="p-6 md:px-12 flex justify-between items-center opacity-80 hover:opacity-100 transition-opacity z-10">
        <div className="text-xl md:text-2xl font-bold tracking-wide text-white flex items-center gap-3">
            <Activity size={24} className="text-teal-400" />
            YourSurgicalCareer.com
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-slate-300">
          <button onClick={() => setActiveModal('about')} className="hover:text-teal-400 transition-colors">About</button>
          <button onClick={() => setActiveModal('contact')} className="hover:text-teal-400 transition-colors">Contact</button>
        </div>
        <div className="md:hidden text-slate-300">
            <Menu size={24} />
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto -mt-16 w-full z-10">
        {!authMode ? (
            <div className="animate-fade-in">
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-200 mb-6 leading-tight tracking-tight">
                  Redefining the Future of <br className="hidden md:block" />
                  <span className="text-white relative inline-block">
                    Surgical Training
                    <span className="absolute -bottom-2 left-0 w-full h-1 bg-teal-500 rounded-full opacity-80"></span>
                  </span>
                </h1>
                
                <p className="text-slate-400 text-base md:text-xl max-w-2xl mb-12 font-light leading-relaxed">
                  Join us to revolutionize surgical training. Everything you need for your career as a surgeon, all in one place. Your specialty, conferences, exam dates, deadlines, and portfolio links. Collated for you.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-sm mx-auto">
                    <button 
                      onClick={() => setAuthMode('signup')}
                      className="flex-1 flex items-center justify-center px-8 py-3.5 font-bold text-slate-900 transition-all duration-200 bg-teal-400 rounded-lg hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 hover:-translate-y-0.5 shadow-lg shadow-teal-900/20"
                    >
                      Sign Up
                    </button>
                    <button 
                      onClick={() => setAuthMode('login')} 
                      className="flex-1 flex items-center justify-center px-8 py-3.5 font-bold text-white transition-all duration-200 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700 hover:-translate-y-0.5"
                    >
                      Log In
                    </button>
                </div>

                <button 
                  onClick={onLogin}
                  className="mt-8 text-slate-500 hover:text-teal-400 font-medium text-sm transition-colors flex items-center gap-2 mx-auto group"
                >
                  <span>Continue as Guest / Admin</span>
                  <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>
        ) : (
            <div className="w-full max-w-md bg-slate-800/50 p-8 rounded-2xl border border-slate-700 backdrop-blur-sm animate-fade-in shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                    <button onClick={() => setAuthMode(null)} className="text-slate-400 hover:text-white transition-colors"><X size={20}/></button>
                </div>
                
                {/* Auth Form (Visual Only - Triggers Guest Login for now) */}
                <form onSubmit={handleAuthSubmit} className="space-y-4 text-left">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                        <input type="email" className="w-full bg-slate-900/80 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600" placeholder="name@hospital.nhs.uk" required />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
                        <input type="password" className="w-full bg-slate-900/80 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600" placeholder="••••••••" required />
                    </div>
                    
                    <button type="submit" className="w-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-3.5 rounded-lg transition-all mt-4 hover:shadow-lg hover:shadow-teal-500/20 active:scale-[0.98]">
                        {authMode === 'login' ? 'Log In' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-slate-700/50">
                    <p className="text-sm text-slate-400">
                        {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                        <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="text-teal-400 hover:text-teal-300 font-semibold hover:underline transition-colors ml-1">
                            {authMode === 'login' ? 'Sign Up' : 'Log In'}
                        </button>
                    </p>
                </div>
            </div>
        )}
      </div>

      {/* Footer */}
      <footer className="p-6 text-center text-slate-600 text-xs z-10">
        &copy; 2025 Your Surgical Career. All rights reserved.
      </footer>

      {/* About Modal */}
      {activeModal === 'about' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
           <div className="bg-slate-800 p-8 rounded-2xl max-w-2xl text-white relative border border-slate-700 shadow-2xl">
             <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"><X size={24} /></button>
             <h2 className="text-2xl font-bold mb-4 text-teal-400">About Your Surgical Career</h2>
             <div className="space-y-4 text-slate-300 leading-relaxed">
               <p><strong>Your Surgical Career</strong> is designed to be the comprehensive Career Management System for surgical trainees in the UK.</p>
               <p>We aim to bridge the gap between the fragmented tools currently available to trainees—unifying logbooks, portfolios, recruitment platforms, and exam resources into a single, cohesive "Professional Operating System."</p>
               <p>Why use this platform? It is the sole means to effectively consolidate your career data, track your readiness for competitive selection (ST3), and access a centralized directory of jobs and hospitals without navigating multiple disparate websites.</p>
               <p className="font-semibold text-white mt-4">Streamline your training. Focus on your surgery.</p>
             </div>
           </div>
        </div>
      )}

      {/* Contact Modal */}
      {activeModal === 'contact' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
           <div className="bg-slate-800 p-8 rounded-2xl max-w-lg w-full text-white relative border border-slate-700 shadow-2xl">
             <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"><X size={24} /></button>
             <h2 className="text-2xl font-bold mb-6 text-teal-400 text-center">Get in Touch</h2>
             <div className="grid gap-3">
               {contactLinks.map((item) => (
                 <a key={item.name} href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-teal-500/50 transition-all group">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm shrink-0 ${item.bg}`}>{item.icon}</div>
                   <div className="ml-3 flex-1">
                     <h3 className="text-sm font-bold text-slate-200">{item.name}</h3>
                     <p className="text-xs text-slate-400 group-hover:text-teal-400 transition-colors truncate">{item.value}</p>
                   </div>
                   <ExternalLink size={16} className="text-slate-500 group-hover:text-teal-400" />
                 </a>
               ))}
             </div>
           </div>
        </div>
      )}
    </div>
  );
}