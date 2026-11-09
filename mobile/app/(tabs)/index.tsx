import React, { useRef, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar, EmptyState, Icon, LogoMark, PressableScale, SectionHeader, colors, fonts } from '@ui';
import { CATEGORIES, CHANNELS, EVENTS, getEvent, heroEvents, shortCat } from '@/data';
import { avatar, myAvatar } from '@/data/images';
import { CategoryTile, ChannelStories, EventCard, HeroCarousel, TicketRow } from '@/components/Events';
import { HomeSkeleton } from '@/components/Skeletons';
import { useLoading } from '@/lib/useLoading';
import { useLayout } from '@/lib/layout';
import { useStore } from '@/lib/store';
import { openEvent } from '@/lib/nav';

/**
 * Home — hero coverflow · Your tickets · Top Channels · Trending · Browse by Category · one category section.
 * "For you" shows only Broadcast Events below the categories (client decision). Picking a chip shows that category instead.
 */
export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { sideRail, wide } = useLayout();
  const store = useStore();
  const [loading, reload] = useLoading('home');
  const [cat, setCat] = useState(0); // 0 = For you
  const scroll = useRef<ScrollView>(null);
  const [solid, setSolid] = useState(false);
  const chips = ['For you', ...CATEGORIES.map((c) => shortCat(c.name))];
  const pickCat = (i: number) => { setCat(i + 1); scroll.current?.scrollTo({ y: 0, animated: true }); };

  const trending = EVENTS.filter((e) => e.status !== 'ended').slice(0, 8);
  const sections = cat === 0 ? CATEGORIES.filter((c) => c.name === 'Broadcast Events') : [CATEGORIES[cat - 1]];
  const headH = insets.top + 116;

  return (
    <View style={[s.root, { paddingLeft: sideRail }]}>
      <ScrollView ref={scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: headH, paddingBottom: 140 }}
        onScroll={(e) => setSolid(e.nativeEvent.contentOffset.y > 8)} scrollEventThrottle={32}
        refreshControl={<RefreshControl refreshing={false} onRefresh={reload} tintColor={colors.primary} progressViewOffset={headH} />}>
        {loading ? <HomeSkeleton /> : (
          <View>
            <HeroCarousel events={heroEvents()} onOpen={(e) => openEvent(router, e, store)}
              ctaLabel={(e) => (e.status === 'live' ? 'Watch now' : store.registered.has(e.id) ? 'Registered' : e.price === 'Free' ? 'Register' : 'Get ticket')}
              onCta={(e) => (e.status === 'live' ? openEvent(router, e, store) : router.push(`/event/${e.id}`))} />

            {store.authed && (
              <View style={s.sec}>
                <View style={s.pad}><SectionHeader title="Your tickets" action="My events" onAction={() => router.push('/my-events')} /></View>
                <View style={[s.pad, { gap: 10 }, wide && s.twoCol]}>
                  <View style={wide ? s.half : undefined}><TicketRow event={getEvent('xmas')} badge="LIVE" primary sub="Started 12 min ago · by thao15 nguyen15" action="Join" onPress={() => router.push('/player/xmas')} onAction={() => router.push('/player/xmas')} /></View>
                  <View style={wide ? s.half : undefined}><TicketRow event={getEvent('seo')} badge="5 MIN" sub="Starts in 5 min · doors open now" action="Enter" onPress={() => router.push('/player/seo?state=waiting')} onAction={() => router.push('/player/seo?state=waiting')} /></View>
                </View>
              </View>
            )}

            <View style={s.sec}>
              <View style={s.pad}><SectionHeader title="Top Channels" action="View all" onAction={() => router.push('/channels')} /></View>
              <ChannelStories names={CHANNELS} onOpen={(n) => router.push(`/organizer/${encodeURIComponent(n)}`)} />
            </View>

            <View style={s.sec}>
              <View style={s.pad}><SectionHeader title="Trending" action="View all" onAction={() => router.push('/list/Trending')} /></View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.rail}>
                {trending.map((e) => <EventCard key={e.id} event={e} onPress={() => openEvent(router, e, store)} />)}
              </ScrollView>
            </View>

            <View style={[s.sec, s.pad]}>
              <SectionHeader title="Browse by Category" action="View all" onAction={() => router.push('/categories')} />
              <View style={s.tiles}>
                {[...CATEGORIES].map((c, i) => ({ c, i })).sort((a, b) => b.c.count - a.c.count).map(({ c, i }) => (
                  <View key={c.name} style={{ width: wide ? '24%' : '48.5%' }}><CategoryTile name={c.name} icon={c.icon} count={c.count} onPress={() => pickCat(i)} /></View>
                ))}
              </View>
            </View>

            {sections.map((c) => {
              const list = EVENTS.filter((e) => e.category === c.name).slice(0, 8);
              return (
                <View key={c.name} style={s.sec}>
                  <View style={s.pad}><SectionHeader title={c.name} action={list.length ? 'View all' : undefined} onAction={() => router.push(`/list/${encodeURIComponent(c.name)}`)} /></View>
                  {list.length ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.rail}>
                      {list.map((e) => <EventCard key={e.id} event={e} onPress={() => openEvent(router, e, store)} />)}
                    </ScrollView>
                  ) : (
                    <View style={[s.pad]}><View style={s.empty}><EmptyState icon="ticket" title={`No events in ${shortCat(c.name)} yet`} body="Follow channels to get notified when they go live." action="Browse categories" onAction={() => router.push('/categories')} /></View></View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Sticky brand header + category chips */}
      <View style={[s.head, { paddingTop: insets.top + 6, left: sideRail }, solid && s.headSolid]}>
        <View style={s.brandRow}>
          <View style={s.brand}><LogoMark size={34} /><Text style={s.brandT}>Fit4Stream</Text></View>
          <View style={{ flex: 1 }} />
          <PressableScale onPress={() => router.push('/notifications')} style={s.mbtn} accessibilityLabel="Notifications, 2 new"><Icon name="bell" size={20} color="#fff" /><View style={s.bdot} /></PressableScale>
          {store.authed
            ? <PressableScale onPress={() => router.push('/account')} accessibilityLabel="Account"><Avatar uri={myAvatar()} name="Thao 13 NGUYEN13" size={44} /></PressableScale>
            : <PressableScale onPress={() => router.push('/login')} style={s.signin}><Text style={s.signinT}>Sign in</Text></PressableScale>}
          <PressableScale onPress={() => router.push('/search')} style={s.mbtn} accessibilityLabel="Search"><Icon name="search" size={19} color="#fff" /></PressableScale>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>
          {chips.map((c, i) => (
            <PressableScale key={c} onPress={() => setCat(i)} accessibilityRole="tab" accessibilityState={{ selected: i === cat }} style={[s.chip, i === cat && s.chipOn]}>
              <Text style={[s.chipT, i === cat && s.chipTOn]}>{c}</Text>
            </PressableScale>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  pad: { paddingHorizontal: 16 },
  sec: { marginTop: 28 },
  rail: { paddingHorizontal: 16, gap: 12 },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 },
  twoCol: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  half: { width: '49.3%' },
  empty: { borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.035)', paddingVertical: 8 },
  head: { position: 'absolute', top: 0, right: 0, paddingBottom: 10, backgroundColor: 'rgba(15,14,20,0.55)' },
  headSolid: { backgroundColor: 'rgba(15,14,20,0.96)', borderBottomWidth: 1, borderBottomColor: colors.border },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, height: 52 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandT: { fontFamily: fonts.extrabold, fontSize: 20, color: '#fff', letterSpacing: -0.4 },
  mbtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)' },
  bdot: { position: 'absolute', top: 10, right: 11, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.live, borderWidth: 1.5, borderColor: colors.bg },
  signin: { height: 36, paddingHorizontal: 14, borderRadius: 18, backgroundColor: colors.primary, justifyContent: 'center' },
  signinT: { fontFamily: fonts.bold, fontSize: 13.5, color: colors.onPrimary },
  chips: { paddingHorizontal: 16, gap: 8, paddingTop: 8 },
  chip: { height: 34, paddingHorizontal: 14, borderRadius: 17, justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.06)' },
  chipOn: { backgroundColor: '#fff' },
  chipT: { fontFamily: fonts.semibold, fontSize: 13, color: 'rgba(255,255,255,0.75)' },
  chipTOn: { color: '#14121A' },
});
