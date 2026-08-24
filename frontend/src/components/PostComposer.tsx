import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PostType, Sentiment, PnlDetails } from '../types';
import { 
  X, 
  Flame, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Hash, 
  Send,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const PostComposer: React.FC = () => {
  const { isComposerOpen, setIsComposerOpen, addPost } = useApp();

  const [postType, setPostType] = useState<PostType>('pnl');
  const [content, setContent] = useState<string>('');
  const [sentiment, setSentiment] = useState<Sentiment>('bullish');
  const [targetStockSymbol, setTargetStockSymbol] = useState<string>('VEDL');
  const [hashtagInput, setHashtagInput] = useState<string>('#vedanta #BreakoutAlert #Nifty50');
  const [showPreviewDisclaimer, setShowPreviewDisclaimer] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState<string>('Zerodha Kite');

  // P&L Builder state
  const [pnlSymbol, setPnlSymbol] = useState<string>('VEDL');
  const [tradeType, setTradeType] = useState<'CALL (CE)' | 'PUT (PE)' | 'EQUITY BUY' | 'EQUITY SHORT' | 'FUTURES'>('EQUITY BUY');
  const [entryPrice, setEntryPrice] = useState<number>(442.0);
  const [exitPrice, setExitPrice] = useState<number>(462.5);
  const [qty, setQty] = useState<number>(1000);
  const [pnlAmount, setPnlAmount] = useState<number>(20500);

  if (!isComposerOpen) return null;

  const handleCalculatePnl = (entry: number, exit: number, quantity: number) => {
    const total = (exit - entry) * quantity;
    setPnlAmount(total);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const hashtagsArr = hashtagInput
      .split(' ')
      .filter(t => t.trim().length > 0)
      .map(t => t.startsWith('#') ? t : `#${t}`);

    let pnlDetailsObj: PnlDetails | undefined = undefined;

    if (postType === 'pnl') {
      const returnPct = entryPrice > 0 ? ((exitPrice - entryPrice) / entryPrice) * 100 : 0;
      pnlDetailsObj = {
        symbol: pnlSymbol.toUpperCase(),
        entryPrice,
        exitPrice,
        qty,
        pnlAmount,
        pnlPercentage: parseFloat(returnPct.toFixed(2)),
        tradeType,
      };
    }

    addPost({
      content: content.trim() || `Trading update for $${targetStockSymbol.toUpperCase()} ${hashtagsArr.join(' ')}`,
      type: postType,
      sentiment,
      targetStockSymbol: targetStockSymbol.toUpperCase(),
      stockChange: sentiment === 'bullish' ? 3.4 : -1.8,
      hashtags: hashtagsArr,
      pnlDetails: pnlDetailsObj,
    });

    setContent('');
    setIsComposerOpen(false);
  };

  return (
    <div className="modal-overlay">
      <div className="bg-white dark:bg-[#0e1524] border border-slate-200 dark:border-white/10 rounded-[32px] w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 sm:p-7 shadow-2xl animate-fadeIn text-slate-900 dark:text-gray-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#3B82F6] flex items-center justify-center shadow-md shadow-blue-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-black text-lg text-slate-900 dark:text-white">Create Trader Post & P&L</h3>
          </div>
          <button 
            onClick={() => setIsComposerOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Post Type Selector */}
          <div>
            <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1.5">Select Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'pnl', label: '💰 P&L Proof', desc: 'Verified P&L' },
                { id: 'callout', label: '🚀 Stock Callout', desc: 'Trade Setup' },
                { id: 'gap_analysis', label: '📊 Gap Analysis', desc: 'Opening Range' },
                { id: 'general', label: '💬 Market Post', desc: 'Analysis' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPostType(item.id as PostType)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    postType === item.id 
                      ? 'border-[#2563EB] bg-blue-50 dark:bg-blue-600/15 text-[#2563EB] dark:text-[#60A5FA] font-bold shadow-2xs' 
                      : 'border-slate-200 dark:border-white/10 bg-[#F8FAFC] dark:bg-white/5 text-slate-600 dark:text-gray-400'
                  }`}
                >
                  <div className="text-xs font-bold">{item.label}</div>
                  <div className="text-[10px] text-slate-400">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Stock Ticker & Sentiment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Target Stock Ticker</label>
              <input
                type="text"
                placeholder="e.g. VEDL, NIFTY50"
                value={targetStockSymbol}
                onChange={(e) => {
                  setTargetStockSymbol(e.target.value);
                  setPnlSymbol(e.target.value);
                }}
                className="w-full bg-[#F8FAFC] dark:bg-[#131c30] border border-slate-200 dark:border-white/10 rounded-full px-4 py-2.5 text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Market Sentiment</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSentiment('bullish')}
                  className={`flex-1 py-2.5 rounded-full border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    sentiment === 'bullish' 
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-600 font-black shadow-xs' 
                      : 'border-slate-200 dark:border-white/10 bg-[#F8FAFC] dark:bg-white/5 text-slate-500'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 text-emerald-500" /> Bullish 🚀
                </button>
                <button
                  type="button"
                  onClick={() => setSentiment('bearish')}
                  className={`flex-1 py-2.5 rounded-full border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    sentiment === 'bearish' 
                      ? 'bg-red-50 border-red-300 text-red-600 font-black shadow-xs' 
                      : 'border-slate-200 dark:border-white/10 bg-[#F8FAFC] dark:bg-white/5 text-slate-500'
                  }`}
                >
                  <TrendingDown className="w-4 h-4 text-red-500" /> Bearish 🔻
                </button>
              </div>
            </div>
          </div>

          {/* 1-Click Broker Verification Badge Selector */}
          {postType === 'pnl' && (
            <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-gray-300">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2563EB]" /> Broker Verification
                </span>
                <span className="text-[10px] bg-blue-100 text-[#2563EB] px-2 py-0.5 rounded-full font-mono font-bold">SEBI COMPLIANT</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {['Zerodha Kite', 'Dhan', 'Groww', 'AngelOne'].map(broker => (
                  <button
                    key={broker}
                    type="button"
                    onClick={() => setSelectedBroker(broker)}
                    className={`p-2 rounded-xl border font-mono text-[11px] font-bold transition-all flex items-center justify-between ${
                      selectedBroker === broker
                        ? 'border-[#2563EB] bg-blue-50 text-[#2563EB] shadow-xs'
                        : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#131c30] text-slate-600 dark:text-gray-400'
                    }`}
                  >
                    <span>{broker}</span>
                    {selectedBroker === broker && <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* P&L Details (If post type is P&L) */}
          {postType === 'pnl' && (
            <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#131c30] border border-slate-200/80 dark:border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-gray-200">
                <span>P&L Proof Calculator Card</span>
                <span className="font-mono text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">LIVE PREVIEW</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Instrument</label>
                  <select
                    value={tradeType}
                    onChange={(e) => setTradeType(e.target.value as any)}
                    className="w-full bg-white dark:bg-[#0e1524] border border-slate-200 dark:border-white/10 rounded-xl p-2 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="EQUITY BUY">EQUITY BUY</option>
                    <option value="CALL (CE)">CALL (CE)</option>
                    <option value="PUT (PE)">PUT (PE)</option>
                    <option value="EQUITY SHORT">EQUITY SHORT</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Buy Price (₹)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={entryPrice}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setEntryPrice(val);
                      handleCalculatePnl(val, exitPrice, qty);
                    }}
                    className="w-full bg-white dark:bg-[#0e1524] border border-slate-200 dark:border-white/10 rounded-xl p-2 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Sell Price (₹)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={exitPrice}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setExitPrice(val);
                      handleCalculatePnl(entryPrice, val, qty);
                    }}
                    className="w-full bg-white dark:bg-[#0e1524] border border-slate-200 dark:border-white/10 rounded-xl p-2 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Quantity</label>
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setQty(val);
                      handleCalculatePnl(entryPrice, exitPrice, val);
                    }}
                    className="w-full bg-white dark:bg-[#0e1524] border border-slate-200 dark:border-white/10 rounded-xl p-2 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Calculated Result Banner */}
              <div className={`p-3 rounded-2xl flex items-center justify-between font-mono ${pnlAmount >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                <span className="text-xs font-bold">Calculated Return:</span>
                <span className="text-base sm:text-lg font-black">
                  {pnlAmount >= 0 ? '+₹' : '-₹'}{Math.abs(pnlAmount).toLocaleString('en-IN')} 
                </span>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Market Analysis & Notes</label>
            <textarea
              rows={3}
              placeholder="Write your trade setup details, gap analysis, or market thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-[#F8FAFC] dark:bg-[#131c30] border border-slate-200 dark:border-white/10 rounded-2xl p-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB] resize-none font-medium"
            />
          </div>

          {/* Hashtags Input */}
          <div>
            <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1 flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-[#2563EB]" /> Hashtags
            </label>
            <input
              type="text"
              placeholder="#vedanta #nifty50 #breakout"
              value={hashtagInput}
              onChange={(e) => setHashtagInput(e.target.value)}
              className="w-full bg-[#F8FAFC] dark:bg-[#131c30] border border-slate-200 dark:border-white/10 rounded-full px-4 py-2.5 text-xs sm:text-sm font-mono text-[#2563EB] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          {/* Submit Action */}
          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-white/10">
            <button
              type="button"
              onClick={() => setIsComposerOpen(false)}
              className="px-5 py-2.5 rounded-full border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300 text-xs font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-black text-xs sm:text-sm shadow-md shadow-blue-500/25 flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Send className="w-3.5 h-3.5" /> Post To Feed
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
