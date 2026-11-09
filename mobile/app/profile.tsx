import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import { Avatar, Button, Icon, IconName, PressableScale, Switch, colors, fonts, useToast } from '@ui';
import { Screen } from '@/components/Screen';
import { BirthdaySheet, GenderSheet } from '@/components/ProfileSheets';
import { ME } from '@/data';
import { myAvatar } from '@/data/images';
import { useLayout } from '@/lib/layout';

const TINT: Partial<Record<IconName, string>> = { user: '#A57AD8', gender: '#F472B6', cake: '#F4A425', mail: '#5B8CF0', phone: '#34C77B', mapPin: '#E74645', star: '#F4A425', message: '#39CAE0', briefcase: '#8A9AB0', globe: '#5B8CF0', ticket: '#A57AD8' };

function Ic({ n }: { n: IconName }) { return <View style={[s.ic, { backgroundColor: (TINT[n] ?? '#A57AD8') + '26' }]}><Icon name={n} size={16} color={TINT[n] ?? '#A57AD8'} /></View>; }
function Add({ onPress }: { onPress: () => void }) { return <PressableScale onPress={onPress} style={s.add}><Icon name="plus" size={13} color={colors.primaryText} /><Text style={s.addT}>Add</Text></PressableScale>; }
/** Label row. Defined at module level so TextInputs inside keep focus while typing. */
function Row({ icon, label, children, onPress, last }: { icon: IconName; label: string; children: React.ReactNode; onPress?: () => void; last?: boolean }) {
  const body = <><Ic n={icon} /><Text style={s.l}>{label}</Text><View style={s.vWrap}>{children}</View></>;
  return onPress ? <PressableScale onPress={onPress} style={[s.row, last && s.last]}>{body}</PressableScale> : <View style={[s.row, last && s.last]}>{body}</View>;
}
function Pick({ value, onPress }: { value: string; onPress: () => void }) {
  return value
    ? <PressableScale onPress={onPress} style={s.pick}><Text style={s.vT}>{value}</Text><Icon name="chevronRight" size={15} color={colors.textMuted} /></PressableScale>
    : <Add onPress={onPress} />;
}

/**
 * Edit profile: avatar with completion ring · Personal (Gender 2×2 sheet, Birthday wheel) · Contact · About me (expertise chips, bio) · Business.
 * Empty values show an "Add" chip. TODO: photo via expo-image-picker; save via PUT /me.
 */
