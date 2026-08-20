import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { darkColors, lightColors } from '../theme/colors';

type Props = {
  icon: React.ComponentProps<typeof Feather>['name'];
  title: string;
  subtitle: string;
};

/** Shared shape for tab screens that don't have real content wired up yet. */
export function PlaceholderScreen({ icon, title, subtitle }: Props) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;

  return (
    <View style={[styles.container, { backgroundColor: colors.gradientBottom }]}>
      <View style={[styles.iconBadge, { backgroundColor: colors.primary + '1A' }]}>
        <Feather name={icon} size={26} color={colors.primary} />
      </View>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 10 },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  title: { fontSize: 18, fontWeight: '800' },
  subtitle: { fontSize: 13, textAlign: 'center', maxWidth: 260 },
});
