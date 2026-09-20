import React from 'react';
import { ShieldAlert, Zap, HelpCircle, Info } from 'lucide-react';

export default function ImpactScoreGauge({
  score = 87,
  level = 'HIGH',
  factors = {},
  onExplainClick,
  compact = false
}) {
  const f = {
    severity: factors?.severity ?? 32,
    publicExposure: factors?.publicExposure ?? 20,
    reportFrequency: factors?.reportFrequency ?? 18,
    locationImportance: factors?.locationImportance ?? 8,
    recency: factors?.recency ?? 5,
  };

  const getScoreColor = (val) => {
    if (val >= 85) return 'from-rose-500 to-amber-500 text-rose-400 border-rose-500/40 bg-rose-500/10';
    if (val >= 70) return 'from-amber-500 to-yellow-400 text-amber-400 border-amber-500/40 bg-amber-500/10';
    if (val >= 40) return 'from-cyan-500 to-blue-500 text-cyan-400 border-cyan-500/40 bg-cyan-500/10';
    return 'from-slate-400 to-slate-500 text-slate-400 border-slate-600 bg-slate-800/40';
  };

  const levelColor = level === 'URGENT' 
    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
    : level === 'HIGH'
    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
    : level === 'MEDIUM'
    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
    : 'bg-slate-700/40 text-slate-300 border-slate-600';

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <div className={`px-2.5 py-1 rounded-lg border font-black text-sm ${getScoreColor(score)} flex items-center space-x-1.5`}>
          <Zap className="w-3.5 h-3.5" />
          <span>{score}</span>
          <span className="text-[10px] opacity-70">/100</span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${levelColor}`}>
          {level}
        </span>
      </div>
    );
  }

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-700/80 shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            AI Civic Impact Engine
          </span>
          <h4 className="text-base font-extrabold text-white flex items-center gap-1.5">
            Civic Impact Score
          </h4>
        </div>
        
        {onExplainClick && (
          <button
            onClick={onExplainClick}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-semibold transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Why?</span>
          </button>
        )}
      </div>

      {/* Main Score Display */}
      <div className="my-4 flex items-center justify-between">
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            {score}
          </span>
          <span className="text-lg font-semibold text-slate-400">/ 100</span>
        </div>
        
        <div className="text-right">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border shadow-md ${levelColor}`}>
            {level === 'URGENT' ? '⚠ URGENT CIVIC HAZARD' : `${level} IMPACT`}
          </span>
          <p className="text-[10px] text-slate-400 mt-1">Multi-factor algorithmic priority</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-5">
        <div
          className={`h-full bg-gradient-to-r ${getScoreColor(score)} transition-all duration-700`}
          style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
        ></div>
      </div>

      {/* 5-Metric Breakdown */}
      <div className="space-y-2.5 pt-2 border-t border-slate-800/80 text-xs">
        
        {/* Severity */}
        <div>
          <div className="flex justify-between text-slate-300 mb-1">
            <span className="font-medium">Hazard Severity</span>
            <span className="font-bold text-white">{f.severity} / 40</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: `${(f.severity / 40) * 100}%` }}></div>
          </div>
        </div>

        {/* Public Exposure */}
        <div>
          <div className="flex justify-between text-slate-300 mb-1">
            <span className="font-medium">Public Exposure & Transit Flow</span>
            <span className="font-bold text-white">{f.publicExposure} / 25</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(f.publicExposure / 25) * 100}%` }}></div>
          </div>
        </div>

        {/* Report Frequency */}
        <div>
          <div className="flex justify-between text-slate-300 mb-1">
            <span className="font-medium">Report Frequency & Cluster Velocity</span>
            <span className="font-bold text-white">{f.reportFrequency} / 20</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${(f.reportFrequency / 20) * 100}%` }}></div>
          </div>
        </div>

        {/* Location Importance */}
        <div>
          <div className="flex justify-between text-slate-300 mb-1">
            <span className="font-medium">Location Importance (Schools/Hospitals)</span>
            <span className="font-bold text-white">{f.locationImportance} / 10</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-400 h-full rounded-full" style={{ width: `${(f.locationImportance / 10) * 100}%` }}></div>
          </div>
        </div>

        {/* Recency */}
        <div>
          <div className="flex justify-between text-slate-300 mb-1">
            <span className="font-medium">Incident Recency & Escalation</span>
            <span className="font-bold text-white">{f.recency} / 5</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${(f.recency / 5) * 100}%` }}></div>
          </div>
        </div>

      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <Info className="w-3 h-3 text-cyan-400" />
          Prototype scoring model (0–100)
        </span>
        <span className="text-slate-400">Target SLA: 24h</span>
      </div>

    </div>
  );
}
