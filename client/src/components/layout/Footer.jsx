import React from 'react';
import { ShieldCheck, Heart, Sparkles, Activity } from 'lucide-react';

export default function Footer({ setRoute }) {
  return (
    <footer className="bg-navy-900 border-t border-slate-800/80 pt-10 pb-8 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Visual Pipeline Bar */}
        <div className="mb-10 p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Core Pipeline
          </span>
          <div className="flex flex-wrap items-center gap-2 text-slate-300 font-medium">
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-200">1. REPORT</span>
            <span className="text-cyan-400 font-bold">→</span>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-200">2. UNDERSTAND</span>
            <span className="text-cyan-400 font-bold">→</span>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-200">3. CONNECT</span>
            <span className="text-cyan-400 font-bold">→</span>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-200">4. PRIORITIZE</span>
            <span className="text-cyan-400 font-bold">→</span>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-200">5. ACT</span>
            <span className="text-cyan-400 font-bold">→</span>
            <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">6. VERIFY & RESOLVE</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand & Vision */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-black text-white">CIVIC LENS AI</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                PROTOTYPE
              </span>
            </div>
            <p className="text-slate-300 font-medium italic text-sm">
              “See the Problem. Understand the Impact. Drive the Resolution.”
            </p>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Transforming raw citizen observations into structured, prioritized, location-aware civic intelligence. Empowering municipal authorities with explainable AI prioritization and ground-truth citizen verification.
            </p>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Intelligence & Hub</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setRoute('/demo')} className="text-amber-400 font-semibold hover:text-amber-300">★ Interactive Live Demo</button></li>
              <li><button onClick={() => setRoute('/info')} className="hover:text-cyan-400">Platform Architecture & Scoring</button></li>
              <li><button onClick={() => setRoute('/profile')} className="hover:text-cyan-400">Contributor Profile & Badges</button></li>
              <li><button onClick={() => setRoute('/login')} className="hover:text-cyan-400">Sign In / Demo Accounts</button></li>
              <li><button onClick={() => setRoute('/dashboard')} className="hover:text-cyan-400">Citizen Dashboard</button></li>
              <li><button onClick={() => setRoute('/report')} className="hover:text-cyan-400">Smart AI Report</button></li>
              <li><button onClick={() => setRoute('/issues')} className="hover:text-cyan-400">Explore Civic Issues</button></li>
              <li><button onClick={() => setRoute('/map')} className="hover:text-cyan-400">Civic Problem Heatmap</button></li>
            </ul>
          </div>

          {/* System Telemetry */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Platform Health</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>AI Vision & NLP: Operational</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Spatial Clustering: Active</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-400">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>MongoDB Connected (Local)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2025 Civic Lens AI — Built for Hackathon Excellence.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for modern civic empowerment
          </p>
        </div>
      </div>
    </footer>
  );
}
