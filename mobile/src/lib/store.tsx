import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';

/**
 * Tiny client state for the prototype (auth flag, registrations, saved, follows).
 * Replace with your real auth/session + server state (React Query / Zustand) — screens only use this hook.
 */
type Store = {
  authed: boolean;
  signIn: () => void;
  signOut: () => void;
  /** Runs `then` if signed in, otherwise opens Login and remembers the intent. */
  requireAuth: (reason: string, then?: () => void) => void;
  registered: Set<string>;
  register: (id: string) => void;
  saved: Set<string>;
  toggleSave: (id: string) => boolean;
  following: Set<string>;
  toggleFollow: (name: string) => boolean;
  authReason?: string;
};
const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authed, setAuthed] = useState(true);
  const [authReason, setReason] = useState<string>();
  const [pending, setPending] = useState<(() => void) | undefined>();
  const [registered, setReg] = useState(new Set(['xmas']));
  const [saved, setSaved] = useState(new Set<string>());
  const [following, setFollowing] = useState(new Set<string>());

  const toggle = (set: Set<string>, k: string, put: (s: Set<string>) => void) => { const n = new Set(set); const on = !n.has(k); on ? n.add(k) : n.delete(k); put(n); return on; };

  const signIn = useCallback(() => { setAuthed(true); const p = pending; setPending(undefined); p?.(); }, [pending]);
  const value = useMemo<Store>(() => ({
    authed, authReason, registered, saved, following, signIn,
    signOut: () => setAuthed(false),
    requireAuth: (reason, then) => { if (authed) return then?.(); setReason(reason); setPending(() => then); router.push('/login'); },
    register: (id) => setReg((s) => new Set(s).add(id)),
    toggleSave: (id) => toggle(saved, id, setSaved),
    toggleFollow: (n) => toggle(following, n, setFollowing),
  }), [authed, authReason, registered, saved, following, signIn, router]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => { const s = useContext(Ctx); if (!s) throw new Error('useStore outside StoreProvider'); return s; };
