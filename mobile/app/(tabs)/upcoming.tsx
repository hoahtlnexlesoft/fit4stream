import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Icon, IconButton, PressableScale, colors, fonts, useToast } from '@ui';
import { Screen } from '@/components/Screen';
import { ListSkeleton } from '@/components/Skeletons';
import { AppEvent, MONTHS, durationLabel, getEvent, startTime, today } from '@/data';
import { useLoading } from '@/lib/useLoading';
import { useStore } from '@/lib/store';
import { useLayout } from '@/lib/layout';

const fmtDay = (n: number) => { const d = today(); d.setDate(d.getDate() + n); return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); };

/** Upcoming: "Next up" hero with live countdown + day groups. Registering = reminder (no separate bell). */
export default function Upcoming() {
  const router = useRouter();
  const toast = useToast();
  const store = useStore();
  const { wide } = useLayout();
  const [loading] = useLoading('upcoming');
  const [left, setLeft] = useState(5 * 60 + 12);
  useEffect(() => { const i = setInterval(() => setLeft((v) => Math.max(0, v - 1)), 1000); return () => clearInterval(i); }, []);
  const f = getEvent('seo');
  const groups: [string, string, AppEvent[]][] = [['Today', fmtDay(0), [getEvent('seo')]], ['This week', fmtDay(2), [getEvent('gig')]]];

  const register = (e: AppEvent) => {
    if (store.registered.has(e.id)) return router.push(`/event/${e.id}`);
    store.requireAuth('Sign in to register', () => {
      if (e.price !== 'Free') return router.push(`/checkout/${e.id}`);
      store.register(e.id); toast.show('Registered · we’ll remind you before it starts');
    });
  };
  const RegBtn = ({ e, big }: { e: AppEvent; big?: boolean }) => {
    const on = store.registered.has(e.id);
    return (
      <PressableScale onPress={() => register(e)} style={[big ? s.heroBtn : s.reg, big && !on && { backgroundColor: colors.primary }, on && s.regOn]} accessibilityLabel={on ? 'Registered' : 'Register'}>
        {on && <Icon name="check" size={14} color={colors.successText} />}
        <Text style={[s.regT, big && !on && { color: colors.onPrimary }, on && { color: colors.successText }]}>{on ? 'Registered' : 'Register'}</Text>
      </PressableScale>
    );
  };
  const unit = (v: number, l: string) => <View style={s.u}><Text style={s.uB}>{String(v).padStart(2, '0')}</Text><Text style={s.uL}>{l}</Text></View>;

  return (
    <Screen tabTitle="Upcoming" right={<IconButton icon="search" accessibilityLabel="Search" onPress={() => router.push('/search')} />} tabBar>
      {loading ? <ListSkeleton hero /> : (
        <View style={[s.pad, { marginTop: 6 }, wide && s.wide]}>
          <View style={s.kickRow}><View style={s.kickDot} /><Text style={s.kicker}>NEXT UP</Text></View>
          <PressableScale onPress={() => router.push(`/event/${f.id}`)} style={s.hero}>
            <Image source={{ uri: f.image }} style={StyleSheet.absoluteFill} />
            <LinearGradient colors={['rgba(12,10,18,0.1)', 'rgba(12,10,18,0.55)', 'rgba(12,10,18,0.96)']} locations={[0, 0.4, 1]} style={StyleSheet.absoluteFill} />
            <View style={s.cat}><Text style={s.catT}>{f.category}</Text></View>
            <View style={s.heroBody}>
              <Text style={s.heroTitle} numberOfLines={2}>{f.title}</Text>
              <Text style={s.heroOrg}>by {f.organizer} · {f.price}</Text>
              <View style={s.count}>{unit(Math.floor(left / 3600), 'hrs')}<Text style={s.colon}>:</Text>{unit(Math.floor(left / 60) % 60, 'min')}<Text style={s.colon}>:</Text>{unit(left % 60, 'sec')}</View>
              <View style={s.acts}>
                <PressableScale onPress={() => router.push(`/event/${f.id}`)} style={s.heroBtn}><Text style={s.regT}>View details</Text></PressableScale>
                <RegBtn e={f} big />
              </View>
            </View>
          </PressableScale>

          {groups.map(([g, day, list]) => (
            <View key={g} style={{ marginTop: 26 }}>
              <View style={s.sh}><Text style={s.shT}>{g}</Text><Text style={s.shD}>{day}</Text></View>
              {list.map((e) => (
                <PressableScale key={e.id} onPress={() => router.push(`/event/${e.id}`)} style={s.row}>
                  <View><Image source={{ uri: e.image }} style={s.th} /><View style={s.thT}><Text style={s.thTT}>{startTime(e)}</Text></View></View>
                  <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                    <Text style={s.title} numberOfLines={2}>{e.title}</Text>
                    <View style={s.meta}><Icon name="clock" size={13} color={colors.textMuted} /><Text style={s.metaT}>{durationLabel(e)}</Text><View style={s.sep} /><Text style={[s.metaT, e.price === 'Free' && { color: colors.successText }]}>{e.price}</Text></View>
                    <Text style={s.by} numberOfLines={1}>by {e.organizer}</Text>
                  </View>
                  <RegBtn e={e} />
                </PressableScale>
              ))}
            </View>
          ))}
        </View>
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  pad: { paddingHorizontal: 16 },
  wide: { maxWidth: 720, alignSelf: 'center', width: '100%' },
  kickRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 10 },
  kickDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.primary },
  kicker: { fontFamily: fonts.bold, fontSize: 11.5, letterSpacing: 1.2, color: colors.primaryText },
  hero: { height: 360, borderRadius: 24, overflow: 'hidden', backgroundColor: '#1B1921' },
  cat: { position: 'absolute', left: 14, top: 14, height: 26, paddingHorizontal: 10, borderRadius: 8, backgroundColor: 'rgba(10,9,14,0.6)', justifyContent: 'center' },
  catT: { fontFamily: fonts.semibold, fontSize: 11.5, color: '#fff' },
  heroBody: { position: 'absolute', left: 16, right: 16, bottom: 16, gap: 6 },
  heroTitle: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 28, color: '#fff' },
  heroOrg: { fontFamily: fonts.medium, fontSize: 13, color: 'rgba(255,255,255,0.75)' },
  count: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  u: { width: 58, height: 54, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  uB: { fontFamily: fonts.extrabold, fontSize: 22, color: '#fff', fontVariant: ['tabular-nums'] },
  uL: { fontFamily: fonts.medium, fontSize: 10.5, color: 'rgba(255,255,255,0.6)' },
  colon: { fontFamily: fonts.bold, fontSize: 20, color: 'rgba(255,255,255,0.5)' },
  acts: { flexDirection: 'row', gap: 10, marginTop: 10 },
  heroBtn: { flex: 1, height: 46, borderRadius: 23, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  sh: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 },
  shT: { fontFamily: fonts.bold, fontSize: 18, color: '#fff' },
  shD: { fontFamily: fonts.medium, fontSize: 12.5, color: colors.textMuted },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 8, paddingRight: 10, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.045)', marginBottom: 10 },
  th: { width: 96, height: 72, borderRadius: 14 },
  thT: { position: 'absolute', left: 5, bottom: 5, height: 18, paddingHorizontal: 6, borderRadius: 5, backgroundColor: 'rgba(10,9,14,0.7)', justifyContent: 'center' },
  thTT: { fontFamily: fonts.bold, fontSize: 10.5, color: '#fff' },
  title: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 19, color: '#fff' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaT: { fontFamily: fonts.medium, fontSize: 12, color: colors.textMuted },
  sep: { width: 3, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)' },
  by: { fontFamily: fonts.regular, fontSize: 12, color: colors.textSubtle },
  reg: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 34, paddingHorizontal: 13, borderRadius: 17, backgroundColor: colors.primarySoft },
  regOn: { backgroundColor: colors.successSoft },
  regT: { fontFamily: fonts.bold, fontSize: 13.5, color: colors.primaryText },
});
