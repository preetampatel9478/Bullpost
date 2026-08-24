import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PostCard } from './PostCard';
import { 
  CheckCircle2, 
  UserPlus, 
  UserCheck, 
  PlusCircle, 
  PieChart, 
  Settings, 
  Moon, 
  Sun, 
  Globe, 
  Bell, 
  LogOut, 
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
      <div className="glass-card p-6 sm:p-8 space-y-6 border border-slate-200/80 dark:border-slate-800 relative overflow-hidden">
        
        {/* Top Cover Gradient Accent */}
        <div className="h-32 -mx-8 -mt-8 bg-gradient-to-r from-[#2563EB]/25 via-[#60A5FA]/20 to-[#93C5FD]/20 border-b border-slate-200/50 dark:border-slate-800" />

        {/* Profile Avatar & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-18">
          <div className="flex items-end gap-4">
            <img 
              src={selectedProfileUser.avatar} 
              alt={selectedProfileUser.name} 
              className="w-24 h-24 sm:w-26 sm:h-26 rounded-full object-cover border-4 border-white dark:border-[#111827] shadow-md"
            />
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{selectedProfileUser.name}</h1>
                {selectedProfileUser.verified && (
                  <span className="bg-[#2563EB] text-white px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 shadow-xs">
                    <CheckCircle2 className="w-3 h-3" /> VERIFIED
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-slate-400">@{selectedProfileUser.username}</p>
            </div>
          </div>

          {/* Action Buttons */}
          {isOwnProfile ? (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setIsComposerOpen(true)}
                className="px-5 py-2.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all active:scale-95"
              >
                <PlusCircle className="w-4 h-4" /> Share Trade P&L
              </button>
              <button
                onClick={() => setIsSettingsDrawerOpen(true)}
                className="px-4 py-2.5 rounded-full bg-[#F8FAFC] dark:bg-[#1E293B] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
              >
                <Settings className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" /> Settings
              </button>
            </div>
          ) : (
            <button
              onClick={() => toggleFollowUser(selectedProfileUser.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                selectedProfileUser.isFollowing
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400'
                  : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md shadow-blue-500/25'
              }`}
            >
              {selectedProfileUser.isFollowing ? (
                <>
                  <UserCheck className="w-4 h-4" /> Following Trader
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> + Follow & Connect
                </>
              )}
            </button>
          )}
        </div>

        {/* Bio */}
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl font-medium">
          {selectedProfileUser.bio}
        </p>

        {/* Stats Grid Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 font-mono">
          
          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase font-sans font-bold">WIN RATE</span>
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">+{selectedProfileUser.winRate}%</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase font-sans font-bold">TODAY P&L</span>
            <span className={`text-lg font-black ${selectedProfileUser.totalPnlToday >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {selectedProfileUser.totalPnlToday >= 0 ? '+₹' : '-₹'}{Math.abs(selectedProfileUser.totalPnlToday).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase font-sans font-bold">FOLLOWERS</span>
            <span className="text-lg font-black text-slate-900 dark:text-white">{selectedProfileUser.followersCount.toLocaleString()}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase font-sans font-bold">FOLLOWING</span>
            <span className="text-lg font-black text-slate-900 dark:text-white">{selectedProfileUser.followingCount.toLocaleString()}</span>
          </div>

        </div>

      </div>

      {/* Profile Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold overflow-x-auto gap-2">
        {[
          { id: 'posts', label: `Posts & P&L (${userPosts.length})` },
          { id: 'liked', label: `Liked Posts (${likedPosts.length})` },
          { id: 'stats', label: 'Trade Performance' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setProfileTab(t.id as any)}
            className={`px-5 py-3 border-b-2 whitespace-nowrap transition-all ${
              profileTab === t.id
                ? 'border-[#2563EB] dark:border-[#60A5FA] text-[#2563EB] dark:text-[#60A5FA] font-black'
                : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-white'
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
            <div className="glass-card p-10 text-center text-slate-400 text-sm font-medium border border-slate-200 dark:border-slate-800">
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
            <div className="glass-card p-10 text-center text-slate-400 text-sm font-medium border border-slate-200 dark:border-slate-800">
              No liked posts yet.
            </div>
          ) : (
            likedPosts.map(p => <PostCard key={p.id} post={p} />)
          )}
        </div>
      )}

      {profileTab === 'stats' && (
        <div className="glass-card p-6 space-y-4 font-mono border border-slate-200 dark:border-slate-800">
          <h3 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
            <PieChart className="w-5 h-5 text-[#2563EB] dark:text-[#60A5FA]" /> Historical Trading Metrics & Risk Index
          </h3>
          
          <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <span>Avg Risk : Reward Ratio</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">1 : 2.8</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <span>Max Consecutive Wins</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">12 Trades</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <span>Preferred Strategy</span>
              <span className="font-bold text-slate-900 dark:text-white">Nifty Options (CE/PE), Stock Swing (Vedanta, Tata Motors)</span>
            </div>
            <div className="flex justify-between">
              <span>SEBI Risk Category Compliance</span>
              <span className="font-bold text-[#2563EB] dark:text-[#60A5FA]">Strict Stop-Loss Verified</span>
            </div>
          </div>
        </div>
      )}

      {/* Settings Drawer */}
      {isSettingsDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end animate-fadeIn">
          {/* Backdrop Overlay */}
          <div 
            onClick={() => setIsSettingsDrawerOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Container */}
          <div className="relative w-full max-w-md sm:w-96 h-full bg-white dark:bg-[#111827] shadow-2xl border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between overflow-y-auto z-10 animate-slideInRight">
            
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[#2563EB] dark:text-[#60A5FA]" /> App Settings & Preferences
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Customize theme, language & notifications</p>
                </div>
                <button
                  onClick={() => setIsSettingsDrawerOpen(false)}
                  className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 1. Theme Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  1. Appearance / Theme Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  
                  <button
                    type="button"
                    onClick={() => { if (theme !== 'dark') toggleTheme(); }}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      theme === 'dark'
                        ? 'border-[#2563EB] bg-blue-500/20 text-white font-bold shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#1E293B] text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-blue-400" />
                      <div>
                        <span className="text-xs font-bold block text-slate-900 dark:text-white">🌙 Dark</span>
                        <span className="text-[10px] text-slate-400">Terminal</span>
                      </div>
                    </div>
                    {theme === 'dark' && <span className="text-[#60A5FA] font-bold text-xs">✓</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => { if (theme !== 'light') toggleTheme(); }}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      theme === 'light'
                        ? 'border-[#2563EB] bg-blue-50 text-slate-900 font-bold shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#1E293B] text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-500" />
                      <div>
                        <span className="text-xs font-bold block text-slate-900 dark:text-white">☀️ Light</span>
                        <span className="text-[10px] text-slate-400 font-normal">Clean Blue</span>
                      </div>
                    </div>
                    {theme === 'light' && <span className="text-[#2563EB] font-bold text-xs">✓</span>}
                  </button>

                </div>
              </div>

              {/* 2. Language Selector */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" /> 2. Language / भाषा
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'en', name: 'English', native: 'English (US)' },
                    { id: 'hi', name: 'Hindi', native: 'हिंदी' },
                    { id: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
                    { id: 'mr', name: 'Marathi', native: 'मराठी' }
                  ].map(lang => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setLanguage(lang.id as any)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        language === lang.id
                          ? 'border-[#2563EB] dark:border-blue-500 bg-blue-50/70 dark:bg-blue-600/20 text-[#2563EB] dark:text-[#60A5FA] font-bold'
                          : 'border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#1E293B] text-slate-600 dark:text-slate-400'
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
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" /> 3. Notifications
                </label>
                <div className="space-y-2">
                  
                  <div className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">Push Notifications</span>
                      <span className="text-[10px] text-slate-400">Trader mentions & tags</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={pushNotifications}
                      onChange={(e) => setPushNotifications(e.target.checked)}
                      className="w-4 h-4 accent-[#2563EB] cursor-pointer"
                    />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">P&L Breakout Alerts</span>
                      <span className="text-[10px] text-slate-400">Stock momentum callouts</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={pnlAlerts}
                      onChange={(e) => setPnlAlerts(e.target.checked)}
                      className="w-4 h-4 accent-[#2563EB] cursor-pointer"
                    />
                  </div>

                </div>
              </div>
            </div>

            {/* Footer Sign Out */}
            {isOwnProfile && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <button
                  onClick={logout}
                  className="w-full py-3 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-bold text-xs hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
                <div className="text-center text-[10px] text-slate-400 font-mono">
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
