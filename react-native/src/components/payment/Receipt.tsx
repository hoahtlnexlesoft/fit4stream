import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PressableScale } from '../core/PressableScale';
import { RadioRow } from '../form/Radio';
import { Button } from '../core/Button';
import { BottomSheet } from '../feedback/BottomSheet';
import { Divider } from '../core/Card';
import { Icon } from '../../icons';
import { PaymentLogo, PaymentBrand } from './PaymentLogo';
import { money } from './CheckoutParts';
import { colors, fonts } from '../../theme';

export type PaymentStatus = 'paid' | 'pending' | 'refunded' | 'failed';
const STATUS: Record<PaymentStatus, { label: string; bg: string; fg: string }> = {
  paid: { label: 'Paid', bg: colors.successSoft, fg: colors.successText },
  pending: { label: 'Refund pending', bg: colors.primarySoft, fg: colors.primaryText },
  refunded: { label: 'Refunded', bg: colors.infoSoft, fg: colors.infoText },
  failed: { label: 'Failed', bg: colors.dangerSoft, fg: colors.dangerText },
};

export function StatusPill({ status }: { status: PaymentStatus }) {
  const t = STATUS[status];
  return <View style={[s.pill, { backgroundColor: t.bg }]}><View style={[s.pDot, { backgroundColor: t.fg }]} /><Text style={[s.pT, { color: t.fg }]}>{t.label}</Text></View>;
}

/** Receipt top: status pill, big amount, date, perforated edge. */
export function ReceiptHero({ status, amount, date }: { status: PaymentStatus; amount: number; date: string }) {
  return (
    <LinearGradient colors={['rgba(244,164,37,0.14)', 'rgba(255,255,255,0.04)']} style={s.hero}>
      <StatusPill status={status} />
      <Text style={s.amt}>{money(amount)}</Text>
      <Text style={s.date}>{date}</Text>
      <View style={s.perf}>{Array.from({ length: 30 }).map((_, i) => <View key={i} style={s.perfDash} />)}</View>
    </LinearGradient>
  );
}

/** Event + line items + total. */
export function ReceiptItems({ image, title, orderId, lines, total, failed }: { image: string; title: string; orderId: string; lines: { label: string; amount: number }[]; total: number; failed?: boolean }) {
  return (
    <View style={s.card}>
      <View style={s.ev}><ImageBackground source={{ uri: image }} style={s.th} imageStyle={{ borderRadius: 12 }} /><View style={{ flex: 1 }}><Text style={s.evT}>{title}</Text><Text style={s.evO}>Order {orderId}</Text></View></View>
      <Divider />
      {lines.map((l) => <View key={l.label} style={s.line}><Text style={[s.lL, l.amount < 0 && { color: colors.successText }]}>{l.label}</Text><Text style={[s.lL, l.amount < 0 && { color: colors.successText }]}>{l.amount < 0 ? '−' + money(-l.amount) : money(l.amount)}</Text></View>)}
      <Divider dashed />
      <View style={s.line}><Text style={s.tL}>{failed ? 'Amount attempted' : 'Total paid'}</Text><Text style={s.tV}>{money(total)}</Text></View>
    </View>
  );
}

/** Payment method / transaction / billed-to rows. */
export function ReceiptMeta({ brand, method, txId, billedTo }: { brand: PaymentBrand; method: string; txId: string; billedTo: string }) {
  const Row = ({ l, children }: { l: string; children: React.ReactNode }) => <View style={s.mRow}><Text style={s.mL}>{l}</Text>{children}</View>;
  return (
    <View style={s.card}>
      <Row l="Payment method"><View style={s.pm}><PaymentLogo brand={brand} small /><Text style={s.mV}>{method}</Text></View></Row>
      <Row l="Transaction ID"><Text style={s.mV}>{txId}</Text></Row>
      <Row l="Billed to"><Text style={s.mV}>{billedTo}</Text></Row>
    </View>
  );
}

