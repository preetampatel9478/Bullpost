import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  useColorScheme,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { darkColors, lightColors } from '../theme/colors';

const NEWS_DATA = [
  {
    id: 'n1',
    title: 'Vedanta declares interim dividend of ₹20 per share; stock jumps 4%',
    summary: 'Strong operational cash flows in Q3 support massive dividend distribution for retail and institutional shareholders.',
    source: 'Economic Times',
    time: '25 mins ago',
    sentiment: 'BULLISH',
    stock: 'VEDL',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'n2',
    title: 'Nifty 50 surges above 24,500 milestone led by Banking and IT heavyweight rally',
    summary: 'Foreign institutional investors turned net buyers with over ₹2,400 crore inflows across frontline indices.',
    source: 'Moneycontrol',
    time: '1 hour ago',
    sentiment: 'BULLISH',
    stock: 'NIFTY50',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'n3',
    title: 'Crude oil volatility spikes after OPEC+ output adjustments',
    summary: 'Energy stocks trade mixed as Brent crude hovers near $82 per barrel amid supply rebalancing.',
    source: 'LiveMint',
    time: '2 hours ago',
    sentiment: 'BEARISH',
    stock: 'CRUDEOIL',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400',
  },
];

export function NewsScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const [filter, setFilter] = useState<'ALL' | 'BULLISH' | 'BEARISH'>('ALL');

  const filteredNews = NEWS_DATA.filter(n => (filter === 'ALL' ? true : n.sentiment === filter));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.gradientBottom }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.cardBorder }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Market News</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Live market triggers & headlines</Text>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {(['ALL', 'BULLISH', 'BEARISH'] as const).map(f => (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[
                styles.filterPill,
                filter === f
                  ? { backgroundColor: '#2563EB', borderColor: '#2563EB' }
                  : { backgroundColor: colors.inputBg, borderColor: colors.cardBorder },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: filter === f ? '#fff' : colors.textSecondary },
                ]}
              >
                {f}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredNews.map(item => (
          <View
            key={item.id}
            style={[styles.newsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
          >
            <Image source={{ uri: item.image }} style={styles.newsImage} />
            <View style={styles.cardBody}>
              <View style={styles.metaRow}>
                <View
                  style={[
                    styles.sentimentBadge,
                    { backgroundColor: item.sentiment === 'BULLISH' ? '#ECFDF5' : '#FEF2F2' },
                  ]}
                >
                  <Text
                    style={[
                      styles.sentimentText,
                      { color: item.sentiment === 'BULLISH' ? '#059669' : '#DC2626' },
                    ]}
                  >
                    {item.sentiment}
                  </Text>
                </View>

                <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                  {item.time} • {item.source}
                </Text>
              </View>

              <Text style={[styles.newsTitle, { color: colors.textPrimary }]}>{item.title}</Text>
              <Text style={[styles.newsSummary, { color: colors.textSecondary }]}>{item.summary}</Text>

              <View style={[styles.tickerPill, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder }]}>
                <Text style={[styles.tickerText, { color: colors.primary }]}>${item.stock}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 11,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  newsCard: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  newsImage: {
    width: '100%',
    height: 160,
  },
  cardBody: {
    padding: 16,
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sentimentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  sentimentText: {
    fontSize: 10,
    fontWeight: '900',
  },
  timeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  newsTitle: {
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 21,
  },
  newsSummary: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '500',
  },
  tickerPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  tickerText: {
    fontSize: 11,
    fontWeight: '800',
  },
});
