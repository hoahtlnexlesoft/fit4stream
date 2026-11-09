import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Avatar, BottomSheet, EmptyState, Icon, IconButton, IconName, PressableScale, colors, fonts } from '@ui';
import { Screen } from '@/components/Screen';
import { ListSkeleton } from '@/components/Skeletons';
import { AppEvent, EVENTS, MONTHS, endTime, eventDate, startTime, today } from '@/data';
import { avatar } from '@/data/images';
import { useLoading } from '@/lib/useLoading';
import { useStore } from '@/lib/store';

type View_ = 'timeline' | 'list' | 'calendar';
type Status = 'all' | 'live' | 'upcoming' | 'ended';
const DOW = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const STL: Record<Exclude<Status, 'all'>, string> = { live: 'Live', upcoming: 'Upcoming', ended: 'Ended' };
const DOT: Record<Status, string> = { all: 'rgba(255,255,255,0.5)', live: colors.live, upcoming: colors.info, ended: 'rgba(255,255,255,0.35)' };

/**
 * Event Guide (client spec #94632): month picker + Today, status filter, Timeline / List / Calendar views,
 * search, scrolling day strip. Timeline groups the selected day's events by channel.
 */
export default function Guide() {
  const router = useRouter();
  const store = useStore();
  const [loading] = useLoading('guide');
  const T = today();
  const [ym, setYm] = useState({ y: T.getFullYear(), m: T.getMonth() });
  const [sel, setSel] = useState(T.getDate());
  const [view, setView] = useState<View_>('timeline');
  const [query, setQ] = useState('');
  const [showQ, setShowQ] = useState(false);
  const [stF, setStF] = useState<Status>('all');
  const [filtOpen, setFiltOpen] = useState(false);
  const [sortDir, setSort] = useState(1);
  const [pick, setPick] = useState<number | null>(null);
  const strip = useRef<ScrollView>(null);

  const dim = new Date(ym.y, ym.m + 1, 0).getDate();
  const inMonth = useMemo(() => EVENTS.filter((e) => { const d = eventDate(e); return d.getFullYear() === ym.y && d.getMonth() === ym.m; }), [ym]);
  const ql = query.trim().toLowerCase();
  const matchQ = (e: AppEvent) => !ql || `${e.title} ${e.organizer} ${e.category}`.toLowerCase().includes(ql);
  const matchSt = (e: AppEvent) => stF === 'all' || e.status === stF;
  const onDay = (d: number) => inMonth.filter((e) => eventDate(e).getDate() === d);
  const isToday = (d: number) => ym.y === T.getFullYear() && ym.m === T.getMonth() && d === T.getDate();
  const dayAll = onDay(sel).filter(matchQ);
  const dayEvents = dayAll.filter(matchSt);
  const goToday = () => { setYm({ y: T.getFullYear(), m: T.getMonth() }); setSel(T.getDate()); };
  const open = (e: AppEvent) => router.push(e.status === 'live' && store.authed ? `/player/${e.id}` : `/event/${e.id}`);
  useEffect(() => { strip.current?.scrollTo({ x: Math.max(0, (sel - 3) * 56), animated: true }); }, [sel, ym.m, view]);

  const nextDay = () => { for (let q = sel + 1; q <= dim; q++) if (onDay(q).filter(matchQ).filter(matchSt).length) return q; return null; };
  const Empty = () => {
    const nx = nextDay(); const filtered = stF !== 'all' && dayAll.length > 0; const mon = MONTHS[ym.m].slice(0, 3);
    return (
      <View style={{ marginTop: 8 }}>
        <EmptyState icon={filtered ? 'search' : 'calendar'}
          title={filtered ? `No ${STL[stF as 'live'].toLowerCase()} events here` : ql ? 'No matches' : 'Nothing scheduled'}
          body={filtered ? `This day has ${dayAll.length} ${dayAll.length === 1 ? 'event' : 'events'} with another status.` : ql ? 'Try another channel, event or host name.' : `No events on ${mon} ${sel}. Pick another day.`}
          action={filtered ? 'Show all statuses' : nx ? `Next: ${mon} ${nx}` : 'Browse upcoming'}
          onAction={() => (filtered ? setStF('all') : nx ? setSel(nx) : router.navigate('/upcoming'))} />
      </View>
    );
  };
  const Pill = ({ st }: { st: AppEvent['status'] }) => (
    <View style={[s.pill, st === 'live' && { backgroundColor: colors.dangerSoft }, st === 'upcoming' && { backgroundColor: colors.infoSoft }]}>
      {st === 'live' && <View style={[s.dot6, { backgroundColor: colors.live }]} />}
      <Text style={[s.pillT, st === 'live' && { color: colors.liveText }, st === 'upcoming' && { color: colors.infoText }]}>{STL[st]}</Text>
    </View>
  );
  const dayLabel = new Date(ym.y, ym.m, sel).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const DayHead = () => (
    <View style={s.dh}>
      <Text style={s.dhB}>{dayLabel}</Text>{isToday(sel) && <Text style={s.dhToday}>Today</Text>}
      <View style={{ flex: 1 }} />
      <Text style={s.dhN}>{dayEvents.length ? `${dayEvents.length} ${dayEvents.length === 1 ? 'event' : 'events'}` : 'No events'}</Text>
      {view === 'list' && dayEvents.length > 1 && <PressableScale onPress={() => setSort(-sortDir)} style={s.sortB}><Text style={s.sortT}>Time {sortDir > 0 ? '↑' : '↓'}</Text></PressableScale>}
    </View>
  );

  let body: React.ReactNode;
  if (view === 'timeline') {
    const by: Record<string, AppEvent[]> = {};
    dayEvents.forEach((e) => (by[e.organizer] = by[e.organizer] || []).push(e));
    const rows = Object.entries(by);
    body = rows.length ? rows.map(([ch, evs]) => (
      <View key={ch} style={s.ch}>
        <PressableScale onPress={() => router.push(`/organizer/${encodeURIComponent(ch)}`)} style={s.chH}>
          <Avatar uri={avatar(ch)} name={ch} size={36} /><Text style={s.chN} numberOfLines={1}>{ch}</Text>
          <Text style={s.chC}>{evs.length} {evs.length === 1 ? 'event' : 'events'}</Text><Icon name="chevronRight" size={16} color={colors.textMuted} />
        </PressableScale>
        {evs.sort((a, b) => startTime(a).localeCompare(startTime(b))).map((e, i) => (
          <PressableScale key={e.id} onPress={() => open(e)} style={s.tl}>
            <View style={s.tlTime}><Text style={s.tlB}>{startTime(e)}</Text><Text style={s.tlS}>{endTime(e)}</Text></View>
            <View style={s.tlRail}><View style={[s.tlDot, { backgroundColor: DOT[e.status] }]} />{i < evs.length - 1 && <View style={s.tlLine} />}</View>
            <View style={{ flex: 1, gap: 6, paddingBottom: 14 }}><Text style={s.tlTitle} numberOfLines={2}>{e.title}</Text><View style={s.tlMeta}><Pill st={e.status} /><Text style={s.tlCat} numberOfLines={1}>{e.category}</Text></View></View>
          </PressableScale>
        ))}
      </View>
    )) : <Empty />;
  } else if (view === 'list') {
    const src = [...dayEvents].sort((a, b) => startTime(a).localeCompare(startTime(b)) * sortDir);
    const liveN = dayEvents.filter((e) => e.status === 'live').length;
    body = (
      <View style={{ gap: 12 }}>
        {liveN > 0 && <View style={s.sum}><View style={s.sumL}><View style={[s.dot6, { backgroundColor: colors.live }]} /><Text style={s.sumLT}>{liveN} live now</Text></View><Icon name="eye" size={14} color={colors.textMuted} /><Text style={s.sumT}>2.4K watching</Text></View>}
        {src.length ? src.map((e) => {
          const live = e.status === 'live', ended = e.status === 'ended';
          return (
            <PressableScale key={e.id} onPress={() => open(e)} style={s.li}>
              <View><Image source={{ uri: e.image }} style={s.liTh} />
                <View style={[s.liTag, live && { backgroundColor: colors.live }, ended && { backgroundColor: 'rgba(10,9,14,0.7)' }]}><Text style={s.liTagT}>{live ? 'LIVE' : ended ? 'Ended' : 'Soon'}</Text></View>
                <View style={s.liTime}><Text style={s.liTagT}>{startTime(e)}</Text></View></View>
              <View style={{ flex: 1, minWidth: 0, gap: 5 }}>
                <Text style={s.tlTitle} numberOfLines={2}>{e.title}</Text>
                <View style={s.host}><Avatar uri={avatar(e.organizer)} name={e.organizer} size={18} /><Text style={s.hostT} numberOfLines={1}>{e.organizer}</Text></View>
                <Text style={s.liSub} numberOfLines={1}>{live ? '2.4K watching' : `${e.range.replace(' – ', '–')} · ${e.category.replace(' and Performances', '').replace('Virtual ', '')}`}</Text>
              </View>
            </PressableScale>
          );
        }) : <Empty />}
      </View>
    );
  } else {
    const first = new Date(ym.y, ym.m, 1).getDay();
    const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: dim }, (_, i) => i + 1)];
    body = (
      <View>
        <View style={s.cal}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((x, i) => <Text key={'h' + i} style={s.calH}>{x}</Text>)}
          {cells.map((d, i) => {
            if (!d) return <View key={'e' + i} style={s.calC} />;
            const evs = onDay(d).filter(matchQ).filter(matchSt); const on = d === sel;
            return (
              <PressableScale key={d} onPress={() => setSel(d)} style={[s.calC, s.calD, on && s.calOn, isToday(d) && !on && s.calToday]}>
                <Text style={[s.calN, on && { color: colors.onPrimary }]}>{d}</Text>
                <View style={s.calDots}>{evs.slice(0, 3).map((e) => <View key={e.id} style={[s.calDot, { backgroundColor: on ? colors.onPrimary : DOT[e.status] }]} />)}</View>
              </PressableScale>
            );
          })}
        </View>
        <DayHead />
        <View style={{ gap: 8 }}>
          {dayEvents.length ? dayEvents.map((e) => (
            <PressableScale key={e.id} onPress={() => open(e)} style={s.cr}>
              <Text style={s.crT}>{startTime(e)}</Text><View style={[s.crB, { backgroundColor: DOT[e.status] }]} />
              <View style={{ flex: 1, minWidth: 0 }}><Text style={s.tlTitle} numberOfLines={1}>{e.title}</Text><Text style={s.liSub} numberOfLines={1}>{e.status === 'live' ? 'LIVE · 2.4K watching' : `${e.organizer} · ${STL[e.status]}`}</Text></View>
              {e.status === 'live' ? <View style={s.crW}><Icon name="play" size={11} color={colors.onPrimary} filled /><Text style={s.crWT}>Watch</Text></View> : <Icon name="chevronRight" size={16} color={colors.textMuted} />}
            </PressableScale>
          )) : <Empty />}
        </View>
      </View>
    );
  }

  const VIEWS: { k: View_; icon: IconName }[] = [{ k: 'timeline', icon: 'list' }, { k: 'list', icon: 'grid' }, { k: 'calendar', icon: 'calendar' }];
  const searchBtn = <IconButton icon={showQ ? 'x' : 'search'} active={showQ || !!query} accessibilityLabel={showQ ? 'Close search' : 'Search'} onPress={() => { if (showQ) setQ(''); setShowQ(!showQ); }} />;

  return (
    <Screen tabTitle="Event Guide" right={searchBtn} tabBar keyboardShouldPersistTaps="handled">
      {/* toolbar */}
      <View style={[s.pad, s.bar]}>
        <PressableScale onPress={() => setPick(ym.y)} style={s.mon} accessibilityLabel="Choose month and year"><Text style={s.monB}>{MONTHS[ym.m].slice(0, 3)}<Text style={s.monY}> {ym.y}</Text></Text><Icon name="chevronDown" size={16} color="#fff" /></PressableScale>
        {!(isToday(sel)) && <PressableScale onPress={goToday} style={s.today}><Text style={s.todayT}>Today</Text></PressableScale>}
        <View style={{ flex: 1 }} />
        <View>
          <PressableScale onPress={() => setFiltOpen(!filtOpen)} style={[s.fb, stF !== 'all' && s.fbOn]} accessibilityLabel="Filter by status"><Icon name="filter" size={16} color="#fff" />{stF !== 'all' && <View style={[s.fbd, { backgroundColor: DOT[stF] }]} />}</PressableScale>
        </View>
        <View style={s.vw}>{VIEWS.map((v) => <PressableScale key={v.k} onPress={() => setView(v.k)} accessibilityRole="tab" accessibilityLabel={v.k} accessibilityState={{ selected: view === v.k }} style={[s.vwi, view === v.k && s.vwOn]}><Icon name={v.icon} size={17} color={view === v.k ? colors.onPrimary : 'rgba(255,255,255,0.7)'} /></PressableScale>)}</View>
      </View>
      {filtOpen && (
        <View style={s.menu}>
          {(['all', 'live', 'upcoming', 'ended'] as Status[]).map((k) => {
            const n = k === 'all' ? inMonth.length : inMonth.filter((e) => e.status === k).length;
            return <PressableScale key={k} onPress={() => { setStF(k); setFiltOpen(false); }} style={[s.mi, stF === k && s.miOn]}><View style={[s.dot6, { backgroundColor: DOT[k] }]} /><Text style={s.miT}>{k === 'all' ? 'All statuses' : STL[k]}</Text><Text style={s.miN}>{n}</Text>{stF === k && <Icon name="check" size={14} color={colors.primary} />}</PressableScale>;
          })}
        </View>
      )}
      {(showQ || !!query) && (
        <View style={[s.pad, { marginTop: 10 }]}>
          <View style={s.q}><Icon name="search" size={17} color={colors.textMuted} /><TextInput autoFocus value={query} onChangeText={setQ} placeholder="Search channels, events, hosts…" placeholderTextColor={colors.textSubtle} style={s.qIn} returnKeyType="search" /></View>
        </View>
      )}
      {view !== 'calendar' && (
        <ScrollView ref={strip} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.strip}>
          {Array.from({ length: dim }, (_, i) => i + 1).map((d) => {
            const on = d === sel, n = onDay(d).filter(matchSt).length;
            return (
              <PressableScale key={d} onPress={() => setSel(d)} style={[s.d, on && s.dOn, isToday(d) && !on && s.dToday]}>
                <Text style={[s.dW, on && { color: colors.onPrimary }]}>{isToday(d) && !on ? 'Today' : DOW[new Date(ym.y, ym.m, d).getDay()].slice(0, 3)}</Text>
                <Text style={[s.dN, on && { color: colors.onPrimary }]}>{d}</Text>
                <View style={[s.dDot, !n && { opacity: 0 }, on && { backgroundColor: colors.onPrimary }]} />
              </PressableScale>
            );
          })}
        </ScrollView>
      )}
      <View style={s.pad}>
        {loading ? <ListSkeleton /> : <>{view !== 'calendar' && <DayHead />}{body}</>}
      </View>

      <BottomSheet visible={pick !== null} onClose={() => setPick(null)}>
        <View style={s.pkH}>
          <IconButton icon="chevronLeft" accessibilityLabel="Previous year" onPress={() => setPick((p) => (p ?? ym.y) - 1)} />
          <Text style={s.pkY}>{pick}</Text>
          <IconButton icon="chevronRight" accessibilityLabel="Next year" onPress={() => setPick((p) => (p ?? ym.y) + 1)} />
        </View>
        <View style={s.pkG}>
          {MONTHS.map((mn, i) => {
            const n = EVENTS.filter((e) => { const d = eventDate(e); return d.getFullYear() === pick && d.getMonth() === i; }).length;
            const cur = pick === ym.y && i === ym.m;
            return (
              <PressableScale key={mn} onPress={() => { if (pick == null) return; setYm({ y: pick, m: i }); setSel(pick === T.getFullYear() && i === T.getMonth() ? T.getDate() : 1); setPick(null); }} style={[s.pkM, cur && s.pkOn]}>
                <Text style={[s.pkMB, cur && { color: colors.onPrimary }]}>{mn.slice(0, 3)}</Text><Text style={[s.pkMS, cur && { color: colors.onPrimary }]}>{n ? `${n} ${n === 1 ? 'event' : 'events'}` : '—'}</Text>
              </PressableScale>
            );
          })}
        </View>
        <PressableScale onPress={() => { goToday(); setPick(null); }} style={s.pkT}><Icon name="calendar" size={15} color={colors.primaryText} /><Text style={s.pkTT}>Jump to today</Text></PressableScale>
      </BottomSheet>
    </Screen>
  );
}

