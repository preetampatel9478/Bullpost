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
  PlusCircle, 
  Hash, 
  Users, 
  X
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
        


        {/* Active Hashtag Filter Banner */}
        {filterHashtag && (
          <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2 text-amber-300">
              <Hash className="w-4 h-4 text-amber-400" />
              <span>Showing posts tagged with <strong className="text-amber-400">{filterHashtag}</strong></span>
            </div>
            <button 
              onClick={() => setFilterHashtag(null)}
              className="p-1 rounded bg-amber-500/20 text-amber-300 hover:text-white flex items-center gap-1 text-[11px]"
            >
              <X className="w-3.5 h-3.5" /> Clear Filter
            </button>
          </div>
        )}



        {/* Posts Feed Stream */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="glass-card p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-white/5 mx-auto flex items-center justify-center text-gray-400">
                <Flame className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="font-bold text-gray-200">No posts found</h3>
              <p className="text-xs text-gray-400">Try clearing your filters or create a new trader post!</p>
              <button
                onClick={() => { setFilterHashtag(null); setFeedType('all'); }}
                className="px-4 py-2 rounded-xl bg-white/10 text-xs font-bold text-gray-200 hover:bg-white/20"
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
        
        {/* Hot Trending Hashtags */}
        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h4 className="font-extrabold text-sm text-gray-100 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400 burning-fire-icon" /> Hot Trending Topics
            </h4>
            <button 
              onClick={() => setActiveTab('trending')}
              className="text-[11px] text-[#00F2FE] hover:underline"
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
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-between font-mono"
              >
                <div>
                  <span className="text-xs font-extrabold text-amber-400 block">{t.tag}</span>
                  <span className="text-[10px] text-gray-400">{t.postsCount.toLocaleString()} posts</span>
                </div>
                {t.isHot && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-amber-500/20 text-amber-300">
                    HOT
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Top Tagged Stocks */}
        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h4 className="font-extrabold text-sm text-gray-100 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#00E676]" /> Top Stock Tickers
            </h4>
          </div>

          <div className="space-y-2">
            {stocks.slice(0, 4).map(stk => (
              <div
                key={stk.symbol}
                onClick={() => openStockModal(stk.symbol)}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-between font-mono"
              >
                <div>
                  <span className="text-xs font-extrabold text-white block">${stk.symbol}</span>
                  <span className="text-[10px] text-gray-400">{stk.tagCount} posts</span>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-gray-200">₹{stk.currentPrice}</div>
                  <div className={`text-[10px] font-bold ${stk.change >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                    {stk.change >= 0 ? '+' : ''}{stk.changePercent}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Traders to Follow */}
        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h4 className="font-extrabold text-sm text-gray-100 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#00F2FE]" /> Traders You May Follow
            </h4>
          </div>

          <div className="space-y-3">
            {users.filter(u => u.id !== currentUser.id).slice(0, 3).map(trader => (
              <div key={trader.id} className="flex items-center justify-between text-xs">
                <div 
                  onClick={() => viewUserProfile(trader)}
                  className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                >
                  <img src={trader.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-white/10" />
                  <div>
                    <span className="font-bold text-gray-200 block">{trader.name}</span>
                    <span className="text-[10px] font-mono text-gray-400">@{trader.username}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleFollowUser(trader.id)}
                  className={`p-1.5 rounded-lg text-[11px] font-bold transition-all ${
                    trader.isFollowing
                      ? 'bg-white/10 text-gray-400'
                      : 'bg-[#00E676]/20 text-[#00E676] border border-[#00E676]/30 hover:bg-[#00E676] hover:text-[#070a11]'
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
    <div className="min-h-screen bg-[var(--bg-dark)] pb-20 lg:pb-12 animate-fadeIn">
      
      {/* Header */}
      <Header />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
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
