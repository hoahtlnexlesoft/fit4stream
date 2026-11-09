import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Avatar, EmptyState, Icon, IconButton, IconName, PressableScale, colors, fonts, useToast } from '@ui';
import { Screen } from '@/components/Screen';
import { Chips } from '@/components/Chips';
import { getEvent } from '@/data';
import { avatar, photo } from '@/data/images';
import { useLayout } from '@/lib/layout';

type K = 'all' | 'live' | 'tickets' | 'reminders' | 'social';
type N = { id: number; g: 'Today' | 'Earlier'; k: Exclude<K, 'all'>; img?: string; av?: string; ic: IconName; c: string; t: string; d: string; time: string; cta?: string; to?: string; unread?: boolean; stars?: boolean };
const EMP: Record<K, [IconName, string, string]> = {
  all: ['bell', 'You’re all caught up', 'New notifications about your events will appear here.'],
  live: ['video', 'No live alerts', 'When channels you follow go live, you’ll see it here.'],
  tickets: ['ticket', 'No ticket updates', 'Purchases, receipts and refunds will show up here.'],
  reminders: ['calendar', 'No reminders', 'Events you register for will remind you before they start.'],
  social: ['users', 'No social activity', 'New followers and mentions will appear here.'],
};

/** Notifications: filter chips · Today / Earlier groups (Clear per group) · mark all read. Wide: filters as a side rail. TODO(api): push + GET /me/notifications. */
export default function Notifications() {
  const router = useRouter();
  const toast = useToast();
  const { wide } = useLayout();
  const [f, setF] = useState<K>('all');
  const [read, setRead] = useState<Record<number, 1>>({});
  const [gone, setGone] = useState<Record<number, 1>>({});
  const ALL: N[] = [
    { id: 1, g: 'Today', k: 'live', img: getEvent('xmas').image, ic: 'radio', c: '#E5484D', t: 'Danang Christmas Market 2026 is live', d: 'thao15 nguyen15 just went live — 2.4K watching', time: '2m', cta: 'Join', to: '/player/xmas', unread: true },
    { id: 2, g: 'Today', k: 'tickets', img: getEvent('xmas').image, ic: 'ticket', c: '#39C87C', t: 'Ticket confirmed', d: '2 × Standard · $6.87 paid with Visa •••• 4242', time: '15m', cta: 'Receipt', to: '/receipt/F4S-261103-0412', unread: true },
    { id: 3, g: 'Today', k: 'reminders', img: getEvent('seo').image, ic: 'clock', c: '#F4A425', t: 'Starts in 5 minutes', d: 'Welcome to our topic about SEO marketing — doors are open', time: '55m', cta: 'Enter', to: '/player/seo?state=waiting' },
    { id: 4, g: 'Today', k: 'social', av: avatar('Marc John'), ic: 'users', c: '#A57AD8', t: 'Marc John started following you', d: 'Follow back to see when they go live', time: '2h', cta: 'Follow back' },
    { id: 5, g: 'Earlier', k: 'reminders', img: photo('concert'), ic: 'star', c: '#F4A425', t: 'How was “For payout batch 5.Nov-1”?', d: 'Tap a star to rate the event', time: 'Yesterday', stars: true, to: '/reviews' },
    { id: 6, g: 'Earlier', k: 'tickets', img: photo('concert'), ic: 'rotateCcw', c: '#39CAE0', t: 'Refund completed', d: '$10.48 is back on your Visa •••• 4242', time: 'Oct 31', to: '/receipt/F4S-261030-0977' },
  ];
  const N = ALL.filter((n) => !gone[n.id]);
  const list = N.filter((n) => f === 'all' || n.k === f);
  const groups = (['Today', 'Earlier'] as const).map((g) => [g, list.filter((n) => n.g === g)] as const).filter(([, l]) => l.length);
  const unread = N.filter((n) => n.unread && !read[n.id]).length;
  const FL: [K, string][] = [['all', 'All'], ['live', 'Live'], ['tickets', 'Tickets'], ['reminders', 'Reminders'], ['social', 'Social']];

  const Content = groups.length ? groups.map(([g, l]) => (
    <View key={g} style={{ marginTop: 18 }}>
      <View style={s.sh}><Text style={s.shT}>{g}</Text><Text style={s.clr} onPress={() => setGone((o) => ({ ...o, ...Object.fromEntries(l.map((n) => [n.id, 1])) }))}>Clear</Text></View>
      <View style={{ gap: 8 }}>
        {l.map((n) => {
          const un = n.unread && !read[n.id];
          return (
            <PressableScale key={n.id} onPress={() => { setRead((r) => ({ ...r, [n.id]: 1 })); if (n.to) router.push(n.to as any); }} style={[s.it, un && s.itUn]}>
              <View>
                {n.av ? <Avatar uri={n.av} name="Marc John" size={48} /> : <Image source={{ uri: n.img }} style={s.img} />}
                <View style={[s.badge, { backgroundColor: n.c }]}><Icon name={n.ic} size={11} color="#fff" /></View>
              </View>
              <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                <View style={s.top}><Text style={s.t} numberOfLines={2}>{n.t}</Text><Text style={s.time}>{n.time}</Text></View>
                <Text style={s.d} numberOfLines={2}>{n.d}</Text>
                {n.cta && <View style={[s.cta, n.k === 'live' && { backgroundColor: colors.primary }]}>{n.k === 'live' && <Icon name="play" size={11} color={colors.onPrimary} filled />}<Text style={[s.ctaT, n.k === 'live' && { color: colors.onPrimary }]}>{n.cta}</Text></View>}
                {n.stars && <View style={s.stars}>{[1, 2, 3, 4, 5].map((i) => <Icon key={i} name="star" size={18} color={colors.primary} filled />)}</View>}
              </View>
              {un && <View style={s.dot} />}
            </PressableScale>
          );
        })}
      </View>
    </View>
  )) : <EmptyState icon={EMP[f][0]} title={EMP[f][1]} body={EMP[f][2]} />;

  const markAll = <IconButton icon="check" accessibilityLabel="Mark all as read" onPress={() => { setRead(Object.fromEntries(N.map((n) => [n.id, 1]))); toast.show('All caught up'); }} />;

  return (
    <Screen title="Notifications" right={markAll}>
      {wide ? (
        <View style={s.two}>
          <View style={s.rail}>
            {FL.map(([k, l]) => (
              <PressableScale key={k} onPress={() => setF(k)} style={[s.railI, f === k && s.railOn]}><Text style={[s.railT, f === k && { color: '#14121A' }]}>{l}</Text>{k === 'all' && unread > 0 && <Text style={s.railN}>{unread}</Text>}</PressableScale>
            ))}
          </View>
          <View style={{ flex: 1 }}>{Content}</View>
        </View>
      ) : (
        <><Chips items={FL} value={f} onChange={setF} badge={{ all: unread }} /><View style={s.pad}>{Content}</View></>
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  pad: { paddingHorizontal: 16 },
  two: { flexDirection: 'row', gap: 24, paddingHorizontal: 24, maxWidth: 960, alignSelf: 'center', width: '100%' },
  rail: { width: 200, gap: 6, paddingTop: 18 },
  railI: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 44, paddingHorizontal: 16, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)' },
  railOn: { backgroundColor: '#fff' },
  railT: { fontFamily: fonts.semibold, fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  railN: { fontFamily: fonts.bold, fontSize: 11, color: '#fff', backgroundColor: colors.live, paddingHorizontal: 6, borderRadius: 9, overflow: 'hidden' },
  sh: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  shT: { fontFamily: fonts.bold, fontSize: 16, color: '#fff' },
  clr: { fontFamily: fonts.semibold, fontSize: 13, color: colors.textMuted },
  it: { flexDirection: 'row', gap: 12, padding: 12, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.035)' },
  itUn: { backgroundColor: 'rgba(244,164,37,0.07)' },
  img: { width: 48, height: 48, borderRadius: 14 },
  badge: { position: 'absolute', right: -4, bottom: -4, width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  top: { flexDirection: 'row', gap: 8 },
  t: { flex: 1, fontFamily: fonts.semibold, fontSize: 14, lineHeight: 19, color: '#fff' },
  time: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.textMuted },
  d: { fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 17, color: colors.textSecondary },
  cta: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 4, height: 28, paddingHorizontal: 12, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.1)', marginTop: 6 },
  ctaT: { fontFamily: fonts.bold, fontSize: 12, color: '#fff' },
  stars: { flexDirection: 'row', gap: 4, marginTop: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 6 },
});
