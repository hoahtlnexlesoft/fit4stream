import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Text, TextInput, View } from 'react-native';
import { PressableScale } from '../core/PressableScale';
import { RadioCard } from '../form/Radio';
import { Stepper } from '../form/Stepper';
import { Divider } from '../core/Card';
import { Icon } from '../../icons';
import { LiveDot } from '../event/LiveDot';
import { PaymentLogo, PaymentBrand, AppleA, GoogleG } from './PaymentLogo';
import { colors, fonts } from '../../theme';

export const money = (n: number) => '$' + (Math.round(n * 100) / 100).toFixed(2);

/** Event summary at the top of checkout. */
export function CheckoutEventCard({ image, title, meta, live }: { image: string; title: string; meta: string; live?: boolean }) {
  return (
    <View style={s.ev}>
      <ImageBackground source={{ uri: image }} style={s.evImg} imageStyle={{ borderRadius: 13 }} />
      <View style={{ flex: 1, gap: 3 }}>
        {live && <View style={s.liveRow}><LiveDot color={colors.live} /><Text style={s.liveT}>LIVE NOW</Text></View>}
        <Text style={s.evT} numberOfLines={2}>{title}</Text>
        <Text style={s.evM}>{meta}</Text>
      </View>
    </View>
  );
}

export type TicketType = { id: string; name: string; description: string; price: number; badge?: string };

/** Ticket type options + quantity stepper. */
export function TicketPicker({ tickets, value, onChange, qty, onQty, maxQty = 5 }: { tickets: TicketType[]; value: string; onChange: (id: string) => void; qty: number; onQty: (n: number) => void; maxQty?: number }) {
  return (
    <View style={{ gap: 10 }}>
      {tickets.map((t) => (
        <RadioCard key={t.id} selected={t.id === value} onPress={() => onChange(t.id)} title={t.name} subtitle={t.description}
          badge={t.badge ? <View style={s.best}><Text style={s.bestT}>{t.badge}</Text></View> : undefined}
          right={<Text style={s.price}>{money(t.price)}</Text>} />
      ))}
      <View style={s.qty}>
        <View style={{ flex: 1 }}><Text style={s.qT}>Quantity</Text><Text style={s.qS}>Max {maxQty} per order · gift extra tickets by email</Text></View>
        <Stepper value={qty} min={1} max={maxQty} onChange={onQty} />
      </View>
    </View>
  );
}

/**
 * Promo code: input + Apply. Invalid → red ring + message. Applied → green chip with remove (×).
 * `validate` returns the discount label (e.g. "20% off tickets · −$1.60") or null if invalid.
 */
export function PromoCodeField({ applied, appliedLabel, onApply, onRemove, error, hint = 'Have a promo code?' }: { applied?: string; appliedLabel?: string; onApply: (code: string) => void; onRemove: () => void; error?: string; hint?: string }) {
  const [code, setCode] = useState('');
  if (applied) return (
    <View style={s.ok}>
      <View style={s.okIc}><Icon name="gift" size={18} color={colors.successText} /></View>
      <View style={{ flex: 1 }}><Text style={s.okC}>{applied}</Text><Text style={s.okL}>{appliedLabel}</Text></View>
      <PressableScale onPress={onRemove} scaleTo={0.9} style={s.okX} accessibilityLabel="Remove code"><Icon name="x" size={16} /></PressableScale>
    </View>
  );
  return (
    <View>
      <View style={[s.cp, !!error && { borderColor: colors.danger }]}>
        <Icon name="gift" size={18} color={colors.textMuted} />
        <TextInput value={code} onChangeText={(v) => setCode(v.toUpperCase())} autoCapitalize="characters" placeholder="Enter code" placeholderTextColor={colors.textSubtle}
          style={s.cpIn} onSubmitEditing={() => code && onApply(code)} returnKeyType="done" accessibilityLabel="Promo code" />
        <PressableScale disabled={!code} onPress={() => onApply(code)} style={[s.apply, !code && s.applyDis]}><Text style={[s.applyT, !code && { color: colors.textSubtle }]}>Apply</Text></PressableScale>
      </View>
      {error ? <View style={s.msg}><Icon name="x" size={13} color={colors.dangerText} /><Text style={[s.msgT, { color: colors.dangerText }]}>{error}</Text></View>
        : <Text style={[s.msgT, { color: colors.textSubtle, marginTop: 10, marginLeft: 4 }]}>{hint}</Text>}
    </View>
  );
}

export type PaymentMethod = { id: string; brand: PaymentBrand; title: string; subtitle: string };

/** Payment method list (radio on the right) + "Add debit or credit card" row. */
export function PaymentMethodList({ methods, value, onChange, onAddCard }: { methods: PaymentMethod[]; value: string; onChange: (id: string) => void; onAddCard: () => void }) {
  return (
    <View style={{ gap: 10 }}>
      {methods.map((m) => <RadioCard key={m.id} radioRight selected={m.id === value} onPress={() => onChange(m.id)} left={<PaymentLogo brand={m.brand} />} title={m.title} subtitle={m.subtitle} />)}
      <PressableScale onPress={onAddCard} style={s.add} accessibilityLabel="Add debit or credit card">
        <PaymentLogo brand="new" />
        <View style={{ flex: 1 }}><Text style={s.addT}>Add debit or credit card</Text><Text style={s.addS}>Visa, Mastercard, JCB, Amex</Text></View>
        <Icon name="chevronRight" size={18} color={colors.textSubtle} />
      </PressableScale>
    </View>
  );
}

export type SummaryLine = { label: string; amount: number; tone?: 'discount' };

