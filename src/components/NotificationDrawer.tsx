import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  Flame, 
  Heart, 
  UserPlus, 
  TrendingUp, 
  CheckCheck, 
  MessageSquare,
  ShieldAlert
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
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00E676] to-[#00F2FE] p-0.5">
              <div className="w-full h-full bg-[#070a11] rounded-[10px] flex items-center justify-center">
                <Bell className="w-5 h-5 text-[#00E676]" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Notifications & Alerts</h2>
              <p className="text-xs text-gray-400">Social interactions, follower alerts & price breakouts.</p>
            </div>
          </div>

          <button
            onClick={markNotificationsAsRead}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-white/20 transition-all"
          >
            <CheckCheck className="w-4 h-4 text-[#00E676]" /> Mark All Read
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 text-xs font-semibold">
          {[
            { id: 'all', label: 'All Activity' },
            { id: 'unread', label: 'Unread Only' },
            { id: 'alerts', label: '⚡ Price & Trend Alerts' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                filter === f.id
                  ? 'bg-[#00E676]/20 border-[#00E676] text-[#00E676] font-bold'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Notification Items */}
        <div className="space-y-3 pt-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              No notifications matching your filter.
            </div>
          ) : (
            filtered.map(n => (
              <div 
                key={n.id}
                className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                  n.read ? 'bg-[#131c30] border-white/5' : 'bg-[#131c30] border-[#00E676]/30 shadow-lg shadow-[#00E676]/5'
                }`}
              >
                <div className="flex items-start gap-3">
                  {n.user ? (
                    <img src={n.user.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                      <Flame className="w-5 h-5 burning-fire-icon" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <p className="text-sm text-gray-200">
                      {n.user && <strong className="text-white font-bold">@{n.user.username} </strong>}
                      {n.content}
                    </p>
                    <span className="text-xs text-gray-400 font-mono block">{n.timestamp}</span>
                  </div>
                </div>

                {n.targetStockSymbol && (
                  <button
                    onClick={() => openStockModal(n.targetStockSymbol!)}
                    className="px-3 py-1 rounded-lg bg-[#00E676]/15 border border-[#00E676]/30 text-xs font-mono font-bold text-[#00E676] hover:bg-[#00E676] hover:text-[#070a11] transition-colors shrink-0"
                  >
                    View ${n.targetStockSymbol}
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
