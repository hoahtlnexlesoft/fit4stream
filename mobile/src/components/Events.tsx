import React, { useRef, useState } from 'react';
import { Animated, Image, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar, Icon, IconName, PressableScale, colors, fonts } from '@ui';
import { AppEvent, shortCat, shortDate, startTime } from '@/data';
import { avatar } from '@/data/images';

/* ------------------------------------------------------------------ */
/* Small pills                                                          */
/* ------------------------------------------------------------------ */
export function LivePill({ small }: { small?: boolean }) {
  return (
    <View style={[p.live, small && { height: 20, paddingHorizontal: 7 }]}>
      <View style={p.dot} /><Text style={[p.liveT, small && { fontSize: 10 }]}>LIVE</Text>
    </View>
  );
}
export function GlassChip({ children, icon }: { children: React.ReactNode; icon?: IconName }) {
  return <View style={p.chip}>{icon && <Icon name={icon} size={12} color="#fff" />}<Text style={p.chipT}>{children}</Text></View>;
}
export function Price({ value, style }: { value: string; style?: object }) {
  return <Text style={[p.price, value === 'Free' && { color: colors.successText }, style]}>{value}</Text>;
}

/* ------------------------------------------------------------------ */
/* EventCard — compact card used in every rail / grid                   */
/* one chip on the image · title (1 line) · organizer · price           */
/* ------------------------------------------------------------------ */
export function EventCard({ event: e, onPress, width = 216 }: { event: AppEvent; onPress: () => void; width?: number | `${number}%` }) {
  return (
    <PressableScale onPress={onPress} style={[c.card, { width }]} accessibilityLabel={e.title}>
      <View>
        <Image source={{ uri: e.image }} style={c.img} />
        <View style={c.tl}>{e.status === 'live' ? <LivePill small /> : <GlassChip>{e.status === 'ended' ? 'Replay' : `${shortDate(e)} · ${startTime(e)}`}</GlassChip>}</View>
      </View>
      <View style={c.body}>
        <Text style={c.title} numberOfLines={1}>{e.title}</Text>
        <View style={c.meta}><Text style={c.org} numberOfLines={1}>{e.organizer}</Text><View style={c.sep} /><Price value={e.price} /></View>
      </View>
    </PressableScale>
  );
}

