import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { EmptyState, Icon, IconName, PressableScale, SearchField, SegmentedTabs, colors, fonts } from '@ui';
import { Screen } from '@/components/Screen';
import { getEvent } from '@/data';
import { photo } from '@/data/images';
import { useLayout } from '@/lib/layout';

type Item = { id: string; img: string; title: string; when: string; by: string; st: 'live' | 'upcoming' | 'soon' | 'ended'; price: string; pf: 'ios' | 'android' | 'web'; rf: null | 'pending' | 'refunded'; rc?: string; to: string };
const PF: Record<Item['pf'], [IconName, string]> = { ios: ['smartphone', 'iOS app'], android: ['smartphone', 'Android app'], web: ['globe', 'Web'] };

/** My Events: search · Upcoming / Past / Invited / Purchased · ticket cards with platform + refund state. TODO(api): GET /me/tickets. */
export default function MyEvents() {
  const router = useRouter();
  const { wide } = useLayout();
  const [tab, setTab] = useState<'up' | 'past' | 'inv' | 'buy'>('up');
  const [q, setQ] = useState('');
  const ITEMS: Item[] = [
    { id: 'xmas', img: getEvent('xmas').image, title: 'Danang Christmas Market 2026', when: 'Live now · started 9:43 AM', by: 'thao15 nguyen15', st: 'live', price: '$3.99', pf: 'ios', rf: null, rc: 'F4S-261103-0412', to: '/player/xmas' },
    { id: 'gig', img: getEvent('gig').image, title: getEvent('gig').title, when: 'Nov 05 · 21:00', by: getEvent('gig').organizer, st: 'upcoming', price: '$9.99', pf: 'android', rf: 'pending', rc: 'F4S-261103-0412', to: '/event/gig' },
    { id: 'seo', img: getEvent('seo').image, title: getEvent('seo').title, when: 'Today · starts in 5 min', by: 'Marc John', st: 'soon', price: 'Free', pf: 'web', rf: null, to: '/player/seo?state=waiting' },
    { id: 'payout', img: photo('concert'), title: 'Payout 3 - pay on 31.Oct - USD', when: 'Oct 30, 2026 · 10:40 AM', by: 'Thao11 Nguyen11', st: 'ended', price: '$9.99', pf: 'web', rf: 'refunded', rc: 'F4S-261030-0977', to: '/event/payout' },
  ].filter((x) => !q || x.title.toLowerCase().includes(q.toLowerCase())) as Item[];
  const lists = { up: ITEMS.filter((x) => x.st !== 'ended'), past: ITEMS.filter((x) => x.st === 'ended'), inv: [] as Item[], buy: ITEMS.filter((x) => x.price !== 'Free') };
  const list = lists[tab];
  const label = (l: string, n: number) => (n ? `${l} ${n}` : l);

  return (
    <Screen title="My Events" keyboardShouldPersistTaps="handled">
      <View style={[s.pad, { gap: 14 }]}>
        <SearchField placeholder="Search your events" value={q} onChangeText={setQ} />
        <SegmentedTabs scroll items={[{ key: 'up', label: label('Upcoming', lists.up.length) }, { key: 'past', label: label('Past', lists.past.length) }, { key: 'inv', label: 'Invited' }, { key: 'buy', label: label('Purchased', lists.buy.length) }]} value={tab} onChange={setTab} />
      </View>
      {list.length ? (
        <View style={[s.pad, s.list, wide && s.grid]}>
          {list.map((e) => {
            const paid = e.price !== 'Free'; const pf = PF[e.pf];
            return (
              <PressableScale key={e.id} onPress={() => router.push(e.to as any)} style={[s.card, wide && { width: '49%' }]}>
                <View style={s.main}>
                  <View><Image source={{ uri: e.img }} style={s.th} />
                    {e.st === 'live' && <View style={[s.tag, { backgroundColor: colors.live }]}><Text style={s.tagT}>LIVE</Text></View>}
                    {e.st === 'soon' && <View style={[s.tag, { backgroundColor: colors.primary }]}><Text style={[s.tagT, { color: colors.onPrimary }]}>5 MIN</Text></View>}
                  </View>
                  <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
                    <Text style={s.title} numberOfLines={2}>{e.title}</Text>
                    <View style={s.line}><Icon name={e.st === 'ended' ? 'calendar' : 'clock'} size={13} color={colors.textMuted} /><Text style={s.date}>{e.when}</Text></View>
                    <Text style={s.org} numberOfLines={1}>by {e.by}</Text>
                    <View style={s.foot}>
                      <View style={s.tags}>
                        <View style={[s.chip, paid ? { backgroundColor: colors.primarySoft } : { backgroundColor: colors.successSoft }]}><Icon name="ticket" size={12} color={paid ? colors.primaryText : colors.successText} /><Text style={[s.chipT, { color: paid ? colors.primaryText : colors.successText }]}>{paid ? e.price : 'Free'}</Text></View>
                        {e.st === 'ended' && <View style={s.chip}><Text style={s.chipT}>Ended</Text></View>}
                      </View>
                      {e.st === 'live' && <View style={[s.cta, { backgroundColor: colors.primary }]}><Icon name="play" size={12} color={colors.onPrimary} filled /><Text style={[s.ctaT, { color: colors.onPrimary }]}>Join</Text></View>}
                      {e.st === 'soon' && <View style={s.cta}><Icon name="clock" size={12} color="#fff" /><Text style={s.ctaT}>Enter</Text></View>}
                    </View>
                  </View>
                </View>
                <View style={s.meta}>
                  <Icon name={pf[0]} size={13} color={colors.textMuted} /><Text style={s.pf}>Registered via <Text style={{ color: '#fff', fontFamily: fonts.semibold }}>{pf[1]}</Text></Text>
                  <View style={{ flex: 1 }} />
                  {paid && (e.rf === 'pending'
                    ? <Text style={[s.rf, { color: colors.primaryText }]} onPress={() => router.push(`/receipt/${e.rc}?flag=pending`)}>● Refund pending</Text>
                    : e.rf === 'refunded'
                      ? <Text style={[s.rf, { color: colors.purpleText }]} onPress={() => router.push(`/receipt/${e.rc}`)}>✓ Refunded</Text>
                      : <PressableScale onPress={() => router.push(`/receipt/${e.rc}?flag=refund`)} style={s.rfB}><Icon name="refresh" size={13} color={colors.dangerText} /><Text style={[s.rf, { color: colors.dangerText }]}>Request refund</Text></PressableScale>)}
                </View>
              </PressableScale>
            );
          })}
        </View>
      ) : <EmptyState icon="ticket" title="No events here yet" body="Events you register for, get invited to or attend will show up in this list." action="Discover events" onAction={() => router.navigate('/')} />}
    </Screen>
  );
}

const s = StyleSheet.create({
  pad: { paddingHorizontal: 16 },
  list: { gap: 12, marginTop: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.045)', overflow: 'hidden' },
  main: { flexDirection: 'row', gap: 12, padding: 10 },
  th: { width: 96, height: 96, borderRadius: 14 },
  tag: { position: 'absolute', left: 5, top: 5, height: 18, paddingHorizontal: 6, borderRadius: 5, justifyContent: 'center' },
  tagT: { fontFamily: fonts.bold, fontSize: 10, color: '#fff' },
  title: { fontFamily: fonts.semibold, fontSize: 14.5, lineHeight: 19, color: '#fff' },
  line: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  date: { fontFamily: fonts.medium, fontSize: 12, color: colors.textSecondary },
  org: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted },
  foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  tags: { flexDirection: 'row', gap: 6 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 22, paddingHorizontal: 8, borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.08)' },
  chipT: { fontFamily: fonts.bold, fontSize: 11, color: colors.textSecondary },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 30, paddingHorizontal: 12, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.1)' },
  ctaT: { fontFamily: fonts.bold, fontSize: 12.5, color: '#fff' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border },
  pf: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted },
  rf: { fontFamily: fonts.bold, fontSize: 12 },
  rfB: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
