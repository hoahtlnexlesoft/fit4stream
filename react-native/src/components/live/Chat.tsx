import React, { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { PressableScale } from '../core/PressableScale';
import { Avatar } from '../core/Avatar';
import { RoleChip } from '../core/Badge';
import { Icon } from '../../icons';
import { colors, fonts } from '../../theme';

export type ChatRole = 'Host' | 'Organizer' | 'Guest';
export type ChatItem =
  | { id: string; kind: 'msg'; name: string; avatar?: string; text: string; role?: ChatRole; me?: boolean }
  | { id: string; kind: 'system'; text: string };

/**
 * One chat line ON TOP OF VIDEO: avatar + dark translucent chip "Name Role text".
 * The dark chip is required for legibility on bright frames — don't remove the background.
 */
export function ChatOverlayLine({ item }: { item: ChatItem }) {
  if (item.kind === 'system') return <View style={o.sys}><View style={o.sysDot} /><Text style={o.sysT}>{item.text}</Text></View>;
  return (
    <View style={o.row}>
      <Avatar uri={item.avatar} name={item.name} size={26} style={{ marginTop: 2 }} />
      <View style={o.chip}>
        <Text style={o.t}>
          <Text style={o.n}>{item.name}</Text>
          {item.role ? <Text>{' '}<View style={o.roleInline}><RoleChip role={item.role} /></View></Text> : null}
          {' '}{item.text}
        </Text>
      </View>
    </View>
  );
}

/** Last N messages over the video, fading toward the top. Tap opens the full chat sheet. */
export function ChatOverlay({ items, max = 4, pinned, onPress }: { items: ChatItem[]; max?: number; pinned?: string; onPress?: () => void }) {
  return (
    <PressableScale onPress={onPress} haptic={false} scaleTo={1} style={o.wrap} accessibilityLabel="Open live chat">
      {pinned ? <PinnedMessage text={pinned} compact /> : null}
      {items.slice(-max).map((it) => <ChatOverlayLine key={it.id} item={it} />)}
    </PressableScale>
  );
}

/** Bubble message for the full chat sheet (Chat tab). */
export function ChatBubble({ item }: { item: ChatItem }) {
  if (item.kind === 'system') return <View style={b.sys}><View style={o.sysDot} /><Text style={b.sysT}>{item.text}</Text></View>;
  return (
    <View style={b.row}>
      <Avatar uri={item.avatar} name={item.name} size={34} ring="subtle" />
      <View style={b.bub}>
        <View style={b.who}><Text style={b.name}>{item.name}</Text>{item.role && <RoleChip role={item.role} />}</View>
        <Text style={b.text}>{item.text}</Text>
      </View>
    </View>
  );
}

/** Pinned host message. */
export function PinnedMessage({ text, by = 'Host', compact }: { text: string; by?: string; compact?: boolean }) {
  const pin = <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><Path d="M15 4l5 5-3 1-4 4 1 4-2 1-4-4-5 5M9 10l5 5" /></Svg>;
  return compact ? (
    <View style={p.compact}><View style={p.ic}>{pin}</View><Text style={p.cT} numberOfLines={1}>{text}</Text></View>
  ) : (
    <View style={p.full}><View style={p.icL}>{pin}</View><View style={{ flex: 1 }}><Text style={p.by}>Pinned by {by}</Text><Text style={p.t}>{text}</Text></View></View>
  );
}

/** Full chat list (inside the Live chat sheet). Auto-scrolls to the newest message. */
export function ChatList({ items, pinned }: { items: ChatItem[]; pinned?: string }) {
  const ref = useRef<FlatList<ChatItem>>(null);
  useEffect(() => { setTimeout(() => ref.current?.scrollToEnd({ animated: true }), 50); }, [items.length]);
  return (
    <FlatList ref={ref} data={items} keyExtractor={(i) => i.id} renderItem={({ item }) => <ChatBubble item={item} />}
      ListHeaderComponent={pinned ? <View style={{ marginBottom: 10 }}><PinnedMessage text={pinned} /></View> : null}
      contentContainerStyle={{ gap: 10, paddingBottom: 8 }} showsVerticalScrollIndicator={false} />
  );
}

/**
 * Bottom composer: [ Say something…  😊 ] [ ♥ ]  → when text is typed, the heart button becomes Send.
 */
export function ChatComposer({ onSend, onHeart, onReactions, placeholder = 'Say something…' }: { onSend: (t: string) => void; onHeart?: () => void; onReactions?: () => void; placeholder?: string }) {
  const [t, setT] = useState('');
  const send = () => { const v = t.trim(); if (!v) return; onSend(v); setT(''); };
  return (
    <View style={c.row}>
      <View style={c.in}>
        <TextInput value={t} onChangeText={setT} placeholder={placeholder} placeholderTextColor="rgba(255,255,255,0.4)" selectionColor={colors.primary}
          style={c.input} returnKeyType="send" onSubmitEditing={send} accessibilityLabel="Chat message" />
        {onReactions && <PressableScale onPress={onReactions} scaleTo={0.9} style={c.emo} accessibilityLabel="Reactions"><Icon name="smile" size={20} color="rgba(255,255,255,0.7)" /></PressableScale>}
      </View>
      {t.trim()
        ? <PressableScale onPress={send} scaleTo={0.9} style={[c.round, { backgroundColor: '#fff' }]} accessibilityLabel="Send"><Icon name="send" size={18} color="#14121A" /></PressableScale>
        : <PressableScale onPress={onHeart} scaleTo={0.85} style={[c.round, { backgroundColor: colors.primary }]} accessibilityLabel="Send a heart"><Icon name="heart" size={20} filled color={colors.onPrimary} /></PressableScale>}
    </View>
  );
}

/** Emoji reaction tray. */
export function ReactionTray({ onPick, emojis = ['👏', '❤️', '😂', '🔥', '🎄', '👍'] }: { onPick: (e: string) => void; emojis?: string[] }) {
  return (
    <View style={c.tray}>
      {emojis.map((e) => <PressableScale key={e} onPress={() => onPick(e)} scaleTo={0.8} style={c.tBtn} accessibilityLabel={`React ${e}`}><Text style={{ fontSize: 24 }}>{e}</Text></PressableScale>)}
    </View>
  );
}

/** Floating hearts / emoji that rise and fade (mount one per tap). */
export function FloatingReaction({ emoji, onDone }: { emoji?: string; onDone: () => void }) {
  const v = useRef(new Animated.Value(0)).current;
  const x = useRef((Math.random() - 0.5) * 30).current;
  useEffect(() => { Animated.timing(v, { toValue: 1, duration: 1600, useNativeDriver: true }).start(onDone); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Animated.View pointerEvents="none" style={{ position: 'absolute', bottom: 0, opacity: v.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] }),
      transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -220] }) }, { translateX: v.interpolate({ inputRange: [0, 1], outputRange: [0, x] }) }, { scale: v.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0.4, 1.15, 0.9] }) }] }}>
      {emoji ? <Text style={{ fontSize: 26 }}>{emoji}</Text> : <Icon name="heart" size={26} filled color={colors.primary} />}
    </Animated.View>
  );
}

