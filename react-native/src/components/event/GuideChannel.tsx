import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { PressableScale } from '../core/PressableScale';
import { Avatar } from '../core/Avatar';
import { Icon } from '../../icons';
import { EventItem } from './types';
import { colors, fonts } from '../../theme';

/** Start ↓ end time column (end time same size, grey arrow). */
export function TimeRange({ start, end }: { start: string; end: string }) {
  return (
    <View style={s.time} accessibilityLabel={`From ${start} to ${end}`}>
      <Text style={s.tT}>{start}</Text>
      <Svg width={10} height={16} viewBox="0 0 10 16" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><Path d="M5 1v13M1.5 10.5 5 14l3.5-3.5" /></Svg>
      <Text style={s.tT}>{end}</Text>
    </View>
  );
}

/**
 * Event Guide group: organizer header (tap → that organizer's profile) + timeline of their events.
 * Important: onOrganizer must open the profile of THIS organizer (pass their id), not a default one.
 */
export function GuideChannel({ organizer, avatar, events, onOrganizer, onEvent }: { organizer: string; avatar?: string; events: EventItem[]; onOrganizer: () => void; onEvent: (e: EventItem) => void }) {
  return (
    <View style={s.card}>
      <PressableScale onPress={onOrganizer} style={s.head} accessibilityLabel={`${organizer}, ${events.length} events`}>
        <Avatar uri={avatar} name={organizer} size={36} ring="subtle" />
        <Text style={s.name}>{organizer}</Text>
        <Text style={s.count}>{events.length} {events.length === 1 ? 'event' : 'events'}</Text>
        <Icon name="chevronRight" size={16} color={colors.textSubtle} />
      </PressableScale>
      {events.map((e, i) => (
        <PressableScale key={e.id} onPress={() => onEvent(e)} style={[s.item, i > 0 && s.sepTop]} accessibilityLabel={e.title}>
          <TimeRange start={e.start} end={e.end} />
          <View style={[s.dot, { backgroundColor: e.status === 'live' ? colors.live : e.status === 'ended' ? 'rgba(255,255,255,0.3)' : colors.info }, e.status === 'live' && s.dotLive]} />
          <View style={s.body}>
            <Text style={[s.title, e.status === 'ended' && { color: colors.textSecondary }]} numberOfLines={2}>{e.title}</Text>
            <View style={s.meta}>
              <View style={[s.pill, e.status === 'live' ? s.pLive : e.status === 'ended' ? s.pEnd : s.pUp]}>
                {e.status === 'live' && <View style={s.pDot} />}
                <Text style={[s.pT, { color: e.status === 'live' ? colors.liveText : e.status === 'ended' ? colors.textSecondary : colors.infoText }]}>{e.status === 'live' ? 'Live' : e.status === 'ended' ? 'Ended' : 'Upcoming'}</Text>
              </View>
              <Text style={s.cat} numberOfLines={1}>{e.category}</Text>
            </View>
          </View>
        </PressableScale>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: 22, backgroundColor: colors.surface, paddingHorizontal: 14, paddingBottom: 4 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  name: { flex: 1, fontFamily: fonts.semibold, fontSize: 15.5, color: colors.text },
  count: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted },
  item: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 14 },
  sepTop: { borderTopWidth: 1, borderTopColor: colors.border },
  time: { width: 46, alignItems: 'center', gap: 2 },
  tT: { fontFamily: fonts.bold, fontSize: 14, color: colors.text, fontVariant: ['tabular-nums'] },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 5 },
  dotLive: { borderWidth: 3, borderColor: 'rgba(229,72,77,0.3)', width: 14, height: 14, borderRadius: 7, marginTop: 3 },
  body: { flex: 1, minWidth: 0, gap: 6 },
  title: { fontFamily: fonts.semibold, fontSize: 15.5, lineHeight: 21, color: colors.text },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 5, height: 22, paddingHorizontal: 8, borderRadius: 7 },
  pLive: { backgroundColor: 'rgba(229,72,77,0.15)' }, pEnd: { backgroundColor: 'rgba(255,255,255,0.08)' }, pUp: { backgroundColor: colors.infoSoft },
  pDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.liveText },
  pT: { fontFamily: fonts.semibold, fontSize: 11.5 },
  cat: { flex: 1, fontFamily: fonts.regular, fontSize: 12.5, color: colors.textMuted },
});
