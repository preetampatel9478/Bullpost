import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  Modal,
  Platform,
  StatusBar as RNStatusBar,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { darkColors } from '../theme/colors';

type Post = {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    winRate: number;
    verified: boolean;
    isFollowing: boolean;
  };
  content: string;
  targetStock: string;
  stockChange: number;
  sentiment: 'bullish' | 'bearish';
  createdAt: string;
  likesCount: number;
  isLiked: boolean;
  commentsCount: number;
  isBookmarked: boolean;
  hashtags: string[];
  pnl?: {
    symbol: string;
    tradeType: string;
    entry: number;
    exit: number;
    qty: number;
    pnlAmount: number;
    pnlPct: number;
  };
};

const TICKER_ITEMS = [
  { symbol: '$RELIANCE', price: '₹2,981.4', change: '-0.58%', isUp: false },
  { symbol: '$HDFCBANK', price: '₹1,648.2', change: '+1.10%', isUp: true },
  { symbol: '$VEDL', price: '₹462.5', change: '+4.10%', isUp: true },
  { symbol: '$TATAMOTORS', price: '₹980.2', change: '+2.30%', isUp: true },
];

const INITIAL_POSTS: Post[] = [
  {
    id: 'p1',
    author: {
      name: 'Priya Deshmukh',
      username: 'priya_swingtrader',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      winRate: 74,
      verified: true,
      isFollowing: false,
    },
    content: 'Huge breakout on #vedanta today! Heavy institutional buying witnessed above ₹450 resistance. Secured +₹32,100 profit in 2 hours on swing trade. Target ₹485 looking solid! 🚀🔥 $VEDL',
    targetStock: 'VEDL',
    stockChange: 4.1,
    sentiment: 'bullish',
    createdAt: '12 mins ago',
    likesCount: 142,
    isLiked: false,
    commentsCount: 28,
    isBookmarked: false,
    hashtags: ['#vedanta', '#SwingTrading', '#BreakoutAlert'],
    pnl: {
      symbol: 'VEDL',
      tradeType: 'EQUITY BUY',
      entry: 442.5,
      exit: 462.5,
      qty: 1600,
      pnlAmount: 32100,
      pnlPct: 4.52,
    },
  },
  {
    id: 'p2',
    author: {
      name: 'Vikram Joshi',
      username: 'vikram_quant',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      winRate: 79,
      verified: true,
      isFollowing: true,
    },
    content: 'Nifty 50 expiry trade locked in. Captured 140 points on the morning gap fill. Strict 25-point stop-loss was kept. Always protect your capital! 📈 #NiftyOptions',
    targetStock: 'NIFTY',
    stockChange: 0.85,
    sentiment: 'bullish',
    createdAt: '45 mins ago',
    likesCount: 215,
    isLiked: true,
    commentsCount: 42,
    isBookmarked: true,
    hashtags: ['#NiftyOptions', '#GapAnalysis', '#ExpiryDay'],
    pnl: {
      symbol: 'NIFTY 24600 CE',
      tradeType: 'CALL (CE)',
      entry: 110,
      exit: 250,
      qty: 600,
      pnlAmount: 84000,
      pnlPct: 127.27,
    },
  },
];

