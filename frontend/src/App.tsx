import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { PostCard } from './components/PostCard';
import { PostComposer } from './components/PostComposer';
import { TrendingSection } from './components/TrendingSection';
import { StockDetailModal } from './components/StockDetailModal';
import { NewsSection } from './components/NewsSection';
import { ProfileView } from './components/ProfileView';
import { NotificationDrawer } from './components/NotificationDrawer';
import { AuthModal } from './components/AuthModal';
import { LandingAuthPage } from './components/LandingAuthPage';
import { 
  Flame, 
  TrendingUp, 
  Hash, 
  Users, 
  X,
  PlusCircle
} from 'lucide-react';

const MainFeed: React.FC = () => {
  const { 
    posts, 
    filterHashtag, 
    setFilterHashtag, 
    setIsComposerOpen, 
    trendingTopics, 
    setActiveTab,
    stocks,
    openStockModal,
    users,
    viewUserProfile,
    toggleFollowUser,
    currentUser
  } = useApp();

  const [feedType, setFeedType] = useState<'all' | 'pnl' | 'callout' | 'gap_analysis' | 'following'>('all');

  const filteredPosts = posts.filter(post => {
    if (filterHashtag) {
      return post.hashtags.some(tag => tag.toLowerCase() === filterHashtag.toLowerCase()) ||
             post.content.toLowerCase().includes(filterHashtag.toLowerCase());
    }

    if (feedType === 'pnl') return post.type === 'pnl';
    if (feedType === 'callout') return post.type === 'callout';
    if (feedType === 'gap_analysis') return post.type === 'gap_analysis';
    if (feedType === 'following') return post.author.isFollowing;

    return true;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Center Feed Column */}
      <div className="lg:col-span-2 space-y-5">
        
        {/* Quick Post Prompt Banner */}
        <div 
          onClick={() => setIsComposerOpen(true)}
          className="glass-card p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-all border border-slate-200/80 dark:border-slate-800 shadow-xs"
        >
          <div className="flex items-center gap-3 min-w-0">
            <img src={currentUser.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-slate-400 dark:text-slate-400 truncate">
              Share your latest trade setup, analysis, or verified P&L...
            </span>
          </div>
          <button 
            type="button"
            className="px-4 py-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-md shadow-blue-500/25 flex items-center gap-1.5 shrink-0"
          >
            <PlusCircle className="w-4 h-4" /> Post
          </button>
        </div>

        {/* Feed Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
          {[
            { id: 'all', label: '🔥 All Posts' },
            { id: 'pnl', label: '💰 Realized P&L' },
            { id: 'callout', label: '🚀 Stock Callouts' },
            { id: 'gap_analysis', label: '📊 Gap Analysis' },
            { id: 'following', label: '👥 Following' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => { setFeedType(f.id as any); setFilterHashtag(null); }}
              className={`px-4 py-2 rounded-full border transition-all whitespace-nowrap ${
                feedType === f.id && !filterHashtag
                  ? 'bg-blue-50 dark:bg-blue-600/20 border-[#2563EB] dark:border-blue-500/40 text-[#2563EB] dark:text-[#60A5FA] font-black shadow-2xs'
                  : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Active Hashtag Filter Banner */}
        {filterHashtag && (
          <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/30 flex items-center justify-between text-xs font-medium">
            <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300">
              <Hash className="w-4 h-4 text-[#2563EB]" />
              <span>Showing posts tagged with <strong className="text-[#2563EB] dark:text-[#60A5FA]">{filterHashtag}</strong></span>
            </div>
            <button 
              onClick={() => setFilterHashtag(null)}
              className="px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-[#2563EB] dark:text-[#60A5FA] hover:bg-blue-200 flex items-center gap-1 text-[11px] font-bold"
            >
              <X className="w-3.5 h-3.5" /> Clear Filter
            </button>
          </div>
        )}

        {/* Posts Feed Stream */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="glass-card p-12 text-center space-y-3 border border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/40 mx-auto flex items-center justify-center text-slate-400">
                <Flame className="w-6 h-6 text-[#2563EB]" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white">No posts found</h3>
              <p className="text-xs text-slate-400">Try clearing your filters or create a new trader post!</p>
              <button
                onClick={() => { setFilterHashtag(null); setFeedType('all'); }}
                className="px-5 py-2.5 rounded-full bg-[#2563EB] text-white text-xs font-bold shadow-md shadow-blue-500/25"
              >
                Reset Feed Filters
              </button>
            </div>
          ) : (
            filteredPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>

      </div>

      {/* Right Column Sidebar */}
      <div className="hidden lg:block space-y-5">
        
        {/* Hot Trending Topics */}
        <div className="glass-card p-5 space-y-3 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#2563EB]" /> Trending Setups
            </h4>
            <button 
              onClick={() => setActiveTab('trending')}
              className="text-[11px] font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-2">
            {trendingTopics.slice(0, 4).map(t => (
              <div
                key={t.id}
                onClick={() => {
                  setFilterHashtag(t.tag);
                  setActiveTab('home');
                }}
                className="p-3 rounded-2xl bg-[#F8FAFC] dark:bg-[#1E293B] hover:bg-slate-100 dark:hover:bg-[#283548] transition-colors cursor-pointer flex items-center justify-between border border-transparent dark:border-slate-800/60"
              >
                <div>
                  <span className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] block font-mono">{t.tag}</span>
                  <span className="text-[10px] text-slate-400">{t.postsCount.toLocaleString()} posts</span>
                </div>
                {t.isHot && (
                  <span className="px-2 py-0.5 text-[9px] font-black rounded-full bg-blue-100 dark:bg-blue-900/40 text-[#2563EB] dark:text-blue-300 uppercase">
                    HOT
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Top Tagged Stocks */}
        <div className="glass-card p-5 space-y-3 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#2563EB]" /> Top Stock Tickers
            </h4>
          </div>

          <div className="space-y-2">
            {stocks.slice(0, 4).map(stk => (
              <div
                key={stk.symbol}
                onClick={() => openStockModal(stk.symbol)}
                className="p-3 rounded-2xl bg-[#F8FAFC] dark:bg-[#1E293B] hover:bg-slate-100 dark:hover:bg-[#283548] transition-colors cursor-pointer flex items-center justify-between font-mono border border-transparent dark:border-slate-800/60"
              >
                <div>
                  <span className="text-xs font-black text-slate-900 dark:text-white block">${stk.symbol}</span>
                  <span className="text-[10px] text-slate-400 font-sans">{stk.tagCount} posts</span>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">₹{stk.currentPrice}</div>
                  <div className={`text-[10px] font-bold ${stk.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {stk.change >= 0 ? '+' : ''}{stk.changePercent}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Traders to Follow */}
        <div className="glass-card p-5 space-y-3 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[#2563EB]" /> Traders to Follow
            </h4>
          </div>

          <div className="space-y-3">
            {users.filter(u => u.id !== currentUser.id).slice(0, 3).map(trader => (
              <div key={trader.id} className="flex items-center justify-between text-xs">
                <div 
                  onClick={() => viewUserProfile(trader)}
                  className="flex items-center gap-2.5 cursor-pointer hover:opacity-80"
                >
                  <img src={trader.avatar} alt="" className="w-8.5 h-8.5 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{trader.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">@{trader.username}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleFollowUser(trader.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    trader.isFollowing
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      : 'bg-blue-50 dark:bg-blue-600/20 text-[#2563EB] dark:text-[#60A5FA] border border-blue-200 dark:border-blue-500/30 hover:bg-[#2563EB] hover:text-white'
                  }`}
                >
                  {trader.isFollowing ? 'Following' : '+ Follow'}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

const AppContent: React.FC = () => {
  const { activeTab, isAuthenticated } = useApp();

  // If not authenticated, show full-screen Login & Registration screen first!
  if (!isAuthenticated) {
    return <LandingAuthPage />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] pb-24 lg:pb-12 animate-fadeIn transition-colors">
      
      {/* Header */}
      <Header />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex gap-6">
          
          {/* Navigation Sidebar */}
          <Navigation />

          {/* Active View Container */}
          <main className="flex-1 min-w-0">
            {activeTab === 'home' && <MainFeed />}
            {activeTab === 'trending' && <TrendingSection />}
            {activeTab === 'news' && <NewsSection />}
            {activeTab === 'notifications' && <NotificationDrawer />}
            {activeTab === 'profile' && <ProfileView />}
          </main>

        </div>
      </div>

      {/* Modals */}
      <PostComposer />
      <StockDetailModal />
      <AuthModal />

    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
