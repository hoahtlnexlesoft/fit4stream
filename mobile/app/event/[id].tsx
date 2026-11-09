import React, { useRef, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar, EmptyState, Icon, IconButton, PressableScale, colors, fonts, useToast } from '@ui';
import { EventCard } from '@/components/Events';
import { ClampText, FormatLine, InfoLine, InfoList } from '@/components/Info';
import { ShareSheet } from '@/components/ShareSheet';
import { StripeCta } from '@/components/StripeCta';
import { DetailSkeleton } from '@/components/Skeletons';
import { durationLabel, getEvent, shortCat, shortDate, startTime } from '@/data';
import { avatar } from '@/data/images';
import { useLoading } from '@/lib/useLoading';
import { useStore } from '@/lib/store';
import { useLayout } from '@/lib/layout';
import { openEvent } from '@/lib/nav';

/**
 * Event detail (live / upcoming / ended): hero · title · status line · stats strip · CTA row (+ save, share) ·
 * about · Hosted by · Event details · More like this · Ratings & Reviews. Wide screens: hero left, content right.
 */
export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const store = useStore();
  const { wide, sideRail } = useLayout();
  const [loading] = useLoading(`detail:${id}`);
  const [share, setShare] = useState(false);
  const scroll = useRef<ScrollView>(null);
  const simY = useRef(0);
  const e = getEvent(id);
  const live = e.status === 'live', ended = e.status === 'ended';
  const reg = store.registered.has(e.id);
  const saved = store.saved.has(e.id);
  const following = store.following.has(e.organizer);
  const others = ['xmas', 'gig', 'seo', 'payout'].filter((k) => k !== e.id).map(getEvent);
  const about = e.about || 'The organizer hasn’t added a description yet.';

  if (loading) return <DetailSkeleton />;

  const go = () => store.requireAuth('Sign in to register for this event', () => router.push(reg ? `/player/${e.id}` : `/checkout/${e.id}`));
  const cta = ended
    ? <StripeCta variant="ended" icon="clock" label="Event ended" onPress={() => { toast.show('This event has ended — check out similar events'); setTimeout(() => scroll.current?.scrollTo({ y: simY.current - 80, animated: true }), 250); }} />
    : e.id === 'seo' && store.authed
      ? <StripeCta variant="waiting" icon="clock" label="Enter waiting room" onPress={() => router.push(`/player/${e.id}?state=waiting`)} />
      : <StripeCta icon="play" label={reg ? 'Join Live Event' : live ? `Register & watch · ${e.price}` : `Register · ${e.price}`} onPress={go} />;

  const Hero = (
    <View style={[s.hero, wide && s.heroWide]}>
      <Image source={{ uri: e.image }} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={['rgba(15,14,20,0.55)', 'rgba(15,14,20,0)', 'rgba(15,14,20,0)', wide ? 'rgba(15,14,20,0)' : colors.bg]} locations={[0, 0.3, 0.6, 1]} style={StyleSheet.absoluteFill} />
      {live && <View style={[s.liveTag, { top: insets.top + 12 }]}><View style={s.dot} /><Text style={s.liveT}>LIVE · 1:01:05</Text></View>}
    </View>
  );

  const Main = (
    <View>
      <View style={s.main}>
        <Text style={s.title}>{e.title}</Text>
        <View style={s.status}>
          <View style={[s.sdot, { backgroundColor: live ? colors.live : ended ? 'rgba(255,255,255,0.35)' : colors.info }]} />
          <Text style={[s.sB, live && { color: colors.liveText }, ended && { color: colors.textMuted }]}>{live ? 'Live now' : ended ? 'Ended' : 'Upcoming'}</Text>
          <Text style={s.sT}>{live ? `Started ${startTime(e)}` : `${shortDate(e)} · ${startTime(e)}`}</Text>
          <View style={s.sep} /><Text style={s.sT}>{shortCat(e.category)}</Text>
        </View>
        <View style={s.stats}>
          {[[e.registers, 'Registered'], [e.views, e.views === 1 ? 'View' : 'Views'], [e.likes, e.likes === 1 ? 'Like' : 'Likes']].map(([n, l], i) => (
            <React.Fragment key={String(l)}>{i > 0 && <View style={s.stDiv} />}<View style={s.st}><Text style={s.stN}>{n}</Text><Text style={s.stL}>{l}</Text></View></React.Fragment>
          ))}
        </View>
        <View style={s.ctaRow}>
          {cta}
          {!ended && <PressableScale onPress={() => store.requireAuth('Sign in to save events', () => { const on = store.toggleSave(e.id); toast.show(on ? 'Saved to My Events' : 'Removed from saved'); })} style={[s.ib, saved && s.ibOn]} accessibilityLabel={saved ? 'Saved' : 'Save'}><Icon name="bookmark" size={21} color={saved ? colors.onPrimary : '#fff'} filled={saved} /></PressableScale>}
          <PressableScale onPress={() => setShare(true)} style={s.ib} accessibilityLabel="Share"><Icon name="share" size={20} color="#fff" /></PressableScale>
        </View>
        <View style={{ marginTop: 18 }}><ClampText text={about} lines={4} style={[s.about, !e.about && { color: colors.textMuted }]} /></View>
      </View>

      <View style={s.sec}>
        <Text style={s.h2}>Hosted by</Text>
        <View style={s.host}>
          <PressableScale onPress={() => router.push(`/organizer/${encodeURIComponent(e.organizer)}`)} style={s.hostL}>
            <Avatar uri={avatar(e.organizer)} name={e.organizer} size={52} />
            <View style={{ flex: 1, minWidth: 0 }}><Text style={s.hostN} numberOfLines={1}>{e.organizer}</Text><Text style={s.hostS}>Organizer · 0 follower</Text></View>
          </PressableScale>
          <PressableScale onPress={() => store.requireAuth('Sign in to follow organizers', () => store.toggleFollow(e.organizer))} style={[s.follow, following && s.followOn]}><Text style={[s.followT, following && { color: '#fff' }]}>{following ? 'Following' : 'Follow'}</Text></PressableScale>
        </View>
      </View>

      <View style={s.sec}>
        <Text style={s.h2}>Event details</Text>
        <InfoList>
          <InfoLine icon="calendar" label="Date" value={e.date} />
          <InfoLine icon="clock" label="Time" value={`${e.range.replace(' – ', '–')} · ${durationLabel(e)}`} />
          <InfoLine icon="mapPin" label="Time zone" value={e.tz || 'Asia/Saigon'} />
          <InfoLine icon="globe" label="Language" value={e.lang} />
          <FormatLine formats={e.format.length ? e.format : ['Live']} />
          <InfoLine icon="refresh" label="Repeats" value={e.type === 'One-time' ? 'No · one-time event' : e.type} />
          <InfoLine icon="grid" label="Category" value={e.category} last />
        </InfoList>
      </View>

      <View style={s.sec} onLayout={(ev) => (simY.current = ev.nativeEvent.layout.y)}>
        <Text style={[s.h2, s.px]}>More like this</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16 }} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
          {others.map((o) => <EventCard key={o.id} event={o} onPress={() => openEvent(router, o, store)} />)}
        </ScrollView>
      </View>

      <View style={s.sec}>
        <View style={[s.px, s.rh]}><Text style={s.h2}>Ratings & Reviews</Text><Text style={s.link} onPress={() => router.push('/reviews')}>See all</Text></View>
        <EmptyState icon="star" title="No reviews yet" body={ended ? 'Attended this event? Share how it went.' : 'Reviews open once the event starts.'} action={ended ? 'Write a review' : undefined} onAction={() => router.push('/reviews')} />
      </View>
    </View>
  );

  return (
    <View style={[s.root, { paddingLeft: sideRail }]}>
      {wide ? (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ width: '46%', padding: 16, paddingTop: insets.top + 64 }}>{Hero}</View>
          <ScrollView ref={scroll} style={{ flex: 1 }} contentContainerStyle={{ paddingTop: insets.top + 56, paddingBottom: insets.bottom + 40 }} showsVerticalScrollIndicator={false}>{Main}</ScrollView>
        </View>
      ) : (
        <ScrollView ref={scroll} contentContainerStyle={{ paddingBottom: insets.bottom + 40 }} showsVerticalScrollIndicator={false}>
          {Hero}{Main}
        </ScrollView>
      )}
      <View style={[s.close, { top: insets.top + 6, left: 12 + sideRail }]}><IconButton icon="x" variant="glass" accessibilityLabel="Close" onPress={() => router.back()} /></View>
      <ShareSheet event={e} visible={share} onClose={() => setShare(false)} />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  hero: { height: 330, backgroundColor: '#1B1921' },
  heroWide: { height: undefined, aspectRatio: 4 / 3, borderRadius: 24, overflow: 'hidden' },
  liveTag: { position: 'absolute', right: 14, flexDirection: 'row', alignItems: 'center', gap: 6, height: 28, paddingHorizontal: 10, borderRadius: 8, backgroundColor: colors.live },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' },
  liveT: { fontFamily: fonts.bold, fontSize: 12, color: '#fff', fontVariant: ['tabular-nums'] },
  close: { position: 'absolute' },
  main: { paddingHorizontal: 16, marginTop: -24 },
  title: { fontFamily: fonts.extrabold, fontSize: 26, lineHeight: 32, letterSpacing: -0.4, color: '#fff', textAlign: 'center' },
  status: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  sdot: { width: 7, height: 7, borderRadius: 4 },
  sB: { fontFamily: fonts.bold, fontSize: 13, color: colors.infoText },
  sT: { fontFamily: fonts.medium, fontSize: 13, color: colors.textSecondary },
  sep: { width: 3, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)' },
  stats: { flexDirection: 'row', alignItems: 'center', marginTop: 18, paddingVertical: 12, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.045)' },
  st: { flex: 1, alignItems: 'center' },
  stN: { fontFamily: fonts.extrabold, fontSize: 18, color: '#fff' },
  stL: { fontFamily: fonts.medium, fontSize: 11.5, color: colors.textMuted, marginTop: 2 },
  stDiv: { width: 1, height: 26, backgroundColor: colors.border },
  ctaRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  ib: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  ibOn: { backgroundColor: colors.primary },
  about: { fontFamily: fonts.regular, fontSize: 14.5, lineHeight: 22, color: colors.textSecondary },
  sec: { marginTop: 30, paddingHorizontal: 16 },
  px: { paddingHorizontal: 0 },
  rh: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  h2: { fontFamily: fonts.bold, fontSize: 18, color: '#fff', marginBottom: 12 },
  link: { fontFamily: fonts.semibold, fontSize: 13.5, color: colors.primaryText, marginBottom: 12 },
  host: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.045)' },
  hostL: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, minWidth: 0 },
  hostN: { fontFamily: fonts.bold, fontSize: 15.5, color: '#fff' },
  hostS: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.textMuted, marginTop: 2 },
  follow: { height: 36, paddingHorizontal: 16, borderRadius: 18, backgroundColor: colors.primary, justifyContent: 'center' },
  followOn: { backgroundColor: 'rgba(255,255,255,0.1)' },
  followT: { fontFamily: fonts.bold, fontSize: 13.5, color: colors.onPrimary },
});
