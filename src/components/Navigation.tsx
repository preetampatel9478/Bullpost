import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  Flame, 
  Newspaper, 
  Bell, 
  User, 
  PieChart, 
  ShieldCheck,
  Plus
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    notifications, 
    setFilterHashtag, 
    currentUser, 
    viewUserProfile,
    setIsComposerOpen 
  } = useApp();
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const desktopNavItems = [
    { id: 'home', label: 'Feed', icon: Home },
    { id: 'trending', label: 'Trending', icon: Flame, badge: 'HOT' },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'notifications', label: 'Notifications', icon: Bell, count: unreadCount },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden lg:block w-64 shrink-0 space-y-6 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto pr-2">
        
        {/* Main Nav Links */}
        <div className="glass-card p-3 space-y-1">
          {desktopNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'profile') {
                    viewUserProfile(currentUser);
                  } else {
                    setActiveTab(item.id);
                    if (item.id === 'home') setFilterHashtag(null);
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/15 to-transparent text-[#059669] dark:text-[#00E676] border-l-4 border-[#059669] dark:border-[#00E676] font-bold shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#059669] dark:text-[#00E676]' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse">
                    {item.badge}
                  </span>
                )}
                {item.count ? (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-bullish text-white dark:text-[#070a11]">
                    {item.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Live Trader P&L Stat Card */}
        <div className="glass-card p-4 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
              <PieChart className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#00F2FE]" /> Live P&L Stat
            </span>
            <span className="text-[10px] bg-green-500/20 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded font-mono font-bold">LIVE</span>
          </div>

          <div className="space-y-1">
            <span className="text-2xl font-extrabold font-mono text-bullish">
              +₹{currentUser.totalPnlToday.toLocaleString('en-IN')}
            </span>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Today Trades: <strong>{currentUser.totalTradesToday}</strong></span>
              <span>Win Rate: <strong className="text-bullish font-mono">{currentUser.winRate}%</strong></span>
            </div>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#059669] to-[#00E676] h-full rounded-full" 
              style={{ width: `${currentUser.winRate}%` }}
            />
          </div>
        </div>

        {/* Compliance / Transparency Card */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-400">
            <ShieldCheck className="w-4 h-4 text-amber-500" /> Trader Transparency
          </div>
          <p className="text-[11px] leading-relaxed opacity-90">
            All posts include burning disclaimer tags to encourage responsible trading & DYOR research.
          </p>
        </div>

      </aside>

      {/* Ultra-Clean Floating Glassmorphic Mobile Bottom Navigation Bar (FITS ALL MOBILE SCREENS) */}
      <nav className="lg:hidden fixed bottom-3 left-2 right-2 z-50 glass-panel rounded-2xl px-1.5 py-1.5 flex items-center justify-between shadow-2xl border border-[var(--border-color)]">
        
        {/* 1. Feed */}
        <button
          onClick={() => {
            setActiveTab('home');
            setFilterHashtag(null);
          }}
          className={`flex-1 flex flex-col items-center justify-center p-1 rounded-xl text-xs transition-all relative outline-none focus:outline-none ${
            activeTab === 'home' ? 'text-[#059669] dark:text-[#00E676] font-bold scale-105' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold tracking-tight">Feed</span>
          {activeTab === 'home' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] dark:bg-[#00E676] shadow-sm absolute -bottom-0.5" />
          )}
        </button>

        {/* 2. Trending */}
        <button
          onClick={() => setActiveTab('trending')}
          className={`flex-1 flex flex-col items-center justify-center p-1 rounded-xl text-xs transition-all relative outline-none focus:outline-none ${
            activeTab === 'trending' ? 'text-[#059669] dark:text-[#00E676] font-bold scale-105' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'
          }`}
        >
          <Flame className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold tracking-tight">Trending</span>
          {activeTab === 'trending' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] dark:bg-[#00E676] shadow-sm absolute -bottom-0.5" />
          )}
        </button>

        {/* 3. Central Prominent Floating + Post Action Button */}
        <button
          onClick={() => setIsComposerOpen(true)}
          className="flex-1 flex flex-col items-center justify-center -mt-5 outline-none focus:outline-none"
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#059669] to-[#00E676] p-0.5 shadow-lg shadow-[#059669]/30 dark:shadow-[#00E676]/40 flex items-center justify-center active:scale-95 transition-transform">
            <div className="w-full h-full bg-[#0F172A] dark:bg-[#070a11] rounded-full flex items-center justify-center">
              <Plus className="w-6 h-6 text-white dark:text-[#00E676]" />
            </div>
          </div>
          <span className="text-[9px] font-bold text-[#059669] dark:text-[#00E676] mt-0.5">Post</span>
        </button>

        {/* 4. News */}
        <button
          onClick={() => setActiveTab('news')}
          className={`flex-1 flex flex-col items-center justify-center p-1 rounded-xl text-xs transition-all relative outline-none focus:outline-none ${
            activeTab === 'news' ? 'text-[#059669] dark:text-[#00E676] font-bold scale-105' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'
          }`}
        >
          <Newspaper className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold tracking-tight">News</span>
          {activeTab === 'news' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] dark:bg-[#00E676] shadow-sm absolute -bottom-0.5" />
          )}
        </button>

        {/* 5. Profile */}
        <button
          onClick={() => viewUserProfile(currentUser)}
          className={`flex-1 flex flex-col items-center justify-center p-1 rounded-xl text-xs transition-all relative outline-none focus:outline-none ${
            activeTab === 'profile' ? 'text-[#059669] dark:text-[#00E676] font-bold scale-105' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold tracking-tight">Profile</span>
          {activeTab === 'profile' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] dark:bg-[#00E676] shadow-sm absolute -bottom-0.5" />
          )}
        </button>

      </nav>
    </>
  );
};
