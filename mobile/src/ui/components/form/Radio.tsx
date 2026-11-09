import React from 'react';
import { StyleSheet, Text, View, StyleProp, ViewStyle } from 'react-native';
import { PressableScale } from '../core/PressableScale';
import { colors, fonts } from '../../theme';

/** 20px radio dot (amber ring when selected). */
export function RadioDot({ selected }: { selected: boolean }) {
  return <View style={[s.dot, selected ? s.dotOn : s.dotOff]} />;
}

export type RadioCardProps = {
  selected: boolean;
  onPress: () => void;
  title: string;
  subtitle?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  badge?: React.ReactNode;
  /** Put the radio on the right (payment methods) instead of the left (ticket types). */
  radioRight?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Selectable card row — ticket type, payment method, refund reason. Selected = amber 1.5px ring + soft amber tint. */
export function RadioCard({ selected, onPress, title, subtitle, left, right, badge, radioRight, style }: RadioCardProps) {
  return (
    <PressableScale onPress={onPress} accessibilityRole="radio" accessibilityState={{ checked: selected }} style={[s.card, selected && s.on, style]}>
      {!radioRight && <RadioDot selected={selected} />}
      {left}
      <View style={s.mid}>
        <View style={s.titleRow}><Text style={s.title} numberOfLines={1}>{title}</Text>{badge}</View>
        {subtitle ? <Text style={s.sub} numberOfLines={1}>{subtitle}</Text> : null}
      </View>
      {right}
      {radioRight && <RadioDot selected={selected} />}
    </PressableScale>
  );
}

/** Plain radio row (no card) — refund reasons. */
export function RadioRow({ selected, onPress, label }: { selected: boolean; onPress: () => void; label: string }) {
  return (
    <PressableScale onPress={onPress} accessibilityRole="radio" accessibilityState={{ checked: selected }} style={s.row}>
      <RadioDot selected={selected} /><Text style={s.rowT}>{label}</Text>
    </PressableScale>
  );
}

const s = StyleSheet.create({
  dot: { width: 20, height: 20, borderRadius: 10 },
  dotOff: { borderWidth: 1.75, borderColor: 'rgba(255,255,255,0.30)' },
  dotOn: { borderWidth: 6, borderColor: colors.primary },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: 'transparent' },
  on: { borderColor: colors.primary, backgroundColor: 'rgba(244,164,37,0.08)' },
  mid: { flex: 1, minWidth: 0, gap: 2 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontFamily: fonts.semibold, fontSize: 14.5, color: colors.text, flexShrink: 1 },
  sub: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.textMuted },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, height: 46 },
  rowT: { fontFamily: fonts.regular, fontSize: 14.5, color: colors.text },
});
