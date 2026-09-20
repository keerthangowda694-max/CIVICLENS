import React from 'react';
import { X, Sparkles, CheckCircle, ShieldAlert, Zap, TrendingUp, AlertTriangle } from 'lucide-react';

export default function WhyExplanationModal({
  isOpen,
  onClose,
  issueTitle,
  priorityLevel = 'HIGH',
  priorityScore = 87,
  reasons = [],
  factors = {},
  isFallback = false
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-navy-900/80 backdrop-blur-md transition-opacity"
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-lg glass-panel-glow bg-navy-900 rounded-2xl border border-cyan-500/40 p-6 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Glow corner accent */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI Prioritization Explanation</h3>
              <p className="text-xs text-cyan-400 font-medium">Explainable Civic Intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Issue Target */}
        <div className="my-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Incident</span>
          <p className="text-sm font-semibold text-white mt-0.5">{issueTitle || 'Main Road Infrastructure Hazard'}</p>
          <div className="mt-2 flex items-center space-x-3 text-xs">
            <span className="font-bold text-cyan-400">Impact Score: {priorityScore}/100</span>
            <span className="text-slate-500">•</span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              {priorityLevel} PRIORITY
            </span>
          </div>
        </div>

        {/* Core Question & Answer */}
        <div className="space-y-3 my-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Why is this rated {priorityLevel} priority?
          </h4>

          <div className="space-y-2">
            {reasons && reasons.length > 0 ? (
              reasons.map((reason, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 text-xs text-slate-200"
                >
                  <span className="font-black text-cyan-400 mt-0.5 text-sm">+</span>
                  <span className="leading-relaxed">{reason}</span>
                </div>
              ))
            ) : (
              <>
                <div className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 text-xs text-slate-200">
                  <span className="font-black text-rose-400 mt-0.5 text-sm">+</span>
                  <span>High physical severity index endangering commuter safety and vehicle axles</span>
                </div>
                <div className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 text-xs text-slate-200">
                  <span className="font-black text-cyan-400 mt-0.5 text-sm">+</span>
                  <span>Multiple corroborating citizen reports clustered in the same 150m perimeter</span>
                </div>
                <div className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 text-xs text-slate-200">
                  <span className="font-black text-amber-400 mt-0.5 text-sm">+</span>
                  <span>High public exposure factor along primary arterial transit route</span>
                </div>
                <div className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 text-xs text-slate-200">
                  <span className="font-black text-emerald-400 mt-0.5 text-sm">+</span>
                  <span>Recent reports velocity accelerating over the last 24-48 hours</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Engine Transparency Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            {isFallback ? 'Deterministic Civic Heuristics' : 'Gemini 1.5 Flash + Spatial Core'}
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
