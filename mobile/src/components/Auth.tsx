import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Icon, PressableScale, TextField, colors, fonts, useToast } from '@ui';
import { useStore } from '@/lib/store';

/**
 * Email + password sign-in form (used by /login and the signed-out Account tab).
 * TODO(api): replace the timeout with your auth call; Apple/Google buttons → expo-apple-authentication / Google Sign-In.
 */
export function LoginForm({ onDone }: { onDone?: () => void }) {
  const router = useRouter();
  const toast = useToast();
  const { signIn } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const submit = () => { setBusy(true); setTimeout(() => { setBusy(false); signIn(); toast.show('Signed in as Thao 13'); onDone?.(); }, 650); };
  return (
    <View style={{ gap: 14 }}>
      <TextField label="Email" icon="mail" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
      <TextField label="Password" icon="lock" value={password} onChangeText={setPassword} placeholder="Your password" secure autoComplete="current-password" textContentType="password" onSubmitEditing={submit} />
      <View style={s.row}>
        <PressableScale onPress={() => setRemember(!remember)} style={s.rem} accessibilityRole="checkbox" accessibilityState={{ checked: remember }}>
          <View style={[s.box, remember && s.boxOn]}>{remember && <Icon name="check" size={12} color={colors.onPrimary} />}</View><Text style={s.remT}>Remember me</Text>
        </PressableScale>
        <Text style={s.link} onPress={() => router.push('/forgot')}>Forgot password?</Text>
      </View>
      <PressableScale onPress={submit} style={s.cta} accessibilityLabel="Sign in">{busy ? <ActivityIndicator color={colors.onPrimary} /> : <Text style={s.ctaT}>Sign in</Text>}</PressableScale>
      <View style={s.or}><View style={s.orL} /><Text style={s.orT}>or continue with</Text><View style={s.orL} /></View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button title="Apple" variant="secondary" style={{ flex: 1 }} onPress={submit} />
        <Button title="Google" variant="secondary" style={{ flex: 1 }} onPress={submit} />
      </View>
    </View>
  );
}

export function AuthFoot({ q, a, onPress }: { q: string; a: string; onPress: () => void }) {
  return <Text style={s.foot}>{q} <Text style={s.link} onPress={onPress}>{a}</Text></Text>;
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  box: { width: 20, height: 20, borderRadius: 6, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  boxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  remT: { fontFamily: fonts.medium, fontSize: 13.5, color: colors.textSecondary },
  link: { fontFamily: fonts.semibold, fontSize: 13.5, color: colors.primaryText },
  cta: { height: 54, borderRadius: 27, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  ctaT: { fontFamily: fonts.bold, fontSize: 16, color: colors.onPrimary },
  or: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 2 },
  orL: { flex: 1, height: 1, backgroundColor: colors.border },
  orT: { fontFamily: fonts.medium, fontSize: 12.5, color: colors.textMuted },
  foot: { textAlign: 'center', fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary, marginTop: 18 },
});
