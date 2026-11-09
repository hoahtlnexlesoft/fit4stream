import React from 'react';
import { ImageBackground, StyleSheet, Text, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PressableScale } from '../core/PressableScale';
import { Button } from '../core/Button';
import { Icon } from '../../icons';
import { LiveBadge, LiveDot } from './LiveDot';
import { EventItem } from './types';
import { colors, fonts } from '../../theme';

export type EventHeroCardProps = {
  event: EventItem;
  onPress?: () => void;
  /** Join (registered + live) / Register / View */
  onCta?: () => void;
  width?: number;
};

/**
 * Tall portrait card used in the Home coverflow.
 * Live + registered → "Join Live Event" (tap card or button opens the player directly).
 * Live + not registered → "Register" (goes to detail / checkout).
 */
export function EventHeroCard({ event: e, onPress, onCta, width = Dimensions.get('window').width * 0.72 }: EventHeroCardProps) {
  const live = e.status === 'live';
  const cta = live ? (e.registered ? 'Join Live Event' : 'Register') : 'View';
  return (
    <PressableScale onPress={onPress} scaleTo={0.98} accessibilityLabel={e.title} style={[s.card, { width, height: width * 1.32 }]}>
      <ImageBackground source={{ uri: e.image }} style={StyleSheet.absoluteFill} imageStyle={{ borderRadius: 28 }} />
      <LinearGradient colors={['rgba(0,0,0,0.25)', 'rgba(0,0,0,0)', 'rgba(8,7,12,0.55)', 'rgba(8,7,12,0.95)']} locations={[0, 0.3, 0.6, 1]} style={[StyleSheet.absoluteFill, { borderRadius: 28 }]} />
      <View style={s.cat}><Text style={s.catT}>{e.category}</Text></View>
      <View style={s.body}>
        {live && <View style={s.liveRow}><LiveBadge /><View style={s.watch}><Icon name="eye" size={14} color="rgba(255,255,255,0.8)" /><Text style={s.watchT}>{e.watching ?? '2.4K'} watching</Text></View></View>}
        <Text style={s.title} numberOfLines={2}>{e.title}</Text>
        <Text style={s.org}>by {e.organizer}</Text>
        <View style={s.foot}>
          {live ? <View style={s.since}><LiveDot color={colors.live} size={8} /><Text style={s.sinceT}>Started 12 min ago</Text></View>
            : <View style={s.since}><Icon name="clock" size={14} color="rgba(255,255,255,0.7)" /><Text style={s.sinceT}>{e.dateLabel}</Text></View>}
          <Button title={cta} size="sm" icon={live && e.registered ? 'play' : undefined} onPress={onCta} />
        </View>
      </View>
    </PressableScale>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: 28, overflow: 'hidden', backgroundColor: '#1A1820' },
  cat: { position: 'absolute', top: 16, left: 16, height: 30, paddingHorizontal: 12, borderRadius: 15, backgroundColor: 'rgba(10,9,14,0.45)', justifyContent: 'center' },
  catT: { fontFamily: fonts.semibold, fontSize: 12.5, color: '#fff' },
  body: { position: 'absolute', left: 18, right: 18, bottom: 18, gap: 6 },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  watch: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  watchT: { fontFamily: fonts.semibold, fontSize: 13, color: 'rgba(255,255,255,0.85)' },
  title: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 27, letterSpacing: -0.3, color: '#fff' },
  org: { fontFamily: fonts.semibold, fontSize: 13.5, color: colors.primaryText },
  foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  since: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sinceT: { fontFamily: fonts.semibold, fontSize: 13, color: 'rgba(255,255,255,0.8)' },
});
