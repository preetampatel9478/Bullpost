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
      <aside className="hidden lg:block w-64 shrink-0 space-y-5 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto pr-1">
        
        {/* Main Nav Links Card */}
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
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-600/15 text-[#2563EB] dark:text-[#60A5FA] font-bold shadow-xs'
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#2563EB] dark:text-[#60A5FA]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-blue-100 text-[#2563EB] dark:bg-blue-900/40 dark:text-blue-300">
                    {item.badge}
                  </span>
                )}
                {item.count ? (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#2563EB] text-white shadow-xs">
                    {item.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Live Trader P&L Stat Card */}
        <div className="glass-card p-5 space-y-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-gray-400">
            <span className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-700 dark:text-gray-300">
              <PieChart className="w-4 h-4 text-[#2563EB]" /> Live Trader P&L
            </span>
            <span className="text-[10px] bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 px-2 py-0.5 rounded-full font-mono font-bold">
              LIVE
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 block">
              +₹{currentUser.totalPnlToday.toLocaleString('en-IN')}
            </span>
            <div className="flex justify-between text-xs text-slate-500 dark:text-gray-400 pt-0.5">
              <span>Today Trades: <strong className="text-slate-800 dark:text-gray-200">{currentUser.totalTradesToday}</strong></span>
              <span>Win Rate: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{currentUser.winRate}%</strong></span>
            </div>
          </div>

          <div className="w-full bg-slate-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#2563EB] to-[#3B82F6] h-full rounded-full" 
              style={{ width: `${currentUser.winRate}%` }}
            />
          </div>
        </div>

        {/* Transparency Card */}
        <div className="p-4 rounded-[24px] bg-white dark:bg-[#0e1524] border border-slate-200/80 dark:border-white/10 text-xs text-slate-600 dark:text-gray-300 space-y-1.5 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <ShieldCheck className="w-4 h-4 text-[#2563EB]" /> Trader Transparency
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-gray-400">
            Real-time verified P&L proofs with interactive financial disclaimers on all posts.
          </p>
        </div>

      </aside>

      {/* Floating Glassmorphic Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-50 bg-white/95 dark:bg-[#0e1524]/95 backdrop-blur-md rounded-full px-3 py-2 flex items-center justify-between shadow-[0_12px_30px_rgba(0,0,0,0.1)] border border-slate-200/80 dark:border-white/10">
        
        {/* 1. Feed */}
        <button
          onClick={() => {
            setActiveTab('home');
            setFilterHashtag(null);
          }}
          className={`flex-1 flex flex-col items-center justify-center p-1 rounded-xl text-xs transition-all relative outline-none focus:outline-none ${
            activeTab === 'home' ? 'text-[#2563EB] dark:text-[#60A5FA] font-bold' : 'text-slate-400 hover:text-slate-700 dark:hover:text-gray-200'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold">Feed</span>
          {activeTab === 'home' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shadow-xs absolute -bottom-1" />
          )}
        </button>

        {/* 2. Trending */}
        <button
          onClick={() => setActiveTab('trending')}
          className={`flex-1 flex flex-col items-center justify-center p-1 rounded-xl text-xs transition-all relative outline-none focus:outline-none ${
            activeTab === 'trending' ? 'text-[#2563EB] dark:text-[#60A5FA] font-bold' : 'text-slate-400 hover:text-slate-700 dark:hover:text-gray-200'
          }`}
        >
          <Flame className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold">Trending</span>
          {activeTab === 'trending' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shadow-xs absolute -bottom-1" />
          )}
        </button>

        {/* 3. Central Prominent Floating + Post Action Button */}
        <button
          onClick={() => setIsComposerOpen(true)}
          className="flex-1 flex flex-col items-center justify-center -mt-6 outline-none focus:outline-none"
        >
          <div className="w-12 h-12 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] p-0.5 shadow-lg shadow-blue-500/30 flex items-center justify-center active:scale-95 transition-transform text-white">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[9px] font-bold text-[#2563EB] mt-0.5">Post</span>
        </button>

        {/* 4. News */}
        <button
          onClick={() => setActiveTab('news')}
          className={`flex-1 flex flex-col items-center justify-center p-1 rounded-xl text-xs transition-all relative outline-none focus:outline-none ${
            activeTab === 'news' ? 'text-[#2563EB] dark:text-[#60A5FA] font-bold' : 'text-slate-400 hover:text-slate-700 dark:hover:text-gray-200'
          }`}
        >
          <Newspaper className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold">News</span>
          {activeTab === 'news' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shadow-xs absolute -bottom-1" />
          )}
        </button>

        {/* 5. Profile */}
        <button
          onClick={() => viewUserProfile(currentUser)}
          className={`flex-1 flex flex-col items-center justify-center p-1 rounded-xl text-xs transition-all relative outline-none focus:outline-none ${
            activeTab === 'profile' ? 'text-[#2563EB] dark:text-[#60A5FA] font-bold' : 'text-slate-400 hover:text-slate-700 dark:hover:text-gray-200'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold">Profile</span>
          {activeTab === 'profile' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shadow-xs absolute -bottom-1" />
          )}
        </button>

      </nav>
    </>
  );
};
