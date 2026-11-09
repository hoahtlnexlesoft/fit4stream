import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { PressableScale } from '../core/PressableScale';
import { Badge } from '../core/Badge';
import { Icon } from '../../icons';
import { EventItem } from './types';
import { colors, fonts } from '../../theme';

/** Compact list row: thumbnail (with start time) + title + date · price. Used in Upcoming, Organizer, My Events. */
export function EventRow({ event: e, onPress, right }: { event: EventItem; onPress?: () => void; right?: React.ReactNode }) {
  return (
    <PressableScale onPress={onPress} style={s.row} accessibilityLabel={e.title}>
      <ImageBackground source={{ uri: e.image }} style={s.thumb} imageStyle={{ borderRadius: 14 }}>
        <View style={s.time}><Text style={s.timeT}>{e.start}</Text></View>
      </ImageBackground>
      <View style={s.mid}>
        <Text style={s.title} numberOfLines={2}>{e.title}</Text>
        <View style={s.meta}>
          <Icon name="calendar" size={13} color={colors.textMuted} />
          <Text style={s.metaT}>{e.dateLabel}</Text>
          {e.price && <><View style={s.sep} /><Text style={s.metaT}>{e.price}</Text></>}
        </View>
        {e.status === 'live' ? <Badge label="Live" tone="live" dot /> : e.registered ? <Badge label="Purchased" tone="purchased" /> : null}
      </View>
      {right}
    </PressableScale>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: 18, backgroundColor: colors.surface },
  thumb: { width: 84, height: 84, justifyContent: 'flex-end', padding: 6 },
  time: { alignSelf: 'flex-start', height: 20, paddingHorizontal: 6, borderRadius: 6, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center' },
  timeT: { fontFamily: fonts.bold, fontSize: 11, color: '#fff' },
  mid: { flex: 1, minWidth: 0, gap: 6 },
  title: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20, color: colors.text },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaT: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.textMuted },
  sep: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.textSubtle },
});
