import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Flame, 
  TrendingUp, 
  TrendingDown, 
  Hash, 
  Trophy, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Sparkles,
  BarChart2
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
    toggleFollowUser,
    filterHashtag
  } = useApp();

  const trendingStocks = stocks.filter(s => s.isTrending).sort((a, b) => (a.trendingRank || 99) - (b.trendingRank || 99));

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. Market Sentiment Overview Meter */}
      <div className="glass-card p-6 border border-[#059669]/30 dark:border-[#00E676]/30 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#047857] dark:text-[#00E676] tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-[#047857] dark:text-[#00E676]" /> Market Sentiment Index Today
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">76% Bullish Sentiment</h2>
            <p className="text-xs text-slate-600 dark:text-gray-400 mt-1">Based on 28,400+ trader posts & stock callouts in the last 24 hours.</p>
          </div>

          {/* Sentiment Meter Bar */}
          <div className="w-full md:w-80 space-y-2">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-bullish flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> 76% BULLS
              </span>
              <span className="text-bearish flex items-center gap-1">
                24% BEARS <TrendingDown className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="h-3 w-full bg-slate-200 dark:bg-gray-800 rounded-full overflow-hidden flex p-0.5 border border-slate-300 dark:border-white/10">
              <div className="bg-[#059669] dark:bg-[#00E676] h-full rounded-l-full" style={{ width: '76%' }} />
              <div className="bg-[#DC2626] dark:bg-[#FF3B30] h-full rounded-r-full" style={{ width: '24%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Trending Hashtags (e.g. #vedanta, #nifty50) */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 burning-fire-icon" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-gray-100">Trending Topics & Stock Tags</h3>
          </div>
          {filterHashtag && (
            <button
              onClick={() => setFilterHashtag(null)}
              className="text-xs text-[#0284C7] dark:text-[#00F2FE] hover:underline flex items-center gap-1 font-semibold"
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
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                filterHashtag === topic.tag
                  ? 'border-amber-500 bg-amber-500/15'
                  : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-amber-500/50'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5 font-mono font-extrabold text-amber-600 dark:text-amber-400 text-sm">
                  <span>#{idx + 1}</span>
                  <span>{topic.tag}</span>
                  {topic.isHot && (
                    <span className="px-1.5 py-0.5 text-[9px] font-extrabold rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 uppercase">
                      HOT
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-600 dark:text-gray-400 mt-1 font-medium">{topic.postsCount.toLocaleString()} trader posts</div>
              </div>

              {topic.associatedStockSymbol && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openStockModal(topic.associatedStockSymbol!);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/15 dark:bg-[#00E676]/15 border border-[#059669]/30 dark:border-[#00E676]/30 text-[11px] font-mono font-bold text-[#047857] dark:text-[#00E676] hover:bg-[#059669] hover:text-white transition-colors"
                >
                  ${topic.associatedStockSymbol}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Top Trending Stocks Grid */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#059669] dark:text-[#00E676]" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-gray-100">Top Tagged Stocks Right Now</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trendingStocks.map((stock) => (
            <div
              key={stock.symbol}
              onClick={() => openStockModal(stock.symbol)}
              className="p-4 rounded-xl bg-slate-50 dark:bg-[#131c30] border border-slate-200 dark:border-white/10 hover:border-[#059669] transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg text-slate-900 dark:text-white font-mono group-hover:text-[#059669] dark:group-hover:text-[#00E676] transition-colors">
                    ${stock.symbol}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono">
                    #{stock.trendingRank} Trending
                  </span>
                </div>
                <div className="text-xs text-slate-600 dark:text-gray-400">{stock.name}</div>
                <div className="text-[11px] text-slate-600 dark:text-gray-400 flex items-center gap-2 font-mono pt-1">
                  <span>Vol: {stock.volume}</span>
                  <span>•</span>
                  <span className="text-[#047857] dark:text-[#00E676] font-bold">{stock.bullishPercentage}% Bullish</span>
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="text-base font-extrabold text-slate-900 dark:text-white">₹{stock.currentPrice.toLocaleString('en-IN')}</div>
                <div className={`text-xs font-bold flex items-center justify-end gap-0.5 ${stock.change >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                  {stock.change >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {stock.change >= 0 ? '+' : ''}{stock.changePercent}%
                </div>
                <span className="text-[10px] text-slate-500 dark:text-gray-500 mt-1 block">{stock.tagCount.toLocaleString()} posts</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Top Trader Leaderboard */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-gray-100">Top Verified Traders Leaderboard</h3>
        </div>

        <div className="space-y-2">
          {users.map((trader, idx) => (
            <div
              key={trader.id}
              onClick={() => viewUserProfile(trader)}
              className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 transition-colors flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-center font-mono font-extrabold text-amber-600 dark:text-amber-400 text-sm">
                  #{idx + 1}
                </span>
                <img src={trader.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900 dark:text-gray-200">
                    {trader.name}
                    {trader.verified && <span className="text-[#059669] dark:text-[#00E676] text-xs">✓</span>}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-gray-400 font-mono">@{trader.username}</div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block font-mono">
                  <div className="text-xs text-slate-500 dark:text-gray-400">P&L TODAY</div>
                  <div className={`text-xs font-bold ${trader.totalPnlToday >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                    {trader.totalPnlToday >= 0 ? '+₹' : '-₹'}{Math.abs(trader.totalPnlToday).toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-xs text-slate-500 dark:text-gray-400">WIN RATE</div>
                  <div className="text-sm font-extrabold text-bullish">{trader.winRate}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
