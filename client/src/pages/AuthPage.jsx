import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, Mail, Lock, Sparkles, Building, ArrowRight } from 'lucide-react';

export default function AuthPage({ setRoute }) {
  const { login, register, loginAsDemo } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('citizen');
  const [department, setDepartment] = useState('Public Works');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register({ name, email, password, role, department });
      } else {
        await login(email, password);
      }
      setRoute('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoRole) => {
    setLoading(true);
    try {
      await loginAsDemo(demoRole);
      setRoute(demoRole === 'authority' ? '/admin' : '/dashboard');
    } catch (e) {
      setError('Failed to log in as demo user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6">
      <div className="glass-panel p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 mb-1">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white">
            {isRegister ? 'Join Civic Lens' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-400">
            {isRegister
              ? 'Become a verified civic contributor to track and solve city problems'
              : 'Sign in to access citizen intelligence and tracking'}
          </p>
        </div>

        {/* 1-Click Demo Login Box (Hackathon Lifesaver) */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-2.5">
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
            ⚡ Quick Demo 1-Click Access
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('citizen')}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-cyan-500/20 text-cyan-300 border border-slate-700 hover:border-cyan-500/40 text-left transition-all"
            >
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>Citizen Alex</span>
                <User className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">240 Contributor pts</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('authority')}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-blue-500/20 text-blue-300 border border-slate-700 hover:border-blue-500/40 text-left transition-all"
            >
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>Admin Sarah</span>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Operations Chief</div>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full"></div>
          <span className="bg-navy-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider">or sign in manually</span>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@civiclens.ai"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Account Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('citizen')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    role === 'citizen'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700'
                  }`}
                >
                  Citizen Contributor
                </button>
                <button
                  type="button"
                  onClick={() => setRole('authority')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    role === 'authority'
                      ? 'bg-blue-600/30 text-blue-300 border-blue-500'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700'
                  }`}
                >
                  City Authority Staff
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2"
          >
            <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle switch */}
        <div className="text-center">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-xs text-cyan-400 hover:underline"
          >
            {isRegister
              ? 'Already have an account? Sign in'
              : "Don't have an account? Create one"}
          </button>
        </div>

      </div>
    </div>
  );
}
