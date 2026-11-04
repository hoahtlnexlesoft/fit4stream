import React from 'react';
import { StyleSheet, Text, View, StyleProp, ViewStyle } from 'react-native';
import { colors, fonts } from '../../theme';

export type BadgeTone = 'live' | 'upcoming' | 'ended' | 'purchased' | 'discount' | 'series' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const TONES: Record<BadgeTone, { bg: string; fg: string }> = {
  live: { bg: colors.live, fg: '#fff' },
  upcoming: { bg: colors.infoSoft, fg: colors.infoText },
  ended: { bg: 'rgba(255,255,255,0.10)', fg: colors.textSecondary },
  purchased: { bg: colors.successSoft, fg: colors.successText },
  discount: { bg: colors.dangerSoft, fg: colors.dangerText },
  series: { bg: colors.purpleSoft, fg: colors.purpleText },
  success: { bg: colors.successSoft, fg: colors.successText },
  warning: { bg: colors.primarySoft, fg: colors.primaryText },
  danger: { bg: colors.dangerSoft, fg: colors.dangerText },
  info: { bg: colors.infoSoft, fg: colors.infoText },
  neutral: { bg: 'rgba(255,255,255,0.08)', fg: colors.text },
};

/** Small status label. `dot` adds a leading dot (pulsing for live is handled by <LiveDot/>). */
export function Badge({ label, tone = 'neutral', dot, style }: { label: string; tone?: BadgeTone; dot?: boolean; style?: StyleProp<ViewStyle> }) {
  const t = TONES[tone];
  return (
    <View style={[s.b, { backgroundColor: t.bg }, style]}>
      {dot && <View style={[s.dot, { backgroundColor: t.fg }]} />}
      <Text style={[s.t, { color: t.fg }]}>{label}</Text>
    </View>
  );
}

/** Role chip used in chat / stage tiles: Host, Organizer, Guest, You. */
export function RoleChip({ role }: { role: 'Host' | 'Organizer' | 'Guest' | 'You' | string }) {
  const map: Record<string, [string, string]> = { Host: [colors.roleHost, colors.onPrimary], Organizer: [colors.roleOrganizer, '#fff'], Guest: [colors.roleGuest, '#08202A'], You: ['#fff', '#14121A'] };
  const [bg, fg] = map[role] ?? ['rgba(0,0,0,0.55)', '#fff'];
  return <View style={[s.role, { backgroundColor: bg }]}><Text style={[s.roleT, { color: fg }]}>{role}</Text></View>;
}

const s = StyleSheet.create({
  b: { flexDirection: 'row', alignItems: 'center', gap: 5, height: 22, paddingHorizontal: 8, borderRadius: 7, alignSelf: 'flex-start' },
  dot: { width: 5, height: 5, borderRadius: 3 },
  t: { fontFamily: fonts.bold, fontSize: 11, letterSpacing: 0.3 },
  role: { height: 16, paddingHorizontal: 6, borderRadius: 5, justifyContent: 'center' },
  roleT: { fontFamily: fonts.bold, fontSize: 9.5, letterSpacing: 0.2 },
});
