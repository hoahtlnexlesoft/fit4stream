import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Icon, IconName, PaymentLogo, PressableScale, RefundSheet, colors, fonts, useToast } from '@ui';
import { Screen } from '@/components/Screen';
import { EVENTS, FEE, ME, ORDERS, OrderStatus, money } from '@/data';
import { useLayout } from '@/lib/layout';

/** Status palette = brand colours: paid cyan · pending amber · refunded purple · failed coral. */
const TONE: Record<OrderStatus, { c: string; soft: string; ic: IconName; t: string; sub: string; lab: string }> = {
  paid: { c: colors.brandCyan, soft: 'rgba(57,202,224,0.16)', ic: 'check', t: 'Payment Successful', sub: 'Your tickets are confirmed and ready', lab: 'Amount paid' },
  pending: { c: colors.primary, soft: 'rgba(244,164,37,0.16)', ic: 'clock', t: 'Refund in Progress', sub: 'We’ll notify you when it’s on its way', lab: 'You’ll get back' },
  refunded: { c: colors.purple, soft: 'rgba(165,122,216,0.18)', ic: 'check', t: 'Refund Complete', sub: 'Your refund has been processed successfully', lab: 'Refunded to you' },
  failed: { c: colors.brandCoral, soft: 'rgba(231,70,69,0.16)', ic: 'x', t: 'Payment Failed', sub: 'Your bank declined this payment', lab: 'Not charged' },
};
const REASONS = ["I can't attend anymore", 'Bought by mistake', 'Event changed or rescheduled', 'Stream quality issues', 'Other'];

/**
 * Receipt: orb hero · amount · refund stepper (pending/refunded) · payment box · summary ·
 * Download PDF + (Resend email | Request refund). Param `id` = order id; `?flag=pending|refund`.
 */
