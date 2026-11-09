import { useCallback, useEffect, useState } from 'react';

const seen = new Set<string>();

/**
 * Demo loading state: shows the screen skeleton on first visit (850ms) and briefly after (300ms).
 * Replace with your query hook (`const { isLoading, refetch } = useQuery(...)`) — skeleton components stay the same.
 * Returns [loading, reload] — reload is wired to pull-to-refresh.
 */
export function useLoading(key: string): [boolean, () => void] {
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => { seen.add(key); setLoading(false); }, seen.has(key) ? 300 : 850);
    return () => clearTimeout(t);
  }, [key, tick]);
  const reload = useCallback(() => { setLoading(true); setTick((n) => n + 1); }, []);
  return [loading, reload];
}
