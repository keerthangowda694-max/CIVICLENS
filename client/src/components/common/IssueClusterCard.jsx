import React from 'react';
import { Network, Layers, Sparkles, FileText, Image, MapPin, ArrowRight } from 'lucide-react';

export default function IssueClusterCard({
  clusterTitle = 'Main Road Pothole Cluster',
  reportCount = 8,
  similarityScore = 89,
  category = 'Road Infrastructure',
  location = 'College Gate, North Blvd',
  relatedReports = []
}) {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 shadow-xl relative overflow-hidden">
      
      {/* Background radial accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
              DUPLICATE INTELLIGENCE
            </span>
            <h4 className="text-sm font-bold text-white">Intelligent Issue Cluster</h4>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-black text-xs border border-cyan-500/30">
            {similarityScore}% similarity
          </span>
          <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs border border-blue-500/30">
            {reportCount} connected reports
          </span>
        </div>
      </div>

      {/* Cluster Tree Diagram */}
      <div className="my-5 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center relative">
        
        {/* Top Node (Underlying Issue) */}
        <div className="inline-block px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-black text-xs sm:text-sm shadow-lg shadow-cyan-500/20 border border-cyan-400/40">
          <div className="text-[10px] uppercase opacity-80 font-normal">1 UNDERLYING ROOT ISSUE</div>
          <div>{clusterTitle}</div>
        </div>

        {/* Tree Connector Lines */}
        <div className="flex justify-center my-2">
          <div className="w-0.5 h-6 bg-cyan-500/50"></div>
        </div>

        <div className="relative max-w-sm mx-auto">
          <div className="border-t-2 border-cyan-500/40 w-full mb-3"></div>
          
          {/* Child Report Nodes */}
          <div className="grid grid-cols-3 gap-2">
            
            {/* Report 1 */}
            <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-center">
              <div className="text-[10px] text-cyan-400 font-bold">Report #1</div>
              <div className="flex justify-center my-1 text-slate-300">
                <Image className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="text-[10px] text-slate-400">Photo Proof</div>
            </div>

            {/* Report 2 */}
            <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-center">
              <div className="text-[10px] text-cyan-400 font-bold">Report #2</div>
              <div className="flex justify-center my-1 text-slate-300">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-[10px] text-slate-400">Citizen Text</div>
            </div>

            {/* Report 3 */}
            <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-center">
              <div className="text-[10px] text-cyan-400 font-bold">Report #3</div>
              <div className="flex justify-center my-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <div className="text-[10px] text-slate-400">GPS Pinpoint</div>
            </div>

          </div>
        </div>

      </div>

      {/* Differentiator Explanation */}
      <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-300 leading-relaxed">
        <p className="font-semibold text-white mb-1">Why Clustering Matters:</p>
        <p>
          Instead of discarding repeated citizen reports as duplicate spam, Civic Lens correlates them into a unified cluster. Each corroborating citizen report boosts the **Report Frequency** metric, elevating its urgency in the municipal queue.
        </p>
      </div>

    </div>
  );
}
