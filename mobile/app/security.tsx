import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Icon, TextField, colors, fonts, useToast } from '@ui';
import { Screen } from '@/components/Screen';
import { useLayout } from '@/lib/layout';

/** Security = change password only (client scope). Strength meter + rule checklist. TODO(api): PUT /me/password. */
export default function Security() {
  const router = useRouter();
  const toast = useToast();
  const { wide } = useLayout();
  const [cur, setCur] = useState(''); const [pw, setPw] = useState(''); const [pw2, setPw2] = useState('');
  const rules: [string, boolean][] = [['8+ characters', pw.length >= 8], ['A number', /\d/.test(pw)], ['A symbol', /[^A-Za-z0-9]/.test(pw)], ['Passwords match', pw.length > 0 && pw === pw2]];
  const score = rules.slice(0, 3).filter((r) => r[1]).length + (pw.length >= 12 ? 1 : 0);
  const LV: [string, string][] = [['', 'rgba(255,255,255,0.12)'], ['Weak', '#E5484D'], ['Fair', '#F4A425'], ['Good', '#39CAE0'], ['Strong', '#39C87C']];
  const lv = LV[pw ? Math.max(1, score) : 0];
  const ok = rules.every((r) => r[1]) && cur.length > 0;
  return (
    <Screen title="Security" footer={<Button title="Update password" block size="lg" disabled={!ok} onPress={() => { toast.show('Password updated'); router.back(); }} />} keyboardShouldPersistTaps="handled">
      <View style={[s.pad, wide && s.twoPane]}>
        <View style={[s.hero, wide && { width: 300 }]}>
          <View style={s.emb}><Icon name="lock" size={30} color={colors.primary} /></View>
          <View style={{ flex: 1 }}><Text style={s.heroT}>Keep your account secure</Text><Text style={s.heroS}>Use a strong password you don’t use anywhere else</Text></View>
        </View>
        <View style={[s.card, wide && { flex: 1 }]}>
          <View style={s.h3}><Text style={s.h3T}>Change password</Text><Text style={s.h3S}>Last changed 3 months ago</Text></View>
          <TextField label="Current password" icon="lock" secure value={cur} onChangeText={setCur} autoComplete="current-password" />
          <TextField label="New password" icon="lock" secure value={pw} onChangeText={setPw} placeholder="Create a new password" autoComplete="new-password" />
          {!!pw && <View style={s.str}><View style={s.bars}>{[1, 2, 3, 4].map((i) => <View key={i} style={[s.bar, { backgroundColor: i <= Math.max(1, score) ? lv[1] : 'rgba(255,255,255,0.1)' }]} />)}</View><Text style={[s.strT, { color: lv[1] }]}>{lv[0]}</Text></View>}
          <TextField label="Confirm new password" icon="lock" secure value={pw2} onChangeText={setPw2} placeholder="Repeat new password" />
          <View style={s.rules}>{rules.map(([l, on]) => (
            <View key={l} style={s.rule}><View style={[s.ruleI, on && { backgroundColor: colors.success, borderColor: colors.success }]}>{on && <Icon name="check" size={11} color="#08130C" />}</View><Text style={[s.ruleT, on && { color: '#fff' }]}>{l}</Text></View>
          ))}</View>
        </View>
      </View>
    </Screen>
  );
}
const s = StyleSheet.create({
  pad: { paddingHorizontal: 16, gap: 16 },
  twoPane: { flexDirection: 'row', alignItems: 'flex-start', maxWidth: 900, alignSelf: 'center', width: '100%' },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.045)' },
  emb: { width: 60, height: 60, borderRadius: 18, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  heroT: { fontFamily: fonts.bold, fontSize: 16, color: '#fff' },
  heroS: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18, color: colors.textSecondary, marginTop: 3 },
  card: { padding: 16, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.045)', gap: 14 },
  h3: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  h3T: { fontFamily: fonts.bold, fontSize: 16, color: '#fff' },
  h3S: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted },
  str: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: -4 },
  bars: { flex: 1, flexDirection: 'row', gap: 4 },
  bar: { flex: 1, height: 4, borderRadius: 2 },
  strT: { fontFamily: fonts.bold, fontSize: 12 },
  rules: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  rule: { flexDirection: 'row', alignItems: 'center', gap: 6, width: '47%' },
  ruleI: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  ruleT: { fontFamily: fonts.medium, fontSize: 12.5, color: colors.textMuted },
});
