import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PressableScale } from '../core/PressableScale';
import { Icon, IconName } from '../../icons';
import { LiveDot } from './LiveDot';
import { colors, fonts } from '../../theme';

/**
 * Calm uniform category card (2-column grid). `wide` = full-width row variant used for the last odd item ("Others").
 * Live categories get a soft red tint + LIVE chip; others read "Coming soon".
 */
export function CategoryCard({ icon, title, count = 0, onPress, wide }: { icon: IconName; title: string; count?: number; onPress?: () => void; wide?: boolean }) {
  const live = count > 0;
  const sub = live ? `${count} ${count === 1 ? 'event' : 'events'}` : 'Coming soon';
  const ic = live
    ? <View style={[s.ic, { backgroundColor: 'rgba(229,72,77,0.85)' }]}><Icon name={icon} size={20} color="#fff" /></View>
    : <LinearGradient colors={['rgba(165,122,216,0.26)', 'rgba(165,122,216,0.10)']} style={s.ic}><Icon name={icon} size={20} color="#EAD9FF" /></LinearGradient>;
  return (
    <PressableScale onPress={onPress} accessibilityLabel={`${title}, ${sub}`} style={[s.card, wide ? s.wide : s.tall, live && s.live]}>
      {wide ? (
        <>
          {ic}
          <Text style={[s.title, { flex: 1, marginTop: 0 }]}>{title}</Text>
          <Text style={s.sub}>{sub}</Text>
        </>
      ) : (
        <>
          <View style={s.top}>{ic}{live && <View style={s.chip}><LiveDot size={5} /><Text style={s.chipT}>LIVE</Text></View>}</View>
          <Text style={s.title}>{title}</Text>
          <Text style={[s.sub, live && { color: colors.dangerText }]}>{sub}</Text>
        </>
      )}
    </PressableScale>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.045)', padding: 16 },
  tall: { flex: 1, minHeight: 118 },
  wide: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 },
  live: { backgroundColor: 'rgba(231,70,69,0.10)' },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ic: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, height: 20, paddingHorizontal: 8, borderRadius: 7, backgroundColor: colors.live },
  chipT: { fontFamily: fonts.extrabold, fontSize: 10, letterSpacing: 0.6, color: '#fff' },
  title: { marginTop: 16, fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20, color: colors.text },
  sub: { marginTop: 3, fontFamily: fonts.regular, fontSize: 12.5, color: colors.textMuted },
});
