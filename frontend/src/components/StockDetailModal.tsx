import React from 'react';
import { useApp } from '../context/AppContext';
import { PostCard } from './PostCard';
import { FinancialChart } from './FinancialChart';
import { 
  X, 
  Flame, 
  PlusCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  BarChart2
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
      <div className="bg-white dark:bg-[#0e1524] border border-slate-200 dark:border-white/10 rounded-[32px] w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 sm:p-7 shadow-2xl animate-fadeIn text-slate-900 dark:text-gray-100 space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black font-mono text-slate-900 dark:text-white">${selectedStock.symbol}</h2>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#2563EB] dark:bg-white/10 dark:text-gray-300">
                {selectedStock.name}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono">NSE / BSE Live Trading Terminal</span>
          </div>

          <button 
            onClick={() => setSelectedStock(null)}
            className="p-1.5 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Price Data & Percentage */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#131c30] border border-slate-200/80 dark:border-white/10">
          <div>
            <div className="text-3xl font-black font-mono text-slate-900 dark:text-white">
              ₹{selectedStock.currentPrice.toLocaleString('en-IN')}
            </div>
            <div className={`text-xs sm:text-sm font-bold flex items-center gap-1 font-mono ${selectedStock.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {selectedStock.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change} ({selectedStock.changePercent}%) Today
            </div>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs text-slate-700 dark:text-gray-300">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-sans font-bold">DAY HIGH</span>
              <span className="font-bold text-slate-900 dark:text-gray-200">₹{selectedStock.dayHigh}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-sans font-bold">DAY LOW</span>
              <span className="font-bold text-slate-900 dark:text-gray-200">₹{selectedStock.dayLow}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-sans font-bold">24H VOLUME</span>
              <span className="font-bold text-slate-900 dark:text-gray-200">{selectedStock.volume}</span>
            </div>
          </div>
        </div>

        {/* Interactive Candlestick / Area Chart Component */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-gray-300">
              <BarChart2 className="w-4 h-4 text-[#2563EB]" /> Interactive Technical Chart
            </span>
            <span className="font-mono text-[#2563EB] font-bold">{selectedStock.bullishPercentage}% Trader Bullish Sentiment</span>
          </div>

          <FinancialChart 
            symbol={selectedStock.symbol} 
            currentPrice={selectedStock.currentPrice} 
            changePercent={selectedStock.changePercent} 
          />
        </div>

        {/* Post About Stock Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-500/20">
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Trading ${selectedStock.symbol}?</h4>
            <p className="text-xs text-slate-500 dark:text-gray-400">Share your entry, target price, or verified P&L proof with the community.</p>
          </div>
          <button
            onClick={() => {
              setSelectedStock(null);
              setIsComposerOpen(true);
            }}
            className="px-5 py-2.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-1.5 shrink-0 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" /> Post Trade Callout
          </button>
        </div>

        {/* Community Posts Filtered by Ticker */}
        <div className="space-y-4 pt-2">
          <h3 className="font-black text-base text-slate-900 dark:text-gray-100 flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#2563EB]" /> Community Trader Discussions for ${selectedStock.symbol} ({stockPosts.length})
          </h3>

          {stockPosts.length === 0 ? (
            <div className="p-8 text-center glass-card text-slate-400 text-sm font-medium">
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
