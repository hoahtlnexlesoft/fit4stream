import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { PressableScale } from '../core/PressableScale';
import { colors, fonts } from '../../theme';

export type DateItem = { key: string; top: string; day: string; hasEvents?: boolean };

/** Horizontal day picker on the Event Guide. Selected day = amber pill. Dot = day has events. */
export function DateStrip({ days, value, onChange }: { days: DateItem[]; value: string; onChange: (k: string) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.row}>
      {days.map((d) => {
        const on = d.key === value;
        return (
          <PressableScale key={d.key} onPress={() => onChange(d.key)} accessibilityState={{ selected: on }} accessibilityLabel={`${d.top} ${d.day}`} style={[s.d, on && s.on]}>
            <Text style={[s.top, on && { color: colors.onPrimary }]}>{d.top}</Text>
            <Text style={[s.day, on && { color: colors.onPrimary }]}>{d.day}</Text>
            <View style={[s.dot, { opacity: d.hasEvents ? 1 : 0, backgroundColor: on ? colors.onPrimary : colors.primary }]} />
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  row: { gap: 8, paddingHorizontal: 20 },
  d: { width: 54, paddingVertical: 10, borderRadius: 18, backgroundColor: colors.surface, alignItems: 'center', gap: 3 },
  on: { backgroundColor: colors.primary },
  top: { fontFamily: fonts.semibold, fontSize: 11.5, color: colors.textMuted },
  day: { fontFamily: fonts.bold, fontSize: 18, color: colors.text },
  dot: { width: 5, height: 5, borderRadius: 3 },
});
