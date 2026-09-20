import React from 'react';
import { AlertTriangle, ShieldAlert, ArrowUpRight } from 'lucide-react';

export default function EmergencyBanner({
  score = 94,
  issueTitle = 'Severe Road Collapse',
  onActionClick
}) {
  if (score < 88) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-950/80 via-red-900/60 to-navy-900 border border-rose-500/50 p-4 shadow-2xl animate-pulse-slow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex items-start space-x-3">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-6 h-6 text-rose-400 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black tracking-wider uppercase px-2 py-0.5 rounded bg-rose-500 text-white shadow-sm">
                ⚠ URGENT CIVIC ISSUE
              </span>
              <span className="text-xs text-rose-300 font-bold">
                Impact Score: {score}/100
              </span>
            </div>
            <h4 className="text-base font-extrabold text-white mt-1">
              High Impact Risk: {issueTitle}
            </h4>
            <p className="text-xs text-rose-200/80 mt-0.5">
              Recommended Operational Action: <strong className="text-white">Immediate Priority Dispatch & Safety Barricading</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 flex-shrink-0">
          <span className="text-[10px] text-slate-400 max-w-[140px] hidden md:inline-block leading-tight">
            Prototype operational alert (non-emergency 911)
          </span>
          {onActionClick && (
            <button
              onClick={onActionClick}
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs shadow-lg shadow-rose-500/30 transition-all flex items-center space-x-1"
            >
              <span>Escalate Dispatch</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
