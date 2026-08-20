import React from 'react';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { darkColors, lightColors } from '../theme/colors';

type Props = {
  identifier: string;
  onLogout: () => void;
};

/**
 * Placeholder landing spot after a successful sign in / sign up.
 * The real trader feed hasn't been ported to mobile yet — this just
 * proves the auth flow works end to end.
 */
export function WelcomeScreen({ identifier, onLogout }: Props) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;

  return (
    <View style={[styles.container, { backgroundColor: colors.gradientBottom }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Welcome, {identifier} 👋</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        You're signed in to Bullpost. The trader feed isn't wired up on mobile yet.
      </Text>
      <Pressable style={[styles.logoutBtn, { backgroundColor: colors.primary }]} onPress={onLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontSize: 22, fontWeight: '800' },
  subtitle: { fontSize: 13, textAlign: 'center', maxWidth: 280 },
  logoutBtn: { marginTop: 12, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 999 },
  logoutText: { color: '#fff', fontWeight: '800', fontSize: 13 },
});
