import type { useRouter } from 'expo-router';
type Router = ReturnType<typeof useRouter>;
import type { AppEvent } from '@/data';

/** Same rule as the prototype: a live event you already have a ticket for opens the player; everything else opens details. */
export function openEvent(router: Router, e: AppEvent, store: { authed: boolean; registered: Set<string> }) {
  if (e.status === 'live' && store.authed && store.registered.has(e.id)) router.push(`/player/${e.id}`);
  else router.push(`/event/${e.id}`);
}
