import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { X, Check, Bell, AlertTriangle, ShieldCheck, Zap, Award, Sparkles } from 'lucide-react';

export default function NotificationDrawer({ setRoute }) {
  const { notifications, unreadCount, isOpen, setIsOpen, markAllAsRead } = useNotifications();

  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'EMERGENCY_ESCALATION':
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      case 'VERIFICATION_REQUESTED':
        return <ShieldCheck className="w-5 h-5 text-amber-400" />;
      case 'POINTS_AWARDED':
        return <Award className="w-5 h-5 text-emerald-400" />;
      case 'COMPLAINT_RECEIVED':
      case 'AI_CLASSIFIED':
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
      default:
        return <Bell className="w-5 h-5 text-blue-400" />;
    }
  };

  const handleNotificationClick = (notif) => {
    if (notif.complaintId) {
      setRoute(`/issues/${notif.complaintId}`);
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className="absolute inset-0 bg-navy-900/70 backdrop-blur-sm transition-opacity"
      ></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel bg-navy-900/95 border-l border-slate-700 shadow-2xl p-6 flex flex-col justify-between">
          
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Smart Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-slate-400 hover:text-cyan-400 flex items-center space-x-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="mt-4 space-y-3 overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  No notifications yet. You will receive updates as issues progress through the AI pipeline!
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif._id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                      notif.read
                        ? 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                        : 'bg-slate-800/80 border-cyan-500/30 text-slate-200 hover:border-cyan-400 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5 p-2 rounded-lg bg-slate-900/60 border border-slate-700/60">
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-white truncate">{notif.title}</p>
                          <span className="text-[10px] text-slate-500 ml-2 whitespace-nowrap">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{notif.message}</p>
                        {notif.complaintId && (
                          <span className="inline-block mt-2 text-[11px] font-medium text-cyan-400 hover:underline">
                            View Issue Intelligence →
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
            Civic Lens automated pipeline alerts
          </div>

        </div>
      </div>
    </div>
  );
}
