import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { PressableScale } from '../core/PressableScale';
import { colors, fonts } from '../../theme';

export type SegmentedTabsProps<T extends string> = { items: { key: T; label: string }[]; value: T; onChange: (k: T) => void; scroll?: boolean };

/** Pill tabs: active = amber fill, inactive = surface. Used for For you / Chat · People · About / My Events filters. */
export function SegmentedTabs<T extends string>({ items, value, onChange, scroll }: SegmentedTabsProps<T>) {
  const body = items.map((it) => {
    const on = it.key === value;
    return (
      <PressableScale key={it.key} onPress={() => onChange(it.key)} accessibilityRole="tab" accessibilityState={{ selected: on }}
        style={[s.item, on && s.on]}>
        <Text style={[s.t, on && s.tOn]}>{it.label}</Text>
      </PressableScale>
    );
  });
  return scroll
    ? <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.row} accessibilityRole="tablist">{body}</ScrollView>
    : <ScrollView horizontal scrollEnabled={false} contentContainerStyle={s.row} accessibilityRole="tablist">{body}</ScrollView>;
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  item: { height: 38, paddingHorizontal: 16, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.07)', justifyContent: 'center' },
  on: { backgroundColor: colors.primary },
  t: { fontFamily: fonts.semibold, fontSize: 14, color: colors.textSecondary },
  tOn: { color: colors.onPrimary, fontFamily: fonts.bold },
});
