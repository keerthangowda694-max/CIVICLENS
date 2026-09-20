import React from 'react';
import {
  Sparkles,
  Bot,
  Layers,
  Network,
  Zap,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Flame,
  ArrowRight,
  Database,
  Cpu,
  Eye,
  Split,
  Award
} from 'lucide-react';

export default function InfoPage({ setRoute }) {
  const pipeline = [
    {
      num: '01',
      title: 'REPORT',
      badge: 'Zero-Friction Capture',
      desc: 'Citizens report issues by typing, using real-time Voice Dictation (Web Speech API), or capturing photo evidence. The system auto-geolocates or pinpoints on an interactive map without requiring tedious 15-field bureaucratic forms.'
    },
    {
      num: '02',
      title: 'UNDERSTAND',
      badge: 'AI Vision & NLP Core',
      desc: 'Multi-modal models inspect the report text and imagery in real-time. The engine automatically extracts: Category, Municipal Department, Hazard Severity, Public Exposure, and generates an executive Synthetic Summary.'
    },
    {
      num: '03',
      title: 'CONNECT',
      badge: 'Spatial Duplicate Clustering',
      desc: 'Instead of discarding repeated citizen reports as duplicate spam, Haversine spatial proximity (≤600m) and semantic analysis correlates complaints into 1 unified Root Issue Cluster, increasing its Report Frequency factor.'
    },
    {
      num: '04',
      title: 'PRIORITIZE',
      badge: '0–100 Civic Impact Score',
      desc: 'Every complaint receives an explainable score from 0 to 100 based on physical severity, commuter transit exposure, cluster report frequency, location criticality (hospitals/schools), and escalation velocity. Scores ≥88 trigger Urgent Hazard alerts.'
    },
    {
      num: '05',
      title: 'ACT',
      badge: 'Municipal Command Center',
      desc: 'City operations dispatch field crews using an algorithmic Priority Queue ("What needs attention first?"). Department chiefs can override AI routing and update lifecycle stages with timestamped audit logs.'
    },
    {
      num: '06',
      title: 'VERIFY & RESOLVE',
      badge: 'Ground-Truth Citizen Loop',
      desc: 'Authorities upload photographic proof of completion. The ticket is NOT silently closed. Citizens inspect the Before/After slider and cast confirmation (✓ Yes, resolved / ⚠ Partially / ✕ Still exists) before permanent closure.'
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold border border-cyan-500/30">
          <Sparkles className="w-4 h-4" />
          <span>PLATFORM INTELLIGENCE & ARCHITECTURE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
          How Civic Lens AI Works
        </h1>
        <p className="text-base text-slate-300 italic">
          “See the Problem. Understand the Impact. Drive the Resolution.”
        </p>
        <p className="text-sm text-slate-400 leading-relaxed">
          Civic Lens AI is an **AI-powered civic issue intelligence platform**, not a basic complaint registration portal. It transforms unstructured citizen observations into structured, prioritized, location-aware intelligence.
        </p>
      </div>

      {/* Core AI Pipeline Breakdown */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Operational Engine</span>
            <h2 className="text-2xl font-black text-white mt-0.5">The 6-Stage Intelligence Pipeline</h2>
          </div>
          <button
            onClick={() => setRoute('/demo')}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-900 font-bold text-xs shadow-md transition-all flex items-center space-x-1"
          >
            <span>Run Interactive Live Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pipeline.map((p, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl font-black text-slate-700 group-hover:text-cyan-400/50 transition-colors">
                    {p.num}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-slate-900 border border-slate-700 text-cyan-300">
                    {p.badge}
                  </span>
                </div>
                <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {p.desc}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 font-medium">
                Stage {idx + 1} of 6 in Civic Lens Lifecycle
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 0-100 Civic Impact Scoring Formula */}
      <div className="glass-panel p-8 rounded-3xl border border-cyan-500/30 shadow-2xl space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            Priority Algorithm
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            The 0–100 Civic Impact Score Model
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Instead of arbitrary High/Medium/Low tags, Civic Lens computes an explainable 0–100 Impact Score evaluating hazard severity, public exposure, and report velocity.
          </p>
        </div>

        {/* 5 Factors Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30">
            <div className="text-2xl font-black text-rose-400">40 PTS</div>
            <span className="text-xs font-bold text-white mt-1 block">Severity</span>
            <p className="text-[10px] text-slate-400 mt-1">Crater depth, electrical danger, burst pipeline.</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30">
            <div className="text-2xl font-black text-amber-400">25 PTS</div>
            <span className="text-xs font-bold text-white mt-1 block">Public Exposure</span>
            <p className="text-[10px] text-slate-400 mt-1">Transit corridor, arterial bus lanes, footfall.</p>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30">
            <div className="text-2xl font-black text-cyan-400">20 PTS</div>
            <span className="text-xs font-bold text-white mt-1 block">Cluster Frequency</span>
            <p className="text-[10px] text-slate-400 mt-1">Escalates with every corroborated report.</p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30">
            <div className="text-2xl font-black text-blue-400">10 PTS</div>
            <span className="text-xs font-bold text-white mt-1 block">Location Importance</span>
            <p className="text-[10px] text-slate-400 mt-1">Proximity to schools, hospitals, emergency care.</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
            <div className="text-2xl font-black text-emerald-400">5 PTS</div>
            <span className="text-xs font-bold text-white mt-1 block">Recency</span>
            <p className="text-[10px] text-slate-400 mt-1">Rapid growth rate over last 24–48 hours.</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
          <span className="font-semibold text-white">Threshold Escapes:</span>
          <span className="text-amber-400 font-bold">≥70 = HIGH PRIORITY</span>
          <span className="text-rose-400 font-bold">≥88 = ⚠ URGENT CIVIC HAZARD</span>
          <span className="text-slate-400">&lt;40 = LOW IMPACT</span>
        </div>
      </div>

      {/* Dual-Engine Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-cyan-400">
            <Cpu className="w-5 h-5" />
            <h3 className="text-lg font-bold text-white">Google Gemini AI Core</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            When configured with a Gemini API key, the platform utilizes Gemini 1.5 Flash via native REST protocols for multi-modal computer vision and advanced semantic reasoning, identifying road fractures and sanitary hazards with high confidence.
          </p>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            Model: <strong className="text-white">gemini-1.5-flash</strong> • Latency: ~800ms
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-teal-400">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="text-lg font-bold text-white">Deterministic Fallback Intelligence</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            If an AI API key is omitted, offline, or rate-limited, Civic Lens automatically activates its heuristic spatial clustering and token-similarity engine. Hackathon demos never fail and never freeze.
          </p>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            Engine: <strong className="text-white">Civic Deterministic Core</strong> • Uptime: 100%
          </div>
        </div>

      </div>

      {/* CTA Bottom */}
      <div className="text-center p-8 glass-panel-glow rounded-3xl border border-cyan-500/40 space-y-4">
        <h3 className="text-2xl font-black text-white">Ready to Explore Civic Lens in Action?</h3>
        <p className="text-xs text-slate-300 max-w-lg mx-auto">
          Walk through the complete 13-step citizen-to-authority journey with pre-seeded data.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setRoute('/demo')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-white font-bold text-sm shadow-xl transition-all"
          >
            Open Live Demo Walkthrough
          </button>
          <button
            onClick={() => setRoute('/report')}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all"
          >
            Report an Issue
          </button>
        </div>
      </div>

    </div>
  );
}