/** Order summary card with dashed separator and bold total. */
export function OrderSummary({ lines, total, totalLabel = 'Total' }: { lines: SummaryLine[]; total: number; totalLabel?: string }) {
  return (
    <View style={s.sum}>
      {lines.map((l) => (
        <View key={l.label} style={s.line}>
          <Text style={[s.lL, l.tone === 'discount' && { color: colors.successText }]}>{l.label}</Text>
          <Text style={[s.lL, l.tone === 'discount' && { color: colors.successText }]}>{l.amount < 0 ? '−' + money(-l.amount) : money(l.amount)}</Text>
        </View>
      ))}
      <Divider dashed />
      <View style={s.line}><Text style={s.tL}>{totalLabel}</Text><Text style={s.tV}>{money(total)}</Text></View>
    </View>
  );
}

/** Sticky bottom bar: Total + Pay button (wallet-styled for Apple/Google Pay). */
export function PayBar({ total, method, onPay, bottomInset = 0 }: { total: number; method: PaymentBrand; onPay: () => void; bottomInset?: number }) {
  const wallet = method === 'apple' || method === 'google';
  return (
    <View style={[s.bar, { paddingBottom: bottomInset + 10 }]}>
      <View><Text style={s.barL}>Total</Text><Text style={s.barV}>{money(total)}</Text></View>
      <PressableScale onPress={onPay} style={[s.pay, wallet && s.payW]} accessibilityLabel={`Pay ${money(total)}`}>
        {method === 'apple' ? <View style={s.payRow}><Text style={[s.payT, { color: '#fff' }]}>Pay with </Text><AppleA size={17} /><Text style={[s.payT, { color: '#fff' }]}>Pay</Text></View>
          : method === 'google' ? <View style={s.payRow}><Text style={[s.payT, { color: '#fff' }]}>Pay with </Text><GoogleG size={16} /><Text style={[s.payT, { color: '#fff' }]}> Pay</Text></View>
          : <Text style={s.payT}>Pay {money(total)}</Text>}
      </PressableScale>
    </View>
  );
}

/** Lock icon + policy note under the summary. */
export function SecureNote({ children }: { children: React.ReactNode }) {
  return <View style={s.note}><Icon name="lock" size={14} color={colors.textSubtle} /><Text style={s.noteT}>{children}</Text></View>;
}

const s = StyleSheet.create({
  ev: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: 18, backgroundColor: colors.surface },
  evImg: { width: 72, height: 72 },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveT: { fontFamily: fonts.bold, fontSize: 11, letterSpacing: 0.6, color: colors.liveText },
  evT: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20, color: colors.text },
  evM: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.textMuted },
  best: { height: 18, paddingHorizontal: 7, borderRadius: 6, backgroundColor: colors.purpleSoft, justifyContent: 'center' },
  bestT: { fontFamily: fonts.bold, fontSize: 10.5, color: colors.purpleText },
  price: { fontFamily: fonts.bold, fontSize: 15.5, color: colors.text },
  qty: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 16, backgroundColor: colors.surface },
  qT: { fontFamily: fonts.semibold, fontSize: 14.5, color: colors.text },
  qS: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted },
  cp: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 52, paddingLeft: 14, paddingRight: 6, borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: 'transparent' },
  cpIn: { flex: 1, fontFamily: fonts.semibold, fontSize: 15, letterSpacing: 1, color: colors.text },
  apply: { height: 40, paddingHorizontal: 16, borderRadius: 12, backgroundColor: colors.primary, justifyContent: 'center' },
  applyDis: { backgroundColor: 'rgba(255,255,255,0.08)' },
  applyT: { fontFamily: fonts.bold, fontSize: 14, color: colors.onPrimary },
  msg: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10, marginLeft: 4 },
  msgT: { fontFamily: fonts.regular, fontSize: 12.5 },
  ok: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, paddingLeft: 12, borderRadius: 16, backgroundColor: 'rgba(57,202,124,0.10)', borderWidth: 1.5, borderColor: 'rgba(57,202,124,0.45)' },
  okIc: { width: 36, height: 36, borderRadius: 11, backgroundColor: 'rgba(57,202,124,0.18)', alignItems: 'center', justifyContent: 'center' },
  okC: { fontFamily: fonts.bold, fontSize: 14.5, letterSpacing: 1, color: colors.text },
  okL: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.successText },
  okX: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  add: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 16, backgroundColor: colors.surface },
  addT: { fontFamily: fonts.semibold, fontSize: 14.5, color: colors.text },
  addS: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.textMuted },
  sum: { gap: 12, padding: 16, borderRadius: 16, backgroundColor: colors.surface },
  line: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  lL: { fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary },
  tL: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  tV: { fontFamily: fonts.extrabold, fontSize: 20, color: colors.text },
  bar: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingTop: 14, paddingHorizontal: 20, backgroundColor: 'rgba(15,14,20,0.95)', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  barL: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted },
  barV: { fontFamily: fonts.extrabold, fontSize: 20, color: colors.text, fontVariant: ['tabular-nums'] },
  pay: { flex: 1, height: 54, borderRadius: 27, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  payW: { backgroundColor: '#000', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  payRow: { flexDirection: 'row', alignItems: 'center' },
  payT: { fontFamily: fonts.bold, fontSize: 16, color: colors.onPrimary },
  note: { flexDirection: 'row', gap: 8, paddingHorizontal: 4 },
  noteT: { flex: 1, fontFamily: fonts.regular, fontSize: 12, lineHeight: 17, color: colors.textSubtle },
});
