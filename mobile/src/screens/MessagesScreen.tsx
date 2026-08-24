import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  useColorScheme,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { darkColors, lightColors } from '../theme/colors';

const CONVERSATIONS = [
  {
    id: 'c1',
    user: {
      name: 'Vikram Joshi',
      username: 'vikram_quant',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    },
    lastMessage: 'Check the 15-min chart for Vedanta, heavy OI buildup at 460 strike.',
    time: '10m',
    unread: 2,
  },
  {
    id: 'c2',
    user: {
      name: 'Priya Deshmukh',
      username: 'priya_swingtrader',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    },
    lastMessage: 'Thanks for sharing the stop-loss strategy! Locked in profit.',
    time: '1h',
    unread: 0,
  },
  {
    id: 'c3',
    user: {
      name: 'Quant Research Desk',
      username: 'quant_desk',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    },
    lastMessage: 'Tomorrow morning gap opening expected near 24,620.',
    time: '3h',
    unread: 0,
  },
];

export function MessagesScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.gradientBottom }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.cardBorder }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Trader Messages</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Private trade discussions & setups</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.cardList, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          {CONVERSATIONS.map((c, idx) => (
            <Pressable
              key={c.id}
              style={[
                styles.chatRow,
                idx < CONVERSATIONS.length - 1 && {
                  borderBottomColor: colors.cardBorder,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                },
              ]}
            >
              <Image source={{ uri: c.user.avatar }} style={styles.avatar} />
              <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                  <Text style={[styles.userName, { color: colors.textPrimary }]}>{c.user.name}</Text>
                  <Text style={[styles.timeText, { color: colors.textSecondary }]}>{c.time}</Text>
                </View>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.lastMsg,
                    { color: c.unread > 0 ? colors.textPrimary : colors.textSecondary },
                    c.unread > 0 && { fontWeight: '700' },
                  ]}
                >
                  {c.lastMessage}
                </Text>
              </View>
              {c.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{c.unread}</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  cardList: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  chatInfo: {
    flex: 1,
    gap: 4,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userName: {
    fontSize: 14,
    fontWeight: '800',
  },
  timeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  lastMsg: {
    fontSize: 12,
  },
  unreadBadge: {
    backgroundColor: '#2563EB',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
});
