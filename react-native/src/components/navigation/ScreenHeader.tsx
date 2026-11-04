import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton } from '../core/IconButton';
import { colors, fonts } from '../../theme';

/** Pushed-screen header: back · centered title · optional right action. */
export function ScreenHeader({ title, onBack, right }: { title?: string; onBack?: () => void; right?: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.bar, { paddingTop: insets.top + 4 }]}>
      {onBack ? <IconButton icon="chevronLeft" accessibilityLabel="Back" onPress={onBack} iconSize={20} /> : <View style={s.slot} />}
      <Text style={s.title} numberOfLines={1} accessibilityRole="header">{title}</Text>
      <View style={s.slot}>{right}</View>
    </View>
  );
}

/** Large tab title (Event Guide, On-air, Upcoming) with optional right slot. */
export function LargeTitle({ title, right, badge }: { title: string; right?: React.ReactNode; badge?: React.ReactNode }) {
  return (
    <View style={s.large}>
      <View style={s.lRow}><Text style={s.lTitle} accessibilityRole="header">{title}</Text>{badge}</View>
      {right}
    </View>
  );
}

/** Section header: title + optional "View all" link. */
export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={s.sec}>
      <Text style={s.secT} accessibilityRole="header">{title}</Text>
      {action && <Text style={s.secA} onPress={onAction} accessibilityRole="link">{action}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingBottom: 8, gap: 8 },
  slot: { width: 44, alignItems: 'flex-end' },
  title: { flex: 1, textAlign: 'center', fontFamily: fonts.bold, fontSize: 17, color: colors.text },
  large: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 8 },
  lRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  lTitle: { fontFamily: fonts.extrabold, fontSize: 28, lineHeight: 34, letterSpacing: -0.6, color: colors.text },
  sec: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  secT: { fontFamily: fonts.bold, fontSize: 18, color: colors.text },
  secA: { fontFamily: fonts.semibold, fontSize: 14, color: colors.primary },
});
