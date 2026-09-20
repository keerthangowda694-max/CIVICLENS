import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Bot,
  Layers,
  Network,
  Zap,
  MapPin,
  CheckCircle2,
  Check,
  X,
  Play,
  Flame,
  ChevronRight,
  Eye,
  FileCheck2
} from 'lucide-react';

export default function LandingPage({ setRoute }) {
  const [stats, setStats] = useState({
    totalIssues: 14,
    activeIssues: 6,
    resolvedIssues: 8,
    highImpactIssues: 5,
    resolutionRate: 57,
  });

  useEffect(() => {
    api.getAnalytics()
      .then((data) => {
        if (data.summary) {
          setStats(data.summary);
        }
      })
      .catch(() => {});
  }, []);

  const pipelineSteps = [
    { step: '01', title: 'REPORT', desc: 'Citizen types, speaks, or uploads photo', icon: MapPin, color: 'text-blue-400' },
    { step: '02', title: 'UNDERSTAND', desc: 'AI extracts category, severity & department', icon: Bot, color: 'text-cyan-400' },
    { step: '03', title: 'CONNECT', desc: 'Spatial clustering detects duplicate reports', icon: Network, color: 'text-teal-400' },
    { step: '04', title: 'PRIORITIZE', desc: '0–100 Civic Impact Score calculated', icon: Zap, color: 'text-amber-400' },
    { step: '05', title: 'ACT', desc: 'Smart routing to municipal field crews', icon: ShieldCheck, color: 'text-emerald-400' },
    { step: '06', title: 'VERIFY', desc: 'Citizens confirm resolution before ticket close', icon: CheckCircle2, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-24 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Hero Section */}
      <section className="relative text-center pt-8 pb-16 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-cyan-500/20 to-teal-400/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

        {/* Tag pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-6 shadow-md backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <span>Next-Generation AI Civic Issue Intelligence</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          See the Problem. <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-300 bg-clip-text text-transparent">
            Understand the Impact.
          </span> <br />
          Drive the Resolution.
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Civic Lens transforms raw citizen observations into structured, prioritized, location-aware intelligence using computer vision, spatial clustering, and citizen ground-truth verification.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setRoute('/report')}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-white font-black text-base shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300 flex items-center space-x-2"
          >
            <span>Report an Issue</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => setRoute('/issues')}
            className="px-8 py-4 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 font-bold text-base transition-all flex items-center space-x-2"
          >
            <span>Explore Civic Issues</span>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>

          <button
            onClick={() => setRoute('/admin')}
            className="px-6 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-cyan-400 border border-cyan-500/40 font-bold text-base transition-all flex items-center space-x-2"
          >
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span>Command Center</span>
          </button>
        </div>

        {/* Live Metrics Strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Total Tracked</span>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">{stats.totalIssues || 14}</div>
            <p className="text-[10px] text-cyan-400 mt-0.5">Metropolitan Area</p>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase">High & Urgent Impact</span>
            <div className="text-2xl sm:text-3xl font-black text-rose-400 mt-1">{stats.highImpactIssues || 5}</div>
            <p className="text-[10px] text-rose-300 mt-0.5">Top Operational Priority</p>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Verified Resolved</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">{stats.resolvedIssues || 8}</div>
            <p className="text-[10px] text-emerald-300 mt-0.5">With Before/After Proof</p>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase">AI Duplicate Grouping</span>
            <div className="text-2xl sm:text-3xl font-black text-cyan-400 mt-1">42%</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Dispatches Streamlined</p>
          </div>
        </div>
      </section>

      {/* Core AI Pipeline Visual */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">End-to-End Workflow</span>
          <h2 className="text-3xl font-black text-white mt-1">The Civic Intelligence Pipeline</h2>
          <p className="text-sm text-slate-400 mt-2">
            Every citizen report flows through an automated multi-stage cognitive pipeline ensuring explainability and accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {pipelineSteps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 group relative"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black text-slate-500">{item.step}</span>
                  <div className={`p-2 rounded-lg bg-slate-900 border border-slate-700/60 ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="text-sm font-extrabold text-white group-hover:text-cyan-400 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-snug">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison: Ordinary Portals vs Civic Lens AI */}
      <section className="glass-panel rounded-3xl p-8 border border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">The Paradigm Shift</span>
          <h2 className="text-3xl font-black text-white mt-1">Why Ordinary Portals Fail</h2>
          <p className="text-sm text-slate-400 mt-2">
            Ordinary portals become black holes for complaints. Civic Lens creates an intelligent operational loop.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Ordinary Complaint Portal */}
          <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-4">
            <div className="flex items-center space-x-2 text-rose-400">
              <X className="w-5 h-5 font-black" />
              <h3 className="text-lg font-bold">Ordinary Complaint Portals</h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Boring forms with 15 tedious dropdowns that citizens abandon.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Repeated reports marked as duplicate spam and discarded silently.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Flat chronologic queue with zero awareness of danger or public impact.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Tickets closed without proof, leaving citizens cynical and distrustful.</span>
              </li>
            </ul>
          </div>

          {/* Civic Lens AI Platform */}
          <div className="p-6 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-4">
            <div className="flex items-center space-x-2 text-cyan-400">
              <Check className="w-5 h-5 font-black" />
              <h3 className="text-lg font-bold">Civic Lens AI Intelligence</h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
              <li className="flex items-start space-x-2">
                <span className="text-cyan-400 font-bold">✓</span>
                <span><strong>Natural Reporting:</strong> Voice, speech dictation, or single sentence photo report. AI auto-extracts everything.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-cyan-400 font-bold">✓</span>
                <span><strong>Issue Clustering:</strong> Groups 17 related complaints into 1 unified root issue, boosting priority.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-cyan-400 font-bold">✓</span>
                <span><strong>0–100 Civic Impact Score:</strong> Explainable multi-factor scoring prioritizing critical school & hospital hazards first.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-cyan-400 font-bold">✓</span>
                <span><strong>Citizen Verification Loop:</strong> Before/After photographic slider with community confirmation before permanent ticket closure.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 13-Step Live Demo Story Walkthrough Card */}
      <section className="glass-panel-glow p-8 rounded-3xl border border-cyan-500/40 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold border border-cyan-500/30">
              <Play className="w-3.5 h-3.5 fill-cyan-400" />
              <span>LIVE DEMO WALKTHROUGH READY</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Experience the Complete Citizen-to-Authority Journey
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Civic Lens is pre-seeded with 14 realistic civic issues, 3 active duplicate clusters, audit history, and before/after proofs. You can test the end-to-end demo right now:
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => setRoute('/report')}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-900 font-bold text-sm shadow-md transition-all"
              >
                1. Test Smart Report Page
              </button>
              <button
                onClick={() => setRoute('/map')}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-all"
              >
                2. View Civic Heatmap
              </button>
              <button
                onClick={() => setRoute('/admin')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all"
              >
                3. Open Command Center
              </button>
            </div>
          </div>

          <div className="w-full lg:w-96 glass-panel p-5 rounded-2xl border border-slate-700/80 text-xs space-y-2.5">
            <span className="font-bold text-cyan-400 uppercase tracking-wider block mb-1">
              Sample 13-Step Story Flow
            </span>
            <div className="flex items-center space-x-2 text-slate-300">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">1</span>
              <span>Report: "Huge pothole outside college gate"</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px]">2</span>
              <span>AI analyzes: Road Infrastructure, High Severity</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-[10px]">3</span>
              <span>System finds 8 similar reports → Impact 94/100</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">4</span>
              <span>Admin routes to Public Works → In Progress</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">5</span>
              <span>Before/After photo proof → Citizen verifies → RESOLVED ✓</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
