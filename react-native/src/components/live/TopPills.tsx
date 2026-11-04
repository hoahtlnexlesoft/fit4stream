import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PressableScale } from '../core/PressableScale';
import { Icon } from '../../icons';
import { LiveDot } from '../event/LiveDot';
import { colors, fonts } from '../../theme';

/** Segmented "● LIVE | 01:01:05" pill. Same component in portrait and landscape. `state` swaps to SOON / ENDED. */
export function LiveStatusPill({ elapsed, state = 'live' }: { elapsed?: string; state?: 'live' | 'soon' | 'ended' }) {
  const live = state === 'live';
  return (
    <View style={s.seg} accessibilityLabel={live ? `Live, ${elapsed}` : state}>
      <View style={[s.segL, !live && { backgroundColor: 'rgba(255,255,255,0.14)' }]}>
        {live && <LiveDot />}
        <Text style={s.segLT}>{live ? 'LIVE' : state === 'soon' ? 'SOON' : 'ENDED'}</Text>
      </View>
      {live && elapsed ? <Text style={s.segR}>{elapsed}</Text> : null}
    </View>
  );
}

/** 👁 2.4K — tap opens People tab. */
export function ViewerPill({ count, onPress }: { count: string; onPress?: () => void }) {
  return (
    <PressableScale onPress={onPress} style={s.view} accessibilityLabel={`${count} viewers`}>
      <Icon name="eye" size={14} /><Text style={s.viewT}>{count}</Text>
    </PressableScale>
  );
}

const s = StyleSheet.create({
  seg: { flexDirection: 'row', alignItems: 'center', height: 28, borderRadius: 9, overflow: 'hidden', backgroundColor: colors.glass },
  segL: { height: '100%', flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, backgroundColor: colors.live },
  segLT: { fontFamily: fonts.extrabold, fontSize: 11.5, letterSpacing: 0.7, color: '#fff' },
  segR: { paddingHorizontal: 9, fontFamily: fonts.semibold, fontSize: 12.5, color: '#fff', fontVariant: ['tabular-nums'] },
  view: { flexDirection: 'row', alignItems: 'center', gap: 5, height: 28, paddingHorizontal: 10, borderRadius: 9, backgroundColor: colors.glass },
  viewT: { fontFamily: fonts.semibold, fontSize: 12.5, color: '#fff' },
});
