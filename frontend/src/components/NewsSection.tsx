import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Newspaper, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  ExternalLink, 
  Filter, 
  Sparkles 
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
      <div className="glass-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00E676] to-[#00F2FE] p-0.5">
              <div className="w-full h-full bg-[#070a11] rounded-[10px] flex items-center justify-center">
                <Newspaper className="w-5 h-5 text-[#00E676]" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Live Market & Stock News</h2>
              <p className="text-xs text-gray-400">Curated financial headlines, gap analysis & stock triggers.</p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 text-xs font-semibold">
            {[
              { id: 'all', label: 'All News' },
              { id: 'bullish', label: '🚀 Bullish (3)' },
              { id: 'bearish', label: '🔻 Bearish (1)' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterSentiment(f.id)}
                className={`px-3 py-1.5 rounded-xl border transition-all ${
                  filterSentiment === f.id
                    ? 'bg-[#00E676]/20 border-[#00E676] text-[#00E676] font-bold'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
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
              className="p-4 rounded-xl bg-[#131c30] border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row gap-4 items-start"
            >
              {item.imageUrl && (
                <img 
                  src={item.imageUrl} 
                  alt="" 
                  className="w-full md:w-48 h-32 object-cover rounded-xl border border-white/10 shrink-0" 
                />
              )}

              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className={`px-2 py-0.5 rounded font-extrabold flex items-center gap-1 uppercase font-mono ${
                    item.sentiment === 'bullish' ? 'badge-bullish' : 'badge-bearish'
                  }`}>
                    {item.sentiment === 'bullish' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {item.sentiment}
                  </span>

                  <span className="text-gray-400 flex items-center gap-1 font-mono text-[11px]">
                    <Clock className="w-3 h-3" /> {item.timestamp}
                  </span>

                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400 font-semibold">{item.source}</span>
                </div>

                <h3 className="text-base font-extrabold text-white hover:text-[#00E676] transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-gray-300 leading-relaxed">
                  {item.summary}
                </p>

                {/* Related Stock Ticker Buttons */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="text-[11px] text-gray-400">Related Stocks:</span>
                  {item.relatedTickers.map(ticker => (
                    <button
                      key={ticker}
                      onClick={() => openStockModal(ticker)}
                      className="px-2.5 py-0.5 rounded bg-white/10 text-xs font-mono font-bold text-gray-200 hover:bg-[#00E676] hover:text-[#070a11] transition-colors"
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
