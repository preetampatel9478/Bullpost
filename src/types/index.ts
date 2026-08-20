export type PostType = 'general' | 'pnl' | 'callout' | 'gap_analysis' | 'news';
export type Sentiment = 'bullish' | 'bearish' | 'neutral';

export interface User {
  id: string;
  name: string;
  username: string; // Unique username (e.g. @alpha_trader)
  avatar: string;
  bio: string;
  verified: boolean;
  traderType: 'Options Pro' | 'Intraday Scalper' | 'Swing Trader' | 'Equity Quant' | 'Crypto Trader';
  winRate: number; // e.g. 76%
  totalPnlToday: number; // e.g. +42500
  totalTradesToday: number;
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
}

export interface PnlDetails {
  symbol: string;
  entryPrice: number;
  exitPrice: number;
  qty: number;
  pnlAmount: number; // e.g. +14200
  pnlPercentage: number; // e.g. +8.4%
  tradeType: 'CALL (CE)' | 'PUT (PE)' | 'EQUITY BUY' | 'EQUITY SHORT' | 'FUTURES';
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userHandle: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
}

export interface Post {
  id: string;
  author: User;
  createdAt: string;
  content: string;
  type: PostType;
  pnlDetails?: PnlDetails;
  sentiment?: Sentiment;
  targetStockSymbol?: string;
  stockChange?: number; // e.g. +3.4%
  hashtags: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  bookmarksCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  comments: Comment[];
  disclaimerText: string;
}

export interface StockTicker {
  symbol: string; // e.g. VEDL, NIFTY50, TATAMOTORS, RELIANCE
  name: string;
  currentPrice: number;
  change: number; // absolute
  changePercent: number;
  volume: string;
  dayHigh: number;
  dayLow: number;
  sparkline: number[]; // chart data points
  bullishPercentage: number;
  isTrending?: boolean;
  trendingRank?: number;
  tagCount: number;
}

export interface TrendingTopic {
  id: string;
  tag: string; // e.g. #vedanta, #nifty50
  category: 'Stock Ticker' | 'Market Sentiment' | 'Strategy' | 'Crypto';
  postsCount: number;
  isHot: boolean;
  associatedStockSymbol?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  timestamp: string;
  sentiment: Sentiment;
  relatedTickers: string[];
  readTime: string;
  imageUrl?: string;
}

export interface Notification {
  id: string;
  type: 'follow' | 'like' | 'comment' | 'price_alert' | 'trending';
  user?: {
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  read: boolean;
  targetPostId?: string;
  targetStockSymbol?: string;
}
