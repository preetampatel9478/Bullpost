import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  Flame, 
  CheckCheck
} from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const { notifications, markNotificationsAsRead, openStockModal } = useApp();
  const [filter, setFilter] = useState<'all' | 'unread' | 'alerts'>('all');

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'alerts') return n.type === 'price_alert' || n.type === 'trending';
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header & Mark All Read */}
      <div className="glass-card p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#3B82F6] flex items-center justify-center shadow-md shadow-blue-500/20">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Notifications & Alerts</h2>
              <p className="text-xs text-slate-400">Social interactions, follower alerts & price breakouts.</p>
            </div>
          </div>

          <button
            onClick={markNotificationsAsRead}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#F8FAFC] dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 hover:text-[#2563EB] hover:border-slate-300 transition-all shadow-2xs"
          >
            <CheckCheck className="w-4 h-4 text-[#2563EB]" /> Mark All Read
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 text-xs font-bold">
          {[
            { id: 'all', label: 'All Activity' },
            { id: 'unread', label: 'Unread Only' },
            { id: 'alerts', label: '⚡ Price & Trend Alerts' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-4 py-1.5 rounded-full border transition-all ${
                filter === f.id
                  ? 'bg-blue-50 border-[#2563EB] text-[#2563EB] font-black'
                  : 'bg-[#F8FAFC] dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Notification Items */}
        <div className="space-y-3 pt-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm font-medium">
              No notifications matching your filter.
            </div>
          ) : (
            filtered.map(n => (
              <div 
                key={n.id}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 shadow-2xs ${
                  n.read 
                    ? 'bg-[#F8FAFC] dark:bg-[#131c30] border-slate-200/80 dark:border-white/5' 
                    : 'bg-white dark:bg-[#131c30] border-blue-200 dark:border-blue-500/30 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  {n.user ? (
                    <img src={n.user.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 text-[#2563EB] flex items-center justify-center shrink-0">
                      <Flame className="w-5 h-5 text-[#2563EB]" />
                    </div>
                  )}

                  <div className="space-y-0.5">
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-gray-200 font-medium">
                      {n.user && <strong className="text-slate-900 dark:text-white font-bold">@{n.user.username} </strong>}
                      {n.content}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono block">{n.timestamp}</span>
                  </div>
                </div>

                {n.targetStockSymbol && (
                  <button
                    onClick={() => openStockModal(n.targetStockSymbol!)}
                    className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono font-bold text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-colors shrink-0 shadow-2xs"
                  >
                    ${n.targetStockSymbol}
                  </button>
                )}
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};