export function HomeScreen() {
  const colors = darkColors; // Sleek Dark Theme Default matching web
  const insets = useSafeAreaInsets();

  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [isComposerVisible, setIsComposerVisible] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newStockSymbol, setNewStockSymbol] = useState('VEDL');
  const [searchQuery, setSearchQuery] = useState('');

  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? (RNStatusBar.currentHeight || 24) : 0);

  const toggleLike = (id: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === id) {
          return {
            ...p,
            isLiked: !p.isLiked,
            likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1,
          };
        }
        return p;
      })
    );
  };

  const toggleFollow = (id: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === id) {
          return {
            ...p,
            author: { ...p.author, isFollowing: !p.author.isFollowing },
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    const newP: Post = {
      id: `p_${Date.now()}`,
      author: {
        name: 'You (Trader)',
        username: 'trader_pro',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        winRate: 82,
        verified: true,
        isFollowing: false,
      },
      content: newPostContent,
      targetStock: newStockSymbol.toUpperCase(),
      stockChange: 2.4,
      sentiment: 'bullish',
      createdAt: 'Just now',
      likesCount: 0,
      isLiked: false,
      commentsCount: 0,
      isBookmarked: false,
      hashtags: ['#Bullpost', '#LiveTrade'],
    };
    setPosts([newP, ...posts]);
    setNewPostContent('');
    setIsComposerVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.pageBg }]}>
      
      {/* 1. Top Live Ticker Marquee */}
      <View style={[styles.tickerBar, { paddingTop: topPadding + 4 }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tickerScroll}>
          {TICKER_ITEMS.map((item, idx) => (
            <View key={idx} style={styles.tickerItem}>
              <Text style={styles.tickerSymbol}>{item.symbol}</Text>
              <Text style={styles.tickerPrice}>{item.price}</Text>
              <Text style={[styles.tickerChange, { color: item.isUp ? '#10B981' : '#EF4444' }]}>
                {item.isUp ? '↗' : '↘'}{item.change}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 2. App Header with Search Pill & Notification */}
      <View style={[styles.header, { backgroundColor: colors.pageBg, borderBottomColor: colors.cardBorder }]}>
        <LinearGradient colors={['#2563EB', '#3B82F6']} style={styles.logoBadge}>
          <Feather name="trending-up" size={16} color="#fff" />
        </LinearGradient>

        {/* Search Pill */}
        <View style={[styles.searchPill, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
          <Feather name="search" size={15} color="#94A3B8" />
          <TextInput
            placeholder="Search traders (@username), stocks..."
            placeholderTextColor="#64748B"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: colors.textPrimary }]}
          />
        </View>

        {/* Notification Bell with Badge */}
        <Pressable 
          onPress={() => Alert.alert('Notifications', '2 new trader breakout alerts.')}
          style={[styles.iconButton, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder }]}
        >
          <Feather name="bell" size={17} color={colors.textPrimary} />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeNum}>2</Text>
          </View>
        </Pressable>
      </View>

      {/* 3. Main Feed Scroll */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Quick Post Prompt Card */}
        <Pressable
          onPress={() => setIsComposerVisible(true)}
          style={[styles.quickCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        >
          <View style={styles.promptRow}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200' }}
              style={styles.userAvatarSmall}
            />
            <Text numberOfLines={1} style={[styles.promptText, { color: '#94A3B8' }]}>
              Share your latest trade set...
            </Text>
            <View style={styles.postBtnPill}>
              <Feather name="plus-circle" size={14} color="#fff" />
              <Text style={styles.postBtnText}>Post</Text>
            </View>
          </View>
        </Pressable>

        {/* Post Cards Feed */}
        {posts.map(post => (
          <View
            key={post.id}
            style={[styles.postCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
          >
            {/* Header: Author info & Follow Button */}
            <View style={styles.authorRow}>
              <View style={styles.authorInfo}>
                <Image source={{ uri: post.author.avatar }} style={styles.avatar} />
                <View>
                  <View style={styles.nameVerifiedRow}>
                    <Text style={[styles.authorName, { color: colors.textPrimary }]}>{post.author.name}</Text>
                    {post.author.verified && (
                      <View style={styles.checkBadge}>
                        <Feather name="check" size={9} color="#fff" />
                      </View>
                    )}
                  </View>
                  <Text style={[styles.handleText, { color: '#94A3B8' }]}>
                    @{post.author.username} • <Text style={styles.winRateText}>+{post.author.winRate}% Win</Text>
                  </Text>
                  <Text style={styles.timeAgo}>{post.createdAt}</Text>
                </View>
              </View>

              <Pressable
                onPress={() => toggleFollow(post.id)}
                style={[
                  styles.followBtn,
                  { backgroundColor: post.author.isFollowing ? '#1E293B' : '#1E293B', borderColor: '#334155' },
                ]}
              >
                <Feather
                  name={post.author.isFollowing ? 'user-check' : 'user-plus'}
                  size={14}
                  color={post.author.isFollowing ? '#60A5FA' : '#94A3B8'}
                />
              </Pressable>
            </View>

            {/* Badges Row matching Web: Stock, Sentiment, PNL, Disclaimer */}
            <View style={styles.badgeRow}>
              <View style={[styles.badgePill, { backgroundColor: colors.badgeBg, borderColor: colors.badgeBorder }]}>
                <Feather name="trending-up" size={11} color="#60A5FA" />
                <Text style={[styles.badgeText, { color: '#60A5FA' }]}>
                  ${post.targetStock} (+{post.stockChange}%)
                </Text>
              </View>

              <View style={[styles.badgePill, { backgroundColor: '#064E3B', borderColor: '#065F46' }]}>
                <Feather name="trending-up" size={11} color="#10B981" />
                <Text style={[styles.badgeText, { color: '#10B981' }]}>
                  {post.sentiment.toUpperCase()}
                </Text>
              </View>

              {post.pnl && (
                <View style={[styles.badgePill, { backgroundColor: colors.badgeBg, borderColor: colors.badgeBorder }]}>
                  <Text style={[styles.badgeText, { color: '#94A3B8' }]}>PNL</Text>
                </View>
              )}

              <Pressable 
                onPress={() => Alert.alert('Disclaimer', 'Past performance does not guarantee future returns. Educational and verified trade sharing.')}
                style={[styles.badgePill, { backgroundColor: '#451A03', borderColor: '#78350F' }]}
              >
                <Feather name="alert-triangle" size={11} color="#F59E0B" />
                <Text style={[styles.badgeText, { color: '#F59E0B' }]}>Disclaimer</Text>
              </Pressable>
            </View>

            {/* Content Body */}
            <Text style={[styles.postContent, { color: '#F8FAFC' }]}>{post.content}</Text>

            {/* Hashtags */}
            <View style={styles.hashtagsRow}>
              {post.hashtags.map(h => (
                <Text key={h} style={styles.hashtagText}>{h} </Text>
              ))}
            </View>

            {/* Realized P&L Proof Graphic Card */}
            {post.pnl && (
              <View style={[styles.pnlCard, { backgroundColor: '#061D15', borderColor: '#047857' }]}>
                <View style={styles.pnlHeader}>
                  <Text style={[styles.pnlSymbol, { color: '#F8FAFC' }]}>${post.pnl.symbol}</Text>
                  <View style={styles.pnlTypePill}>
                    <Text style={styles.pnlTypeText}>{post.pnl.tradeType}</Text>
                  </View>
                  <View style={styles.verifiedPill}>
                    <Text style={styles.verifiedPillText}>VERIFIED P&L</Text>
                  </View>
                </View>

                <View style={styles.pnlGrid}>
                  <View style={styles.pnlCol}>
                    <Text style={styles.pnlLabel}>ENTRY</Text>
                    <Text style={styles.pnlVal}>₹{post.pnl.entry}</Text>
                  </View>
                  <View style={styles.pnlCol}>
                    <Text style={styles.pnlLabel}>EXIT</Text>
                    <Text style={styles.pnlVal}>₹{post.pnl.exit}</Text>
                  </View>
                  <View style={styles.pnlCol}>
                    <Text style={styles.pnlLabel}>QTY</Text>
                    <Text style={styles.pnlVal}>{post.pnl.qty}</Text>
                  </View>
                  <View style={styles.pnlCol}>
                    <Text style={styles.pnlLabel}>RETURN</Text>
                    <Text style={[styles.pnlVal, { color: '#10B981', fontWeight: '900' }]}>
                      +{post.pnl.pnlPct}%
                    </Text>
                  </View>
                </View>

                <View style={styles.pnlFooter}>
                  <Text style={styles.pnlTotalLabel}>REALIZED PROFIT:</Text>
                  <Text style={styles.pnlTotalVal}>+₹{post.pnl.pnlAmount.toLocaleString('en-IN')}</Text>
                </View>
              </View>
            )}

            {/* Social Action Footer Bar */}
            <View style={[styles.socialRow, { borderTopColor: colors.cardBorder }]}>
              {/* Like */}
              <Pressable onPress={() => toggleLike(post.id)} style={styles.actionBtn}>
                <Ionicons
                  name={post.isLiked ? 'heart' : 'heart-outline'}
                  size={18}
                  color={post.isLiked ? '#EF4444' : '#94A3B8'}
                />
                <Text style={[styles.actionCount, { color: post.isLiked ? '#EF4444' : '#94A3B8' }]}>
                  {post.likesCount}
                </Text>
              </Pressable>

              {/* Comment (Icon + count only) */}
              <Pressable
                onPress={() => Alert.alert('Comments', `${post.commentsCount} trader comments on this post.`)}
                style={styles.actionBtn}
              >
                <Feather name="message-circle" size={17} color="#94A3B8" />
                <Text style={[styles.actionCount, { color: '#94A3B8' }]}>
                  {post.commentsCount}
                </Text>
              </Pressable>

              {/* Share */}
              <Pressable
                onPress={() => Alert.alert('Share', 'Post link copied to clipboard!')}
                style={styles.actionBtn}
              >
                <Feather name="share-2" size={17} color="#94A3B8" />
              </Pressable>

              {/* Bookmark */}
              <Pressable
                onPress={() =>
                  setPosts(prev =>
                    prev.map(p => (p.id === post.id ? { ...p, isBookmarked: !p.isBookmarked } : p))
                  )
                }
                style={styles.actionBtn}
              >
                <Ionicons
                  name={post.isBookmarked ? 'bookmark' : 'bookmark-outline'}
                  size={17}
                  color={post.isBookmarked ? '#60A5FA' : '#94A3B8'}
                />
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Compose Post Modal */}
      <Modal visible={isComposerVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={[styles.composerModal, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Create Trader Post</Text>
              <Pressable onPress={() => setIsComposerVisible(false)}>
                <Feather name="x" size={22} color={colors.textSecondary} />
              </Pressable>
            </View>

            <TextInput
              placeholder="Target Stock (e.g. VEDL, NIFTY50)"
              placeholderTextColor={colors.textSecondary}
              value={newStockSymbol}
              onChangeText={setNewStockSymbol}
              style={[styles.stockInput, { backgroundColor: colors.inputBg, color: colors.textPrimary, borderColor: colors.inputBorder }]}
            />

            <TextInput
              placeholder="Share your trade setup, entry/exit levels, and market analysis..."
              placeholderTextColor={colors.textSecondary}
              value={newPostContent}
              onChangeText={setNewPostContent}
              multiline
              numberOfLines={4}
              style={[styles.composerInput, { backgroundColor: colors.inputBg, color: colors.textPrimary, borderColor: colors.inputBorder }]}
            />

            <Pressable onPress={handleCreatePost} style={styles.submitPostBtn}>
              <Text style={styles.submitPostText}>Post To Feed</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tickerBar: {
    backgroundColor: '#070A12',
    paddingBottom: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1F2937',
  },
  tickerScroll: {
    paddingHorizontal: 12,
    gap: 16,
    alignItems: 'center',
  },
  tickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tickerSymbol: {
    color: '#60A5FA',
    fontSize: 11,
    fontWeight: '900',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  tickerPrice: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  tickerChange: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeNum: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
  },
  scrollContent: {
    padding: 14,
    gap: 14,
    paddingBottom: 70,
  },
  quickCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 12,
  },
  promptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userAvatarSmall: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  promptText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
  },
  postBtnPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  postBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  postCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  nameVerifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '800',
  },
  checkBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  handleText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  winRateText: {
    color: '#10B981',
    fontWeight: '800',
  },
  timeAgo: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  followBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  postContent: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
  hashtagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hashtagText: {
    color: '#60A5FA',
    fontSize: 12,
    fontWeight: '700',
  },
  pnlCard: {
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    gap: 8,
  },
  pnlHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pnlSymbol: {
    fontSize: 12,
    fontWeight: '900',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  pnlTypePill: {
    backgroundColor: '#064E3B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pnlTypeText: {
    color: '#10B981',
    fontSize: 9,
    fontWeight: '800',
  },
  verifiedPill: {
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  verifiedPillText: {
    color: '#000',
    fontSize: 9,
    fontWeight: '900',
  },
  pnlGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pnlCol: {
    alignItems: 'flex-start',
  },
  pnlLabel: {
    fontSize: 8,
    color: '#94A3B8',
    fontWeight: '700',
  },
  pnlVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F8FAFC',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  pnlFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(16, 185, 129, 0.3)',
    paddingTop: 6,
  },
  pnlTotalLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  pnlTotalVal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#10B981',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  actionCount: {
    fontSize: 12,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  composerModal: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    gap: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  stockInput: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    fontWeight: '700',
  },
  composerInput: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    fontSize: 13,
    minHeight: 90,
    textAlignVertical: 'top',
  },
  submitPostBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 6,
  },
  submitPostText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
});
