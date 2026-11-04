import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PressableScale } from '../core/PressableScale';
import { Icon, IconName } from '../../icons';
import { colors, fonts } from '../../theme';

export type RailAction = { key: string; icon: IconName; label: string; active?: boolean; onPress: () => void };

/** Vertical action column on the right of the live player (Like · Rate · Chat · Share). Hide while the viewer is on stage. */
export function ActionRail({ actions }: { actions: RailAction[] }) {
  return (
    <View style={s.rail}>
      {actions.map((a) => (
        <PressableScale key={a.key} onPress={a.onPress} scaleTo={0.88} accessibilityLabel={a.label} accessibilityState={{ selected: !!a.active }} style={s.item}>
          <View style={[s.ic, a.active && s.on]}><Icon name={a.icon} size={21} color={a.active ? colors.primary : '#fff'} filled={a.active && (a.icon === 'thumbsUp' || a.icon === 'star')} /></View>
          <Text style={s.t}>{a.label}</Text>
        </PressableScale>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  rail: { gap: 12, alignItems: 'center' },
  item: { width: 52, alignItems: 'center', gap: 4 },
  ic: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  on: { backgroundColor: 'rgba(244,164,37,0.22)' },
  t: { fontFamily: fonts.semibold, fontSize: 11.5, color: 'rgba(255,255,255,0.88)' },
});
