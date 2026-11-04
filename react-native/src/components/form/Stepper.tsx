import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PressableScale } from '../core/PressableScale';
import { Icon } from '../../icons';
import { colors, fonts } from '../../theme';
import Svg, { Path } from 'react-native-svg';

/** − value + quantity stepper (ticket quantity). */
export function Stepper({ value, min = 1, max = 5, onChange }: { value: number; min?: number; max?: number; onChange: (n: number) => void }) {
  const dec = value <= min, inc = value >= max;
  return (
    <View style={s.wrap} accessibilityRole="adjustable" accessibilityValue={{ min, max, now: value }}>
      <PressableScale scaleTo={0.9} disabled={dec} onPress={() => onChange(value - 1)} accessibilityLabel="Fewer" style={[s.b, dec && s.dis]}>
        <Svg width={16} height={16} viewBox="0 0 24 24"><Path d="M5 12h14" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" /></Svg>
      </PressableScale>
      <Text style={s.v}>{value}</Text>
      <PressableScale scaleTo={0.9} disabled={inc} onPress={() => onChange(value + 1)} accessibilityLabel="More" style={[s.b, inc && s.dis]}>
        <Icon name="plus" size={16} />
      </PressableScale>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: 3, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.07)' },
  b: { width: 34, height: 34, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.10)', alignItems: 'center', justifyContent: 'center' },
  dis: { opacity: 0.3 },
  v: { minWidth: 28, textAlign: 'center', fontFamily: fonts.bold, fontSize: 16, color: colors.text, fontVariant: ['tabular-nums'] },
});
