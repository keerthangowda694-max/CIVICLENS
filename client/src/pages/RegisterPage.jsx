import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Sparkles, Building, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function RegisterPage({ setRoute }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('citizen');
  const [area, setArea] = useState('Central City Zone');
  const [department, setDepartment] = useState('Public Works');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ name, email, password, role, area, department });
      setRoute('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-12 px-4 sm:px-6 space-y-6">
      
      <div className="glass-panel p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-400 p-0.5 mx-auto flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <User className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white">Join Civic Lens AI</h1>
          <p className="text-xs text-slate-400">
            Empower your neighborhood with transparent, AI-prioritized civic resolution.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Select Account Purpose</label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setRole('citizen')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  role === 'citizen'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 font-bold shadow-md'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <div className="text-xs font-bold text-white">Citizen Observer</div>
                <p className="text-[10px] text-slate-400 mt-0.5">Report issues, confirm resolutions, earn trust points.</p>
              </button>

              <button
                type="button"
                onClick={() => setRole('authority')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  role === 'authority'
                    ? 'bg-blue-600/30 text-blue-300 border-blue-500 font-bold shadow-md'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <div className="text-xs font-bold text-white">Authority Staff</div>
                <p className="text-[10px] text-slate-400 mt-0.5">Manage priority queues, upload proof, resolve tickets.</p>
              </button>
            </div>
          </div>

          {role === 'authority' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none"
              >
                <option value="Public Works">Public Works Department</option>
                <option value="Municipal Sanitation">Municipal Sanitation Board</option>
                <option value="Water Supply & Sewerage Board">Water Supply & Sewerage Board</option>
                <option value="Electrical & Lighting Authority">Electrical & Lighting Authority</option>
                <option value="Traffic Police & Transport Dept">Traffic Police & Transport Dept</option>
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Neighborhood / Zone</label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. North College District, Sector 4..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2"
          >
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800/80 text-center text-xs">
          <span className="text-slate-400">Already registered? </span>
          <button
            onClick={() => setRoute('/login')}
            className="text-cyan-400 hover:underline font-semibold"
          >
            Sign In here →
          </button>
        </div>

      </div>

    </div>
  );
}
