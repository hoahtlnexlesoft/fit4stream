import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Avatar, EmptyState, Icon, IconName, PressableScale, colors, fonts } from '@ui';
import { Screen } from '@/components/Screen';
import { CATEGORIES, CHANNELS, getEvent, shortCat } from '@/data';
import { avatar } from '@/data/images';
import { useStore } from '@/lib/store';
import { openEvent } from '@/lib/nav';

const DEFAULT_RECENT = ['christmas market', 'Marc John', 'acoustic'];
const TREND: [string, '' | 'up' | 'new'][] = [['Danang Christmas Market', 'up'], ['SEO marketing', 'up'], ['Acoustic night', 'new'], ['Talk shows', ''], ['thao15 nguyen15', '']];
const MORE_CH = ['Hoang Minh', 'Linh Vo', 'Quang Le', 'Mai Pham', 'Duc Tran', 'Bao Ngoc', 'Khoa Dang', 'Vy Nguyen', 'Tuan Ho', 'Phuong Do', 'Long Bui', 'Ha Trinh', 'Nam Vu'];
let recentMemory: string[] = DEFAULT_RECENT; // TODO: persist with AsyncStorage; empty list falls back to defaults (prototype rule)

/** Search: Recent · Trending searches · Browse categories → results with All / Events / Channels / Categories tabs and highlight. */
export default function Search() {
  const router = useRouter();
  const store = useStore();
  const { tab: initTab } = useLocalSearchParams<{ tab?: string }>();
  const [q, setQ] = useState('');
  const [tab, setTab] = useState(({ events: 1, channels: 2, categories: 3 } as Record<string, number>)[initTab ?? ''] ?? 0);
  const [recent, setRecentS] = useState(recentMemory.length ? recentMemory : DEFAULT_RECENT);
  const setRecent = (l: string[]) => { recentMemory = l; setRecentS(l); };
  const commit = (v = q) => { v = v.trim(); if (!v) return; setRecent([v, ...recent.filter((x) => x.toLowerCase() !== v.toLowerCase())].slice(0, 6)); };
  const run = (v: string) => { setQ(v); setTab(0); commit(v); };

  const ql = q.trim().toLowerCase();
  const m = (s: string) => s.toLowerCase().includes(ql);
  const evs = ['xmas', 'gig', 'seo', 'payout'].map(getEvent);
  const chs = [...CHANNELS, ...MORE_CH];
  const fe = ql ? evs.filter((e) => m(e.title) || m(e.organizer) || m(e.category)) : [];
  const fc = ql ? chs.filter(m) : [];
  const fk = ql ? CATEGORIES.filter((c) => m(c.name)) : [];
  const total = fe.length + fc.length + fk.length;
  const HL = ({ text, style }: { text: string; style: object }) => {
    const i = ql ? text.toLowerCase().indexOf(ql) : -1;
    if (i < 0) return <Text style={style} numberOfLines={1}>{text}</Text>;
    return <Text style={style} numberOfLines={1}>{text.slice(0, i)}<Text style={{ color: colors.primary }}>{text.slice(i, i + ql.length)}</Text>{text.slice(i + ql.length)}</Text>;
  };
  const Row = ({ left, title, sub, onPress }: { left: React.ReactNode; title: string; sub: React.ReactNode; onPress: () => void }) => (
    <PressableScale onPress={() => { commit(); onPress(); }} style={s.row}>{left}<View style={{ flex: 1, minWidth: 0, gap: 3 }}><HL text={title} style={s.rt} />{sub}</View><Icon name="chevronRight" size={18} color={colors.textSubtle} /></PressableScale>
  );
  const evRows = (l: typeof fe) => l.map((e) => <Row key={e.id} left={<Image source={{ uri: e.image }} style={s.th} />} title={e.title} onPress={() => openEvent(router, e, store)}
    sub={<><Text style={s.rs} numberOfLines={1}>by {e.organizer}</Text>{e.status === 'live' ? <Text style={[s.rs, { color: colors.liveText, fontFamily: fonts.bold }]}>● LIVE · 2.4K watching</Text> : <Text style={s.rs}>{e.status === 'ended' ? 'Ended' : 'Upcoming'} · {e.price}</Text>}</>} />);
  const chRows = (l: string[]) => l.map((n, i) => <Row key={n} left={<Avatar uri={avatar(n)} name={n} size={48} seed={i} />} title={n} onPress={() => router.push(`/organizer/${encodeURIComponent(n)}`)}
    sub={<Text style={s.rs}>Channel · {i < 3 ? ['12.4K', '8.1K', '5.6K'][i] : (i + 1) * 37} followers</Text>} />);
  const catRows = (l: typeof fk) => l.map((c) => <Row key={c.name} left={<View style={s.cic}><Icon name={c.icon as IconName} size={20} color={colors.purpleText} /></View>} title={c.name} onPress={() => router.push(`/list/${encodeURIComponent(c.name)}`)}
    sub={<Text style={s.rs}>Category · {c.count ? `${c.count} live now` : 'Coming soon'}</Text>} />);
  const H = ({ t, action, onAction }: { t: string; action?: string; onAction?: () => void }) => <View style={s.h}><Text style={s.hT}>{t}</Text>{action && <Text style={s.clear} onPress={onAction}>{action}</Text>}</View>;

  const discover = (
    <View>
      {recent.length > 0 && (
        <View style={s.sec}>
          <H t="Recent" action="Clear" onAction={() => setRecent([])} />
          <View style={s.recent}>{recent.map((r) => (
            <View key={r} style={s.rc}>
              <PressableScale onPress={() => run(r)} style={s.rcB}><Icon name="clock" size={15} color={colors.textMuted} /><Text style={s.rcT}>{r}</Text></PressableScale>
              <PressableScale onPress={() => setRecent(recent.filter((x) => x !== r))} accessibilityLabel={`Remove ${r}`} style={s.rcX}><Icon name="x" size={13} color={colors.textMuted} /></PressableScale>
            </View>
          ))}</View>
        </View>
      )}
      <View style={s.sec}>
        <H t="Trending searches" />
        {TREND.map(([t, k], i) => (
          <PressableScale key={t} onPress={() => run(t)} style={s.tr}><Text style={s.trN}>{i + 1}</Text><Text style={s.trT}>{t}</Text>{k === 'up' && <Text style={s.up}>↗</Text>}{k === 'new' && <Text style={s.new}>NEW</Text>}</PressableScale>
        ))}
      </View>
      <View style={s.sec}>
        <H t="Browse categories" />
        <View style={s.cats}>{CATEGORIES.map((c) => (
          <PressableScale key={c.name} onPress={() => router.push(`/list/${encodeURIComponent(c.name)}`)} style={s.cat}><Icon name={c.icon as IconName} size={16} color="#fff" /><Text style={s.catT}>{shortCat(c.name)}</Text>{c.count > 0 && <View style={s.dot} />}</PressableScale>
        ))}</View>
      </View>
    </View>
  );
  const tabs: [string, number][] = [['All', total], ['Events', fe.length], ['Channels', fc.length], ['Categories', fk.length]];
  const results = !total ? <EmptyState icon="search" title={`No results for “${q.trim()}”`} body="Check the spelling or try a channel name, event or category." /> : (
    <View>
      <View style={s.tabs}>{tabs.map(([l, n], i) => (n || i === 0) ? (
        <PressableScale key={l} onPress={() => setTab(i)} style={[s.tab, tab === i && s.tabOn]}><Text style={[s.tabT, tab === i && { color: '#14121A' }]}>{l}</Text><Text style={[s.tabN, tab === i && { color: '#14121A' }]}>{n}</Text></PressableScale>
      ) : null)}</View>
      {(tab === 0 || tab === 1) && fe.length > 0 && <View style={s.sec}>{tab === 0 && <H t="Events" />}{evRows(tab === 0 ? fe.slice(0, 3) : fe)}</View>}
      {(tab === 0 || tab === 2) && fc.length > 0 && <View style={s.sec}>{tab === 0 && <H t="Channels" action={fc.length > 3 ? `See all ${fc.length}` : undefined} onAction={() => setTab(2)} />}{chRows(tab === 0 ? fc.slice(0, 3) : fc)}</View>}
      {(tab === 0 || tab === 3) && fk.length > 0 && <View style={s.sec}>{tab === 0 && <H t="Categories" />}{catRows(tab === 0 ? fk.slice(0, 3) : fk)}</View>}
    </View>
  );

  return (
    <Screen title="Search" keyboardShouldPersistTaps="handled">
      <View style={s.pad}>
        <View style={s.bar}>
          <Icon name="search" size={19} color={colors.textMuted} />
          <TextInput autoFocus value={q} onChangeText={(v) => { setQ(v); setTab(0); }} onSubmitEditing={() => commit()} returnKeyType="search" placeholder="Events, channels or categories" placeholderTextColor={colors.textSubtle} style={s.in} />
          {!!q && <PressableScale onPress={() => setQ('')} style={s.x} accessibilityLabel="Clear search"><Icon name="x" size={14} color="#fff" /></PressableScale>}
        </View>
        {ql ? results : discover}
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  pad: { paddingHorizontal: 16, maxWidth: 760, alignSelf: 'center', width: '100%' },
  bar: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 50, paddingHorizontal: 16, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.07)' },
  in: { flex: 1, fontFamily: fonts.regular, fontSize: 15.5, color: '#fff' },
  x: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  sec: { marginTop: 22 },
  h: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  hT: { fontFamily: fonts.bold, fontSize: 16, color: '#fff' },
  clear: { fontFamily: fonts.semibold, fontSize: 13, color: colors.primaryText },
  recent: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  rc: { flexDirection: 'row', alignItems: 'center', height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.06)', paddingLeft: 12 },
  rcB: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rcT: { fontFamily: fonts.medium, fontSize: 13.5, color: '#fff' },
  rcX: { width: 32, height: 36, alignItems: 'center', justifyContent: 'center' },
  tr: { flexDirection: 'row', alignItems: 'center', gap: 12, height: 46 },
  trN: { width: 20, fontFamily: fonts.extrabold, fontSize: 15, color: colors.primaryText },
  trT: { flex: 1, fontFamily: fonts.medium, fontSize: 14.5, color: '#fff' },
  up: { fontFamily: fonts.bold, fontSize: 14, color: colors.successText },
  new: { fontFamily: fonts.bold, fontSize: 10, color: colors.infoText, backgroundColor: colors.infoSoft, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5, overflow: 'hidden' },
  cats: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cat: { flexDirection: 'row', alignItems: 'center', gap: 7, height: 38, paddingHorizontal: 14, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.06)' },
  catT: { fontFamily: fonts.semibold, fontSize: 13.5, color: '#fff' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.live },
  tabs: { flexDirection: 'row', gap: 8, marginTop: 16, flexWrap: 'wrap' },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 34, paddingHorizontal: 13, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.06)' },
  tabOn: { backgroundColor: '#fff' },
  tabT: { fontFamily: fonts.semibold, fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  tabN: { fontFamily: fonts.medium, fontSize: 12, color: colors.textMuted },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  th: { width: 64, height: 48, borderRadius: 10 },
  cic: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  rt: { fontFamily: fonts.semibold, fontSize: 14.5, color: '#fff' },
  rs: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted },
});
