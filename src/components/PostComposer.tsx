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
      <div className="bg-white dark:bg-[#0e1524] border border-slate-200 dark:border-[rgba(255,255,255,0.15)] rounded-t-2xl sm:rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-4 sm:p-6 shadow-2xl animate-fadeIn text-slate-900 dark:text-gray-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-[#059669] to-[#00E676] p-0.5">
              <div className="w-full h-full bg-[#070a11] rounded-[6px] flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00E676]" />
              </div>
            </div>
            <h3 className="font-extrabold text-sm sm:text-lg text-slate-900 dark:text-white">Create Trader Post & P&L Proof</h3>
          </div>
          <button 
            onClick={() => setIsComposerOpen(false)}
            className="p-1.5 text-gray-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-3.5 space-y-4">
          
          {/* Post Type Selector */}
          <div>
            <label className="text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 block mb-1.5">Select Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'pnl', label: '💰 P&L Proof', desc: 'Share P&L' },
                { id: 'callout', label: '🚀 Stock Callout', desc: 'Trade Setup' },
                { id: 'gap_analysis', label: '📊 Gap Analysis', desc: 'Market Open' },
                { id: 'general', label: '💬 Market Post', desc: 'Opinion' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPostType(item.id as PostType)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    postType === item.id 
                      ? 'border-[#059669] dark:border-[#00E676] bg-emerald-500/10 text-slate-900 dark:text-white font-bold' 
                      : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-gray-500'
                  }`}
                >
                  <div className="text-xs font-bold">{item.label}</div>
                  <div className="text-[10px] text-gray-400">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Stock Ticker & Sentiment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 block mb-1">Target Stock Ticker</label>
              <input
                type="text"
                placeholder="e.g. VEDL, NIFTY50"
                value={targetStockSymbol}
                onChange={(e) => {
                  setTargetStockSymbol(e.target.value);
                  setPnlSymbol(e.target.value);
                }}
                className="w-full bg-slate-50 dark:bg-[#131c30] border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#059669] dark:focus:border-[#00E676]"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 block mb-1">Market Sentiment</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSentiment('bullish')}
                  className={`flex-1 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                    sentiment === 'bullish' 
                      ? 'bg-emerald-500/20 border-[#059669] dark:border-[#00E676] text-[#059669] dark:text-[#00E676]' 
                      : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-gray-500'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" /> Bullish 🚀
                </button>
                <button
                  type="button"
                  onClick={() => setSentiment('bearish')}
                  className={`flex-1 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                    sentiment === 'bearish' 
                      ? 'bg-red-500/20 border-red-500 text-red-600 dark:text-red-400' 
                      : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-gray-500'
                  }`}
                >
                  <TrendingDown className="w-3.5 h-3.5" /> Bearish 🔻
                </button>
              </div>
            </div>
          </div>

          {/* 1-Click SEBI Broker Verification Badge Selector */}
          {postType === 'pnl' && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-500" /> 1-Click SEBI Broker Verification
                </span>
                <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded font-mono">SEBI COMPLIANT</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {['Zerodha Kite', 'Dhan', 'Groww', 'AngelOne'].map(broker => (
                  <button
                    key={broker}
                    type="button"
                    onClick={() => setSelectedBroker(broker)}
                    className={`p-2 rounded-lg border font-mono text-[11px] font-bold transition-all flex items-center justify-between ${
                      selectedBroker === broker
                        ? 'border-amber-500 bg-amber-500/20 text-amber-600 dark:text-amber-300'
                        : 'border-slate-200 dark:border-white/10 bg-white/5 text-gray-400'
                    }`}
                  >
                    <span>{broker}</span>
                    {selectedBroker === broker && <CheckCircle2 className="w-3 h-3 text-amber-500" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* P&L Details (If post type is P&L) */}
          {postType === 'pnl' && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#131c30] border border-slate-200 dark:border-[#00E676]/30 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#059669] dark:text-[#00E676]">
                <span>P&L Proof Calculator Card</span>
                <span className="font-mono text-[9px] bg-emerald-500/20 px-1.5 py-0.5 rounded">LIVE PREVIEW</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <label className="text-[9px] text-gray-500 dark:text-gray-400 block">Instrument</label>
                  <select
                    value={tradeType}
                    onChange={(e) => setTradeType(e.target.value as any)}
                    className="w-full bg-white dark:bg-[#0e1524] border border-slate-200 dark:border-white/10 rounded-lg p-1.5 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="EQUITY BUY">EQUITY BUY</option>
                    <option value="CALL (CE)">CALL (CE)</option>
                    <option value="PUT (PE)">PUT (PE)</option>
                    <option value="EQUITY SHORT">EQUITY SHORT</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] text-gray-500 dark:text-gray-400 block">Buy Price (₹)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={entryPrice}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setEntryPrice(val);
                      handleCalculatePnl(val, exitPrice, qty);
                    }}
                    className="w-full bg-white dark:bg-[#0e1524] border border-slate-200 dark:border-white/10 rounded-lg p-1.5 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[9px] text-gray-500 dark:text-gray-400 block">Sell Price (₹)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={exitPrice}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setExitPrice(val);
                      handleCalculatePnl(entryPrice, val, qty);
                    }}
                    className="w-full bg-white dark:bg-[#0e1524] border border-slate-200 dark:border-white/10 rounded-lg p-1.5 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[9px] text-gray-500 dark:text-gray-400 block">Quantity</label>
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setQty(val);
                      handleCalculatePnl(entryPrice, exitPrice, val);
                    }}
                    className="w-full bg-white dark:bg-[#0e1524] border border-slate-200 dark:border-white/10 rounded-lg p-1.5 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Calculated Result Banner */}
              <div className={`p-2.5 rounded-xl flex items-center justify-between font-mono ${pnlAmount >= 0 ? 'bg-emerald-500/15 text-[#059669] dark:text-[#00E676]' : 'bg-red-500/15 text-red-600 dark:text-[#FF3B30]'}`}>
                <span className="text-[11px] font-bold">Calculated Profit:</span>
                <span className="text-base sm:text-lg font-extrabold">
                  {pnlAmount >= 0 ? '+₹' : '-₹'}{Math.abs(pnlAmount).toLocaleString('en-IN')} 
                </span>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 block mb-1">Market Analysis & Notes</label>
            <textarea
              rows={3}
              placeholder="Write your trade setup details, gap analysis, or market thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#131c30] border border-slate-300 dark:border-white/10 rounded-xl p-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#059669] dark:focus:border-[#00E676] resize-none"
            />
          </div>

          {/* Hashtags Input */}
          <div>
            <label className="text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 block mb-1 flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> Hashtags
            </label>
            <input
              type="text"
              placeholder="#vedanta #nifty50 #breakout"
              value={hashtagInput}
              onChange={(e) => setHashtagInput(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#131c30] border border-slate-300 dark:border-white/10 rounded-xl p-2 text-xs sm:text-sm font-mono text-amber-600 dark:text-amber-400 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Disclaimer Icon Badge Preview */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span className="font-bold">Attached Post Badge Preview:</span>
              <button
                type="button"
                onClick={() => setShowPreviewDisclaimer(!showPreviewDisclaimer)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold font-mono hover:bg-amber-500/25 transition-all"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Disclaimer ℹ️</span>
              </button>
            </div>
            
            {showPreviewDisclaimer && (
              <p className="text-[11px] text-amber-600 dark:text-amber-300/90 leading-relaxed pt-1 font-mono">
                "⚠️ Trader Disclaimer: Personal market opinion & portfolio proof. Not financial or SEBI investment advice. DYOR."
              </p>
            )}
          </div>

          {/* Submit Action */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
            <button
              type="button"
              onClick={() => setIsComposerOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-gray-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-slate-900 text-white dark:bg-gradient-to-r dark:from-[#00E676] dark:to-[#00F2FE] dark:text-[#070a11] font-extrabold text-xs sm:text-sm hover:opacity-90 flex items-center gap-1.5 shadow-lg"
            >
              <Send className="w-3.5 h-3.5" /> Post To Feed
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
