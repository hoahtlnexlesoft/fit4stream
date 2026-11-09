import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Avatar, EmptyState, Icon, IconButton, PressableScale, colors, fonts } from '@ui';
import { Screen } from '@/components/Screen';
import { Chips } from '@/components/Chips';
import { CHANNELS } from '@/data';
import { avatar } from '@/data/images';

/** Top Channels: podium (top 3) · filter chips · ranked list with Follow. TODO(api): GET /channels/top. */
export default function Channels() {
  const router = useRouter();
  const [f, setF] = useState<'all' | 'live' | 'following'>('all');
  const [fol, setFol] = useState<Record<string, boolean>>({});
  const DATA = CHANNELS.map((n, i) => ({ n, live: i === 0 || n === 'Marc John', cat: ['Concerts', 'Talk shows', 'Workshops', 'Festivals', 'Conferences'][i % 5], fol: [12.4, 8.1, 5.6, 4.2, 3.9, 2.7, 2.1, 1.8, 1.2][i] || 1 }));
  const list = DATA.filter((c) => f === 'all' || (f === 'live' ? c.live : fol[c.n]));
  const open = (n: string) => router.push(`/organizer/${encodeURIComponent(n)}`);
  return (
    <Screen title="Top Channels" right={<IconButton icon="search" accessibilityLabel="Search channels" onPress={() => router.push('/search?tab=channels')} />}>
      <View style={s.pod}>
        {[1, 0, 2].map((k) => {
          const c = DATA[k]; const size = k === 0 ? 84 : 66;
          return (
            <PressableScale key={c.n} onPress={() => open(c.n)} style={s.pd}>
              <View><Avatar uri={avatar(c.n)} name={c.n} size={size} seed={k} /><View style={[s.rank, k === 0 && { backgroundColor: colors.primary }]}><Text style={[s.rankT, k === 0 && { color: colors.onPrimary }]}>{k + 1}</Text></View>{c.live && <View style={s.liveTag}><Text style={s.liveT}>LIVE</Text></View>}</View>
              <Text style={s.pdN} numberOfLines={1}>{c.n}</Text><Text style={s.pdS}>{c.fol}K followers</Text>
              <View style={[s.step, { height: k === 0 ? 46 : k === 1 ? 30 : 20 }]} />
            </PressableScale>
          );
        })}
      </View>
      <Chips items={[['all', 'All'], ['live', 'Live now'], ['following', 'Following']]} value={f} onChange={setF} />
      <View style={[s.pad, { marginTop: 14, gap: 8 }]}>
        {list.length ? list.map((c, i) => (
          <PressableScale key={c.n} onPress={() => open(c.n)} style={s.row}>
            <Text style={s.rk}>{DATA.indexOf(c) + 1}</Text>
            <View style={[s.av, c.live && { borderColor: colors.live }]}><Avatar uri={avatar(c.n)} name={c.n} size={48} seed={i} /></View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><Text style={s.n} numberOfLines={1}>{c.n}</Text>{c.live && <Text style={s.lv}>● LIVE</Text>}</View>
              <Text style={s.sub}>{c.cat} · {c.fol}K followers</Text>
            </View>
            <PressableScale onPress={() => setFol((o) => ({ ...o, [c.n]: !o[c.n] }))} style={[s.fb, fol[c.n] && s.fbOn]}>{fol[c.n] ? <Icon name="check" size={15} color="#fff" /> : <Text style={s.fbT}>Follow</Text>}</PressableScale>
          </PressableScale>
        )) : <EmptyState icon="users" title="No channels yet" body="Follow channels to see them here." />}
      </View>
    </Screen>
  );
}
const s = StyleSheet.create({
  pad: { paddingHorizontal: 16 },
  pod: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 10, paddingHorizontal: 16, marginBottom: 18 },
  pd: { flex: 1, maxWidth: 130, alignItems: 'center', gap: 4 },
  rank: { position: 'absolute', bottom: -4, alignSelf: 'center', left: '50%', marginLeft: -11, width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.bg },
  rankT: { fontFamily: fonts.extrabold, fontSize: 11, color: '#14121A' },
  liveTag: { position: 'absolute', top: -4, right: -4, paddingHorizontal: 5, height: 16, borderRadius: 5, backgroundColor: colors.live, justifyContent: 'center' },
  liveT: { fontFamily: fonts.bold, fontSize: 9, color: '#fff' },
  pdN: { marginTop: 8, fontFamily: fonts.bold, fontSize: 13.5, color: '#fff' },
  pdS: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.textMuted },
  step: { alignSelf: 'stretch', marginTop: 8, borderTopLeftRadius: 12, borderTopRightRadius: 12, backgroundColor: 'rgba(255,255,255,0.06)' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.045)' },
  rk: { width: 20, textAlign: 'center', fontFamily: fonts.bold, fontSize: 14, color: colors.textMuted },
  av: { borderRadius: 28, borderWidth: 2, borderColor: 'transparent', padding: 2 },
  n: { flexShrink: 1, fontFamily: fonts.bold, fontSize: 14.5, color: '#fff' },
  lv: { fontFamily: fonts.bold, fontSize: 10.5, color: colors.liveText },
  sub: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  fb: { height: 34, minWidth: 74, paddingHorizontal: 14, borderRadius: 17, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  fbOn: { backgroundColor: 'rgba(255,255,255,0.1)' },
  fbT: { fontFamily: fonts.bold, fontSize: 13, color: colors.onPrimary },
});
