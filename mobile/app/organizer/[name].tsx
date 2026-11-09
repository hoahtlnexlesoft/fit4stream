import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar, Icon, IconButton, PressableScale, RatingSummary, SectionHeader, colors, fonts, useToast } from '@ui';
import { EventCard } from '@/components/Events';
import { ClampText } from '@/components/Info';
import { EVENTS, organizer, shortDate, startTime } from '@/data';
import { avatar, photo } from '@/data/images';
import { useStore } from '@/lib/store';
import { useLayout } from '@/lib/layout';

const COVER: Record<string, string> = { 'Marc John': 'conference', 'thao15 nguyen15': 'xmas', 'Sandra Smith': 'concert' };

/** Organizer / channel profile: cover · avatar · badge · stats · Follow + bell · bio (More) · expertise · On air · Upcoming · ratings. */
export default function Organizer() {
  const { name: raw } = useLocalSearchParams<{ name: string }>();
  const NAME = decodeURIComponent(raw ?? 'Marc John');
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const store = useStore();
  const { sideRail, wide } = useLayout();
  const O = organizer(NAME);
  const following = store.following.has(NAME);
  const mine = EVENTS.filter((e) => e.organizer === NAME);
  const onAir = mine.find((e) => e.status === 'live');
  const rest = mine.filter((e) => e.status !== 'live');
  return (
    <View style={[s.root, { paddingLeft: sideRail }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 60 }} showsVerticalScrollIndicator={false}>
        <View style={s.cover}>
          <Image source={{ uri: photo(COVER[NAME] ?? 'concert') }} style={StyleSheet.absoluteFill} />
          <LinearGradient colors={['rgba(15,14,20,0.35)', 'rgba(15,14,20,0.2)', colors.bg]} style={StyleSheet.absoluteFill} />
        </View>
        <View style={[s.head, wide && { maxWidth: 640, alignSelf: 'center', width: '100%' }]}>
          <View style={s.av}><Avatar uri={avatar(NAME)} name={NAME} size={96} /></View>
          <Text style={s.h1}>{NAME}</Text>
          <View style={s.badge}><Icon name="star" size={12} color={colors.primary} filled /><Text style={s.badgeT}>{O.badge}</Text></View>
          <View style={s.stats}>
            {[[O.events, 'Events'], [String(O.followers + (following ? 1 : 0)), 'Followers'], [O.rating, 'Rating']].map(([v, l], i) => (
              <React.Fragment key={l}>{i > 0 && <View style={s.div} />}<View style={s.st}><Text style={s.stN}>{v}</Text><Text style={s.stL}>{l}</Text></View></React.Fragment>
            ))}
          </View>
          <View style={s.acts}>
            <PressableScale onPress={() => store.requireAuth('Sign in to follow organizers', () => store.toggleFollow(NAME))} style={[s.follow, following && s.followOn]}>
              <Icon name={following ? 'check' : 'plus'} size={18} color={following ? '#fff' : colors.onPrimary} /><Text style={[s.followT, following && { color: '#fff' }]}>{following ? 'Following' : 'Follow'}</Text>
            </PressableScale>
            <PressableScale onPress={() => toast.show(`You’ll be notified when ${NAME.split(' ')[0]} goes live`)} style={s.ic} accessibilityLabel="Notifications"><Icon name="bell" size={19} color="#fff" /></PressableScale>
          </View>
          <View style={{ alignSelf: 'stretch', marginTop: 18 }}><ClampText text={O.bio} lines={3} style={s.bio} /></View>
          {O.expertise.length > 0 && <View style={s.chips}>{O.expertise.map((x) => <View key={x} style={s.chip}><Text style={s.chipT}>{x}</Text></View>)}</View>}
        </View>

        {onAir && <View style={s.sec}><SectionHeader title="On air" /><EventCard event={onAir} width="100%" onPress={() => router.push(`/player/${onAir.id}`)} /></View>}
        {rest.length > 0 && (
          <View style={s.sec}>
            <SectionHeader title={rest[0].status === 'ended' ? 'Past events' : 'Upcoming'} />
            <View style={{ gap: 10 }}>{rest.map((e) => (
              <PressableScale key={e.id} onPress={() => router.push(`/event/${e.id}`)} style={s.row}>
                <View><Image source={{ uri: e.image }} style={s.th} /><View style={s.thT}><Text style={s.thTT}>{startTime(e)}</Text></View></View>
                <View style={{ flex: 1, minWidth: 0, gap: 4 }}><Text style={s.t} numberOfLines={2}>{e.title}</Text><View style={s.meta}><Icon name="calendar" size={13} color={colors.textMuted} /><Text style={s.metaT}>{shortDate(e)} · <Text style={e.price === 'Free' ? { color: colors.successText } : undefined}>{e.price}</Text></Text></View></View>
              </PressableScale>
            ))}</View>
          </View>
        )}
        <View style={s.sec}>
          <SectionHeader title="Ratings & Reviews" action="See all" onAction={() => router.push('/reviews')} />
          <PressableScale onPress={() => router.push('/reviews')}><RatingSummary score={Number(O.rating)} reviews={O.reviews} distribution={[90, 7, 2, 1, 0]} /></PressableScale>
        </View>
      </ScrollView>
      <View style={[s.top, { top: insets.top + 6, left: sideRail }]}>
        <IconButton icon="chevronLeft" variant="glass" accessibilityLabel="Back" onPress={() => router.back()} />
        <IconButton icon="share" variant="glass" accessibilityLabel="Share" onPress={() => toast.show('Link copied')} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  cover: { height: 220 },
  top: { position: 'absolute', right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12 },
  head: { alignItems: 'center', paddingHorizontal: 16, marginTop: -60 },
  av: { padding: 4, borderRadius: 54, backgroundColor: colors.bg },
  h1: { marginTop: 10, fontFamily: fonts.extrabold, fontSize: 24, color: '#fff' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, height: 26, paddingHorizontal: 10, borderRadius: 13, backgroundColor: colors.primarySoft, marginTop: 8 },
  badgeT: { fontFamily: fonts.bold, fontSize: 12, color: colors.primaryText },
  stats: { flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch', marginTop: 18, paddingVertical: 12, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.045)' },
  st: { flex: 1, alignItems: 'center' },
  stN: { fontFamily: fonts.extrabold, fontSize: 18, color: '#fff' },
  stL: { fontFamily: fonts.medium, fontSize: 11.5, color: colors.textMuted, marginTop: 2 },
  div: { width: 1, height: 26, backgroundColor: colors.border },
  acts: { flexDirection: 'row', gap: 10, alignSelf: 'stretch', marginTop: 14 },
  follow: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 50, borderRadius: 25, backgroundColor: colors.primary },
  followOn: { backgroundColor: 'rgba(255,255,255,0.1)' },
  followT: { fontFamily: fonts.bold, fontSize: 15, color: colors.onPrimary },
  ic: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  bio: { fontFamily: fonts.regular, fontSize: 14.5, lineHeight: 22, color: colors.textSecondary },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignSelf: 'stretch', marginTop: 14 },
  chip: { height: 30, paddingHorizontal: 12, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.06)', justifyContent: 'center' },
  chipT: { fontFamily: fonts.medium, fontSize: 12.5, color: colors.textSecondary },
  sec: { marginTop: 28, paddingHorizontal: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 8, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.045)' },
  th: { width: 96, height: 64, borderRadius: 13 },
  thT: { position: 'absolute', left: 5, bottom: 5, height: 18, paddingHorizontal: 6, borderRadius: 5, backgroundColor: 'rgba(10,9,14,0.7)', justifyContent: 'center' },
  thTT: { fontFamily: fonts.bold, fontSize: 10.5, color: '#fff' },
  t: { fontFamily: fonts.semibold, fontSize: 14, color: '#fff' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaT: { fontFamily: fonts.medium, fontSize: 12, color: colors.textMuted },
});
