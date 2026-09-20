import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  Layers,
  PlusCircle,
  MapPin,
  Flame,
  Bot,
  ShieldAlert,
  User,
  Bell,
  LogOut,
  ChevronDown,
  Sparkles,
  Menu,
  X,
  Building2,
  CheckCircle2
} from 'lucide-react';

export default function Navbar({ currentPath, setRoute }) {
  const { user, logout, loginAsDemo } = useAuth();
  const { unreadCount, setIsOpen } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Layers },
    { name: 'Report Issue', path: '/report', icon: PlusCircle, highlight: true },
    { name: 'Explore', path: '/issues', icon: MapPin },
    { name: 'Heatmap', path: '/map', icon: Flame },
    { name: 'Copilot', path: '/assistant', icon: Bot },
    { name: 'Command Center', path: '/admin', icon: ShieldAlert, adminOnly: true },
  ];

  const handleNav = (path) => {
    setRoute(path);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-navy-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div
            onClick={() => handleNav('/')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-teal-400 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
              <div className="w-full h-full bg-navy-900 rounded-[10px] flex items-center justify-center">
                <div className="relative flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full border-2 border-cyan-400 animate-ping absolute opacity-40"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500"></div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-black tracking-tight text-white">CIVIC LENS</span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">AI</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider hidden sm:block">
                INTELLIGENCE PLATFORM
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              if (link.adminOnly && user?.role !== 'authority' && user?.role !== 'admin') {
                return null;
              }
              const Icon = link.icon;
              const isActive = currentPath === link.path;

              return (
                <button
                  key={link.name}
                  onClick={() => handleNav(link.path)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    link.highlight
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20 hover:shadow-cyan-500/30'
                      : isActive
                      ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3">
            
            {/* Quick Demo Switcher */}
            <div className="hidden lg:flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700 text-xs">
              <span className="text-slate-400 px-2 font-medium">Demo Mode:</span>
              <button
                onClick={() => loginAsDemo('citizen')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  user?.role === 'citizen'
                    ? 'bg-cyan-500 text-white font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Alex (Citizen)
              </button>
              <button
                onClick={() => loginAsDemo('authority')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  user?.role === 'authority' || user?.role === 'admin'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Sarah (Authority)
              </button>
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth State */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 pr-2.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-cyan-500/50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-semibold text-slate-200 leading-none">{user.name}</p>
                    <p className="text-[10px] text-cyan-400 capitalize">{user.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 glass-dropdown rounded-xl shadow-2xl py-1.5 z-50">
                    <div className="px-4 py-2 border-b border-slate-700/60">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                      <div className="mt-1 flex items-center space-x-1.5">
                        <span className="text-xs font-semibold text-amber-400">★ {user.points || 0} Civic Points</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleNav('/profile')}
                      className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 flex items-center space-x-2"
                    >
                      <User className="w-4 h-4 text-cyan-400" />
                      <span>Contributor Profile</span>
                    </button>

                    {user.role === 'authority' && (
                      <button
                        onClick={() => handleNav('/admin')}
                        className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 flex items-center space-x-2"
                      >
                        <ShieldAlert className="w-4 h-4 text-blue-400" />
                        <span>Command Center</span>
                      </button>
                    )}

                    <div className="border-t border-slate-700/60 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNav('/auth')}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.name}
                onClick={() => handleNav(link.path)}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left text-sm text-slate-200 hover:bg-slate-800"
              >
                <Icon className="w-5 h-5 text-cyan-400" />
                <span>{link.name}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Demo Role:</span>
            <div className="flex space-x-2">
              <button
                onClick={() => { loginAsDemo('citizen'); setMobileMenuOpen(false); }}
                className="text-xs px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400"
              >
                Alex (Citizen)
              </button>
              <button
                onClick={() => { loginAsDemo('authority'); setMobileMenuOpen(false); }}
                className="text-xs px-2.5 py-1 rounded bg-blue-500/20 text-blue-400"
              >
                Sarah (Admin)
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