/** Refund progress: requested → approved → back on card. */
export function RefundTimeline({ steps }: { steps: { title: string; caption: string; done: boolean }[] }) {
  return (
    <View style={s.tl}>
      {steps.map((st, i) => (
        <View key={st.title} style={s.step}>
          <View style={{ alignItems: 'center' }}>
            <View style={[s.dot, st.done && s.dotOn]}>{st.done && <Icon name="check" size={12} strokeWidth={3} color={colors.onPrimary} />}</View>
            {i < steps.length - 1 && <View style={[s.lineV, st.done && { backgroundColor: colors.primary }]} />}
          </View>
          <View style={{ flex: 1, paddingBottom: i < steps.length - 1 ? 14 : 0 }}>
            <Text style={[s.stT, !st.done && { color: colors.textSecondary }]}>{st.title}</Text><Text style={s.stC}>{st.caption}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

/** Request refund sheet: refundable amount, reason list, warning, submit. */
export function RefundSheet({ visible, onClose, amount, destination, fee, reasons = ["I can't attend anymore", 'Bought by mistake', 'Event changed or rescheduled', 'Stream quality issues', 'Other'], reason, onReason, onSubmit, submitting }: {
  visible: boolean; onClose: () => void; amount: number; destination: string; fee: number; reasons?: string[]; reason: number; onReason: (i: number) => void; onSubmit: () => void; submitting?: boolean;
}) {
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Request a refund">
      <View style={s.rf}>
        <View style={s.rfRow}><Text style={s.rfL}>You'll get back</Text><Text style={s.rfV}>{money(amount)}</Text></View>
        <Text style={s.rfN}>To {destination} in 5–10 business days. Service fee ({money(fee)}) is non-refundable.</Text>
      </View>
      <View>
        <Text style={s.rsH}>REASON</Text>
        {reasons.map((r, i) => <RadioRow key={r} label={r} selected={reason === i} onPress={() => onReason(i)} />)}
      </View>
      <Text style={s.warn}>Your tickets will be cancelled and you'll lose access to the live and replay.</Text>
      <Button title="Submit refund request" size="lg" block loading={submitting} onPress={onSubmit} />
    </BottomSheet>
  );
}

/** Row in Payment History. */
export function PaymentHistoryRow({ title, caption, amount, status, onPress }: { title: string; caption: string; amount: number; status: PaymentStatus; onPress: () => void }) {
  const t = STATUS[status];
  return (
    <PressableScale onPress={onPress} style={s.hRow} accessibilityLabel={`${title}, ${money(amount)}, ${t.label}`}>
      <View style={s.hIc}><Icon name="ticket" size={19} color={colors.purple} /></View>
      <View style={{ flex: 1, minWidth: 0 }}><Text style={s.hT} numberOfLines={1}>{title}</Text><Text style={s.hC} numberOfLines={1}>{caption}</Text></View>
      <View style={{ alignItems: 'flex-end', gap: 3 }}>
        <Text style={[s.hA, status !== 'paid' && { color: colors.textMuted, textDecorationLine: 'line-through' }]}>{money(amount)}</Text>
        <View style={[s.hS, { backgroundColor: t.bg }]}><Text style={[s.hST, { color: t.fg }]}>{t.label}</Text></View>
      </View>
    </PressableScale>
  );
}

const s = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 26, paddingHorizontal: 10, borderRadius: 13 },
  pDot: { width: 6, height: 6, borderRadius: 3 },
  pT: { fontFamily: fonts.bold, fontSize: 12 },
  hero: { alignItems: 'center', gap: 6, paddingTop: 26, paddingBottom: 30, borderTopLeftRadius: 22, borderTopRightRadius: 22, borderBottomLeftRadius: 6, borderBottomRightRadius: 6 },
  amt: { fontFamily: fonts.extrabold, fontSize: 40, lineHeight: 46, letterSpacing: -0.5, color: '#fff', fontVariant: ['tabular-nums'] },
  date: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted },
  perf: { position: 'absolute', left: 10, right: 10, bottom: 0, flexDirection: 'row', justifyContent: 'space-between' },
  perfDash: { width: 6, height: 2, backgroundColor: 'rgba(255,255,255,0.18)' },
  card: { padding: 14, borderRadius: 18, backgroundColor: colors.surface, gap: 12 },
  ev: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  th: { width: 48, height: 48 },
  evT: { fontFamily: fonts.semibold, fontSize: 14.5, color: '#fff' },
  evO: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted, fontVariant: ['tabular-nums'] },
  line: { flexDirection: 'row', justifyContent: 'space-between' },
  lL: { fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary },
  tL: { fontFamily: fonts.semibold, fontSize: 14.5, color: '#fff' },
  tV: { fontFamily: fonts.bold, fontSize: 17, color: '#fff' },
  mRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  mL: { fontFamily: fonts.regular, fontSize: 13.5, color: colors.textMuted },
  mV: { fontFamily: fonts.semibold, fontSize: 13.5, color: '#fff' },
  pm: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tl: { padding: 14, borderRadius: 18, backgroundColor: 'rgba(244,164,37,0.06)' },
  step: { flexDirection: 'row', gap: 12 },
  dot: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  dotOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  lineV: { flex: 1, width: 2, marginVertical: 2, backgroundColor: 'rgba(255,255,255,0.1)' },
  stT: { fontFamily: fonts.semibold, fontSize: 14, color: '#fff' },
  stC: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.textMuted },
  rf: { padding: 14, borderRadius: 16, backgroundColor: 'rgba(57,202,224,0.08)' },
  rfRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  rfL: { fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary },
  rfV: { fontFamily: fonts.extrabold, fontSize: 22, color: '#fff' },
  rfN: { marginTop: 6, fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 17, color: colors.textMuted },
  rsH: { marginBottom: 4, fontFamily: fonts.semibold, fontSize: 13, letterSpacing: 0.5, color: colors.textMuted },
  warn: { fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 17, color: colors.primaryText },
  hRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14 },
  hIc: { width: 40, height: 40, borderRadius: 13, backgroundColor: 'rgba(165,122,216,0.16)', alignItems: 'center', justifyContent: 'center' },
  hT: { fontFamily: fonts.semibold, fontSize: 14.5, color: '#fff' },
  hC: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.textMuted },
  hA: { fontFamily: fonts.bold, fontSize: 15, color: '#fff' },
  hS: { height: 20, paddingHorizontal: 8, borderRadius: 7, justifyContent: 'center' },
  hST: { fontFamily: fonts.bold, fontSize: 11 },
});
