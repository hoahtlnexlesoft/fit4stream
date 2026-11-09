import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from '../../icons';
import { Avatar } from '../core/Avatar';
import { colors, fonts } from '../../theme';

export function Stars({ value, size = 14, gap = 2 }: { value: number; size?: number; gap?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap }} accessibilityLabel={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => <Icon key={i} name="star" size={size} filled color={i <= Math.round(value) ? colors.primary : 'rgba(255,255,255,0.18)'} />)}
    </View>
  );
}

/** Premium summary: big score + stars + count on the left, 5→1 distribution bars on the right. */
export function RatingSummary({ score, reviews, distribution }: { score: number; reviews: number; distribution: [number, number, number, number, number] }) {
  return (
    <View style={s.card}>
      <View style={s.left}>
        <View style={s.big}><Text style={s.bigT}>{score.toFixed(2)}</Text><Text style={s.of}>/5</Text></View>
        <Stars value={score} />
        <Text style={s.cnt}>{reviews} reviews</Text>
      </View>
      <View style={s.bars}>
        {distribution.map((pct, i) => (
          <View key={i} style={s.bar}>
            <Text style={s.n}>{5 - i}</Text>
            <View style={s.track}><View style={[s.fill, { width: `${Math.max(2, pct)}%` }]} /></View>
            <Text style={s.p}>{pct}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function ReviewCard({ name, avatar, rating, date, text }: { name: string; avatar?: string; rating: number; date: string; text: string }) {
  return (
    <View style={s.rc}>
      <View style={s.rcH}>
        <Avatar uri={avatar} name={name} size={36} />
        <View style={{ flex: 1 }}><Text style={s.rcN}>{name}</Text><Text style={s.rcD}>{date}</Text></View>
        <Stars value={rating} size={12} />
      </View>
      <Text style={s.rcT}>{text}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: { flexDirection: 'row', gap: 18, padding: 16, borderRadius: 20, backgroundColor: colors.surface },
  left: { alignItems: 'center', justifyContent: 'center', gap: 6, paddingRight: 18, borderRightWidth: 1, borderRightColor: colors.border },
  big: { flexDirection: 'row', alignItems: 'flex-end' },
  bigT: { fontFamily: fonts.extrabold, fontSize: 36, lineHeight: 40, color: colors.text, letterSpacing: -1 },
  of: { fontFamily: fonts.semibold, fontSize: 14, color: colors.textMuted, marginBottom: 5, marginLeft: 2 },
  cnt: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted },
  bars: { flex: 1, justifyContent: 'center', gap: 6 },
  bar: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  n: { width: 10, fontFamily: fonts.semibold, fontSize: 12, color: colors.textSecondary },
  track: { flex: 1, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3, backgroundColor: colors.primary },
  p: { width: 32, textAlign: 'right', fontFamily: fonts.regular, fontSize: 11.5, color: colors.textMuted },
  rc: { padding: 14, borderRadius: 18, backgroundColor: colors.surface, gap: 10 },
  rcH: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rcN: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text },
  rcD: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted },
  rcT: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.textSecondary },
});
