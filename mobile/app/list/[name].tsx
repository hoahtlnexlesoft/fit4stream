import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { EmptyState, colors, fonts } from '@ui';
import { Screen } from '@/components/Screen';
import { EventCard } from '@/components/Events';
import { CATEGORIES, getEvent } from '@/data';
import { photo } from '@/data/images';
import { useStore } from '@/lib/store';
import { useLayout } from '@/lib/layout';
import { openEvent } from '@/lib/nav';

const CAT_PHOTO: Record<string, string> = { 'Concerts and Performances': 'festival', 'Broadcast Events': 'hero', 'Talk Shows': 'comedy', 'Social and Community': 'festival', 'Product Launches and Demonstrations': 'conference', 'Virtual Conferencing': 'conference', 'Virtual Workshops and Training': 'theater', 'Virtual Networking': 'sports' };

/** Generic "View all" list for a section or category. Categories get a photo header. TODO(api): GET /events?category=… */
export default function List() {
  const { name: raw } = useLocalSearchParams<{ name: string }>();
  const name = decodeURIComponent(raw ?? 'Events');
  const router = useRouter();
  const store = useStore();
  const { wide } = useLayout();
  const all = ['xmas', 'gig', 'seo', 'payout'].map(getEvent);
  const isCat = CATEGORIES.some((c) => c.name === name);
  const list = all.filter((e) => {
    if (name === 'Live now') return e.status === 'live';
    if (['Upcoming', 'This week', 'My scheduled'].includes(name)) return e.status === 'upcoming';
    if (isCat) return e.category === name;
    return e.status !== 'ended';
  });
  return (
    <Screen title={isCat ? '' : name} contentStyle={isCat ? { paddingTop: 0 } : undefined}>
      {isCat && (
        <View style={s.hero}>
          <Image source={{ uri: photo(CAT_PHOTO[name] ?? 'concert') }} style={StyleSheet.absoluteFill} />
          <LinearGradient colors={['rgba(15,14,20,0.4)', 'rgba(15,14,20,0.2)', colors.bg]} style={StyleSheet.absoluteFill} />
          <View style={s.heroT}><Text style={s.h1}>{name}</Text><Text style={s.n}>{list.length} {list.length === 1 ? 'event' : 'events'}</Text></View>
        </View>
      )}
      <View style={[s.pad, s.list, wide && s.grid]}>
        {list.length ? list.map((e) => <View key={e.id} style={wide ? { width: '49%' } : undefined}><EventCard event={e} width="100%" onPress={() => openEvent(router, e, store)} /></View>)
          : <EmptyState icon="video" title="Nothing here yet" body="New events in this category will appear here as soon as they are scheduled." action="Explore other categories" onAction={() => router.push('/categories')} />}
      </View>
    </Screen>
  );
}
const s = StyleSheet.create({
  pad: { paddingHorizontal: 16 },
  list: { gap: 14, marginTop: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  hero: { height: 240, justifyContent: 'flex-end' },
  heroT: { paddingHorizontal: 16, paddingBottom: 4 },
  h1: { fontFamily: fonts.extrabold, fontSize: 28, lineHeight: 34, color: '#fff' },
  n: { fontFamily: fonts.medium, fontSize: 13, color: colors.textSecondary, marginTop: 4 },
});
