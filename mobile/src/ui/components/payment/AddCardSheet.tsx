import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BottomSheet } from '../feedback/BottomSheet';
import { Button } from '../core/Button';
import { Switch } from '../form/Switch';
import { Icon } from '../../icons';
import { PaymentLogo } from './PaymentLogo';
import { colors, fonts } from '../../theme';

const fmtN = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
const fmtE = (v: string) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d; };

/** Live card preview that updates as the user types (brand gradient switches Visa / Mastercard). */
export function CardPreview({ number, name, expiry }: { number: string; name: string; expiry: string }) {
  const digits = number.replace(/\D/g, '');
  const brand = /^4/.test(digits) ? 'visa' : /^5/.test(digits) ? 'mastercard' : null;
  const shown = (fmtN(number) + '•••• •••• •••• ••••'.slice(fmtN(number).length)).slice(0, 19);
  const grad: [string, string] = brand === 'visa' ? ['#2E3DB8', '#141A5C'] : brand === 'mastercard' ? ['#3A2A1C', '#1D1712'] : ['#3A3446', '#211D2A'];
  return (
    <LinearGradient colors={grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.card}>
      <View style={s.circle} />
      <LinearGradient colors={['#E9CF8F', '#B48D3E']} style={s.chip} />
      <View style={s.brand}>{brand === 'mastercard' ? <PaymentLogo brand="mastercard" /> : brand === 'visa' ? <Text style={s.visa}>VISA</Text> : null}</View>
      <Text style={s.num}>{shown}</Text>
      <View style={s.meta}>
        <View><Text style={s.mL}>CARD HOLDER</Text><Text style={s.mV}>{(name || 'YOUR NAME').toUpperCase()}</Text></View>
        <View style={{ alignItems: 'flex-end' }}><Text style={s.mL}>EXPIRES</Text><Text style={s.mV}>{expiry || 'MM/YY'}</Text></View>
      </View>
    </LinearGradient>
  );
}

/**
 * Add card sheet. NOTE for devs: in production, collect card data with your PSP's PCI-compliant fields
 * (e.g. Stripe <CardField/> / CardForm). This sheet is the visual spec; wire its inputs to the PSP SDK.
 */
export function AddCardSheet({ visible, onClose, onAdd }: { visible: boolean; onClose: () => void; onAdd: (card: { last4: string; save: boolean }) => Promise<void> | void }) {
  const [n, setN] = useState(''); const [e, setE] = useState(''); const [c, setC] = useState(''); const [name, setName] = useState(''); const [save, setSave] = useState(true); const [busy, setBusy] = useState(false);
  const digits = n.replace(/\D/g, '');
  const ok = digits.length >= 15 && /^\d\d\/\d\d$/.test(e) && c.length >= 3 && name.trim().length > 1;
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Add card">
      <CardPreview number={n} name={name} expiry={e} />
      <Field label="Card number"><TextInput value={fmtN(n)} onChangeText={setN} keyboardType="number-pad" autoComplete="cc-number" textContentType="creditCardNumber" placeholder="1234 5678 9012 3456" placeholderTextColor={colors.textSubtle} style={s.in} /></Field>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Field label="Expiry" flex><TextInput value={e} onChangeText={(v) => setE(fmtE(v))} keyboardType="number-pad" placeholder="MM/YY" placeholderTextColor={colors.textSubtle} style={s.in} /></Field>
        <Field label="CVC" flex><TextInput value={c} onChangeText={(v) => setC(v.replace(/\D/g, '').slice(0, 4))} keyboardType="number-pad" secureTextEntry placeholder="123" placeholderTextColor={colors.textSubtle} style={s.in} /></Field>
      </View>
      <Field label="Name on card"><TextInput value={name} onChangeText={setName} autoComplete="name" placeholder="As shown on card" placeholderTextColor={colors.textSubtle} style={s.in} /></Field>
      <Switch value={save} onChange={setSave} label="Save this card for faster checkout" />
      <Button title="Add card" block size="lg" disabled={!ok} loading={busy} onPress={async () => { setBusy(true); try { await onAdd({ last4: digits.slice(-4), save }); } finally { setBusy(false); } }} />
      <View style={s.sec}><Icon name="lock" size={13} color={colors.textSubtle} /><Text style={s.secT}>Secured by PCI-DSS certified processor</Text></View>
    </BottomSheet>
  );
}

function Field({ label, children, flex }: { label: string; children: React.ReactNode; flex?: boolean }) {
  return <View style={[{ gap: 6 }, flex && { flex: 1 }]}><Text style={s.lab}>{label}</Text>{children}</View>;
}

const s = StyleSheet.create({
  card: { height: 178, borderRadius: 20, padding: 20, justifyContent: 'flex-end', gap: 16, overflow: 'hidden' },
  circle: { position: 'absolute', right: -60, top: -80, width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(255,255,255,0.06)' },
  chip: { position: 'absolute', left: 20, top: 22, width: 38, height: 28, borderRadius: 7 },
  brand: { position: 'absolute', right: 20, top: 20 },
  visa: { fontFamily: fonts.extrabold, fontStyle: 'italic', fontSize: 20, color: '#fff' },
  num: { fontFamily: 'Menlo', fontSize: 20, letterSpacing: 1.6, color: '#fff', fontWeight: '600' },
  meta: { flexDirection: 'row', justifyContent: 'space-between' },
  mL: { fontFamily: fonts.semibold, fontSize: 9.5, letterSpacing: 0.8, color: 'rgba(255,255,255,0.55)' },
  mV: { fontFamily: fonts.semibold, fontSize: 13, color: '#fff' },
  lab: { fontFamily: fonts.semibold, fontSize: 12.5, color: colors.textSecondary },
  in: { height: 50, paddingHorizontal: 14, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.06)', fontFamily: fonts.regular, fontSize: 15.5, color: colors.text },
  sec: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  secT: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.textSubtle },
});
