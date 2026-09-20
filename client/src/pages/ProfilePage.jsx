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
  LogOut,
  ChevronRight,
  TrendingUp,
  FileText,
  Mail,
  Building,
  Key
} from 'lucide-react';

export default function ProfilePage({ setRoute }) {
  const { user, logout, loginAsDemo } = useAuth();
  const [userReports, setUserReports] = useState([]);
  const [activeTab, setActiveTab] = useState('reputation'); // 'reputation' | 'reports' | 'verifications' | 'credentials'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getComplaints({ limit: 10 })
      .then((data) => {
        setUserReports(data.complaints || []);
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
              <span className="text-slate-600">•</span>
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>{user?.email || 'citizen@civiclens.ai'}</span>
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

      {/* Tabs Row */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-1 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('reputation')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'reputation'
              ? 'bg-cyan-500 text-navy-900 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Reputation & Badges
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'reports'
              ? 'bg-cyan-500 text-navy-900 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          My Submissions ({userReports.length})
        </button>
        <button
          onClick={() => setActiveTab('credentials')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'credentials'
              ? 'bg-cyan-500 text-navy-900 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Account & Demo Switcher
        </button>
      </div>

      {/* Tab 1: Reputation & Badges */}
      {activeTab === 'reputation' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
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

        </div>
      )}

      {/* Tab 2: My Submissions */}
      {activeTab === 'reports' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white">Your Reported Incidents</h3>
            <button onClick={() => setRoute('/report')} className="text-xs text-cyan-400 font-bold hover:underline">
              + Report New Incident
            </button>
          </div>

          <div className="space-y-3">
            {userReports.map((r) => (
              <div
                key={r._id}
                onClick={() => setRoute(`/issues/${r._id}`)}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-colors cursor-pointer flex items-center justify-between text-xs group"
              >
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase">{r.category}</span>
                    <span className="text-slate-600">•</span>
                    <span className="px-2 py-0.2 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">
                      {r.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {r.title}
                  </h4>
                  <span className="text-slate-500 mt-0.5 block">{r.location}</span>
                </div>
                <div className="text-right">
                  <div className="text-base font-black text-amber-400">{r.priorityScore}</div>
                  <span className="text-[10px] text-slate-500">/ 100 Impact</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Account & Demo Switcher */}
      {activeTab === 'credentials' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 animate-in fade-in duration-200">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400" />
            <span>Account Details & Demo Switching</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Current Logged-in User</span>
              <p className="text-sm font-bold text-white">{user?.name || 'Alex Rivera'}</p>
              <p className="text-slate-400">{user?.email || 'citizen@civiclens.ai'}</p>
              <span className="inline-block mt-2 px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold uppercase text-[10px]">
                {user?.role || 'Citizen'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Quick Role Switcher</span>
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => loginAsDemo('citizen')}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-cyan-500/20 text-cyan-300 border border-slate-700 text-left font-semibold text-xs flex items-center justify-between"
                >
                  <span>Switch to Alex Rivera (Citizen)</span>
                  <User className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => loginAsDemo('authority')}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-blue-500/20 text-blue-300 border border-slate-700 text-left font-semibold text-xs flex items-center justify-between"
                >
                  <span>Switch to Sarah Jenkins (Admin)</span>
                  <ShieldCheck className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                logout();
                setRoute('/login');
              }}
              className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center space-x-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out of Account</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
