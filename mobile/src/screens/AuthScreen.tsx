import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { ThemeColors, darkColors, lightColors } from '../theme/colors';

type Mode = 'signin' | 'signup';
type Styles = ReturnType<typeof createStyles>;

const TRADER_TYPES = ['Options Pro', 'Intraday Scalper', 'Swing Trader', 'Equity Quant'] as const;

type Props = {
  /** Called with the signed-in/created identifier once a form validates. */
  onAuthenticated: (identifier: string) => void;
};

export function AuthScreen({ onAuthenticated }: Props) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [mode, setMode] = useState<Mode>('signin');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sign in fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign up fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [traderType, setTraderType] = useState<(typeof TRADER_TYPES)[number]>('Options Pro');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const switchMode = (next: Mode) => {
    setErrors({});
    setMode(next);
  };

  const handleSignIn = () => {
    const nextErrors: Record<string, string> = {};
    if (!identifier.trim()) nextErrors.identifier = 'Enter your username or email';
    if (!password) nextErrors.password = 'Enter your password';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onAuthenticated(identifier.trim());
  };

  const handleSignUp = () => {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = 'Enter your full name';
    if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = 'Enter a valid email';
    if (!username.trim()) nextErrors.username = 'Choose a trader handle';
    if (password.length < 6) nextErrors.password = 'At least 6 characters';
    if (confirmPassword !== password) nextErrors.confirmPassword = 'Passwords do not match';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onAuthenticated(username.replace('@', '').trim());
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={[colors.gradientTop, colors.gradientMid, colors.gradientBottom]} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <View style={styles.logoRow}>
              <LinearGradient colors={[colors.primary, colors.accent]} style={styles.logoBadge}>
                <Feather name="trending-up" size={18} color="#fff" />
              </LinearGradient>
              <Text style={styles.logoText}>Bullpost</Text>
            </View>

            {mode === 'signin' ? (
              <View style={styles.formGap}>
                <View style={styles.headerBlock}>
                  <Text style={styles.title}>Welcome back</Text>
                  <Text style={styles.subtitle}>Sign in to your Bullpost account</Text>
                </View>

                <Field
                  styles={styles}
                  colors={colors}
                  placeholder="Enter your username or email"
                  value={identifier}
                  onChangeText={setIdentifier}
                  autoCapitalize="none"
                  error={errors.identifier}
                />

                <PasswordField
                  styles={styles}
                  colors={colors}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  visible={showPassword}
                  onToggleVisible={() => setShowPassword((v) => !v)}
                  error={errors.password}
                />

                <Pressable style={styles.forgotRow} hitSlop={8}>
                  <Text style={styles.linkText}>Forgot password?</Text>
                </Pressable>

                <PrimaryButton styles={styles} label="Sign In" onPress={handleSignIn} />

                <Divider styles={styles} />
                <SocialRow styles={styles} onPress={(provider) => onAuthenticated(`${provider}_user`)} />

                <View style={styles.switchRow}>
                  <Text style={styles.mutedText}>Don't have an account? </Text>
                  <Pressable onPress={() => switchMode('signup')} hitSlop={8}>
                    <Text style={styles.linkTextBold}>Create account</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={styles.formGap}>
                <View style={styles.headerBlock}>
                  <Text style={styles.title}>Create account</Text>
                  <Text style={styles.subtitle}>Join Bullpost as a trader</Text>
                </View>

                <Field
                  styles={styles}
                  colors={colors}
                  icon="user"
                  placeholder="Full name (e.g. Rishi Kumar)"
                  value={name}
                  onChangeText={setName}
                  error={errors.name}
                />
                <Field
                  styles={styles}
                  colors={colors}
                  icon="mail"
                  placeholder="Email address"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  error={errors.email}
                />
                <Field
                  styles={styles}
                  colors={colors}
                  prefix="@"
                  placeholder="Trader handle"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  error={errors.username}
                />

                <View style={styles.chipRow}>
                  {TRADER_TYPES.map((t) => {
                    const active = traderType === t;
                    return (
                      <Pressable key={t} onPress={() => setTraderType(t)} style={[styles.chip, active && styles.chipActive]}>
                        <Text style={[styles.chipText, active && styles.chipTextActive]}>{t}</Text>
                      </Pressable>
                    );
                  })}
                </View>

                <PasswordField
                  styles={styles}
                  colors={colors}
                  placeholder="Create a password"
                  value={password}
                  onChangeText={setPassword}
                  visible={showPassword}
                  onToggleVisible={() => setShowPassword((v) => !v)}
                  error={errors.password}
                />
                <PasswordField
                  styles={styles}
                  colors={colors}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  visible={showConfirmPassword}
                  onToggleVisible={() => setShowConfirmPassword((v) => !v)}
                  error={errors.confirmPassword}
                />

                <PrimaryButton styles={styles} label="Create account" onPress={handleSignUp} />

                <View style={styles.switchRow}>
                  <Text style={styles.mutedText}>Already have an account? </Text>
                  <Pressable onPress={() => switchMode('signin')} hitSlop={8}>
                    <Text style={styles.linkTextBold}>Log in</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>

          <Text style={styles.footerText}>© 2026 Bullpost Network • Trader Social Terminal</Text>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

function Field({
  styles,
  colors,
  placeholder,
  value,
  onChangeText,
  error,
  icon,
  prefix,
  autoCapitalize,
  keyboardType,
}: {
  styles: Styles;
  colors: ThemeColors;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  error?: string;
  icon?: React.ComponentProps<typeof Feather>['name'];
  prefix?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address';
}) {
  return (
    <View style={styles.fieldWrap}>
      <View style={[styles.inputRow, error && styles.inputRowError]}>
        {icon ? <Feather name={icon} size={16} color={colors.textSecondary} style={styles.inputIcon} /> : null}
        {prefix ? <Text style={styles.inputPrefix}>{prefix}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize={autoCapitalize ?? 'sentences'}
          keyboardType={keyboardType ?? 'default'}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

function PasswordField({
  styles,
  colors,
  placeholder,
  value,
  onChangeText,
  visible,
  onToggleVisible,
  error,
}: {
  styles: Styles;
  colors: ThemeColors;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  visible: boolean;
  onToggleVisible: () => void;
  error?: string;
}) {
  return (
    <View style={styles.fieldWrap}>
      <View style={[styles.inputRow, error && styles.inputRowError]}>
        <TextInput
          style={[styles.input, styles.inputWithTrailingIcon]}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!visible}
          autoCapitalize="none"
        />
        <Pressable onPress={onToggleVisible} hitSlop={8} style={styles.trailingIconBtn}>
          <Feather name={visible ? 'eye-off' : 'eye'} size={16} color={colors.textSecondary} />
        </Pressable>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

function PrimaryButton({ styles, label, onPress }: { styles: Styles; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}>
      <Text style={styles.primaryBtnText}>{label}</Text>
    </Pressable>
  );
}

function Divider({ styles }: { styles: Styles }) {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>Or</Text>
      <View style={styles.dividerLine} />
    </View>
  );
}

function SocialRow({ styles, onPress }: { styles: Styles; onPress: (provider: string) => void }) {
  return (
    <View style={styles.socialRow}>
      <Pressable style={styles.socialBtn} onPress={() => onPress('apple')} hitSlop={4}>
        <Ionicons name="logo-apple" size={20} color="#000" />
      </Pressable>
      <Pressable style={styles.socialBtn} onPress={() => onPress('google')} hitSlop={4}>
        <Ionicons name="logo-google" size={18} color="#EA4335" />
      </Pressable>
      <Pressable style={styles.socialBtn} onPress={() => onPress('facebook')} hitSlop={4}>
        <Ionicons name="logo-facebook" size={20} color="#1877F2" />
      </Pressable>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    flex: { flex: 1 },
    scrollContent: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    card: {
      width: '100%',
      maxWidth: 400,
      backgroundColor: colors.card,
      borderRadius: 28,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      padding: 24,
      shadowColor: colors.primary,
      shadowOpacity: 0.12,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
      elevation: 6,
    },
    logoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginBottom: 20,
    },
    logoBadge: {
      width: 34,
      height: 34,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoText: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.textPrimary,
      letterSpacing: -0.5,
    },
    formGap: { gap: 14 },
    headerBlock: { gap: 2, marginBottom: 2 },
    title: { fontSize: 24, fontWeight: '800', color: colors.textPrimary },
    subtitle: { fontSize: 13, color: colors.textSecondary },
    fieldWrap: { gap: 4 },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.inputBg,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 999,
      paddingHorizontal: 16,
      height: 48,
    },
    inputRowError: { borderColor: colors.danger },
    inputIcon: { marginRight: 8 },
    inputPrefix: { color: colors.textSecondary, fontWeight: '600', marginRight: 4 },
    input: {
      flex: 1,
      fontSize: 14,
      color: colors.textPrimary,
      fontWeight: '500',
      paddingVertical: 0,
    },
    inputWithTrailingIcon: { paddingRight: 8 },
    trailingIconBtn: { padding: 6 },
    errorText: { fontSize: 11, color: colors.danger, marginLeft: 4 },
    forgotRow: { alignItems: 'flex-end' },
    linkText: { fontSize: 12, fontWeight: '600', color: colors.primary },
    linkTextBold: { fontSize: 12, fontWeight: '800', color: colors.primary },
    mutedText: { fontSize: 12, color: colors.textSecondary },
    primaryBtn: {
      backgroundColor: colors.primary,
      borderRadius: 999,
      height: 52,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.primary,
      shadowOpacity: 0.3,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 4,
    },
    primaryBtnPressed: { backgroundColor: colors.primaryPressed },
    primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
    dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    dividerLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: colors.divider },
    dividerText: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },
    socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
    socialBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.card,
    },
    switchRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: colors.inputBg,
    },
    chipActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '1A',
    },
    chipText: { fontSize: 11, fontWeight: '700', color: colors.textSecondary },
    chipTextActive: { color: colors.primary },
    footerText: {
      marginTop: 16,
      fontSize: 11,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });
}