/* ------------------------------------------------------------------ */
/* HeroCarousel — Home coverflow (max 10 events, live first)            */
/* ------------------------------------------------------------------ */
export function HeroCarousel({ events, onOpen, onCta, ctaLabel, initial = 1 }: { events: AppEvent[]; onOpen: (e: AppEvent) => void; onCta: (e: AppEvent) => void; ctaLabel: (e: AppEvent) => string; initial?: number }) {
  const { width } = useWindowDimensions();
  const cw = Math.min(346, width - 84);
  const ch = Math.round(cw * 0.824);
  const step = cw * 0.88;
  const x = useRef(new Animated.Value(initial * step)).current;
  const [idx, setIdx] = useState(initial);
  const ref = useRef<ScrollView>(null);
  const onEnd = (ev: NativeSyntheticEvent<NativeScrollEvent>) => setIdx(Math.round(ev.nativeEvent.contentOffset.x / step));
  return (
    <View>
      <Animated.ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={step} decelerationRate="fast" ref={ref as any} contentOffset={{ x: initial * step, y: 0 }} onLayout={() => ref.current?.scrollTo({ x: initial * step, animated: false })}
        contentContainerStyle={{ paddingHorizontal: (width - cw) / 2, paddingVertical: 6 }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x } } }], { useNativeDriver: true })} scrollEventThrottle={16}
        onMomentumScrollEnd={onEnd}>
        {events.map((e, i) => {
          const r = [(i - 1) * step, i * step, (i + 1) * step];
          const scale = x.interpolate({ inputRange: r, outputRange: [0.84, 1, 0.84], extrapolate: 'clamp' });
          const opacity = x.interpolate({ inputRange: r, outputRange: [0.55, 1, 0.55], extrapolate: 'clamp' });
          return (
            <Animated.View key={e.id} style={{ width: step, alignItems: 'center', transform: [{ scale }], opacity }}>
              <PressableScale onPress={() => onOpen(e)} style={[h.card, { width: cw, height: ch }]} accessibilityLabel={e.title}>
                <Image source={{ uri: e.image }} style={StyleSheet.absoluteFill} />
                <LinearGradient colors={['rgba(0,0,0,0.35)', 'rgba(0,0,0,0)', 'rgba(12,10,18,0)', 'rgba(12,10,18,0.78)', 'rgba(12,10,18,0.96)']} locations={[0, 0.22, 0.42, 0.7, 1]} style={StyleSheet.absoluteFill} />
                <View style={h.top}>
                  {e.status === 'live' ? <LivePill /> : <GlassChip>{`${shortDate(e)} · ${startTime(e)}`}</GlassChip>}
                  {e.status === 'live' && <GlassChip icon="eye">2.4K</GlassChip>}
                  <View style={{ flex: 1 }} />
                  {e.status === 'live' && <GlassChip>Live 1h 01m</GlassChip>}
                </View>
                {e.status === 'live' && <View style={h.play}><Icon name="play" size={20} color="#fff" filled /></View>}
                <View style={h.body}>
                  <Text style={h.title} numberOfLines={2}>{e.title}</Text>
                  <View style={h.by}><Avatar uri={avatar(e.organizer)} name={e.organizer} size={20} /><Text style={h.org} numberOfLines={1}>{e.organizer}</Text><View style={c.sep} /><Text style={h.cat}>{shortCat(e.category)}</Text></View>
                  <View style={h.foot}>
                    {e.status === 'live' ? <View style={h.since}><View style={[p.dot, { backgroundColor: colors.live }]} /><Text style={h.sinceT}>Started at {startTime(e)}</Text></View> : <Price value={e.price} style={{ fontSize: 13 }} />}
                    <PressableScale onPress={() => onCta(e)} style={h.cta}>{e.status === 'live' && <Icon name="play" size={12} color={colors.onPrimary} filled />}<Text style={h.ctaT}>{ctaLabel(e)}</Text></PressableScale>
                  </View>
                </View>
              </PressableScale>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>
      <View style={h.dots}>{events.map((e, i) => <View key={e.id} style={[h.dotI, i === idx && h.dotOn]} />)}</View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* TicketRow — "Your tickets" on Home                                   */
/* ------------------------------------------------------------------ */
export function TicketRow({ event: e, sub, badge, action, primary, onPress, onAction }: { event: AppEvent; sub: string; badge: string; action: string; primary?: boolean; onPress: () => void; onAction: () => void }) {
  return (
    <PressableScale onPress={onPress} style={t.row}>
      <View><Image source={{ uri: e.image }} style={t.th} /><View style={[t.badge, primary ? { backgroundColor: colors.live } : { backgroundColor: colors.primary }]}><Text style={[t.badgeT, !primary && { color: colors.onPrimary }]}>{badge}</Text></View></View>
      <View style={{ flex: 1, minWidth: 0 }}><Text style={t.title} numberOfLines={1}>{e.title}</Text><Text style={t.sub} numberOfLines={1}>{sub}</Text></View>
      <PressableScale onPress={onAction} style={[t.btn, primary ? { backgroundColor: colors.primary } : { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
        <Icon name={primary ? 'play' : 'clock'} size={13} color={primary ? colors.onPrimary : '#fff'} filled={primary} />
        <Text style={[t.btnT, { color: primary ? colors.onPrimary : '#fff' }]}>{action}</Text>
      </PressableScale>
    </PressableScale>
  );
}

/* ------------------------------------------------------------------ */
/* ChannelStories — Top Channels avatars                                */
/* ------------------------------------------------------------------ */
export function ChannelStories({ names, liveIndex = 0, onOpen }: { names: string[]; liveIndex?: number; onOpen: (n: string) => void }) {
  return (
    <Animated.ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
      {names.map((n, i) => (
        <PressableScale key={n} onPress={() => onOpen(n)} style={{ width: 72, alignItems: 'center' }} accessibilityLabel={n}>
          <View style={[st.ring, i === liveIndex && st.ringLive]}><Avatar uri={avatar(n)} name={n} size={62} seed={i} /></View>
          {i === liveIndex && <View style={st.liveTag}><Text style={st.liveT}>LIVE</Text></View>}
          <Text style={st.name} numberOfLines={1}>{n}</Text>
        </PressableScale>
      ))}
    </Animated.ScrollView>
  );
}

/* ------------------------------------------------------------------ */
/* CategoryTile                                                         */
/* ------------------------------------------------------------------ */
/** Category tint (same as prototype CAT_LOOK). */
export const CAT_TINT: Record<string, string> = {
  'Concerts and Performances': '#C63D63', 'Broadcast Events': '#33438D', 'Talk Shows': '#F4A425', 'Social and Community': '#E74645',
  'Product Launches and Demonstrations': '#39CAE0', 'Virtual Conferencing': '#33438D', Others: '#8A9AB0', 'Virtual Workshops and Training': '#F08A24', 'Virtual Networking': '#A57AD8',
};
export function CategoryTile({ name, icon, count, onPress }: { name: string; icon: string; count: number; onPress: () => void }) {
  const tint = CAT_TINT[name] ?? colors.purple;
  return (
    <PressableScale onPress={onPress} style={ct.tile}>
      <View style={ct.row}>
        <View style={[ct.ic, { backgroundColor: tint + '33' }]}><Icon name={icon as IconName} size={20} color={tint === '#33438D' ? '#8EA2F0' : tint} /></View>
        {count > 0 && <LivePill small />}
      </View>
      <Text style={ct.name} numberOfLines={1}>{shortCat(name)}</Text>
      <Text style={[ct.count, count === 0 && { color: colors.textMuted }]}>{count ? `${count} ${count === 1 ? 'event' : 'events'}` : 'Coming soon'}</Text>
    </PressableScale>
  );
}

/* ------------------------------------------------------------------ */
/* FeedCard — On-air live post (organizer · media · like/comment/share)  */
/* ------------------------------------------------------------------ */
export function FeedCard({ event: e, viewers, onOpen, onComment, onProfile, onShare }: { event: AppEvent; viewers: string; onOpen: () => void; onComment: () => void; onProfile: () => void; onShare: () => void }) {
  const [following, setF] = useState(false);
  const [liked, setL] = useState(false);
  return (
    <View style={f.card}>
      <View style={f.head}>
        <PressableScale onPress={onProfile} style={f.who}>
          <Avatar uri={avatar(e.organizer)} name={e.organizer} size={46} />
          <View style={{ flex: 1, minWidth: 0 }}><Text style={f.name} numberOfLines={1}>{e.organizer}</Text><Text style={f.handle} numberOfLines={1}>{e.category}</Text></View>
        </PressableScale>
        <PressableScale onPress={() => setF(!following)} style={[f.follow, following && f.followOn]}><Text style={[f.followT, following && { color: '#fff' }]}>{following ? 'Following' : 'Follow'}</Text></PressableScale>
      </View>
      <PressableScale onPress={onOpen} style={f.media}>
        <Image source={{ uri: e.image }} style={StyleSheet.absoluteFill} />
        <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.75)']} locations={[0.45, 1]} style={StyleSheet.absoluteFill} />
        <View style={f.top}><LivePill /><GlassChip icon="eye">{viewers}</GlassChip></View>
        <View style={f.cap}><Text style={f.title} numberOfLines={2}>{e.title}</Text><Text style={f.meta} numberOfLines={1}>{`${e.format[0] ?? 'Live'} · ${viewers} watching · ${e.likes} likes`}</Text></View>
      </PressableScale>
      <View style={f.acts}>
        <PressableScale onPress={() => setL(!liked)} style={f.act}><Icon name="thumbsUp" size={20} color={liked ? colors.primary : '#fff'} filled={liked} /><Text style={f.actT}>{liked ? '1' : '0'}</Text></PressableScale>
        <PressableScale onPress={onComment} style={f.act}><Icon name="message" size={20} color="#fff" /><Text style={f.actT}>Comment</Text></PressableScale>
        <PressableScale onPress={onShare} style={f.act}><Icon name="send" size={19} color="#fff" /><Text style={f.actT}>Share</Text></PressableScale>
        <View style={{ flex: 1 }} />
        <PressableScale onPress={onOpen} style={f.watch}><Icon name="play" size={13} color={colors.onPrimary} filled /><Text style={f.watchT}>Watch</Text></PressableScale>
      </View>
    </View>
  );
}
const f = StyleSheet.create({
  card: { borderRadius: 22, padding: 12, backgroundColor: 'rgba(255,255,255,0.045)', gap: 12 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  who: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, minWidth: 0 },
  name: { fontFamily: fonts.bold, fontSize: 15, color: '#fff' },
  handle: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  follow: { height: 32, paddingHorizontal: 14, borderRadius: 16, backgroundColor: colors.primary, justifyContent: 'center' },
  followOn: { backgroundColor: 'rgba(255,255,255,0.1)' },
  followT: { fontFamily: fonts.bold, fontSize: 13, color: colors.onPrimary },
  media: { aspectRatio: 4 / 3, borderRadius: 16, overflow: 'hidden', backgroundColor: '#1B1921' },
  top: { position: 'absolute', left: 10, top: 10, flexDirection: 'row', gap: 6 },
  cap: { position: 'absolute', left: 12, right: 12, bottom: 12, gap: 3 },
  title: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 22, color: '#fff' },
  meta: { fontFamily: fonts.regular, fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  acts: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 4 },
  act: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actT: { fontFamily: fonts.semibold, fontSize: 13, color: 'rgba(255,255,255,0.85)' },
  watch: { flexDirection: 'row', alignItems: 'center', gap: 5, height: 34, paddingHorizontal: 14, borderRadius: 17, backgroundColor: colors.primary },
  watchT: { fontFamily: fonts.bold, fontSize: 13, color: colors.onPrimary },
});

const p = StyleSheet.create({
  live: { flexDirection: 'row', alignItems: 'center', gap: 5, height: 24, paddingHorizontal: 9, borderRadius: 7, backgroundColor: colors.live },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' },
  liveT: { fontFamily: fonts.bold, fontSize: 11, color: '#fff', letterSpacing: 0.4 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, height: 24, paddingHorizontal: 9, borderRadius: 7, backgroundColor: 'rgba(10,9,14,0.6)' },
  chipT: { fontFamily: fonts.semibold, fontSize: 11, color: '#fff' },
  price: { fontFamily: fonts.semibold, fontSize: 11.5, color: 'rgba(255,255,255,0.8)' },
});
const c = StyleSheet.create({
  card: { borderRadius: 16, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.045)' },
  img: { width: '100%', aspectRatio: 16 / 9 },
  tl: { position: 'absolute', left: 8, top: 8, flexDirection: 'row', gap: 5 },
  body: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 12, gap: 3 },
  title: { fontFamily: fonts.semibold, fontSize: 13.5, lineHeight: 18, color: 'rgba(255,255,255,0.92)' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  org: { flexShrink: 1, fontFamily: fonts.regular, fontSize: 11.5, color: 'rgba(255,255,255,0.5)' },
  sep: { width: 3, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)' },
});
const h = StyleSheet.create({
  card: { borderRadius: 22, overflow: 'hidden', backgroundColor: '#1B1921' },
  top: { position: 'absolute', left: 12, right: 12, top: 12, flexDirection: 'row', gap: 6 },
  play: { position: 'absolute', alignSelf: 'center', top: '34%', width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(10,9,14,0.55)' },
  body: { position: 'absolute', left: 16, right: 16, bottom: 14, gap: 6 },
  title: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 25, color: '#fff', textShadowColor: 'rgba(0,0,0,0.45)', textShadowRadius: 10 },
  by: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  org: { flexShrink: 1, fontFamily: fonts.medium, fontSize: 12, color: '#F6C26B' },
  cat: { fontFamily: fonts.regular, fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  since: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sinceT: { fontFamily: fonts.medium, fontSize: 12.5, color: 'rgba(255,255,255,0.85)' },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 5, height: 30, paddingHorizontal: 12, borderRadius: 15, backgroundColor: colors.primary },
  ctaT: { fontFamily: fonts.bold, fontSize: 12.5, color: colors.onPrimary },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 5, marginTop: 8 },
  dotI: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.25)' },
  dotOn: { width: 18, backgroundColor: colors.primary },
});
const t = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 8, paddingRight: 10, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.045)' },
  th: { width: 92, height: 58, borderRadius: 14 },
  badge: { position: 'absolute', left: 5, bottom: 5, paddingHorizontal: 6, height: 17, borderRadius: 5, justifyContent: 'center' },
  badgeT: { fontFamily: fonts.bold, fontSize: 9.5, color: '#fff', letterSpacing: 0.3 },
  title: { fontFamily: fonts.semibold, fontSize: 14, color: '#fff' },
  sub: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted, marginTop: 3 },
  btn: { flexDirection: 'row', alignItems: 'center', gap: 5, height: 34, paddingHorizontal: 13, borderRadius: 17 },
  btnT: { fontFamily: fonts.bold, fontSize: 13 },
});
const st = StyleSheet.create({
  ring: { width: 70, height: 70, borderRadius: 35, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(165,122,216,0.6)' },
  ringLive: { borderColor: colors.live },
  liveTag: { position: 'absolute', top: 58, paddingHorizontal: 5, height: 15, borderRadius: 4, backgroundColor: colors.live, justifyContent: 'center' },
  liveT: { fontFamily: fonts.bold, fontSize: 8.5, color: '#fff' },
  name: { marginTop: 9, fontFamily: fonts.medium, fontSize: 12, color: 'rgba(255,255,255,0.8)', maxWidth: 72 },
});
const ct = StyleSheet.create({
  tile: { flex: 1, minWidth: 140, padding: 14, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.045)', gap: 4 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  ic: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  name: { fontFamily: fonts.bold, fontSize: 15, color: '#fff' },
  count: { fontFamily: fonts.medium, fontSize: 12, color: colors.textSecondary },
});
