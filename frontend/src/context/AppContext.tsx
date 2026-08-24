import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Post, StockTicker, TrendingTopic, NewsItem, Notification, Comment } from '../types';
import { CURRENT_USER, MOCK_USERS, MOCK_POSTS, MOCK_STOCKS, MOCK_TRENDING_TOPICS, MOCK_NEWS, MOCK_NOTIFICATIONS } from '../data/mockData';

export type ThemeMode = 'dark' | 'light';

interface AppContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  currentUser: User;
  users: User[];
  posts: Post[];
  stocks: StockTicker[];
  trendingTopics: TrendingTopic[];
  news: NewsItem[];
  notifications: Notification[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedProfileUser: User;
  setSelectedProfileUser: (user: User) => void;
  selectedStock: StockTicker | null;
  setSelectedStock: (stock: StockTicker | null) => void;
  isComposerOpen: boolean;
  setIsComposerOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isSettingsDrawerOpen: boolean;
  setIsSettingsDrawerOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterHashtag: string | null;
  setFilterHashtag: (tag: string | null) => void;
  
  // Auth Actions
  login: (identifier: string) => void;
  signup: (data: { name: string; username: string; traderType: User['traderType']; avatar?: string }) => void;
  logout: () => void;

  // App Actions
  addPost: (postData: Partial<Post>) => void;
  toggleLikePost: (postId: string) => void;
  toggleBookmarkPost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  toggleFollowUser: (userId: string) => void;
  markNotificationsAsRead: () => void;
  openStockModal: (symbol: string) => void;
  viewUserProfile: (user: User) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('bullpost_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [stocks, setStocks] = useState<StockTicker[]>(MOCK_STOCKS);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>(MOCK_TRENDING_TOPICS);
  const [news] = useState<NewsItem[]>(MOCK_NEWS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedProfileUser, setSelectedProfileUser] = useState<User>(CURRENT_USER);
  const [selectedStock, setSelectedStock] = useState<StockTicker | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState<boolean>(false);
  
  // Default to true so home screen opens immediately on launch
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('bullpost_auth');
    return saved !== null ? saved === 'true' : true;
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterHashtag, setFilterHashtag] = useState<string | null>(null);

  // Sync theme class to root html element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark-theme');
      root.classList.add('dark');
      root.classList.remove('light-theme');
    }
    localStorage.setItem('bullpost_theme', theme);
  }, [theme]);

  // Sync auth state
  useEffect(() => {
    localStorage.setItem('bullpost_auth', String(isAuthenticated));
  }, [isAuthenticated]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Auth Methods
  const login = (identifier: string) => {
    const clean = identifier.replace('@', '').toLowerCase();
    const found = users.find(u => u.username.toLowerCase() === clean || u.name.toLowerCase().includes(clean));
    if (found) {
      setCurrentUser(found);
      setSelectedProfileUser(found);
    } else {
      const customUser: User = {
        id: `usr_${Date.now()}`,
        name: identifier.includes('@') ? identifier.split('@')[0] : identifier,
        username: clean,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        bio: 'Active Trader on Bullpost. Tracking live market momentum & price action setups. 📈',
        verified: true,
        traderType: 'Options Pro',
        winRate: 75,
        totalPnlToday: 18500,
        totalTradesToday: 4,
        followersCount: 120,
        followingCount: 45,
      };
      setUsers([customUser, ...users]);
      setCurrentUser(customUser);
      setSelectedProfileUser(customUser);
    }
    setIsAuthenticated(true);
  };

  const signup = (data: { name: string; username: string; traderType: User['traderType']; avatar?: string }) => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: data.name,
      username: data.username.toLowerCase(),
      avatar: data.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200`,
      bio: `${data.traderType} on Bullpost. Sharing live market analysis & P&L proofs.`,
      verified: true,
      traderType: data.traderType,
      winRate: 80,
      totalPnlToday: 24000,
      totalTradesToday: 3,
      followersCount: 1,
      followingCount: 10,
    };

    setUsers([newUser, ...users]);
    setCurrentUser(newUser);
    setSelectedProfileUser(newUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsSettingsDrawerOpen(false);
  };

  const addPost = (postData: Partial<Post>) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    const newHashtags = postData.hashtags || [];
    
    const newPost: Post = {
      id: `post_${Date.now()}`,
      author: currentUser,
      createdAt: 'Just now',
      content: postData.content || '',
      type: postData.type || 'general',
      pnlDetails: postData.pnlDetails,
      sentiment: postData.sentiment,
      targetStockSymbol: postData.targetStockSymbol,
      stockChange: postData.stockChange || (postData.targetStockSymbol ? 1.5 : undefined),
      hashtags: newHashtags,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      bookmarksCount: 0,
      isLiked: false,
      isBookmarked: false,
      comments: [],
      disclaimerText: '⚠️ Trader Disclaimer: Personal market opinion & portfolio proof. Not financial or SEBI investment advice. DYOR.',
    };

    setPosts([newPost, ...posts]);

    if (newHashtags.length > 0) {
      setTrendingTopics(prev => prev.map(topic => {
        if (newHashtags.some(tag => tag.toLowerCase() === topic.tag.toLowerCase())) {
          return { ...topic, postsCount: topic.postsCount + 1 };
        }
        return topic;
      }));
    }

    if (postData.targetStockSymbol) {
      setStocks(prev => prev.map(stk => {
        if (stk.symbol.toUpperCase() === postData.targetStockSymbol?.toUpperCase()) {
          return { ...stk, tagCount: stk.tagCount + 1 };
        }
        return stk;
      }));
    }
  };

  const toggleLikePost = (postId: string) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isLiked = !post.isLiked;
        return {
          ...post,
          isLiked,
          likesCount: isLiked ? post.likesCount + 1 : post.likesCount - 1,
        };
      }
      return post;
    }));
  };

  const toggleBookmarkPost = (postId: string) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isBookmarked = !post.isBookmarked;
        return {
          ...post,
          isBookmarked,
          bookmarksCount: isBookmarked ? post.bookmarksCount + 1 : post.bookmarksCount - 1,
        };
      }
      return post;
    }));
  };

  const addComment = (postId: string, text: string) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!text.trim()) return;

    const newComment: Comment = {
      id: `c_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userHandle: currentUser.username,
      userAvatar: currentUser.avatar,
      content: text.trim(),
      createdAt: 'Just now',
      likes: 0,
    };

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          commentsCount: post.commentsCount + 1,
          comments: [...post.comments, newComment],
        };
      }
      return post;
    }));
  };

  const toggleFollowUser = (userId: string) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        const isFollowing = !user.isFollowing;
        return {
          ...user,
          isFollowing,
          followersCount: isFollowing ? user.followersCount + 1 : user.followersCount - 1,
        };
      }
      return user;
    }));

    if (selectedProfileUser.id === userId) {
      setSelectedProfileUser(prev => ({
        ...prev,
        isFollowing: !prev.isFollowing,
        followersCount: !prev.isFollowing ? prev.followersCount + 1 : prev.followersCount - 1,
      }));
    }
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const openStockModal = (symbol: string) => {
    const found = stocks.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
    if (found) {
      setSelectedStock(found);
    } else {
      const fallback: StockTicker = {
        symbol: symbol.toUpperCase(),
        name: `${symbol.toUpperCase()} Stock`,
        currentPrice: 500.00,
        change: 5.50,
        changePercent: 1.10,
        volume: '5.2M',
        dayHigh: 512.00,
        dayLow: 492.00,
        sparkline: [490, 495, 502, 498, 505, 500],
        bullishPercentage: 70,
        tagCount: 150,
      };
      setSelectedStock(fallback);
    }
  };

  const viewUserProfile = (user: User) => {
    setSelectedProfileUser(user);
    setActiveTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currentUser,
        users,
        posts,
        stocks,
        trendingTopics,
        news,
        notifications,
        activeTab,
        setActiveTab,
        selectedProfileUser,
        setSelectedProfileUser,
        selectedStock,
        setSelectedStock,
        isComposerOpen,
        setIsComposerOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isSettingsDrawerOpen,
        setIsSettingsDrawerOpen,
        isAuthenticated,
        searchQuery,
        setSearchQuery,
        filterHashtag,
        setFilterHashtag,
        login,
        signup,
        logout,
        addPost,
        toggleLikePost,
        toggleBookmarkPost,
        addComment,
        toggleFollowUser,
        markNotificationsAsRead,
        openStockModal,
        viewUserProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