export default function Receipt() {
  const { id, flag } = useLocalSearchParams<{ id: string; flag?: string }>();
  const router = useRouter();
  const toast = useToast();
  const { wide } = useLayout();
  const o = ORDERS[id] ?? ORDERS['F4S-261103-0412'];
  const [st, setSt] = useState<OrderStatus>(flag === 'pending' ? 'pending' : o.st);
  const [refund, setRefund] = useState(flag === 'refund');
  const [reason, setReason] = useState(0);
  const T = TONE[st];
  const isRf = st === 'pending' || st === 'refunded';
  const amt = isRf ? o.total - FEE : o.total;
  const [whole, cents] = money(amt).split('.');
  const steps: [string, string, 0 | 1 | 2][] = st === 'refunded' ? [['Requested', 'Nov 04', 2], ['Approved', 'Nov 04', 2], ['Refunded', 'Nov 06', 2]] : [['Requested', 'Nov 04', 2], ['Approved', '~24h', 1], ['Refunded', '5–10 days', 0]];
  const img = EVENTS.find((e) => e.title === o.ev)?.image ?? EVENTS[0].image;
  const method = o.pmT.replace('Apple Pay · ', '');

  const pop = useRef(new Animated.Value(0)).current;
  useEffect(() => { pop.setValue(0); Animated.spring(pop, { toValue: 1, useNativeDriver: true, damping: 11, stiffness: 140 }).start(); }, [st, pop]);

  const Hero = (
    <View style={s.hero}>
      <View style={[s.ring, { borderColor: T.c + '55' }]} />
      <Animated.View style={[s.orb, { backgroundColor: T.c, shadowColor: T.c, transform: [{ scale: pop }] }]}><Icon name={T.ic} size={40} color="#0F0E14" /></Animated.View>
      <Text style={s.h2}>{T.t}</Text>
      <Text style={s.sub}>{T.sub}</Text>
      <LinearGradient colors={[T.soft, 'rgba(255,255,255,0.03)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.amt}>
        <Text style={s.amtL}>{T.lab}</Text>
        <Text style={s.amtB}>{isRf ? '+' : ''}{whole}<Text style={s.amtC}>.{cents}</Text></Text>
        <Text style={s.amtE}>{isRf ? `of ${money(o.total)} paid · ${money(FEE)} fee non-refundable` : st === 'failed' ? `Insufficient funds on ${o.pmT}` : o.when}</Text>
      </LinearGradient>
      {isRf && (
        <View style={s.steps}>
          {steps.map(([l, d, v], n) => (
            <View key={l} style={s.step}>
              {n > 0 && <View style={[s.ln, v >= 1 && { backgroundColor: T.c }]} />}
              <View style={[s.dot, v === 2 && { backgroundColor: T.c, borderColor: T.c }, v === 1 && { borderColor: T.c }]}>{v === 2 ? <Icon name="check" size={13} color="#0F0E14" /> : v === 1 ? <View style={[s.dotIn, { backgroundColor: T.c }]} /> : null}</View>
              <Text style={[s.stB, v === 0 && { color: colors.textMuted }]}>{l}</Text><Text style={s.stS}>{d}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const Rows = (
    <View style={{ gap: 12 }}>
      <View style={s.box}>
        <View style={s.row}><View style={s.ic}><Icon name="dollar" size={17} color={colors.textSecondary} /></View><Text style={s.rl}>Payment method</Text><View style={s.pm}><PaymentLogo brand={o.pm} small /><Text style={s.rv}>{method}</Text></View></View>
        <View style={s.hr} />
        <View style={s.row}><Text style={s.rl}>Transaction ID</Text><Text style={s.rv}>{`ch_3Q${o.id.slice(-4)}Xa9LkT`}</Text></View>
        <View style={s.row}><Text style={s.rl}>Billed to</Text><Text style={s.rv}>Tran Nguyen</Text></View>
        <View style={s.row}><Text style={s.rl}>{st === 'failed' ? 'Attempted' : 'Paid on'}</Text><Text style={s.rv}>{o.when}</Text></View>
      </View>
      <View style={s.box}>
        <View style={[s.row, { marginBottom: 4 }]}><View style={s.ic}><Icon name="list" size={17} color={colors.textSecondary} /></View><Text style={s.sumT}>Summary</Text></View>
        <View style={s.ev}><Image source={{ uri: img }} style={s.th} /><View style={{ flex: 1, minWidth: 0 }}><Text style={s.evT} numberOfLines={2}>{o.ev}</Text><Text style={s.evS}>Order {o.id}</Text></View></View>
        {o.lines.map(([l, v]) => <View key={l} style={s.row}><Text style={s.rl}>{l}</Text><Text style={[s.rv, v < 0 && { color: colors.successText }]}>{v < 0 ? '−' : ''}{money(Math.abs(v))}</Text></View>)}
        <View style={s.hr} />
        <View style={s.row}><Text style={s.totL}>{st === 'failed' ? 'Total' : 'Total paid'}</Text><Text style={s.totV}>{money(o.total)}</Text></View>
      </View>
      {st === 'failed' ? (
        <PressableScale onPress={() => router.push('/checkout/xmas')} style={s.btn}><Icon name="refresh" size={18} color={colors.onPrimary} /><Text style={s.btnT}>Try payment again</Text></PressableScale>
      ) : (
        <View style={{ gap: 10 }}>
          <PressableScale onPress={() => toast.show('Receipt PDF saved')} style={s.btn}><Icon name="download" size={18} color={colors.onPrimary} /><Text style={s.btnT}>Download PDF</Text></PressableScale>
          <View style={s.sec}>
            <PressableScale onPress={() => toast.show(`Sent to ${ME.email}`)} style={s.sb}><Icon name="mail" size={16} color="#fff" /><Text style={s.sbT}>Resend email</Text></PressableScale>
            {st === 'paid' && <PressableScale onPress={() => setRefund(true)} style={s.sb}><Icon name="refresh" size={16} color={colors.dangerText} /><Text style={[s.sbT, { color: colors.dangerText }]}>Request refund</Text></PressableScale>}
          </View>
        </View>
      )}
      <View style={s.help}><View style={s.q}><Text style={s.qT}>?</Text></View><Text style={s.helpT}>Questions about this charge? <Text style={{ textDecorationLine: 'underline', color: '#fff' }}>Contact support</Text></Text></View>
    </View>
  );

  return (
    <Screen title="Receipt">
      {wide
        ? <View style={s.two}><View style={{ width: 340 }}>{Hero}</View><View style={{ flex: 1 }}>{Rows}</View></View>
        : <View style={s.pad}>{Hero}<View style={{ height: 16 }} />{Rows}</View>}
      <RefundSheet visible={refund} onClose={() => setRefund(false)} amount={o.total - FEE} destination={method} fee={FEE} reasons={REASONS} reason={reason} onReason={setReason}
        onSubmit={() => { setRefund(false); setSt('pending'); toast.show('Refund requested'); }} />
    </Screen>
  );
}

const s = StyleSheet.create({
  pad: { paddingHorizontal: 16 },
  two: { flexDirection: 'row', gap: 24, paddingHorizontal: 24, alignItems: 'flex-start', maxWidth: 960, alignSelf: 'center', width: '100%' },
  hero: { alignItems: 'center', paddingTop: 8 },
  ring: { position: 'absolute', top: 0, width: 112, height: 112, borderRadius: 56, borderWidth: 1.5 },
  orb: { width: 88, height: 88, borderRadius: 44, marginTop: 12, alignItems: 'center', justifyContent: 'center', shadowOpacity: 0.55, shadowRadius: 24, shadowOffset: { width: 0, height: 8 }, elevation: 12 },
  h2: { marginTop: 22, fontFamily: fonts.extrabold, fontSize: 22, color: '#fff' },
  sub: { marginTop: 4, fontFamily: fonts.regular, fontSize: 13.5, color: colors.textSecondary },
  amt: { alignSelf: 'stretch', marginTop: 18, padding: 16, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
  amtL: { fontFamily: fonts.medium, fontSize: 12.5, color: colors.textSecondary },
  amtB: { fontFamily: fonts.extrabold, fontSize: 36, color: '#fff', marginTop: 2, fontVariant: ['tabular-nums'] },
  amtC: { fontSize: 20, color: colors.textSecondary },
  amtE: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  steps: { flexDirection: 'row', alignSelf: 'stretch', marginTop: 16 },
  step: { flex: 1, alignItems: 'center', gap: 4 },
  ln: { position: 'absolute', top: 12, right: '50%', width: '100%', height: 2, backgroundColor: 'rgba(255,255,255,0.12)', zIndex: -1 },
  dot: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)', backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  dotIn: { width: 8, height: 8, borderRadius: 4 },
  stB: { fontFamily: fonts.bold, fontSize: 12.5, color: '#fff', marginTop: 4 },
  stS: { fontFamily: fonts.regular, fontSize: 11, color: colors.textMuted },
  box: { padding: 14, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.045)', gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ic: { width: 30, height: 30, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
  rl: { flex: 1, fontFamily: fonts.regular, fontSize: 13.5, color: colors.textSecondary },
  rv: { fontFamily: fonts.semibold, fontSize: 13.5, color: '#fff' },
  pm: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  hr: { height: 1, backgroundColor: colors.border },
  sumT: { fontFamily: fonts.bold, fontSize: 15, color: '#fff' },
  ev: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
  th: { width: 64, height: 46, borderRadius: 10 },
  evT: { fontFamily: fonts.semibold, fontSize: 14, color: '#fff' },
  evS: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  totL: { flex: 1, fontFamily: fonts.bold, fontSize: 15, color: '#fff' },
  totV: { fontFamily: fonts.extrabold, fontSize: 17, color: '#fff' },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 54, borderRadius: 27, backgroundColor: colors.primary },
  btnT: { fontFamily: fonts.bold, fontSize: 15.5, color: colors.onPrimary },
  sec: { flexDirection: 'row', gap: 10 },
  sb: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.07)' },
  sbT: { fontFamily: fonts.bold, fontSize: 14, color: '#fff' },
  help: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 6 },
  q: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: colors.textMuted, alignItems: 'center', justifyContent: 'center' },
  qT: { fontFamily: fonts.bold, fontSize: 11, color: colors.textMuted },
  helpT: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted },
});
