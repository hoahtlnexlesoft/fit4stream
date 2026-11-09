import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { PressableScale, colors, fonts } from '@ui';

/** Horizontal filter chips (Notifications, Channels, My Events). */
export function Chips<T extends string>({ items, value, onChange, badge }: { items: [T, string][]; value: T; onChange: (k: T) => void; badge?: Partial<Record<T, number>> }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.row} style={{ flexGrow: 0 }}>
      {items.map(([k, l]) => {
        const on = k === value; const n = badge?.[k];
        return (
          <PressableScale key={k} onPress={() => onChange(k)} accessibilityRole="tab" accessibilityState={{ selected: on }} style={[s.chip, on && s.on]}>
            <Text style={[s.t, on && s.tOn]}>{l}</Text>
            {!!n && <Text style={[s.n, on && s.nOn]}>{n}</Text>}
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}
const s = StyleSheet.create({
  row: { paddingHorizontal: 16, gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 36, paddingHorizontal: 15, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.06)' },
  on: { backgroundColor: '#fff' },
  t: { fontFamily: fonts.semibold, fontSize: 13.5, color: 'rgba(255,255,255,0.75)' },
  tOn: { color: '#14121A' },
  n: { minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 5, textAlign: 'center', lineHeight: 18, overflow: 'hidden', fontFamily: fonts.bold, fontSize: 11, color: '#fff', backgroundColor: colors.live },
  nOn: { color: '#fff' },
});
