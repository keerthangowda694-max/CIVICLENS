import React, { useState } from 'react';
import { CheckCircle2, Clock, Split, Eye } from 'lucide-react';

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  isVerified = false,
  verifiedVotes = 0,
  resolvedAt,
  notes
}) {
  const [sliderPos, setSliderPos] = useState(50);
  const [viewMode, setViewMode] = useState('slider'); // 'slider' | 'side-by-side'

  const fallbackBefore = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';
  const fallbackAfter = 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80';

  const bImg = beforeImage || fallbackBefore;
  const aImg = afterImage || fallbackAfter;

  const handleSliderMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPos(percent);
  };

  const handleTouchMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPos(percent);
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-700/80 overflow-hidden shadow-2xl">
      
      {/* Header */}
      <div className="px-5 py-3.5 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Split className="w-4 h-4 text-cyan-400" />
          <h4 className="text-sm font-bold text-white">Before / After Ground-Truth Proof</h4>
        </div>

        <div className="flex items-center space-x-2">
          {isVerified ? (
            <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Resolution Verified ({verifiedVotes} votes)</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold animate-pulse">
              <Clock className="w-3.5 h-3.5" />
              <span>Awaiting Citizen Verification</span>
            </span>
          )}

          <div className="bg-slate-900 rounded-lg p-0.5 border border-slate-700 text-xs flex">
            <button
              onClick={() => setViewMode('slider')}
              className={`px-2 py-1 rounded ${viewMode === 'slider' ? 'bg-cyan-500 text-navy-900 font-bold' : 'text-slate-400'}`}
            >
              Slider
            </button>
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-2 py-1 rounded ${viewMode === 'side-by-side' ? 'bg-cyan-500 text-navy-900 font-bold' : 'text-slate-400'}`}
            >
              Split
            </button>
          </div>
        </div>
      </div>

      {/* Main Image Container */}
      {viewMode === 'slider' ? (
        <div
          className="relative w-full h-80 sm:h-96 select-none cursor-ew-resize overflow-hidden bg-slate-950"
          onMouseMove={handleSliderMove}
          onTouchMove={handleTouchMove}
        >
          {/* AFTER (Background) */}
          <img
            src={aImg}
            alt="After Resolution"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold backdrop-blur-md shadow-lg">
            AFTER: RESOLVED
          </div>

          {/* BEFORE (Foreground with clip-path) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src={bImg}
              alt="Before Citizen Report"
              className="absolute inset-0 w-full h-full object-cover max-w-none"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-md bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-bold backdrop-blur-md shadow-lg">
              BEFORE: CITIZEN REPORT
            </div>
          </div>

          {/* Slider Line & Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl pointer-events-none z-20 flex items-center justify-center"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="w-8 h-8 rounded-full bg-cyan-500 text-navy-900 border-2 border-white flex items-center justify-center shadow-2xl">
              <Split className="w-4 h-4 rotate-90" />
            </div>
          </div>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-navy-900/80 backdrop-blur-md border border-slate-700 text-[11px] text-slate-300 pointer-events-none">
            Drag slider left or right to inspect resolution proof
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-950">
          <div className="relative h-64 rounded-xl overflow-hidden border border-rose-500/30">
            <img src={bImg} alt="Before" className="w-full h-full object-cover" />
            <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded bg-rose-900/90 text-rose-200 text-xs font-bold">
              BEFORE
            </span>
          </div>
          <div className="relative h-64 rounded-xl overflow-hidden border border-emerald-500/30">
            <img src={aImg} alt="After" className="w-full h-full object-cover" />
            <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded bg-emerald-900/90 text-emerald-200 text-xs font-bold">
              AFTER (COMPLETED)
            </span>
          </div>
        </div>
      )}

      {/* Proof Notes */}
      {notes && (
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 text-xs text-slate-300 flex items-start space-x-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold text-white">Authority Work Summary: </span>
            <span>{notes}</span>
            {resolvedAt && (
              <span className="text-slate-500 ml-2">
                (Completed on {new Date(resolvedAt).toLocaleDateString()})
              </span>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
