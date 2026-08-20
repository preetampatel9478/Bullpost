import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PostCard } from './PostCard';
import { 
  User as UserIcon, 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  Users, 
  UserPlus, 
  UserCheck, 
  PlusCircle, 
  PieChart,
  ShieldCheck,
  Zap,
  Settings,
  Sun,
  Moon,
  LogOut,
  Globe,
  Bell,
  Check,
  X
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { 
    selectedProfileUser, 
    currentUser, 
    posts, 
    toggleFollowUser, 
    setIsComposerOpen,
    theme,
    toggleTheme,
    logout,
    isSettingsDrawerOpen,
    setIsSettingsDrawerOpen
  } = useApp();
  
  const [profileTab, setProfileTab] = useState<'posts' | 'liked' | 'stats'>('posts');
  const [language, setLanguage] = useState<'en' | 'hi' | 'gu' | 'mr'>('en');
  const [pushNotifications, setPushNotifications] = useState(true);
  const [pnlAlerts, setPnlAlerts] = useState(true);

  const isOwnProfile = selectedProfileUser.id === currentUser.id;
  const userPosts = posts.filter(p => p.author.id === selectedProfileUser.id);
  const likedPosts = posts.filter(p => p.isLiked);

  return (
    <div className="space-y-6 animate-fadeIn relative">
      
      {/* Profile Card Banner */}
      <div className="glass-card p-6 space-y-5 border border-slate-200 dark:border-white/10 relative overflow-hidden">
        
        {/* Top Cover Gradient Accent */}
        <div className="h-28 -mx-6 -mt-6 bg-gradient-to-r from-[#00E676]/20 via-[#00F2FE]/20 to-blue-600/20 border-b border-white/10" />

        {/* Profile Avatar & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16">
          <div className="flex items-end gap-4">
            <img 
              src={selectedProfileUser.avatar} 
              alt={selectedProfileUser.name} 
              className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-[#0e1524] shadow-xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{selectedProfileUser.name}</h1>
                {selectedProfileUser.verified && (
                  <span className="bg-[#059669] dark:bg-[#00E676] text-white dark:text-[#070a11] px-1.5 py-0.5 rounded-full text-xs font-extrabold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> VERIFIED
                  </span>
                )}
              </div>
              <p className="text-sm font-mono text-gray-500 dark:text-gray-400">@{selectedProfileUser.username}</p>
            </div>
          </div>

          {/* Action Buttons */}
          {isOwnProfile ? (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setIsComposerOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-gradient-to-r dark:from-[#00E676] dark:to-[#00F2FE] dark:text-[#070a11] font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-lg"
              >
                <PlusCircle className="w-4 h-4" /> Share Trade P&L
              </button>
              <button
                onClick={() => setIsSettingsDrawerOpen(true)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-gray-200 hover:bg-slate-200 dark:hover:bg-white/20 font-bold text-xs flex items-center gap-1.5 border border-slate-300 dark:border-white/10 transition-colors"
              >
                <Settings className="w-4 h-4 text-[#059669] dark:text-[#00E676]" /> Settings
              </button>
            </div>
          ) : (
            <button
              onClick={() => toggleFollowUser(selectedProfileUser.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedProfileUser.isFollowing
                  ? 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-gray-200 border border-slate-300 dark:border-white/10 hover:bg-red-500/20 hover:text-red-600'
                  : 'bg-[#059669] text-white dark:bg-[#00E676] dark:text-[#070a11] hover:opacity-90 shadow-lg'
              }`}
            >
              {selectedProfileUser.isFollowing ? (
                <>
                  <UserCheck className="w-4 h-4" /> Following Trader
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Follow & Connect
                </>
              )}
            </button>
          )}
        </div>

        {/* Bio */}
        <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed max-w-2xl">
          {selectedProfileUser.bio}
        </p>

        {/* Stats Grid Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono">
          
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#131c30] border border-slate-200 dark:border-white/10">
            <span className="text-[10px] text-gray-500 dark:text-gray-400 block uppercase">WIN RATE</span>
            <span className="text-lg font-extrabold text-bullish">+{selectedProfileUser.winRate}%</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#131c30] border border-slate-200 dark:border-white/10">
            <span className="text-[10px] text-gray-500 dark:text-gray-400 block uppercase">TODAY P&L</span>
            <span className={`text-lg font-extrabold ${selectedProfileUser.totalPnlToday >= 0 ? 'text-bullish' : 'text-bearish'}`}>
              {selectedProfileUser.totalPnlToday >= 0 ? '+₹' : '-₹'}{Math.abs(selectedProfileUser.totalPnlToday).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#131c30] border border-slate-200 dark:border-white/10">
            <span className="text-[10px] text-gray-500 dark:text-gray-400 block uppercase">FOLLOWERS</span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-white">{selectedProfileUser.followersCount.toLocaleString()}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#131c30] border border-slate-200 dark:border-white/10">
            <span className="text-[10px] text-gray-500 dark:text-gray-400 block uppercase">FOLLOWING</span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-white">{selectedProfileUser.followingCount.toLocaleString()}</span>
          </div>

        </div>

      </div>

      {/* Profile Tabs */}
      <div className="flex border-b border-gray-200 dark:border-white/10 text-xs sm:text-sm font-semibold overflow-x-auto">
        {[
          { id: 'posts', label: `Posts & P&L (${userPosts.length})` },
          { id: 'liked', label: `Liked Posts (${likedPosts.length})` },
          { id: 'stats', label: 'Trade Performance' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setProfileTab(t.id as any)}
            className={`px-4 sm:px-5 py-3 border-b-2 whitespace-nowrap transition-all ${
              profileTab === t.id
                ? 'border-[#059669] dark:border-[#00E676] text-[#059669] dark:text-[#00E676] font-extrabold'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {profileTab === 'posts' && (
        <div className="space-y-4">
          {userPosts.length === 0 ? (
            <div className="glass-card p-8 text-center text-gray-400 text-sm">
              No trade posts created by @{selectedProfileUser.username} yet.
            </div>
          ) : (
            userPosts.map(p => <PostCard key={p.id} post={p} />)
          )}
        </div>
      )}

      {profileTab === 'liked' && (
        <div className="space-y-4">
          {likedPosts.length === 0 ? (
            <div className="glass-card p-8 text-center text-gray-400 text-sm">
              No liked posts yet.
            </div>
          ) : (
            likedPosts.map(p => <PostCard key={p.id} post={p} />)
          )}
        </div>
      )}

      {profileTab === 'stats' && (
        <div className="glass-card p-6 space-y-4 font-mono">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <PieChart className="w-5 h-5 text-[#0284C7] dark:text-[#00F2FE]" /> Historical Trading Metrics & Risk Index
          </h3>
          
          <div className="space-y-3 text-xs text-slate-700 dark:text-gray-300">
            <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-2">
              <span>Avg Risk : Reward Ratio</span>
              <span className="font-bold text-[#059669] dark:text-[#00E676]">1 : 2.8</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-2">
              <span>Max Consecutive Wins</span>
              <span className="font-bold text-[#059669] dark:text-[#00E676]">12 Trades</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-2">
              <span>Preferred Instruments</span>
              <span className="font-bold text-slate-900 dark:text-gray-100">Nifty Options (CE/PE), Stock Swing (Vedanta, Tata Motors)</span>
            </div>
            <div className="flex justify-between">
              <span>SEBI Risk Category Compliance</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">Strict Stop-Loss Verified</span>
            </div>
          </div>
        </div>
      )}

      {/* Side Pop Half-Screen Settings Drawer */}
      {isSettingsDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end animate-fadeIn">
          {/* Backdrop Overlay */}
          <div 
            onClick={() => setIsSettingsDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Container (Sliding from Right) */}
          <div className="relative w-full max-w-md sm:w-96 h-full bg-white dark:bg-[#0e1524] shadow-2xl border-l border-slate-200 dark:border-white/10 p-6 flex flex-col justify-between overflow-y-auto z-10 animate-slideInRight">
            
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[#059669] dark:text-[#00E676]" /> App Settings & Preferences
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Customize theme, language & notifications</p>
                </div>
                <button
                  onClick={() => setIsSettingsDrawerOpen(false)}
                  className="p-1.5 rounded-full bg-slate-100 dark:bg-white/10 text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 1. Theme Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400 block">
                  1. Appearance / Theme Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  
                  <button
                    type="button"
                    onClick={() => { if (theme !== 'dark') toggleTheme(); }}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      theme === 'dark'
                        ? 'border-[#00E676] bg-[#00E676]/15 text-white font-bold shadow-md'
                        : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-indigo-400" />
                      <div>
                        <span className="text-xs font-bold block text-slate-900 dark:text-white">🌙 Dark</span>
                        <span className="text-[10px] text-gray-400">Terminal</span>
                      </div>
                    </div>
                    {theme === 'dark' && <span className="text-[#00E676] font-bold text-xs">✓</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => { if (theme !== 'light') toggleTheme(); }}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      theme === 'light'
                        ? 'border-[#059669] bg-emerald-500/15 text-slate-900 font-bold shadow-md'
                        : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-500" />
                      <div>
                        <span className="text-xs font-bold block text-slate-900 dark:text-white">☀️ Light</span>
                        <span className="text-[10px] text-gray-400 font-normal">Financial</span>
                      </div>
                    </div>
                    {theme === 'light' && <span className="text-[#059669] font-bold text-xs">✓</span>}
                  </button>

                </div>
              </div>

              {/* 2. Language Selector */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400 block flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-[#0284C7] dark:text-[#00F2FE]" /> 2. Language / भाषा Select
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'en', name: 'English', native: 'English (US)' },
                    { id: 'hi', name: 'Hindi', native: 'हिंदी' },
                    { id: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
                    { id: 'mr', name: 'Marathi', native: 'મરાઠી' }
                  ].map(lang => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setLanguage(lang.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        language === lang.id
                          ? 'border-[#059669] dark:border-[#00E676] bg-emerald-500/10 text-[#059669] dark:text-[#00E676] font-bold'
                          : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-gray-400'
                      }`}
                    >
                      <div className="text-xs font-bold">{lang.name}</div>
                      <div className="text-[10px] opacity-80">{lang.native}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Notification Preferences */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400 block flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-amber-500" /> 3. Notification Controls
                </label>
                <div className="space-y-2">
                  
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">Push Notifications</span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">Trader mentions & tags</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={pushNotifications}
                      onChange={(e) => setPushNotifications(e.target.checked)}
                      className="w-4 h-4 accent-[#059669] cursor-pointer"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">P&L Breakout Alerts</span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">Stock momentum callouts</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={pnlAlerts}
                      onChange={(e) => setPnlAlerts(e.target.checked)}
                      className="w-4 h-4 accent-[#059669] cursor-pointer"
                    />
                  </div>

                </div>
              </div>
            </div>

            {/* Footer Sign Out */}
            {isOwnProfile && (
              <div className="pt-4 border-t border-gray-200 dark:border-white/10 space-y-2">
                <button
                  onClick={logout}
                  className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 font-bold text-xs hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out of Terminal
                </button>
                <div className="text-center text-[10px] text-gray-400 font-mono">
                  Bullpost PRO v1.0.4 • SEBI Compliant
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
