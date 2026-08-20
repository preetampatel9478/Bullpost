import React from 'react';
import { useApp } from '../context/AppContext';
import { PostCard } from './PostCard';
import { FinancialChart } from './FinancialChart';
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  BarChart2, 
  Flame, 
  PlusCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart
} from 'lucide-react';

export const StockDetailModal: React.FC = () => {
  const { selectedStock, setSelectedStock, posts, setIsComposerOpen } = useApp();

  if (!selectedStock) return null;

  // Filter posts related to this stock symbol
  const stockPosts = posts.filter(p => 
    p.targetStockSymbol?.toUpperCase() === selectedStock.symbol.toUpperCase() ||
    p.content.toUpperCase().includes(selectedStock.symbol.toUpperCase()) ||
    p.hashtags.some(t => t.toUpperCase().includes(selectedStock.symbol.toUpperCase()))
  );

  return (
    <div className="modal-overlay">
      <div className="bg-white dark:bg-[#0e1524] border border-slate-200 dark:border-[rgba(255,255,255,0.15)] rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-5 sm:p-6 shadow-2xl animate-fadeIn text-slate-900 dark:text-gray-100 space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">${selectedStock.symbol}</h2>
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-gray-300">
                {selectedStock.name}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">NSE / BSE Live Trading Symbol</span>
          </div>

          <button 
            onClick={() => setSelectedStock(null)}
            className="p-1.5 text-gray-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Price Data & Percentage */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-[#131c30] border border-slate-200 dark:border-white/10">
          <div>
            <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
              ₹{selectedStock.currentPrice.toLocaleString('en-IN')}
            </div>
            <div className={`text-sm font-bold flex items-center gap-1 font-mono ${selectedStock.change >= 0 ? 'text-bullish' : 'text-bearish'}`}>
              {selectedStock.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change} ({selectedStock.changePercent}%) Today
            </div>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs text-slate-700 dark:text-gray-300">
            <div>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 block uppercase">DAY HIGH</span>
              <span className="font-bold text-slate-900 dark:text-gray-200">₹{selectedStock.dayHigh}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 block uppercase">DAY LOW</span>
              <span className="font-bold text-slate-900 dark:text-gray-200">₹{selectedStock.dayLow}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 block uppercase">24H VOLUME</span>
              <span className="font-bold text-slate-900 dark:text-gray-200">{selectedStock.volume}</span>
            </div>
          </div>
        </div>

        {/* Interactive Candlestick / Area Chart Component */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-[#059669] dark:text-[#00E676]" /> Interactive Technical Chart
            </span>
            <span className="font-mono text-[#059669] dark:text-[#00E676]">{selectedStock.bullishPercentage}% Trader Bullish Sentiment</span>
          </div>

          <FinancialChart 
            symbol={selectedStock.symbol} 
            currentPrice={selectedStock.currentPrice} 
            changePercent={selectedStock.changePercent} 
          />
        </div>

        {/* Post About Stock Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 border border-emerald-500/30">
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Trading ${selectedStock.symbol}?</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">Share your entry, target price, or verified P&L proof with the community.</p>
          </div>
          <button
            onClick={() => {
              setSelectedStock(null);
              setIsComposerOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-[#059669] text-white dark:bg-[#00E676] dark:text-[#070a11] font-bold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-lg shrink-0"
          >
            <PlusCircle className="w-4 h-4" /> Post Trade Callout
          </button>
        </div>

        {/* Community Posts Filtered by Ticker */}
        <div className="space-y-4 pt-2">
          <h3 className="font-bold text-base text-slate-900 dark:text-gray-100 flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 dark:text-amber-400" /> Community Trader Discussions for ${selectedStock.symbol} ({stockPosts.length})
          </h3>

          {stockPosts.length === 0 ? (
            <div className="p-8 text-center glass-card text-gray-400 text-sm">
              No specific post callouts for ${selectedStock.symbol} yet. Be the first trader to post!
            </div>
          ) : (
            <div className="space-y-4">
              {stockPosts.map(p => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