const s = StyleSheet.create({
  pad: { paddingHorizontal: 16 },
  bar: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  mon: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 40, paddingHorizontal: 14, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.06)' },
  monB: { fontFamily: fonts.bold, fontSize: 15, color: '#fff' },
  monY: { fontFamily: fonts.medium, color: colors.textMuted },
  today: { height: 40, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(244,164,37,0.5)', justifyContent: 'center' },
  todayT: { fontFamily: fonts.bold, fontSize: 13, color: colors.primaryText },
  fb: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
  fbOn: { borderWidth: 1, borderColor: colors.primary },
  fbd: { position: 'absolute', top: 8, right: 8, width: 7, height: 7, borderRadius: 4 },
  vw: { flexDirection: 'row', padding: 3, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.06)' },
  vwi: { width: 36, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  vwOn: { backgroundColor: colors.primary },
  menu: { marginHorizontal: 16, marginTop: 8, padding: 6, borderRadius: 16, backgroundColor: colors.surfaceSolid, borderWidth: 1, borderColor: colors.border },
  mi: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 42, paddingHorizontal: 10, borderRadius: 10 },
  miOn: { backgroundColor: 'rgba(255,255,255,0.05)' },
  miT: { flex: 1, fontFamily: fonts.semibold, fontSize: 14, color: '#fff' },
  miN: { fontFamily: fonts.medium, fontSize: 12.5, color: colors.textMuted },
  q: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 46, paddingHorizontal: 14, borderRadius: 23, backgroundColor: 'rgba(255,255,255,0.06)' },
  qIn: { flex: 1, fontFamily: fonts.regular, fontSize: 15, color: '#fff' },
  strip: { paddingHorizontal: 16, gap: 8, paddingVertical: 14 },
  d: { width: 48, height: 70, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 3, backgroundColor: 'rgba(255,255,255,0.045)' },
  dOn: { backgroundColor: colors.primary },
  dToday: { borderWidth: 1, borderColor: 'rgba(244,164,37,0.55)' },
  dW: { fontFamily: fonts.semibold, fontSize: 10.5, color: colors.textMuted },
  dN: { fontFamily: fonts.bold, fontSize: 17, color: '#fff' },
  dDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.primary },
  dh: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12, marginTop: 4 },
  dhB: { fontFamily: fonts.bold, fontSize: 16, color: '#fff' },
  dhToday: { fontFamily: fonts.bold, fontSize: 11, color: colors.primaryText, backgroundColor: colors.primarySoft, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, overflow: 'hidden' },
  dhN: { fontFamily: fonts.medium, fontSize: 12.5, color: colors.textMuted },
  sortB: { height: 28, paddingHorizontal: 10, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.06)', justifyContent: 'center' },
  sortT: { fontFamily: fonts.semibold, fontSize: 12, color: '#fff' },
  ch: { borderRadius: 20, padding: 12, backgroundColor: 'rgba(255,255,255,0.045)', marginBottom: 12 },
  chH: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  chN: { flex: 1, fontFamily: fonts.bold, fontSize: 15, color: '#fff' },
  chC: { fontFamily: fonts.medium, fontSize: 12, color: colors.textMuted },
  tl: { flexDirection: 'row', gap: 10 },
  tlTime: { width: 48, alignItems: 'flex-end' },
  tlB: { fontFamily: fonts.bold, fontSize: 13.5, color: '#fff' },
  tlS: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.textMuted },
  tlRail: { width: 12, alignItems: 'center', paddingTop: 4 },
  tlDot: { width: 10, height: 10, borderRadius: 5 },
  tlLine: { flex: 1, width: 2, marginTop: 4, backgroundColor: 'rgba(255,255,255,0.1)' },
  tlTitle: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 19, color: '#fff' },
  tlMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tlCat: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 5, height: 20, paddingHorizontal: 7, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.08)' },
  pillT: { fontFamily: fonts.bold, fontSize: 10.5, color: colors.textSecondary },
  dot6: { width: 6, height: 6, borderRadius: 3 },
  sum: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 12, borderRadius: 14, backgroundColor: colors.dangerSoft },
  sumL: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  sumLT: { fontFamily: fonts.bold, fontSize: 13, color: colors.liveText },
  sumT: { fontFamily: fonts.medium, fontSize: 12.5, color: colors.textSecondary },
  li: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 8, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.045)' },
  liTh: { width: 112, height: 76, borderRadius: 13 },
  liTag: { position: 'absolute', left: 5, top: 5, height: 18, paddingHorizontal: 6, borderRadius: 5, backgroundColor: colors.info, justifyContent: 'center' },
  liTime: { position: 'absolute', right: 5, bottom: 5, height: 18, paddingHorizontal: 6, borderRadius: 5, backgroundColor: 'rgba(10,9,14,0.7)', justifyContent: 'center' },
  liTagT: { fontFamily: fonts.bold, fontSize: 10, color: '#fff' },
  host: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  hostT: { flex: 1, fontFamily: fonts.medium, fontSize: 12, color: colors.primaryText },
  liSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted },
  cal: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  calH: { width: `${100 / 7}%`, textAlign: 'center', fontFamily: fonts.semibold, fontSize: 11.5, color: colors.textMuted, paddingVertical: 6 },
  calC: { width: `${100 / 7}%`, height: 48 },
  calD: { alignItems: 'center', justifyContent: 'center', borderRadius: 14, gap: 3 },
  calOn: { backgroundColor: colors.primary },
  calToday: { borderWidth: 1, borderColor: 'rgba(244,164,37,0.55)' },
  calN: { fontFamily: fonts.semibold, fontSize: 14.5, color: '#fff' },
  calDots: { flexDirection: 'row', gap: 2, height: 5 },
  calDot: { width: 5, height: 5, borderRadius: 3 },
  cr: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.045)' },
  crT: { width: 44, fontFamily: fonts.bold, fontSize: 13, color: '#fff' },
  crB: { width: 3, height: 32, borderRadius: 2 },
  crW: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 30, paddingHorizontal: 11, borderRadius: 15, backgroundColor: colors.primary },
  crWT: { fontFamily: fonts.bold, fontSize: 12.5, color: colors.onPrimary },
  pkH: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  pkY: { fontFamily: fonts.extrabold, fontSize: 20, color: '#fff' },
  pkG: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pkM: { width: '31.5%', height: 60, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)' },
  pkOn: { backgroundColor: colors.primary },
  pkMB: { fontFamily: fonts.bold, fontSize: 15, color: '#fff' },
  pkMS: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.textMuted, marginTop: 2 },
  pkT: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 46, marginTop: 14 },
  pkTT: { fontFamily: fonts.bold, fontSize: 14, color: colors.primaryText },
});
