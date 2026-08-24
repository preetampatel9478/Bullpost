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
  useColorScheme,
  Alert,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { darkColors, lightColors } from '../theme/colors';

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
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const insets = useSafeAreaInsets();

  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [isComposerVisible, setIsComposerVisible] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newStockSymbol, setNewStockSymbol] = useState('VEDL');

  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? (RNStatusBar.currentHeight || 24) : 0) + 6;

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
    };
    setPosts([newP, ...posts]);
    setNewPostContent('');
    setIsComposerVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.gradientBottom }]}>
      {/* Top App Header with proper notch/status bar spacing */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.card,
            borderBottomColor: colors.cardBorder,
            paddingTop: topPadding,
          },
        ]}
      >
        <View style={styles.brandRow}>
          <LinearGradient colors={['#2563EB', '#3B82F6']} style={styles.logoBadge}>
            <Feather name="trending-up" size={16} color="#fff" />
          </LinearGradient>
          <Text style={[styles.brandText, { color: colors.textPrimary }]}>Bullpost</Text>
        </View>

        <Pressable 
          onPress={() => Alert.alert('Notifications', 'No new unread market alerts.')}
          style={[styles.iconButton, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder }]}
        >
          <Feather name="bell" size={18} color={colors.textPrimary} />
          <View style={styles.notificationDot} />
        </Pressable>
      </View>

      {/* Main Feed Scroll */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Quick Post Prompt Card */}
        <Pressable
          onPress={() => setIsComposerVisible(true)}
          style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        >
          <View style={styles.promptRow}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200' }}
              style={styles.userAvatarSmall}
            />
            <Text style={[styles.promptText, { color: colors.textSecondary }]}>
              Share trade setup or verified P&L...
            </Text>
            <View style={styles.postBtnPill}>
              <Feather name="plus" size={14} color="#fff" />
              <Text style={styles.postBtnText}>Post</Text>
            </View>
          </View>
        </Pressable>

        {/* Posts Stream */}
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
                        <Feather name="check" size={10} color="#fff" />
                      </View>
                    )}
                  </View>
                  <Text style={[styles.handleText, { color: colors.textSecondary }]}>
                    @{post.author.username} • <Text style={styles.winRateText}>+{post.author.winRate}% Win</Text>
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => toggleFollow(post.id)}
                style={[
                  styles.followBtn,
                  post.author.isFollowing
                    ? { backgroundColor: colors.inputBg, borderColor: colors.cardBorder }
                    : { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' },
                ]}
              >
                <Text
                  style={[
                    styles.followBtnText,
                    { color: post.author.isFollowing ? colors.textSecondary : '#2563EB' },
                  ]}
                >
                  {post.author.isFollowing ? 'Following' : '+ Follow'}
                </Text>
              </Pressable>
            </View>

            {/* Badges: Stock & Sentiment */}
            <View style={styles.badgeRow}>
              <View style={[styles.stockPill, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder }]}>
                <Feather name="trending-up" size={12} color="#2563EB" />
                <Text style={[styles.stockText, { color: colors.textPrimary }]}>
                  ${post.targetStock} ({post.stockChange > 0 ? '+' : ''}{post.stockChange}%)
                </Text>
              </View>

              <View
                style={[
                  styles.sentimentPill,
                  { backgroundColor: post.sentiment === 'bullish' ? '#ECFDF5' : '#FEF2F2' },
                ]}
              >
                <Text
                  style={[
                    styles.sentimentText,
                    { color: post.sentiment === 'bullish' ? '#059669' : '#DC2626' },
                  ]}
                >
                  {post.sentiment.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Content Body */}
            <Text style={[styles.postContent, { color: colors.textPrimary }]}>{post.content}</Text>

            {/* Realized P&L Proof Graphic Card */}
            {post.pnl && (
              <View
                style={[
                  styles.pnlCard,
                  { backgroundColor: post.pnl.pnlAmount >= 0 ? '#F0FDF4' : '#FEF2F2' },
                ]}
              >
                <View style={styles.pnlHeader}>
                  <Text style={styles.pnlSymbol}>${post.pnl.symbol}</Text>
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
                    <Text style={[styles.pnlVal, { color: '#059669', fontWeight: '900' }]}>
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
                  color={post.isLiked ? '#EF4444' : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.actionCount,
                    { color: post.isLiked ? '#EF4444' : colors.textSecondary },
                  ]}
                >
                  {post.likesCount}
                </Text>
              </Pressable>

              {/* Comment */}
              <Pressable
                onPress={() => Alert.alert('Comments', `${post.commentsCount} comments on this trade.`)}
                style={styles.actionBtn}
              >
                <Feather name="message-circle" size={17} color={colors.textSecondary} />
                <Text style={[styles.actionCount, { color: colors.textSecondary }]}>
                  {post.commentsCount}
                </Text>
              </Pressable>

              {/* Share */}
              <Pressable
                onPress={() => Alert.alert('Share', 'Link copied to clipboard!')}
                style={styles.actionBtn}
              >
                <Feather name="share-2" size={17} color={colors.textSecondary} />
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
                  color={post.isBookmarked ? '#2563EB' : colors.textSecondary}
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
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#2563EB',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  promptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userAvatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    paddingHorizontal: 12,
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
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  },
  winRateText: {
    color: '#059669',
    fontWeight: '800',
  },
  followBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
  },
  followBtnText: {
    fontSize: 11,
    fontWeight: '800',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
  },
  stockText: {
    fontSize: 11,
    fontWeight: '800',
  },
  sentimentPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sentimentText: {
    fontSize: 10,
    fontWeight: '900',
  },
  postContent: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
  pnlCard: {
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(5, 150, 105, 0.2)',
    gap: 8,
  },
  pnlHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pnlSymbol: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
  },
  verifiedPill: {
    backgroundColor: '#059669',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedPillText: {
    color: '#fff',
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
    fontSize: 9,
    color: '#64748B',
    fontWeight: '700',
  },
  pnlVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  pnlFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(5, 150, 105, 0.2)',
    paddingTop: 6,
  },
  pnlTotalLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  pnlTotalVal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#059669',
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
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionCount: {
    fontSize: 12,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
