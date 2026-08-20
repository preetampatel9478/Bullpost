export type ThemeColors = {
  gradientTop: string;
  gradientMid: string;
  gradientBottom: string;
  card: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  inputBg: string;
  inputBorder: string;
  primary: string;
  primaryPressed: string;
  accent: string;
  danger: string;
  success: string;
  divider: string;
};

// Matches the Bullpost web app's Tailwind palette (frontend/tailwind.config.js
// and the light/dark classes in AuthModal.tsx / LandingAuthPage.tsx) so the
// mobile auth screen reads as the same brand.
export const lightColors: ThemeColors = {
  gradientTop: '#E2ECF9',
  gradientMid: '#EEF4FB',
  gradientBottom: '#F8FAFC',
  card: '#FFFFFF',
  cardBorder: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  inputBg: '#F8FAFC',
  inputBorder: '#E2E8F0',
  primary: '#2563EB',
  primaryPressed: '#1D4ED8',
  accent: '#60A5FA',
  danger: '#EF4444',
  success: '#059669',
  divider: '#E2E8F0',
};

export const darkColors: ThemeColors = {
  gradientTop: '#070A11',
  gradientMid: '#0C121E',
  gradientBottom: '#070A11',
  card: '#0E1524',
  cardBorder: 'rgba(255,255,255,0.1)',
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',
  inputBg: '#131C30',
  inputBorder: 'rgba(255,255,255,0.1)',
  primary: '#2563EB',
  primaryPressed: '#1D4ED8',
  accent: '#60A5FA',
  danger: '#F87171',
  success: '#00E676',
  divider: 'rgba(255,255,255,0.1)',
};
