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
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { darkColors, lightColors } from '../theme/colors';

type Props = {
  identifier: string;
  onLogout: () => void;
};

export function ProfileScreen({ identifier, onLogout }: Props) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const insets = useSafeAreaInsets();

  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? (RNStatusBar.currentHeight || 24) : 0) + 8;

  return (
    <View style={[styles.container, { backgroundColor: colors.gradientBottom }]}>
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: topPadding }]} 
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card Banner */}
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          {/* Top Gradient Banner */}
          <LinearGradient
            colors={['rgba(37,99,235,0.25)', 'rgba(96,165,250,0.12)']}
            style={styles.bannerGradient}
          />

          {/* Avatar & Header */}
          <View style={styles.avatarRow}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200' }}
              style={[styles.avatar, { borderColor: colors.card }]}
            />
            <View style={styles.headerInfo}>
              <View style={styles.nameCheckRow}>
                <Text style={[styles.userName, { color: colors.textPrimary }]}>{identifier || 'Pro Trader'}</Text>
                <View style={styles.checkBadge}>
                  <Feather name="check" size={10} color="#fff" />
                </View>
              </View>
              <Text style={[styles.userHandle, { color: colors.textSecondary }]}>@{identifier?.toLowerCase() || 'trader'}</Text>
            </View>
          </View>

          {/* Bio */}
          <Text style={[styles.bioText, { color: colors.textPrimary }]}>
            Active Equity & Options Trader on Bullpost. Tracking momentum breakouts, gap analysis & sharing verified P&L setups. 📈🚀
          </Text>

          {/* Stats Grid - Fixed width and no wrapping */}
          <View style={styles.statsGrid}>
            <View style={[styles.statBox, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder }]}>
              <Text numberOfLines={1} style={[styles.statLabel, { color: colors.textSecondary }]}>WIN RATE</Text>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.statVal, { color: '#059669' }]}>+78%</Text>
            </View>

            <View style={[styles.statBox, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder }]}>
              <Text numberOfLines={1} style={[styles.statLabel, { color: colors.textSecondary }]}>TODAY P&L</Text>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.statVal, { color: '#059669' }]}>+₹24.5K</Text>
            </View>

            <View style={[styles.statBox, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder }]}>
              <Text numberOfLines={1} style={[styles.statLabel, { color: colors.textSecondary }]}>FOLLOWERS</Text>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.statVal, { color: colors.textPrimary }]}>1,420</Text>
            </View>

            <View style={[styles.statBox, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder }]}>
              <Text numberOfLines={1} style={[styles.statLabel, { color: colors.textSecondary }]}>FOLLOWING</Text>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.statVal, { color: colors.textPrimary }]}>48</Text>
            </View>
          </View>
        </View>

        {/* Account & Security Section */}
        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ACCOUNT & TERMINAL</Text>
          
          <View style={styles.menuRow}>
            <View style={styles.menuLeft}>
              <Feather name="shield" size={18} color="#2563EB" />
              <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>Broker Verification</Text>
            </View>
            <Text style={styles.verifiedTag}>Connected</Text>
          </View>

          <View style={[styles.menuRow, { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.cardBorder }]}>
            <View style={styles.menuLeft}>
              <Feather name="bell" size={18} color="#2563EB" />
              <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>P&L Breakout Notifications</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.textSecondary} />
          </View>
        </View>

        {/* Logout Button */}
        <Pressable onPress={onLogout} style={styles.logoutBtn}>
          <Feather name="log-out" size={16} color="#DC2626" />
          <Text style={styles.logoutText}>Sign Out of Bullpost</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 16,
    paddingBottom: 40,
  },
  profileCard: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  bannerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 75,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
  },
  headerInfo: {
    gap: 2,
    paddingBottom: 4,
  },
  nameCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 18,
    fontWeight: '900',
  },
  checkBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userHandle: {
    fontSize: 12,
    fontWeight: '600',
  },
  bioText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  statLabel: {
    fontSize: 8,
    fontWeight: '800',
    textAlign: 'center',
  },
  statVal: {
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
  },
  sectionCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  verifiedTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginTop: 8,
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '800',
  },
});
