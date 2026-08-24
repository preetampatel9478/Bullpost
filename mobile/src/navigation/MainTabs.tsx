import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { darkColors } from '../theme/colors';
import { HomeScreen } from '../screens/HomeScreen';
import { TrendingScreen } from '../screens/TrendingScreen';
import { NewsScreen } from '../screens/NewsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

type Props = {
  identifier: string;
  onLogout: () => void;
};

export function MainTabs({ identifier, onLogout }: Props) {
  const colors = darkColors; // Sleek Dark Theme matching Web
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'home' | 'trending' | 'news' | 'profile'>('home');

  const bottomInset = Math.max(insets.bottom, Platform.OS === 'android' ? 10 : 6);

  return (
    <View style={[styles.container, { backgroundColor: colors.pageBg }]}>
      {/* Active Screen View */}
      <View style={styles.screenContainer}>
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'trending' && <TrendingScreen />}
        {activeTab === 'news' && <NewsScreen />}
        {activeTab === 'profile' && <ProfileScreen identifier={identifier} onLogout={onLogout} />}
      </View>

      {/* Floating Bottom Navigation Bar (1:1 with Web Mobile Design) */}
      <View style={[styles.navWrapper, { paddingBottom: bottomInset }]}>
        <View style={[styles.floatingBar, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          
          {/* 1. Feed */}
          <Pressable onPress={() => setActiveTab('home')} style={styles.tabItem}>
            <Feather
              name="home"
              size={20}
              color={activeTab === 'home' ? '#60A5FA' : '#94A3B8'}
            />
            <Text style={[styles.tabLabel, { color: activeTab === 'home' ? '#60A5FA' : '#94A3B8' }]}>
              Feed
            </Text>
            {activeTab === 'home' && <View style={styles.activeDot} />}
          </Pressable>

          {/* 2. Trending */}
          <Pressable onPress={() => setActiveTab('trending')} style={styles.tabItem}>
            <Feather
              name="zap"
              size={20}
              color={activeTab === 'trending' ? '#60A5FA' : '#94A3B8'}
            />
            <Text style={[styles.tabLabel, { color: activeTab === 'trending' ? '#60A5FA' : '#94A3B8' }]}>
              Trending
            </Text>
            {activeTab === 'trending' && <View style={styles.activeDot} />}
          </Pressable>

          {/* 3. Central Elevated + Post Button */}
          <Pressable
            onPress={() => setActiveTab('home')}
            style={styles.centerPostBtn}
          >
            <View style={styles.centerCircle}>
              <Feather name="plus" size={24} color="#fff" />
            </View>
            <Text style={styles.postLabel}>Post</Text>
          </Pressable>

          {/* 4. News */}
          <Pressable onPress={() => setActiveTab('news')} style={styles.tabItem}>
            <Feather
              name="file-text"
              size={20}
              color={activeTab === 'news' ? '#60A5FA' : '#94A3B8'}
            />
            <Text style={[styles.tabLabel, { color: activeTab === 'news' ? '#60A5FA' : '#94A3B8' }]}>
              News
            </Text>
            {activeTab === 'news' && <View style={styles.activeDot} />}
          </Pressable>

          {/* 5. Profile */}
          <Pressable onPress={() => setActiveTab('profile')} style={styles.tabItem}>
            <Feather
              name="user"
              size={20}
              color={activeTab === 'profile' ? '#60A5FA' : '#94A3B8'}
            />
            <Text style={[styles.tabLabel, { color: activeTab === 'profile' ? '#60A5FA' : '#94A3B8' }]}>
              Profile
            </Text>
            {activeTab === 'profile' && <View style={styles.activeDot} />}
          </Pressable>

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
  navWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  floatingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 36,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
    gap: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '800',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#60A5FA',
    position: 'absolute',
    bottom: -2,
  },
  centerPostBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  centerCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  postLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#60A5FA',
    marginTop: 2,
  },
});
