import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Play,
  CheckCircle2,
  Sparkles,
  User,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Flame,
  MapPin,
  Bot,
  Split,
  Award,
  Zap,
  Network
} from 'lucide-react';

export default function DemoPage({ setRoute }) {
  const { user, loginAsDemo } = useAuth();
  const [completedSteps, setCompletedSteps] = useState([1]);

  const toggleStep = (stepNumber) => {
    setCompletedSteps(prev => 
      prev.includes(stepNumber) 
        ? prev.filter(s => s !== stepNumber) 
        : [...prev, stepNumber]
    );
  };

  const steps = [
    {
      num: 1,
      title: 'Open Civic Lens Home',
      role: 'Citizen',
      desc: 'Inspect the landing page hero, core 6-stage AI pipeline diagram, and real-time metropolitan metric counters.',
      actionLabel: 'Go to Landing Page',
      targetPath: '/'
    },
    {
      num: 2,
      title: 'File Citizen Observation',
      role: 'Citizen',
      desc: 'Open the Smart Report page. Dictate or type natural language: "Huge pothole near the college gate. Vehicles are braking suddenly."',
      actionLabel: 'Open Smart Report',
      targetPath: '/report'
    },
    {
      num: 3,
      title: 'Inspect Live AI Extraction',
      role: 'AI Core',
      desc: 'Watch the real-time AI card parse Category (Road Infrastructure), Department (Public Works), Severity (High), and Risk Hazards.',
      actionLabel: 'Test AI Preview on Report Page',
      targetPath: '/report'
    },
    {
      num: 4,
      title: 'Submit to Intelligence Pipeline',
      role: 'Citizen',
      desc: 'Click Submit. Spatial correlation checks for duplicate clusters and assigns the initial Civic Impact Score.',
      actionLabel: 'Submit on Report Page',
      targetPath: '/report'
    },
    {
      num: 5,
      title: 'Inspect Issue Intelligence & Timeline',
      role: 'Citizen',
      desc: 'View the vertical audit timeline: Reported → AI Classified → 8 Clustered Reports → Priority Assigned.',
      actionLabel: 'View Star Pothole Issue',
      targetPath: '/issues/civic-1042'
    },
    {
      num: 6,
      title: 'Click "Why?" on Impact Score Gauge',
      role: 'AI Core',
      desc: 'Open the Explainable AI modal detailing why this issue received a high 94/100 score (depth, vehicle damage, transit exposure).',
      actionLabel: 'Inspect Issue Scorecard',
      targetPath: '/issues/civic-1042'
    },
    {
      num: 7,
      title: 'Examine Duplicate Cluster Diagram',
      role: 'AI Core',
      desc: 'See how 8 separate citizen reports are connected into 1 underlying Root Issue Cluster with 89% similarity.',
      actionLabel: 'View Cluster Diagram',
      targetPath: '/issues/civic-1042'
    },
    {
      num: 8,
      title: 'Explore the Civic Heatmap',
      role: 'Citizen / Admin',
      desc: 'Switch between Pin Markers and Hotspot Heatmap mode to visualize spatial problem density across the city.',
      actionLabel: 'Open Civic Heatmap',
      targetPath: '/map'
    },
    {
      num: 9,
      title: 'Switch to Sarah (Operations Chief)',
      role: 'Authority',
      desc: 'Use the navbar quick-switch button to log in as Authority Staff Sarah Jenkins.',
      actionLabel: 'Open Command Center',
      targetPath: '/admin'
    },
    {
      num: 10,
      title: 'Check Municipal Priority Queue',
      role: 'Authority',
      desc: 'Inspect "What needs attention first?" sorted strictly by algorithmic Civic Impact Score rather than flat timestamps.',
      actionLabel: 'View Priority Queue',
      targetPath: '/admin'
    },
    {
      num: 11,
      title: 'Inspect Before / After Resolution Proof',
      role: 'Citizen / Authority',
      desc: 'Drag the interactive before/after slider comparing original citizen report photo vs authority completed road resurfacing.',
      actionLabel: 'Inspect Before/After Slider',
      targetPath: '/issues/civic-1043'
    },
    {
      num: 12,
      title: 'Submit Ground-Truth Verification',
      role: 'Citizen',
      desc: 'Vote: "✓ Yes, Resolved". Confirming resolution triggers permanent ticket closure and awards +5 Contributor Points.',
      actionLabel: 'Cast Citizen Vote',
      targetPath: '/issues/civic-1046'
    },
    {
      num: 13,
      title: 'Query ✨ AI Civic Copilot',
      role: 'Citizen / Admin',
      desc: 'Open the floating assistant or full copilot page. Ask: "What is happening near me?" or "Show unresolved road issues".',
      actionLabel: 'Ask Civic Copilot',
      targetPath: '/assistant'
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold border border-cyan-500/30">
          <Play className="w-4 h-4 fill-cyan-400" />
          <span>HACKATHON DEMO MASTER GUIDE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Interactive Live Demo Guide
        </h1>
        <p className="text-sm text-slate-300">
          Follow this 13-step sequence to demonstrate the entire end-to-end civic intelligence lifecycle to judges.
        </p>
      </div>

      {/* 1-Click Role Switcher Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Current Active Persona
          </span>
          <div className="flex items-center space-x-2 mt-1">
            <div className={`w-3 h-3 rounded-full ${user?.role === 'authority' ? 'bg-blue-500' : 'bg-cyan-400'} animate-pulse`}></div>
            <span className="text-lg font-black text-white">{user?.name || 'Alex Rivera'}</span>
            <span className="text-xs px-2 py-0.5 rounded font-bold uppercase bg-slate-800 text-cyan-300 border border-slate-700">
              {user?.role || 'citizen'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Switch roles to test both the citizen observation loop and the municipal command queue.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => loginAsDemo('citizen')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              user?.role === 'citizen'
                ? 'bg-cyan-500 text-navy-900 shadow-md shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Switch to Alex (Citizen)</span>
          </button>

          <button
            onClick={() => loginAsDemo('authority')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              user?.role === 'authority'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Switch to Sarah (Admin)</span>
          </button>
        </div>
      </div>

      {/* Pre-Loaded Quick Scenario Launchers */}
      <div className="space-y-4">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Pre-Configured Demo Scenarios (1-Click Launchers)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Scenario 1 */}
          <div className="glass-panel p-5 rounded-2xl border border-rose-500/30 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-rose-400 uppercase">Scenario A • Urgent Hazard</span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-black">
                  94/100
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-white">University Gate Road Crater</h4>
              <p className="text-xs text-slate-400 mt-1">
                Deep pothole causing buses to brake suddenly. Correlates 8 reports into 1 cluster.
              </p>
            </div>
            <button
              onClick={() => setRoute('/issues/civic-1042')}
              className="w-full py-2 rounded-xl bg-rose-600/80 hover:bg-rose-500 text-white font-bold text-xs transition-all flex items-center justify-center space-x-1"
            >
              <span>Launch Scenario A</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Scenario 2 */}
          <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-amber-400 uppercase">Scenario B • Commercial Cluster</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-black">
                  82/100
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-white">Central Market Waste Dump</h4>
              <p className="text-xs text-slate-400 mt-1">
                Overflowing commercial trash bins spilling onto pedestrian thoroughfare. 5 reports.
              </p>
            </div>
            <button
              onClick={() => setRoute('/issues/civic-1045')}
              className="w-full py-2 rounded-xl bg-amber-600/80 hover:bg-amber-500 text-white font-bold text-xs transition-all flex items-center justify-center space-x-1"
            >
              <span>Launch Scenario B</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Scenario 3 */}
          <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-emerald-400 uppercase">Scenario C • Before/After Proof</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-black">
                  VERIFIED
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-white">5th Main Utility Trench</h4>
              <p className="text-xs text-slate-400 mt-1">
                Completed road resurfacing with interactive drag slider comparing Before vs After.
              </p>
            </div>
            <button
              onClick={() => setRoute('/issues/civic-1043')}
              className="w-full py-2 rounded-xl bg-emerald-600/80 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center justify-center space-x-1"
            >
              <span>Launch Scenario C</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* 13-Step Interactive Walkthrough Checklist */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-white">13-Step Live Demo Checklist</h3>
            <p className="text-xs text-slate-400">Click any step to navigate directly to that part of the application.</p>
          </div>
          <span className="text-xs font-bold text-cyan-400">
            {completedSteps.length} of 13 steps reviewed
          </span>
        </div>

        <div className="space-y-3">
          {steps.map((s) => {
            const isDone = completedSteps.includes(s.num);
            return (
              <div
                key={s.num}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isDone
                    ? 'bg-slate-900/80 border-cyan-500/40'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <button
                    onClick={() => toggleStep(s.num)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 transition-colors ${
                      isDone
                        ? 'bg-cyan-500 text-navy-900'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-cyan-400'
                    }`}
                  >
                    {isDone ? '✓' : s.num}
                  </button>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-white">{s.title}</h4>
                      <span className="text-[10px] px-2 py-0.2 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                        {s.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    toggleStep(s.num);
                    setRoute(s.targetPath);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-navy-900 text-cyan-400 font-bold text-xs border border-slate-700 transition-all flex items-center space-x-1 self-start sm:self-center whitespace-nowrap"
                >
                  <span>{s.actionLabel}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
