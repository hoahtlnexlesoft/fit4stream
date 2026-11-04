import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Avatar, AvatarStack, Badge, BottomNav, Button, CategoryCard, ConfirmDialog, DateStrip, EmptyState, EventHeroCard, EventRow, GuideChannel,
  IconButton, LargeTitle, Logo, RatingSummary, ReviewCard, SearchField, SectionHeader, SegmentedTabs, Skeleton, Switch, TextField, colors, fonts, useToast, TabKey,
} from '../../src';
import { EVENTS, IMG } from '../data';

/** Every component on one scrollable page — use as a living style guide. */
export function GalleryScreen() {
  const toast = useToast();
  const [seg, setSeg] = useState<'foryou' | 'concert' | 'talk'>('foryou');
  const [day, setDay] = useState('03');
  const [sw, setSw] = useState(true);
  const [dlg, setDlg] = useState(false);
  const [tab, setTab] = useState<TabKey>('home');
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={s.body}>
        <View style={s.headRow}>
          <Logo />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <IconButton icon="bell" accessibilityLabel="Notifications" dot />
            <Avatar uri={IMG.me} name="Thao" size={40} style={{ margin: 2 }} />
            <IconButton icon="search" accessibilityLabel="Search" />
          </View>
        </View>
        <LargeTitle title="On-air" badge={<Badge label="1 live" tone="live" />} />
        <H t="Buttons" />
        <View style={s.wrap}>
          <Button title="Join Live Event" icon="play" />
          <Button title="Register" variant="secondary" />
          <Button title="Maybe later" variant="ghost" />
          <Button title="Leave" variant="danger" size="sm" />
          <Button title="Loading" loading />
        </View>
        <H t="Badges & avatars" />
        <View style={s.wrap}>
          <Badge label="Live" tone="live" dot /><Badge label="Upcoming" tone="upcoming" /><Badge label="Ended" tone="ended" /><Badge label="Purchased" tone="purchased" /><Badge label="Series" tone="series" />
        </View>
        <View style={s.wrap}><Avatar uri={IMG.host} name="thao" size={52} ring="live" /><Avatar name="Marc John" size={52} ring="subtle" /><AvatarStack people={[{ name: 'A', uri: IMG.a1 }, { name: 'B', uri: IMG.a2 }, { name: 'C', uri: IMG.a3 }, { name: 'D', uri: IMG.a4 }]} /></View>
        <H t="Tabs & inputs" />
        <SegmentedTabs items={[{ key: 'foryou', label: 'For you' }, { key: 'concert', label: 'Concerts' }, { key: 'talk', label: 'Talk shows' }]} value={seg} onChange={setSeg} />
        <SearchField placeholder="Search events, channels…" />
        <TextField label="Email" icon="mail" placeholder="you@example.com" />
        <TextField label="Password" icon="lock" placeholder="••••••••" secure error="Incorrect password" />
        <Switch value={sw} onChange={setSw} label="Notify me when my events go live" />
        <H t="Event cards" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
          {EVENTS.map((e) => <EventHeroCard key={e.id} event={e} width={260} onPress={() => toast.show(e.title)} />)}
        </ScrollView>
        <EventRow event={EVENTS[2]} />
        <SectionHeader title="Browse by Category" action="View all" />
        <View style={{ flexDirection: 'row', gap: 10 }}><CategoryCard icon="music" title="Concerts" count={1} /><CategoryCard icon="video" title="Broadcast Events" /></View>
        <CategoryCard icon="more" title="Others" wide />
        <H t="Event Guide" />
        <DateStrip value={day} onChange={setDay} days={[{ key: '02', top: 'Nov', day: '02' }, { key: '03', top: 'Today', day: '03', hasEvents: true }, { key: '04', top: 'Nov', day: '04' }, { key: '05', top: 'Nov', day: '05', hasEvents: true }, { key: '06', top: 'Nov', day: '06' }]} />
        <GuideChannel organizer="thao15 nguyen15" avatar={IMG.host} events={EVENTS.slice(0, 2)} onOrganizer={() => toast.show('Open thao15 nguyen15 profile')} onEvent={(e) => toast.show(e.title)} />
        <H t="Ratings" />
        <RatingSummary score={4.96} reviews={379} distribution={[90, 7, 2, 1, 0]} />
        <ReviewCard name="Linh Tran" avatar={IMG.a4} rating={5} date="Nov 02, 2026" text="Amazing atmosphere, crystal clear stream and the host was super engaging." />
        <H t="Empty / loading / dialog" />
        <EmptyState icon="calendar" title="No events scheduled" body="There are no live or upcoming events scheduled. Please check back again soon." action="Browse upcoming" />
        <View style={{ gap: 8 }}><Skeleton width="70%" height={18} /><Skeleton width="100%" height={120} radius={20} /></View>
        <Button title="Open logout dialog" variant="secondary" onPress={() => setDlg(true)} />
      </ScrollView>
      <BottomNav active={tab} onChange={setTab} />
      <ConfirmDialog visible={dlg} onClose={() => setDlg(false)} onConfirm={() => setDlg(false)} title="Log out of Fit4Stream?" message="You can sign back in any time with your email." confirmLabel="Log out" />
    </View>
  );
}

const H = ({ t }: { t: string }) => <Text style={s.h}>{t}</Text>;
const s = StyleSheet.create({
  body: { padding: 16, paddingTop: 56, gap: 14, paddingBottom: 40 },
  headRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  h: { marginTop: 14, fontFamily: fonts.bold, fontSize: 13, letterSpacing: 1, color: colors.textMuted, textTransform: 'uppercase' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center' },
});
