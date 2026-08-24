import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Flame, 
  TrendingUp, 
  TrendingDown, 
  Hash, 
  Trophy, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles
} from 'lucide-react';

export const TrendingSection: React.FC = () => {
  const { 
    trendingTopics, 
    stocks, 
    users, 
    setFilterHashtag, 
    setActiveTab, 
    openStockModal, 
    viewUserProfile, 
    filterHashtag
  } = useApp();

  const trendingStocks = stocks.filter(s => s.isTrending).sort((a, b) => (a.trendingRank || 99) - (b.trendingRank || 99));

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. Market Sentiment Overview Meter */}
      <div className="glass-card p-6 border border-blue-100 dark:border-white/10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#2563EB] dark:text-[#60A5FA] tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-[#2563EB]" /> Live Market Sentiment
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">76% Bullish Outlook</h2>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">Based on 28,400+ verified trader callouts & analysis in the last 24h.</p>
          </div>

          {/* Sentiment Meter Bar */}
          <div className="w-full md:w-80 space-y-2">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> 76% BULLS
              </span>
              <span className="text-red-500 dark:text-red-400 flex items-center gap-1">
                24% BEARS <TrendingDown className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="h-3 w-full bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden flex p-0.5 border border-slate-200 dark:border-white/10">
              <div className="bg-[#10B981] h-full rounded-l-full" style={{ width: '76%' }} />
              <div className="bg-[#EF4444] h-full rounded-r-full" style={{ width: '24%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Trending Hashtags */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#2563EB]" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-gray-100">Trending Topics & Setups</h3>
          </div>
          {filterHashtag && (
            <button
              onClick={() => setFilterHashtag(null)}
              className="text-xs text-[#2563EB] dark:text-[#60A5FA] hover:underline flex items-center gap-1 font-bold"
            >
              Clear Filter ({filterHashtag})
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {trendingTopics.map((topic, idx) => (
            <div
              key={topic.id}
              onClick={() => {
                setFilterHashtag(topic.tag);
                setActiveTab('home');
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                filterHashtag === topic.tag
                  ? 'border-[#2563EB] bg-blue-50/70 dark:bg-blue-600/20'
                  : 'border-slate-200/80 dark:border-white/10 bg-[#F8FAFC] dark:bg-white/5 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5 font-bold text-[#2563EB] dark:text-[#60A5FA] text-sm">
                  <span className="opacity-60">#{idx + 1}</span>
                  <span>{topic.tag}</span>
                  {topic.isHot && (
                    <span className="px-2 py-0.5 text-[9px] font-black rounded-full bg-blue-100 dark:bg-blue-900/40 text-[#2563EB] dark:text-blue-300 uppercase">
                      HOT
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 dark:text-gray-400 mt-1 font-medium">{topic.postsCount.toLocaleString()} trader posts</div>
              </div>

              {topic.associatedStockSymbol && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openStockModal(topic.associatedStockSymbol!);
                  }}
                  className="px-3 py-1 rounded-full bg-white dark:bg-[#131c30] border border-slate-200 dark:border-white/10 text-xs font-mono font-bold text-slate-800 dark:text-gray-200 hover:border-[#2563EB] transition-colors shadow-2xs"
                >
                  ${topic.associatedStockSymbol}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Top Trending Stocks Grid */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#2563EB]" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-gray-100">Top Tagged Stocks Right Now</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trendingStocks.map((stock) => (
            <div
              key={stock.symbol}
              onClick={() => openStockModal(stock.symbol)}
              className="p-4.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#131c30] border border-slate-200/80 dark:border-white/10 hover:border-[#2563EB] transition-all cursor-pointer flex items-center justify-between group shadow-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg text-slate-900 dark:text-white font-mono group-hover:text-[#2563EB] transition-colors">
                    ${stock.symbol}
                  </span>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-[#2563EB] dark:bg-blue-900/30 dark:text-blue-300 font-mono">
                    #{stock.trendingRank} Hot
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-gray-400 font-medium">{stock.name}</div>
                <div className="text-xs text-slate-400 flex items-center gap-2 font-mono pt-1">
                  <span>Vol: {stock.volume}</span>
                  <span>•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{stock.bullishPercentage}% Bullish</span>
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="text-base font-black text-slate-900 dark:text-white">₹{stock.currentPrice.toLocaleString('en-IN')}</div>
                <div className={`text-xs font-bold flex items-center justify-end gap-0.5 ${stock.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {stock.change >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {stock.change >= 0 ? '+' : ''}{stock.changePercent}%
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">{stock.tagCount.toLocaleString()} posts</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Top Trader Leaderboard */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
          <Trophy className="w-5 h-5 text-[#2563EB]" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-gray-100">Top Verified Traders Leaderboard</h3>
        </div>

        <div className="space-y-2.5">
          {users.map((trader, idx) => (
            <div
              key={trader.id}
              onClick={() => viewUserProfile(trader)}
              className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-white/5 border border-slate-200/80 dark:border-white/5 hover:border-slate-300 transition-colors flex items-center justify-between cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-center font-mono font-black text-[#2563EB] dark:text-[#60A5FA] text-sm">
                  #{idx + 1}
                </span>
                <img src={trader.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs" />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900 dark:text-gray-200">
                    {trader.name}
                    {trader.verified && <span className="text-[#2563EB] text-xs">✓</span>}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">@{trader.username}</div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block font-mono">
                  <div className="text-[10px] text-slate-400 uppercase">P&L TODAY</div>
                  <div className={`text-xs font-bold ${trader.totalPnlToday >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {trader.totalPnlToday >= 0 ? '+₹' : '-₹'}{Math.abs(trader.totalPnlToday).toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-[10px] text-slate-400 uppercase">WIN RATE</div>
                  <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">{trader.winRate}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
