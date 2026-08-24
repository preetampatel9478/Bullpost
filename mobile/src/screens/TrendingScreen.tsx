import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  useColorScheme,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { darkColors, lightColors } from '../theme/colors';

const TRENDING_TOPICS = [
  { tag: 'vedanta', count: '14.2k', isHot: true },
  { tag: 'nifty50', count: '38.5k', isHot: true },
  { tag: 'BreakoutAlert', count: '9.8k', isHot: false },
  { tag: 'tatamotors', count: '6.4k', isHot: false },
];

const LEADERBOARD = [
  {
    name: 'Vikram Joshi',
    username: 'vikram_quant',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    winRate: 79,
    pnl: '+₹84,000',
  },
  {
    name: 'Priya Deshmukh',
    username: 'priya_swingtrader',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    winRate: 74,
    pnl: '+₹32,100',
  },
];

export function TrendingScreen() {
  const scheme = useColorScheme();
  const colors = darkColors; // Sleek dark default
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? (RNStatusBar.currentHeight || 24) : 0) + 8;

  return (
    <View style={[styles.container, { backgroundColor: colors.pageBg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.cardBorder, paddingTop: topPadding }]}>
        <View style={styles.titleRow}>
          <Feather name="zap" size={20} color="#60A5FA" />
          <Text style={[styles.title, { color: colors.textPrimary }]}>Trending & Sentiment</Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Live market mood & top setups</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Sentiment Meter Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={[styles.cardLabel, { color: '#60A5FA' }]}>LIVE SENTIMENT</Text>
          <Text style={[styles.sentimentHeading, { color: colors.textPrimary }]}>76% Bullish Outlook</Text>
          <Text style={[styles.sentimentSub, { color: colors.textSecondary }]}>Based on 28,400+ verified trader posts</Text>
          
          <View style={styles.meterBarBg}>
            <View style={[styles.meterBulls, { width: '76%' }]} />
            <View style={[styles.meterBears, { width: '24%' }]} />
          </View>

          <View style={styles.meterLegend}>
            <Text style={styles.bullText}>76% BULLS</Text>
            <Text style={styles.bearText}>24% BEARS</Text>
          </View>
        </View>

        {/* Trending Tags */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Hot Trader Topics</Text>
          <View style={styles.tagsGrid}>
            {TRENDING_TOPICS.map(t => (
              <View key={t.tag} style={[styles.tagPill, { backgroundColor: colors.cardSecondary, borderColor: colors.cardBorder }]}>
                <Text style={[styles.tagText, { color: '#60A5FA' }]}>#{t.tag}</Text>
                <Text style={[styles.tagCount, { color: colors.textSecondary }]}>{t.count}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Top Trader Leaderboard */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Top Verified Traders</Text>
          <View style={styles.leaderboardList}>
            {LEADERBOARD.map((item, idx) => (
              <View key={item.username} style={[styles.leaderRow, idx < LEADERBOARD.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.cardBorder }]}>
                <Image source={{ uri: item.avatar }} style={styles.leaderAvatar} />
                <View style={styles.leaderInfo}>
                  <Text style={[styles.leaderName, { color: colors.textPrimary }]}>{item.name}</Text>
                  <Text style={[styles.leaderHandle, { color: colors.textSecondary }]}>@{item.username}</Text>
                </View>
                <View style={styles.leaderStats}>
                  <Text style={styles.leaderPnl}>{item.pnl}</Text>
                  <Text style={styles.leaderWin}>+{item.winRate}% Win</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { fontSize: 20, fontWeight: '900' },
  subtitle: { fontSize: 11, fontWeight: '500', marginTop: 2 },
  scrollContent: { padding: 16, gap: 16, paddingBottom: 60 },
  card: { borderRadius: 24, borderWidth: 1, padding: 16, gap: 10 },
  cardLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  sentimentHeading: { fontSize: 20, fontWeight: '900' },
  sentimentSub: { fontSize: 11 },
  meterBarBg: { height: 10, borderRadius: 5, backgroundColor: '#1E293B', flexDirection: 'row', overflow: 'hidden', marginTop: 4 },
  meterBulls: { backgroundColor: '#10B981', height: '100%' },
  meterBears: { backgroundColor: '#EF4444', height: '100%' },
  meterLegend: { flexDirection: 'row', justifyContent: 'space-between' },
  bullText: { fontSize: 11, fontWeight: '800', color: '#10B981' },
  bearText: { fontSize: 11, fontWeight: '800', color: '#EF4444' },
  sectionTitle: { fontSize: 15, fontWeight: '800' },
  tagsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, borderWidth: 1 },
  tagText: { fontSize: 12, fontWeight: '800' },
  tagCount: { fontSize: 10 },
  leaderboardList: { marginTop: 4 },
  leaderRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 10 },
  leaderAvatar: { width: 38, height: 38, borderRadius: 19 },
  leaderInfo: { flex: 1 },
  leaderName: { fontSize: 13, fontWeight: '800' },
  leaderHandle: { fontSize: 11 },
  leaderStats: { alignItems: 'flex-end' },
  leaderPnl: { fontSize: 13, fontWeight: '900', color: '#10B981' },
  leaderWin: { fontSize: 10, fontWeight: '700', color: '#64748B' },
});
