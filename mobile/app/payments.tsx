import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Icon, PressableScale, colors, fonts } from '@ui';
import { Screen } from '@/components/Screen';
import { ORDERS, OrderStatus, money } from '@/data';
import { useLayout } from '@/lib/layout';

const STAT: Record<OrderStatus, [string, string]> = { paid: ['Paid', colors.successText], refunded: ['Refunded', colors.purpleText], pending: ['Refund pending', colors.primaryText], failed: ['Failed', colors.dangerText] };
const BARS: [string, number][] = [['Jun', 4.5], ['Jul', 9.9], ['Aug', 3.99], ['Sep', 14.2], ['Oct', 10.48], ['Nov', 6.87]];

/** Payment history: monthly spend card with 6-month bars · transactions list · manage methods. TODO(api): GET /me/orders. */
export default function Payments() {
  const router = useRouter();
  const { wide } = useLayout();
  return (
    <Screen title="Payment History">
      <View style={[s.pad, wide && s.narrow]}>
        <LinearGradient colors={['#2A1E44', '#18141F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.card}>
          <View style={s.top}><View style={s.k}><View style={s.kic}><Icon name="ticket" size={15} color={colors.primary} /></View><Text style={s.kT}>Spent this month</Text></View><Text style={s.mo}>November</Text></View>
          <View style={s.row}>
            <Text style={s.amt}><Text style={s.sup}>$</Text>6<Text style={s.small}>.87</Text></Text>
            <View style={s.bars}>{BARS.map(([m, v], i) => (
              <View key={m} style={s.barC}><View style={s.barTrack}><View style={[s.bar, { height: `${Math.max(12, (v / 14.2) * 100)}%` }, i === BARS.length - 1 && { backgroundColor: colors.primary }]} /></View><Text style={[s.barL, i === BARS.length - 1 && { color: '#fff' }]}>{m}</Text></View>
            ))}</View>
          </View>
          <View style={s.stats}><Text style={s.st}><Text style={s.stB}>3</Text> transactions</Text><View style={s.dot} /><Icon name="rotateCcw" size={13} color={colors.purpleText} /><Text style={s.st}><Text style={s.stB}>1</Text> refunded</Text><View style={{ flex: 1 }} /><Text style={[s.st, { color: colors.successText }]}>↓ 34% vs Oct</Text></View>
        </LinearGradient>

        <View style={s.group}>
          {Object.values(ORDERS).map((o) => (
            <PressableScale key={o.id} onPress={() => router.push(`/receipt/${o.id}`)} style={s.item}>
              <View style={s.ic}><Icon name="ticket" size={19} color={colors.purpleText} /></View>
              <View style={{ flex: 1, minWidth: 0 }}><Text style={s.t} numberOfLines={1}>{o.ev}</Text><Text style={s.s} numberOfLines={1}>{o.when.split(' · ')[0]} · {o.pmT.replace('Apple Pay · ', '')}</Text></View>
              <View style={{ alignItems: 'flex-end' }}><Text style={[s.a, o.st !== 'paid' && { color: colors.textMuted, textDecorationLine: 'line-through' }]}>{money(o.total)}</Text><Text style={[s.stt, { color: STAT[o.st][1] }]}>{STAT[o.st][0]}</Text></View>
            </PressableScale>
          ))}
        </View>
        <PressableScale onPress={() => router.push('/checkout/xmas')} style={s.manage}><Icon name="dollar" size={18} color="#fff" /><Text style={s.manageT}>Manage payment methods</Text><Icon name="chevronRight" size={18} color={colors.textMuted} /></PressableScale>
      </View>
    </Screen>
  );
}
const s = StyleSheet.create({
  pad: { paddingHorizontal: 16, gap: 16 },
  narrow: { maxWidth: 640, alignSelf: 'center', width: '100%' },
  card: { borderRadius: 24, padding: 18, gap: 14 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  k: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  kic: { width: 26, height: 26, borderRadius: 8, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  kT: { fontFamily: fonts.semibold, fontSize: 13, color: colors.textSecondary },
  mo: { fontFamily: fonts.medium, fontSize: 12.5, color: colors.textMuted },
  row: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  amt: { fontFamily: fonts.extrabold, fontSize: 44, color: '#fff' },
  sup: { fontSize: 22, color: colors.textSecondary },
  small: { fontSize: 24, color: colors.textSecondary },
  bars: { flexDirection: 'row', gap: 6, height: 70 },
  barC: { width: 22, alignItems: 'center', gap: 4 },
  barTrack: { flex: 1, width: 10, justifyContent: 'flex-end' },
  bar: { width: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.18)' },
  barL: { fontFamily: fonts.medium, fontSize: 9.5, color: colors.textMuted },
  stats: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  st: { fontFamily: fonts.medium, fontSize: 12.5, color: colors.textSecondary },
  stB: { fontFamily: fonts.bold, color: '#fff' },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)' },
  group: { borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.045)', overflow: 'hidden' },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 13 },
  ic: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  t: { fontFamily: fonts.semibold, fontSize: 14.5, color: '#fff' },
  s: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  a: { fontFamily: fonts.bold, fontSize: 15, color: '#fff' },
  stt: { fontFamily: fonts.bold, fontSize: 11.5, marginTop: 2 },
  manage: { flexDirection: 'row', alignItems: 'center', gap: 12, height: 54, paddingHorizontal: 16, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.045)' },
  manageT: { flex: 1, fontFamily: fonts.semibold, fontSize: 14.5, color: '#fff' },
});