export default function Profile() {
  const router = useRouter();
  const toast = useToast();
  const { wide } = useLayout();
  const [v, setV] = useState({ first: ME.first, last: ME.last, gender: '', birthday: '', phone: ME.phone, address: '', bio: '', bizName: '', taxId: '', bizAddr: '', web: '' });
  const [exp, setExp] = useState(['Live music', 'Concerts']);
  const [adding, setAdding] = useState(false);
  const [newExp, setNewExp] = useState('');
  const [biz, setBiz] = useState(false);
  const [gs, setGs] = useState(false);
  const [bs, setBs] = useState(false);
  const set = (k: keyof typeof v) => (val: string) => setV((o) => ({ ...o, [k]: val }));
  const checks = [!!v.first, !!v.last, !!v.gender, !!v.birthday, !!v.phone, !!v.address, exp.length > 0, !!v.bio, true];
  const pct = Math.round((checks.filter(Boolean).length / checks.length) * 100);
  const nextMissing = !v.birthday ? 'birthday' : !v.address ? 'address' : !v.bio ? 'bio' : !v.gender ? 'gender' : null;
  const bday = v.birthday ? new Date(v.birthday + 'T00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  const field = (k: keyof typeof v, placeholder: string, extra: TextInputProps = {}) => ({ value: v[k], onChangeText: set(k), placeholder, placeholderTextColor: colors.textSubtle, style: s.v, ...extra });

  const R = 56, C = 2 * Math.PI * R;
  return (
    <Screen title="" footer={<Button title="Save profile" block size="lg" onPress={() => { toast.show('Profile saved'); router.back(); }} />} keyboardShouldPersistTaps="handled" contentStyle={{ paddingTop: 0 }}>
      <LinearGradient colors={['rgba(120,47,141,0.35)', 'rgba(15,14,20,0)']} style={s.hero}>
        <View style={s.av}>
          <Svg width={120} height={120} style={StyleSheet.absoluteFill}>
            <Circle cx={60} cy={60} r={R} stroke="rgba(255,255,255,0.1)" strokeWidth={4} fill="none" />
            <Circle cx={60} cy={60} r={R} stroke={colors.primary} strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray={`${(pct / 100) * C} ${C}`} transform="rotate(-90 60 60)" />
          </Svg>
          <PressableScale onPress={() => toast.show('Pick a photo (expo-image-picker)')} accessibilityLabel="Change photo"><Avatar uri={myAvatar()} name={`${v.first} ${v.last}`} size={96} /></PressableScale>
          <View style={s.cam}><Icon name="camera" size={15} color={colors.onPrimary} /></View>
        </View>
        <Text style={s.name}>{`${v.first} ${v.last}`.trim() || 'Your name'}</Text>
        <Text style={s.mail}>{ME.email}</Text>
        <View style={s.done}><Text style={s.doneB}>{pct}%</Text><Text style={s.doneT}>{pct === 100 ? 'Profile complete — nice!' : `complete${nextMissing ? ` · add your ${nextMissing}` : ''}`}</Text></View>
      </LinearGradient>

      <View style={[s.pad, wide && s.narrow]}>
        <Text style={s.gl}>Personal</Text>
        <View style={s.grp}>
          <Row icon="user" label="First name"><TextInput {...field('first', 'Enter first name', { autoComplete: 'given-name' })} /></Row>
          <Row icon="user" label="Last name"><TextInput {...field('last', 'Enter last name', { autoComplete: 'family-name' })} /></Row>
          <Row icon="gender" label="Gender"><Pick value={v.gender} onPress={() => setGs(true)} /></Row>
          <Row icon="cake" label="Birthday" last><Pick value={bday} onPress={() => setBs(true)} /></Row>
        </View>
        <Text style={s.gl}>Contact</Text>
        <View style={s.grp}>
          <Row icon="mail" label="Email"><View style={s.ro}><Icon name="lock" size={13} color={colors.textMuted} /><Text style={[s.vT, { color: colors.textMuted }]} numberOfLines={1}>{ME.email}</Text></View></Row>
          <Row icon="phone" label="Phone"><TextInput {...field('phone', 'Enter phone', { keyboardType: 'phone-pad', autoComplete: 'tel' })} /></Row>
          <Row icon="mapPin" label="Address" last><TextInput {...field('address', 'Enter address', { autoComplete: 'street-address' })} /></Row>
        </View>
        <Text style={s.gl}>About me</Text>
        <View style={s.grp}>
          <View style={[s.colRow]}>
            <View style={s.rh}><Ic n="star" /><Text style={s.l}>Expertise</Text></View>
            <View style={s.chips}>
              {exp.map((x) => <View key={x} style={s.chip}><Text style={s.chipT}>{x}</Text><PressableScale onPress={() => setExp(exp.filter((y) => y !== x))} accessibilityLabel={`Remove ${x}`} hitSlop={8}><Icon name="x" size={11} color={colors.textMuted} /></PressableScale></View>)}
              {adding
                ? <TextInput autoFocus value={newExp} onChangeText={setNewExp} placeholder="e.g. Yoga" placeholderTextColor={colors.textSubtle} style={s.chipIn}
                    onSubmitEditing={() => { if (newExp.trim()) setExp([...exp, newExp.trim()]); setNewExp(''); }} onBlur={() => { if (newExp.trim()) setExp([...exp, newExp.trim()]); setNewExp(''); setAdding(false); }} />
                : <Add onPress={() => setAdding(true)} />}
            </View>
          </View>
          <View style={[s.colRow, s.last]}>
            <View style={s.rh}><Ic n="message" /><Text style={s.l}>Bio</Text><Text style={s.cnt}>{v.bio.length}/500</Text></View>
            <TextInput multiline maxLength={500} value={v.bio} onChangeText={set('bio')} placeholder="A few lines about you — what you love to watch, where you’re tuning in from…" placeholderTextColor={colors.textSubtle} style={s.ta} />
          </View>
        </View>
        <Text style={s.gl}>Business</Text>
        <View style={s.grp}>
          <View style={[s.row, !biz && s.last]}><Ic n="briefcase" /><View style={{ flex: 1 }}><Text style={s.l}>Registered business</Text><Text style={s.small}>Shown on your receipts</Text></View><Switch value={biz} onChange={setBiz} label="" /></View>
          {biz && <>
            <Row icon="briefcase" label="Business name"><TextInput {...field('bizName', 'Enter name')} /></Row>
            <Row icon="ticket" label="Tax ID"><TextInput {...field('taxId', 'Enter tax ID')} /></Row>
            <Row icon="mapPin" label="Address"><TextInput {...field('bizAddr', 'Add')} /></Row>
            <Row icon="globe" label="Website" last><TextInput {...field('web', 'https://', { keyboardType: 'url', autoCapitalize: 'none' })} /></Row>
          </>}
        </View>
      </View>

      <GenderSheet visible={gs} value={v.gender} onClose={() => setGs(false)} onPick={set('gender')} />
      {bs && <BirthdaySheet visible={bs} value={v.birthday} onClose={() => setBs(false)} onSave={(d) => { set('birthday')(d); setBs(false); toast.show('Birthday saved'); }} />}
    </Screen>
  );
}

const s = StyleSheet.create({
  hero: { alignItems: 'center', paddingTop: 100, paddingBottom: 8 },
  av: { width: 120, height: 120, alignItems: 'center', justifyContent: 'center' },
  cam: { position: 'absolute', right: 6, bottom: 6, width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.bg },
  name: { marginTop: 12, fontFamily: fonts.extrabold, fontSize: 22, color: '#fff' },
  mail: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, marginTop: 2 },
  done: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, height: 30, paddingHorizontal: 12, borderRadius: 15, backgroundColor: colors.primarySoft },
  doneB: { fontFamily: fonts.extrabold, fontSize: 13, color: colors.primary },
  doneT: { fontFamily: fonts.medium, fontSize: 12.5, color: colors.primaryText },
  pad: { paddingHorizontal: 16 },
  narrow: { maxWidth: 640, alignSelf: 'center', width: '100%' },
  gl: { fontFamily: fonts.bold, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: colors.textMuted, marginTop: 24, marginBottom: 10, marginLeft: 4 },
  grp: { borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.045)', overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 54, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  last: { borderBottomWidth: 0 },
  ic: { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  l: { minWidth: 76, fontFamily: fonts.medium, fontSize: 14, color: colors.textSecondary },
  small: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.textMuted, marginTop: 1 },
  vWrap: { flex: 1, alignItems: 'flex-end' },
  v: { alignSelf: 'stretch', textAlign: 'right', fontFamily: fonts.semibold, fontSize: 14, color: '#fff', paddingVertical: 14 },
  vT: { fontFamily: fonts.semibold, fontSize: 14, color: '#fff' },
  ro: { flexDirection: 'row', alignItems: 'center', gap: 5, flexShrink: 1 },
  pick: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  add: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 28, paddingHorizontal: 11, borderRadius: 14, backgroundColor: colors.primarySoft },
  addT: { fontFamily: fonts.bold, fontSize: 12.5, color: colors.primaryText },
  colRow: { padding: 14, gap: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  rh: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cnt: { marginLeft: 'auto', fontFamily: fonts.regular, fontSize: 11.5, color: colors.textMuted },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 30, paddingHorizontal: 12, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.08)' },
  chipT: { fontFamily: fonts.medium, fontSize: 13, color: '#fff' },
  chipIn: { minWidth: 100, height: 30, paddingHorizontal: 12, borderRadius: 15, borderWidth: 1, borderColor: colors.primary, color: '#fff', fontFamily: fonts.medium, fontSize: 13 },
  ta: { minHeight: 84, borderRadius: 14, padding: 12, backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', fontFamily: fonts.regular, fontSize: 14, textAlignVertical: 'top' },
});
