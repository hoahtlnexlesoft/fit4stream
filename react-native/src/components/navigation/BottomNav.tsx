import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { PressableScale } from '../core/PressableScale';
import { Icon } from '../../icons';
import { colors, fonts } from '../../theme';

export type TabKey = 'home' | 'guide' | 'onair' | 'upcoming' | 'account';
const TABS: { key: TabKey; label: string }[] = [
  { key: 'home', label: 'Home' }, { key: 'guide', label: 'Guide' }, { key: 'onair', label: 'On-air' }, { key: 'upcoming', label: 'Upcoming' }, { key: 'account', label: 'Account' },
];

/** Broadcast glyph used for the On-air tab. */
function OnAirGlyph({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round">
      <Path d="M4.93 19.07a10 10 0 0 1 0-14.14" /><Path d="M7.76 16.24a6 6 0 0 1 0-8.49" />
      <Path d="M16.24 7.76a6 6 0 0 1 0 8.49" /><Path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <Circle cx={12} cy={12} r={2} fill={color} />
    </Svg>
  );
}

const ICON: Record<TabKey, 'home' | 'calendar' | 'clock' | 'userCircle' | null> = { home: 'home', guide: 'calendar', onair: null, upcoming: 'clock', account: 'userCircle' };

/**
 * Bottom tab bar (use as `tabBar` of @react-navigation/bottom-tabs or standalone).
 * Fills to the very bottom of the screen (no gap in PWA/standalone): background extends under the home indicator.
 */
export function BottomNav({ active, onChange, liveDot = true }: { active: TabKey; onChange: (k: TabKey) => void; liveDot?: boolean }) {
  const insets = useSafeAreaInsets();
  return (
    <BlurView intensity={40} tint="dark" style={[s.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {TABS.map((t) => {
        const on = t.key === active;
        const c = on ? colors.primary : 'rgba(255,255,255,0.55)';
        return (
          <PressableScale key={t.key} scaleTo={0.9} onPress={() => onChange(t.key)} accessibilityRole="tab" accessibilityState={{ selected: on }} accessibilityLabel={t.label} style={s.item}>
            <View>
              {t.key === 'onair' ? <OnAirGlyph color={c} /> : <Icon name={ICON[t.key]!} size={22} color={c} />}
              {t.key === 'onair' && liveDot && <View style={s.dot} />}
            </View>
            <Text style={[s.t, { color: c }]}>{t.label}</Text>
          </PressableScale>
        );
      })}
    </BlurView>
  );
}

const s = StyleSheet.create({
  bar: { flexDirection: 'row', paddingTop: 8, backgroundColor: 'rgba(15,14,20,0.82)', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(255,255,255,0.06)' },
  item: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 2 },
  t: { fontFamily: fonts.semibold, fontSize: 11 },
  dot: { position: 'absolute', top: -1, right: -3, width: 7, height: 7, borderRadius: 4, backgroundColor: colors.live },
});
