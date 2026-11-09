import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Badge, EmptyState, IconButton, SectionHeader } from '@ui';
import { Screen } from '@/components/Screen';
import { EventCard, FeedCard } from '@/components/Events';
import { ListSkeleton } from '@/components/Skeletons';
import { liveEvents } from '@/data';
import { useLoading } from '@/lib/useLoading';
import { useStore } from '@/lib/store';
import { useLayout } from '@/lib/layout';

/** On-air: live posts (feed cards) + the same lives grouped by category. */
export default function OnAir() {
  const router = useRouter();
  const store = useStore();
  const { wide } = useLayout();
  const [loading] = useLoading('onair');
  const lives = liveEvents().filter((e) => e.id === 'xmas');
  const search = <IconButton icon="search" accessibilityLabel="Search" onPress={() => router.push('/search')} />;
  return (
    <Screen tabTitle="On-air" tabBadge={lives.length ? <Badge tone="live" label={`${lives.length} live`} dot /> : undefined} right={search} tabBar>
      {loading ? <ListSkeleton hero /> : !lives.length ? (
        <View style={{ marginTop: 40 }}><EmptyState icon="video" title="Nothing on air right now" body="Live streams will show up here the moment they start." action="See upcoming" onAction={() => router.navigate('/upcoming')} /></View>
      ) : (
        <View style={[s.pad, { gap: 18, marginTop: 6 }, wide && { maxWidth: 640, alignSelf: 'center', width: '100%' }]}>
          {lives.map((e) => (
            <FeedCard key={e.id} event={e} viewers="2.4K" onOpen={() => router.push(`/event/${e.id}`)}
              onComment={() => store.requireAuth('Sign in to join the live chat', () => { store.register(e.id); router.push(`/player/${e.id}?chat=1`); })}
              onProfile={() => router.push(`/organizer/${encodeURIComponent(e.organizer)}`)} onShare={() => {}} />
          ))}
          <SectionHeader title="Concerts and Performances" />
          {lives.map((e) => <EventCard key={e.id} event={e} width="100%" onPress={() => router.push(`/event/${e.id}`)} />)}
        </View>
      )}
    </Screen>
  );
}
const s = StyleSheet.create({ pad: { paddingHorizontal: 16 } });
