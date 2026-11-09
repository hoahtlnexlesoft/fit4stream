import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, IconName, LogoMark, PressableScale, TabKey, colors, fonts } from '@ui';

const ITEMS: { key: TabKey; label: string; icon: IconName }[] = [
  { key: 'home', label: 'Home', icon: 'home' }, { key: 'guide', label: 'Guide', icon: 'calendar' }, { key: 'onair', label: 'On-air', icon: 'radio' },
  { key: 'upcoming', label: 'Upcoming', icon: 'clock' }, { key: 'account', label: 'Account', icon: 'userCircle' },
];

/** Tablet / unfolded layout (width ≥ 700): vertical rail replaces the bottom tab bar. */
export function SideRail({ active, onChange }: { active: TabKey; onChange: (k: TabKey) => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.rail, { paddingTop: insets.top + 14, paddingBottom: insets.bottom + 14 }]}>
      <LogoMark size={34} />
      <View style={{ height: 22 }} />
      {ITEMS.map((t) => {
        const on = t.key === active;
        return (
          <PressableScale key={t.key} onPress={() => onChange(t.key)} accessibilityRole="tab" accessibilityState={{ selected: on }} style={s.item}>
            <View style={[s.pill, on && s.pillOn]}><Icon name={t.icon} size={22} color={on ? colors.primary : 'rgba(255,255,255,0.6)'} />{t.key === 'onair' && <View style={s.dot} />}</View>
            <Text style={[s.label, on && { color: colors.primary }]}>{t.label}</Text>
          </PressableScale>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  rail: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 104, alignItems: 'center', gap: 6, backgroundColor: '#0C0B11', borderRightWidth: 1, borderRightColor: colors.border },
  item: { alignItems: 'center', gap: 4, paddingVertical: 6, width: 88 },
  pill: { width: 56, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  pillOn: { backgroundColor: colors.primarySoft },
  dot: { position: 'absolute', top: 4, right: 14, width: 7, height: 7, borderRadius: 4, backgroundColor: colors.live },
  label: { fontFamily: fonts.semibold, fontSize: 11.5, color: 'rgba(255,255,255,0.6)' },
});
