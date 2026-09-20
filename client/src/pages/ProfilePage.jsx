import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Clock,
  Sparkles,
  User,
  Heart,
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';

export default function ProfilePage({ setRoute }) {
  const { user } = useAuth();
  const [userReports, setUserReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getComplaints({ limit: 10 })
      .then((data) => {
        setUserReports(data.complaints?.slice(0, 4) || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const badges = [
    {
      icon: '🏙️',
      name: 'Civic Observer',
      tier: 'Level 1',
      desc: 'Active observer of urban infrastructure conditions.',
      earned: true,
    },
    {
      icon: '🔎',
      name: 'Issue Spotter',
      tier: 'Level 2',
      desc: 'Submitted 10+ high-fidelity verified civic reports with photo evidence.',
      earned: true,
    },
    {
      icon: '🤝',
      name: 'Community Helper',
      tier: 'Level 3',
      desc: 'Participated in ground-truth resolution verifications for municipal tickets.',
      earned: true,
    },
    {
      icon: '🌟',
      name: 'Master Guardian',
      tier: 'Level 4',
      desc: 'Top 5% contributor across metropolitan district.',
      earned: false,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Profile Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-teal-400 p-1 shadow-xl shadow-cyan-500/25 flex-shrink-0">
            <div className="w-full h-full bg-navy-900 rounded-[22px] flex items-center justify-center text-white font-black text-2xl">
              {user?.name?.charAt(0) || 'A'}
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-black text-cyan-400 uppercase tracking-wider">
                CIVIC CONTRIBUTOR PROFILE
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 capitalize">{user?.role || 'Citizen'}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {user?.name || 'Alex Rivera'}
            </h1>
            
            <p className="text-xs text-slate-400 mt-1 flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{user?.area || 'Metro University District'}</span>
            </p>
          </div>
        </div>

        {/* Contributor Score Meter */}
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 text-center min-w-[200px]">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
            Civic Trust Score
          </span>
          <div className="text-4xl font-black text-white mt-1">
            {user?.points || 240}
          </div>
          <span className="text-xs font-semibold text-amber-300">
            Contributor Points
          </span>
        </div>
      </div>

      {/* Point Earning Breakdown */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Non-Punitive Contribution Model</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-emerald-400 font-black text-lg">+10 PTS</div>
            <span className="font-bold text-white block mt-0.5">Valid Civic Report</span>
            <p className="text-slate-400 text-[11px] mt-1">Accurate text, photo evidence, and location observation.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-cyan-400 font-black text-lg">+5 PTS</div>
            <span className="font-bold text-white block mt-0.5">Duplicate Confirmation</span>
            <p className="text-slate-400 text-[11px] mt-1">Confirming existing cluster to boost resolution urgency.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-purple-400 font-black text-lg">+5 PTS</div>
            <span className="font-bold text-white block mt-0.5">Resolution Verification</span>
            <p className="text-slate-400 text-[11px] mt-1">Ground-truth inspection after municipal work completion.</p>
          </div>
        </div>
      </div>

      {/* Gamification Badges Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>Earned Civic Recognition Badges</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border transition-all ${
                badge.earned
                  ? 'glass-panel border-cyan-500/30 shadow-lg'
                  : 'bg-slate-900/40 border-slate-800/80 opacity-50'
              }`}
            >
              <div className="text-3xl mb-3">{badge.icon}</div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-white">{badge.name}</h4>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400">
                  {badge.tier}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{badge.desc}</p>
              {badge.earned && (
                <div className="mt-3 text-[10px] text-emerald-400 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Unlocked & Verified</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Submissions Activity */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Recent Activity & Submissions
          </h3>
          <button onClick={() => setRoute('/issues')} className="text-xs text-cyan-400 hover:underline">
            View all
          </button>
        </div>

        <div className="space-y-3">
          {userReports.map((r) => (
            <div
              key={r._id}
              onClick={() => setRoute(`/issues/${r._id}`)}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors cursor-pointer flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-white">{r.title}</span>
                <span className="text-slate-500 ml-2">({r.location})</span>
              </div>
              <span className="text-cyan-400 font-bold">Impact: {r.priorityScore}/100</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
