import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Sparkles, User, ShieldCheck, ArrowRight, CheckCircle2, Play } from 'lucide-react';

export default function LoginPage({ setRoute }) {
  const { login, loginAsDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      setRoute('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role) => {
    setLoading(true);
    try {
      await loginAsDemo(role);
      setRoute(role === 'authority' ? '/admin' : '/dashboard');
    } catch (e) {
      setError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-12 px-4 sm:px-6 space-y-6">
      
      {/* Top Card */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 mx-auto flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white">Sign In to Civic Lens</h1>
          <p className="text-xs text-slate-400">
            Access your civic intelligence dashboard, track issues, and earn contributor reputation.
          </p>
        </div>

        {/* 1-Click Instant Demo Login Banner */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Play className="w-3 h-3 fill-cyan-400" />
              1-Click Demo Logins (Instant Access)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
              NO TYPING NEEDED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleDemo('citizen')}
              className="p-3 rounded-xl bg-slate-800 hover:bg-cyan-500/20 text-cyan-300 border border-slate-700 hover:border-cyan-500/50 text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-cyan-300">Alex Rivera</span>
                <User className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Citizen • 240 Points</p>
              <div className="mt-1 text-[10px] text-cyan-400 font-semibold">Click to enter as Citizen →</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemo('authority')}
              className="p-3 rounded-xl bg-slate-800 hover:bg-blue-500/20 text-blue-300 border border-slate-700 hover:border-blue-500/50 text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-blue-300">Sarah Jenkins</span>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Authority • Operations Chief</p>
              <div className="mt-1 text-[10px] text-blue-400 font-semibold">Click to enter as Admin →</div>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full"></div>
          <span className="bg-navy-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider">or sign in with email</span>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@civiclens.ai"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Links to Register and Demo */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <button
            onClick={() => setRoute('/register')}
            className="text-cyan-400 hover:underline font-semibold"
          >
            Create New Account →
          </button>

          <button
            onClick={() => setRoute('/demo')}
            className="text-slate-400 hover:text-white flex items-center gap-1"
          >
            <Play className="w-3 h-3 text-cyan-400" />
            <span>Interactive Demo Guide</span>
          </button>
        </div>

      </div>

    </div>
  );
}
