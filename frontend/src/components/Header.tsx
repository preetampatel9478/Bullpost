import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  Search, 
  Bell, 
  User as UserIcon, 
  Flame, 
  ArrowUpRight, 
  ArrowDownRight,
  Hash,
  X,
  Settings
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    users, 
    stocks, 
    trendingTopics, 
    notifications, 
    openStockModal,
    viewUserProfile,
    activeTab,
    setActiveTab,
    setIsSettingsDrawerOpen,
    markNotificationsAsRead,
    searchQuery,
    setSearchQuery,
    setFilterHashtag
  } = useApp();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showNotificationsPopover, setShowNotificationsPopover] = useState(false);
  const [tickerPrices, setTickerPrices] = useState(stocks);
  const [flashSymbol, setFlashSymbol] = useState<string | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Live WebSocket Tick Simulation Effect
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * stocks.length);
      const target = stocks[randomIndex];
      const delta = (Math.random() - 0.49) * 2.5;

      setTickerPrices(prev => prev.map((stk, idx) => {
        if (idx === randomIndex) {
          const newPrice = Math.max(10, parseFloat((stk.currentPrice + delta).toFixed(2)));
          return {
            ...stk,
            currentPrice: newPrice,
            change: parseFloat((stk.change + delta).toFixed(2)),
            changePercent: parseFloat((stk.changePercent + (delta > 0 ? 0.08 : -0.08)).toFixed(2))
          };
        }
        return stk;
      }));

      setFlashSymbol(target.symbol);
      setTimeout(() => setFlashSymbol(null), 800);
    }, 2200);

    return () => clearInterval(interval);
  }, [stocks]);

  const matchingUsers = searchQuery.trim() 
    ? users.filter(u => 
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const matchingStocks = searchQuery.trim()
    ? tickerPrices.filter(s => 
        s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const matchingHashtags = searchQuery.trim()
    ? trendingTopics.filter(t => 
        t.tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0e1524]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 transition-colors">
      
      {/* 1. Live Market Ticker Marquee Bar */}
      <div className="bg-slate-900 dark:bg-[#070a11] text-white py-1.5 px-3 text-[11px] sm:text-xs">
        <div className="marquee-container">
          <div className="marquee-content font-mono">
            {tickerPrices.concat(tickerPrices).map((stk, idx) => {
              const isFlashing = flashSymbol === stk.symbol;
              return (
                <div 
                  key={`${stk.symbol}-${idx}`} 
                  onClick={() => openStockModal(stk.symbol)}
                  className={`inline-flex items-center gap-1.5 cursor-pointer transition-all px-2.5 py-0.5 rounded-full ${
                    isFlashing 
                      ? stk.change >= 0 ? 'bg-emerald-500/30 text-emerald-300 scale-105' : 'bg-red-500/30 text-red-300 scale-105'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-[#60A5FA] dark:text-[#38BDF8]">${stk.symbol}</span>
                  <span className="font-bold">₹{stk.currentPrice.toLocaleString('en-IN')}</span>
                  <span className={`inline-flex items-center text-[10px] sm:text-[11px] font-bold ${stk.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stk.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stk.change >= 0 ? '+' : ''}{stk.changePercent.toFixed(2)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => { setActiveTab('home'); setFilterHashtag(null); }}
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
        >
          <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#3B82F6] flex items-center justify-center shadow-md shadow-blue-500/25">
            <TrendingUp className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-sans hidden sm:inline">
            Bullpost
          </span>
        </div>

        {/* Search Bar with Pill styling matching auth inputs */}
        <div className="flex-1 max-w-2xl relative" ref={searchRef}>
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search traders (@username), stocks ($VEDL), or hashtags (#vedanta)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="w-full bg-[#F8FAFC] dark:bg-[#131c30] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-gray-100 text-xs sm:text-sm rounded-full pl-11 pr-10 py-2.5 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-gray-500 shadow-xs"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 text-slate-400 hover:text-slate-700 dark:hover:text-gray-200 p-0.5 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {isSearchFocused && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0e1524] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden z-50 animate-fadeIn max-h-[80vh] overflow-y-auto">
              
              {matchingUsers.length > 0 && (
                <div className="p-3 border-b border-slate-100 dark:border-white/5">
                  <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1">
                    <UserIcon className="w-3.5 h-3.5 text-[#2563EB]" /> Traders ({matchingUsers.length})
                  </div>
                  <div className="space-y-1">
                    {matchingUsers.map(user => (
                      <div
                        key={user.id}
                        onClick={() => {
                          viewUserProfile(user);
                          setIsSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-white/10" />
                          <div>
                            <div className="flex items-center gap-1 text-xs font-bold text-slate-900 dark:text-gray-200">
                              {user.name}
                              {user.verified && <span className="text-[#2563EB] text-[10px]">✓</span>}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">@{user.username}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">+{user.winRate}% Win</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchingStocks.length > 0 && (
                <div className="p-3 border-b border-slate-100 dark:border-white/5">
                  <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-[#2563EB]" /> Stocks ({matchingStocks.length})
                  </div>
                  <div className="space-y-1">
                    {matchingStocks.map(stock => (
                      <div
                        key={stock.symbol}
                        onClick={() => {
                          openStockModal(stock.symbol);
                          setIsSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-gray-100">${stock.symbol}</div>
                          <div className="text-[10px] text-slate-400">{stock.name}</div>
                        </div>
                        <div className="text-right font-mono">
                          <div className="text-xs font-bold text-slate-900 dark:text-gray-200">₹{stock.currentPrice.toLocaleString('en-IN')}</div>
                          <div className={`text-[10px] font-bold ${stock.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                            {stock.change >= 0 ? '+' : ''}{stock.changePercent}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchingHashtags.length > 0 && (
                <div className="p-3">
                  <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-[#2563EB]" /> Hashtags & Topics
                  </div>
                  <div className="space-y-1">
                    {matchingHashtags.map(t => (
                      <div
                        key={t.id}
                        onClick={() => {
                          setFilterHashtag(t.tag);
                          setActiveTab('trending');
                          setIsSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
                      >
                        <span className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] font-mono">{t.tag}</span>
                        <span className="text-[10px] text-slate-400">{t.postsCount.toLocaleString()} posts</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          {/* Settings Icon Button */}
          {activeTab === 'profile' && (
            <button
              onClick={() => setIsSettingsDrawerOpen(true)}
              className="p-2.5 rounded-full bg-[#F8FAFC] dark:bg-[#131c30] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300 hover:text-[#2563EB] transition-all shadow-xs flex items-center justify-center group"
              title="App Settings"
            >
              <Settings className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform group-hover:rotate-45" />
            </button>
          )}

          {/* Notification Bell Icon */}
          <div className="relative shrink-0">
            <button
              onClick={() => {
                setShowNotificationsPopover(!showNotificationsPopover);
                if (unreadCount > 0) markNotificationsAsRead();
              }}
              className="p-2.5 rounded-full bg-[#F8FAFC] dark:bg-[#131c30] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300 hover:text-[#2563EB] hover:border-slate-300 transition-all relative shadow-xs"
            >
              <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#2563EB] text-white font-extrabold text-[9px] flex items-center justify-center shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {showNotificationsPopover && (
              <div className="absolute right-0 mt-3 w-72 sm:w-80 md:w-96 bg-white dark:bg-[#0e1524] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl p-4 z-50 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-2.5 mb-3">
                  <h4 className="font-bold text-xs sm:text-sm flex items-center gap-2 text-slate-900 dark:text-gray-100">
                    <Bell className="w-3.5 h-3.5 text-[#2563EB]" /> Notifications
                  </h4>
                  <button 
                    onClick={() => { setActiveTab('notifications'); setShowNotificationsPopover(false); }}
                    className="text-[11px] font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.slice(0, 4).map(n => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 text-[11px] flex gap-2.5 items-start">
                      {n.user ? (
                        <img src={n.user.avatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                          <Flame className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div>
                        <p className="text-slate-800 dark:text-gray-200 font-medium">
                          {n.user && <strong className="font-bold text-slate-900 dark:text-white">@{n.user.username} </strong>}
                          {n.content}
                        </p>
                        <span className="text-[9px] text-slate-400 mt-0.5 block">{n.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </header>
  );
};