const o = StyleSheet.create({
  wrap: { gap: 8 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 9 },
  chip: { flexShrink: 1, paddingVertical: 6, paddingHorizontal: 11, borderRadius: 14, backgroundColor: 'rgba(10,9,14,0.58)' },
  t: { fontFamily: fonts.regular, fontSize: 13.5, lineHeight: 19, color: '#fff' },
  n: { fontFamily: fonts.semibold, color: colors.primaryText },
  roleInline: { transform: [{ translateY: 3 }] },
  sys: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', marginLeft: 35, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10, backgroundColor: 'rgba(10,9,14,0.5)' },
  sysDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.info },
  sysT: { fontFamily: fonts.regular, fontSize: 12, color: 'rgba(255,255,255,0.75)' },
});
const b = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  bub: { flexShrink: 1, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 16, borderTopLeftRadius: 6, backgroundColor: 'rgba(255,255,255,0.06)' },
  who: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  name: { fontFamily: fonts.semibold, fontSize: 13.5, color: colors.primaryText },
  text: { fontFamily: fonts.regular, fontSize: 14.5, lineHeight: 20, color: colors.text },
  sys: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  sysT: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted },
});
const p = StyleSheet.create({
  compact: { flexDirection: 'row', alignItems: 'center', gap: 7, alignSelf: 'flex-start', maxWidth: '100%', paddingVertical: 6, paddingLeft: 6, paddingRight: 10, borderRadius: 12, backgroundColor: 'rgba(244,164,37,0.16)' },
  ic: { width: 20, height: 20, borderRadius: 6, backgroundColor: 'rgba(244,164,37,0.28)', alignItems: 'center', justifyContent: 'center' },
  cT: { flexShrink: 1, fontFamily: fonts.regular, fontSize: 12.5, color: '#fff' },
  full: { flexDirection: 'row', gap: 10, padding: 12, borderRadius: 14, backgroundColor: 'rgba(244,164,37,0.10)' },
  icL: { width: 24, height: 24, borderRadius: 8, backgroundColor: 'rgba(244,164,37,0.2)', alignItems: 'center', justifyContent: 'center' },
  by: { fontFamily: fonts.bold, fontSize: 11.5, color: colors.primary, letterSpacing: 0.2 },
  t: { fontFamily: fonts.regular, fontSize: 13.5, color: colors.text, marginTop: 1 },
});
const c = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  in: { flex: 1, height: 46, flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 6, borderRadius: 23, backgroundColor: 'rgba(255,255,255,0.12)' },
  input: { flex: 1, fontFamily: fonts.regular, fontSize: 15, color: '#fff' },
  emo: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  round: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  tray: { flexDirection: 'row', alignSelf: 'flex-start', gap: 2, padding: 6, borderRadius: 26, backgroundColor: 'rgba(20,18,26,0.92)' },
  tBtn: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
});
