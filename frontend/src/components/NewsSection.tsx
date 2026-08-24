import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Newspaper, 
  TrendingUp, 
  TrendingDown, 
  Clock
} from 'lucide-react';

export const NewsSection: React.FC = () => {
  const { news, openStockModal } = useApp();
  const [filterSentiment, setFilterSentiment] = useState<string>('all');

  const filteredNews = news.filter(item => {
    if (filterSentiment === 'all') return true;
    return item.sentiment === filterSentiment;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* News Header & Sentiment Filters */}
      <div className="glass-card p-6 space-y-5 border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#3B82F6] flex items-center justify-center shadow-md shadow-blue-500/20">
              <Newspaper className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Live Market & Stock News</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Curated financial headlines, gap analysis & stock triggers.</p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 text-xs font-bold">
            {[
              { id: 'all', label: 'All News' },
              { id: 'bullish', label: '🚀 Bullish (3)' },
              { id: 'bearish', label: '🔻 Bearish (1)' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterSentiment(f.id)}
                className={`px-3.5 py-1.5 rounded-full border transition-all ${
                  filterSentiment === f.id
                    ? 'bg-blue-50 dark:bg-blue-600/20 border-[#2563EB] dark:border-blue-500/40 text-[#2563EB] dark:text-[#60A5FA] font-black'
                    : 'bg-[#F8FAFC] dark:bg-[#1E293B] border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* News Feed List */}
        <div className="space-y-4">
          {filteredNews.map(item => (
            <article 
              key={item.id}
              className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row gap-4 items-start shadow-2xs"
            >
              {item.imageUrl && (
                <img 
                  src={item.imageUrl} 
                  alt="" 
                  className="w-full md:w-48 h-32 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shrink-0" 
                />
              )}

              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 uppercase font-mono ${
                    item.sentiment === 'bullish' ? 'badge-bullish' : 'badge-bearish'
                  }`}>
                    {item.sentiment === 'bullish' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {item.sentiment}
                  </span>

                  <span className="text-slate-400 dark:text-slate-400 flex items-center gap-1 font-mono text-[11px]">
                    <Clock className="w-3 h-3" /> {item.timestamp}
                  </span>

                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span className="text-slate-500 dark:text-slate-400 font-bold">{item.source}</span>
                </div>

                <h3 className="text-base font-black text-slate-900 dark:text-white hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {item.summary}
                </p>

                {/* Related Stock Ticker Buttons */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="text-[11px] text-slate-400">Related Stocks:</span>
                  {item.relatedTickers.map(ticker => (
                    <button
                      key={ticker}
                      onClick={() => openStockModal(ticker)}
                      className="px-3 py-0.5 rounded-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 hover:border-[#2563EB] dark:hover:border-[#60A5FA] hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors shadow-2xs"
                    >
                      ${ticker}
                    </button>
                  ))}
                </div>
              </div>

            </article>
          ))}
        </div>

      </div>

    </div>
  );
};
