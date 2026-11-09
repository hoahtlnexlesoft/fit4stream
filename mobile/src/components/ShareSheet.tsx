import React, { useState } from 'react';
import { Image, Share, StyleSheet, Text, View } from 'react-native';
import { BottomSheet, Icon, PressableScale, colors, fonts, useToast } from '@ui';
import type { AppEvent } from '@/data';

/**
 * Share event: preview card + copy link + native share sheet (OS lists Messages, Facebook, Zalo… itself).
 * TODO: copy with expo-clipboard (`Clipboard.setStringAsync(url)`) — not installed to keep deps minimal.
 */
export function ShareSheet({ event, visible, onClose }: { event?: AppEvent; visible: boolean; onClose: () => void }) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  if (!event) return null;
  const url = `fit4stream.com/e/${event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
  const copy = () => { setCopied(true); setTimeout(() => { setCopied(false); onClose(); toast.show('Link copied'); }, 650); };
  const native = async () => { onClose(); try { await Share.share({ message: `${event.title} — https://${url}`, url: `https://${url}` }); } catch {} };
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Share event">
      <View style={s.card}>
        <Image source={{ uri: event.image }} style={s.th} />
        <View style={{ flex: 1, minWidth: 0 }}><Text style={s.t} numberOfLines={2}>{event.title}</Text><Text style={s.sub} numberOfLines={1}>{event.status === 'live' ? 'Live now' : event.status === 'ended' ? 'Replay' : 'Upcoming'} · by {event.organizer}</Text></View>
      </View>
      <View style={s.link}>
        <Icon name="external" size={16} color={colors.textMuted} />
        <Text style={s.url} numberOfLines={1}>{url}</Text>
        <PressableScale onPress={copy} style={[s.copy, copied && { backgroundColor: colors.successSoft }]}>{copied && <Icon name="check" size={14} color={colors.successText} />}<Text style={[s.copyT, copied && { color: colors.successText }]}>{copied ? 'Copied' : 'Copy'}</Text></PressableScale>
      </View>
      <PressableScale onPress={native} style={s.more}><Icon name="share" size={18} color="#fff" /><Text style={s.moreT}>Share via…</Text></PressableScale>
    </BottomSheet>
  );
}

const s = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.05)' },
  th: { width: 72, height: 50, borderRadius: 10 },
  t: { fontFamily: fonts.semibold, fontSize: 14, color: '#fff' },
  sub: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted, marginTop: 3 },
  link: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 50, paddingLeft: 14, paddingRight: 6, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.05)', marginTop: 14 },
  url: { flex: 1, fontFamily: fonts.medium, fontSize: 13, color: colors.textSecondary },
  copy: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 38, paddingHorizontal: 16, borderRadius: 19, backgroundColor: colors.primary },
  copyT: { fontFamily: fonts.bold, fontSize: 13, color: colors.onPrimary },
  more: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.08)', marginTop: 12 },
  moreT: { fontFamily: fonts.bold, fontSize: 14.5, color: '#fff' },
});
