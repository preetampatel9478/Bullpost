import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  useColorScheme,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { darkColors, lightColors } from '../theme/colors';

const STOCKS = [
  { symbol: 'VEDL', name: 'Vedanta Limited', price: 462.5, change: 4.1 },
  { symbol: 'NIFTY50', name: 'Nifty 50 Index', price: 24580, change: 0.85 },
  { symbol: 'TATAMOTORS', name: 'Tata Motors', price: 980.2, change: 2.3 },
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2940, change: -0.6 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1650.4, change: 1.1 },
];

const TRADERS = [
  {
    name: 'Priya Deshmukh',
    username: 'priya_swingtrader',
    winRate: 74,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
  },
  {
    name: 'Vikram Joshi',
    username: 'vikram_quant',
    winRate: 79,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  },
];

export function SearchScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? (RNStatusBar.currentHeight || 24) : 0) + 8;

  const filteredStocks = STOCKS.filter(s =>
    s.symbol.toLowerCase().includes(query.toLowerCase()) || s.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTraders = TRADERS.filter(t =>
    t.name.toLowerCase().includes(query.toLowerCase()) || t.username.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.gradientBottom }]}>
      {/* Search Input Bar with notch padding */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.cardBorder, paddingTop: topPadding }]}>
        <View style={[styles.searchBox, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
          <Feather name="search" size={18} color={colors.textSecondary} />
          <TextInput
            placeholder="Search stocks ($VEDL) or traders (@priya)..."
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={setQuery}
            style={[styles.input, { color: colors.textPrimary }]}
          />
          {query ? (
            <Pressable onPress={() => setQuery('')}>
              <Feather name="x" size={16} color={colors.textSecondary} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Stocks List */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>STOCKS & INDICES</Text>
          <View style={[styles.cardList, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            {filteredStocks.map((stock, idx) => (
              <View
                key={stock.symbol}
                style={[
                  styles.itemRow,
                  idx < filteredStocks.length - 1 && { borderBottomColor: colors.cardBorder, borderBottomWidth: StyleSheet.hairlineWidth },
                ]}
              >
                <View>
                  <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>${stock.symbol}</Text>
                  <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>{stock.name}</Text>
                </View>
                <View style={styles.priceCol}>
                  <Text style={[styles.priceText, { color: colors.textPrimary }]}>₹{stock.price.toLocaleString('en-IN')}</Text>
                  <Text style={[styles.changeText, { color: stock.change >= 0 ? '#059669' : '#DC2626' }]}>
                    {stock.change >= 0 ? '+' : ''}{stock.change}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Traders List */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>TOP TRADERS</Text>
          <View style={[styles.cardList, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            {filteredTraders.map((trader, idx) => (
              <View
                key={trader.username}
                style={[
                  styles.itemRow,
                  idx < filteredTraders.length - 1 && { borderBottomColor: colors.cardBorder, borderBottomWidth: StyleSheet.hairlineWidth },
                ]}
              >
                <View style={styles.traderInfo}>
                  <Image source={{ uri: trader.avatar }} style={styles.avatar} />
                  <View>
                    <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>{trader.name}</Text>
                    <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>@{trader.username}</Text>
                  </View>
                </View>
                <Text style={styles.winRateText}>+{trader.winRate}% Win</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    gap: 20,
    paddingBottom: 40,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardList: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  itemSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '800',
  },
  changeText: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  traderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  winRateText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#059669',
  },
});
