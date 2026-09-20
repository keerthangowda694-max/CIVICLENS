import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ImpactScoreGauge from '../components/common/ImpactScoreGauge';
import {
  MapPin,
  Flame,
  PlusCircle,
  Award,
  ShieldCheck,
  TrendingUp,
  Clock,
  ArrowRight,
  Layers,
  ChevronRight,
  Bot
} from 'lucide-react';

export default function CitizenDashboardPage({ setRoute }) {
  const { user } = useAuth();
  const [areaData, setAreaData] = useState(null);
  const [myIssues, setMyIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'my-reports'

  useEffect(() => {
    Promise.all([
      api.getAreaOverview(user?.area || 'Central City Zone'),
      api.getComplaints({ limit: 6 })
    ])
      .then(([areaRes, complaintsRes]) => {
        setAreaData(areaRes);
        setMyIssues(complaintsRes.complaints || []);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Welcome & Quick Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-bold text-cyan-400 uppercase tracking-wider">CITIZEN INTELLIGENCE PORTAL</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">{user?.area || 'Central City Zone'}</span>
          </div>
          <h1 className="text-3xl font-black text-white mt-1">
            Welcome back, {user?.name || 'Alex Rivera'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track active neighborhood conditions, monitor reported hazards, and earn civic trust points.
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={() => setRoute('/report')}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-white font-black text-sm shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all flex items-center space-x-2 self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report Civic Problem</span>
        </button>
      </div>

      {/* Feature 7: "What's Happening in My Area?" Intelligence Card */}
      <div className="glass-panel-glow p-6 sm:p-8 rounded-3xl border border-cyan-500/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Civic Lens — Your Area ({areaData?.areaName || 'Metro College District'})
              </h2>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Real-time civic sensor overview derived from citizen submissions, spatial cluster correlation, and municipal work logs.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Most Common Problem</span>
                <span className="font-extrabold text-amber-400 text-sm mt-0.5 block">
                  {areaData?.mostCommonIssue || 'Road Infrastructure'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Fastest Growing Issue</span>
                <span className="font-extrabold text-rose-400 text-sm mt-0.5 block">
                  {areaData?.fastestGrowingIssue || 'Garbage Accumulation'}
                </span>
              </div>
            </div>
          </div>

          {/* Area Metric Counters */}
          <div className="grid grid-cols-3 gap-3 w-full lg:w-auto text-center">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 min-w-[100px]">
              <div className="text-3xl font-black text-white">{areaData?.activeIssues || 12}</div>
              <span className="text-[10px] font-bold text-slate-400 uppercase mt-1 block">Active Issues</span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 min-w-[100px]">
              <div className="text-3xl font-black text-rose-400">{areaData?.highImpact || 4}</div>
              <span className="text-[10px] font-bold text-rose-300 uppercase mt-1 block">High Impact</span>
            </div>

            <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 min-w-[100px]">
              <div className="text-3xl font-black text-cyan-400">{areaData?.mediumImpact || 5}</div>
              <span className="text-[10px] font-bold text-cyan-300 uppercase mt-1 block">Medium</span>
            </div>
          </div>

        </div>
      </div>

      {/* Gamified Contributor Points & Badges Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-navy-900 rounded-[14px] flex items-center justify-center text-amber-400 font-black text-xl">
              ★
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Civic Contributor</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                Level 3 Observer
              </span>
            </div>
            <div className="text-2xl font-black text-white mt-0.5">
              {user?.points || 240} Contributor Points
            </div>
            <p className="text-xs text-slate-400">
              Earned through 12 valid reports, 8 helpful verifications & 5 duplicate confirms.
            </p>
          </div>
        </div>

        {/* Badges preview */}
        <div className="flex items-center space-x-2 self-start md:self-auto">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center space-x-1.5 text-xs font-semibold text-slate-300" title="Active Spotter">
            <span>🏙️</span>
            <span>Civic Observer</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center space-x-1.5 text-xs font-semibold text-slate-300" title="Submitted high-fidelity reports">
            <span>🔎</span>
            <span>Issue Spotter</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center space-x-1.5 text-xs font-semibold text-slate-300" title="Participated in verifications">
            <span>🤝</span>
            <span>Community Helper</span>
          </div>
        </div>
      </div>

      {/* Nearby Active Issues Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <span>Active Issues In Your Vicinity</span>
          </h3>
          <button
            onClick={() => setRoute('/issues')}
            className="text-xs text-cyan-400 hover:underline flex items-center space-x-1 font-semibold"
          >
            <span>View All Issues</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myIssues.slice(0, 3).map((item) => (
            <div
              key={item._id}
              onClick={() => setRoute(`/issues/${item._id}`)}
              className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 shadow-lg group"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-800 text-slate-300 border border-slate-700">
                    {item.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                  {item.title}
                </h4>

                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {item.summary || item.description}
                </p>

                <div className="mt-3 flex items-center space-x-1.5 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <ImpactScoreGauge
                  score={item.priorityScore}
                  level={item.priorityLevel}
                  compact={true}
                />
                <span className="text-xs text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center">
                  <span>Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
