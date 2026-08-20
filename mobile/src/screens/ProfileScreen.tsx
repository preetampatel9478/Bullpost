import React from 'react';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { darkColors, lightColors } from '../theme/colors';

type Props = {
  identifier: string;
  onLogout: () => void;
};

export function ProfileScreen({ identifier, onLogout }: Props) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;

  return (
    <View style={[styles.container, { backgroundColor: colors.gradientBottom }]}>
      <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
        <Feather name="user" size={28} color="#fff" />
      </View>
      <Text style={[styles.name, { color: colors.textPrimary }]}>@{identifier}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Profile details, trade history, and settings will live here.
      </Text>
      <Pressable style={[styles.logoutBtn, { backgroundColor: colors.primary }]} onPress={onLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 10 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  name: { fontSize: 18, fontWeight: '800' },
  subtitle: { fontSize: 13, textAlign: 'center', maxWidth: 260, marginBottom: 8 },
  logoutBtn: { marginTop: 12, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 999 },
  logoutText: { color: '#fff', fontWeight: '800', fontSize: 13 },
});
