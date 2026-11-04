import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ActionRail, BottomSheet, ChatComposer, ChatList, ChatOverlay, FloatingReaction, HandRaisedBanner, HostPill, IconButton,
  InviteToStageSheet, LiveStatusPill, OnStageBar, PipTile, ReactionTray, SegmentedTabs, StageGrid, ViewerPill, useToast, ChatItem,
} from '../../src';
import { CHAT, IMG, SPEAKERS } from '../data';

/**
 * Reference implementation of the live player (portrait, full-bleed).
 * Swap <Image> for your video component (react-native-video / LiveKit / Agora / IVS player).
 */
export function LivePlayerScreen({ onBack }: { onBack?: () => void }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const toast = useToast();
  const [swap, setSwap] = useState(false); // false = event broadcast big, host cam in PiP
  const [grid, setGrid] = useState(false);
  const [muted, setMuted] = useState(false);
  const [following, setFollowing] = useState(false);
  const [liked, setLiked] = useState(false);
  const [hand, setHand] = useState(false);
  const [invite, setInvite] = useState(false);
  const [onStage, setOnStage] = useState(false);
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(false);
  const [tray, setTray] = useState(false);
  const [sheet, setSheet] = useState<null | 'chat' | 'people' | 'about'>(null);
  const [chat, setChat] = useState<ChatItem[]>(CHAT);
  const [reactions, setReactions] = useState<{ id: number; emoji?: string }[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const react = (emoji?: string) => { setTray(false); setReactions((r) => [...r.slice(-10), { id: Date.now() + Math.random(), emoji }]); };
  const raiseHand = () => {
    if (hand) { setHand(false); if (timer.current) clearTimeout(timer.current); return; }
    setHand(true); timer.current = setTimeout(() => setInvite(true), 2800); // demo: host invites after 2.8s
  };
  const speakers = onStage ? [...SPEAKERS, { id: 'me', name: 'You', role: 'You' as const, avatar: IMG.me, cameraOn: cam, micOn: mic }] : SPEAKERS;

  return (
    <View style={s.root}>
      {/* main video */}
      <Image source={{ uri: swap ? IMG.host : IMG.xmas }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      <LinearGradient colors={['rgba(8,7,12,0.72)', 'rgba(8,7,12,0)']} style={[s.scrimT]} pointerEvents="none" />
      <LinearGradient colors={['rgba(8,7,12,0)', 'rgba(8,7,12,0.35)', 'rgba(8,7,12,0.82)', 'rgba(8,7,12,0.96)']} locations={[0, 0.38, 0.68, 1]} style={s.scrimB} pointerEvents="none" />

      {grid && <View style={[s.grid, { top: insets.top + 58 }]}><StageGrid speakers={speakers} height={Math.min(340, width * 0.85)} /></View>}

      {/* top bar */}
      <View style={[s.top, { paddingTop: insets.top + 6 }]}>
        <IconButton icon="chevronLeft" variant="plain" accessibilityLabel="Minimize" onPress={onBack} iconSize={24} />
        <LiveStatusPill elapsed="01:01:05" />
        <ViewerPill count="2.4K" onPress={() => setSheet('people')} />
        <View style={{ flex: 1 }} />
        <IconButton icon={muted ? 'x' : 'volume'} variant="glass" size={38} accessibilityLabel={muted ? 'Unmute' : 'Mute'} onPress={() => setMuted(!muted)} />
        <IconButton icon="grid" variant="glass" size={38} accessibilityLabel="Speakers view" active={grid} onPress={() => setGrid(!grid)} />
        {!onStage && <IconButton icon="hand" variant="glass" size={38} accessibilityLabel={hand ? 'Lower hand' : 'Raise hand'} active={hand} onPress={raiseHand} />}
      </View>

      {!grid && (
        <View style={[s.sub, { top: insets.top + 56 }]}>
          <HostPill name="thao15 nguyen15" avatar={IMG.host} subtitle="Danang Christmas Market 2026" following={following}
            onFollow={() => { setFollowing(!following); if (!following) toast.show('Following thao15 nguyen15'); }} />
          <PipTile uri={swap ? IMG.xmas : IMG.host} label={swap ? 'Live' : 'Host cam'} onSwap={() => setSwap(!swap)} />
        </View>
      )}

      {hand && !invite && <View style={[s.hand, { top: insets.top + 112 }]}><HandRaisedBanner onLower={raiseHand} /></View>}

      {!onStage && (
        <View style={[s.rail, { bottom: insets.bottom + 76 }]}>
          <ActionRail actions={[
            { key: 'like', icon: 'thumbsUp', label: '1.2K', active: liked, onPress: () => { setLiked(!liked); if (!liked) react(); } },
            { key: 'rate', icon: 'star', label: 'Rate', onPress: () => toast.show('Open rating sheet') },
            { key: 'chat', icon: 'message', label: 'Chat', onPress: () => setSheet('chat') },
            { key: 'share', icon: 'share', label: 'Share', onPress: () => toast.show('Open share sheet') },
          ]} />
        </View>
      )}
      <View style={[s.hearts, { bottom: insets.bottom + 330 }]} pointerEvents="none">
        {reactions.map((r) => <FloatingReaction key={r.id} emoji={r.emoji} onDone={() => setReactions((x) => x.filter((y) => y.id !== r.id))} />)}
      </View>

      {/* bottom */}
      <View style={[s.bottom, { paddingBottom: insets.bottom + 10 }]}>
        <View style={{ paddingRight: onStage ? 0 : 64 }}>
          <ChatOverlay items={chat} pinned="Market tour starts at the fountain at 10:00 🎄" onPress={() => setSheet('chat')} max={onStage ? 2 : 4} />
        </View>
        {onStage && <OnStageBar micOn={mic} camOn={cam} onMic={() => setMic(!mic)} onCam={() => setCam(!cam)} onLeave={() => { setOnStage(false); toast.show('You left the stage'); }} />}
        {tray && <ReactionTray onPick={react} />}
        <ChatComposer onHeart={() => react()} onReactions={() => setTray(!tray)}
          onSend={(t) => setChat((c) => [...c, { id: String(Date.now()), kind: 'msg', name: 'You', avatar: IMG.me, text: t, me: true }])} />
      </View>

      <BottomSheet visible={!!sheet} onClose={() => setSheet(null)} heightRatio={0.72}>
        <SegmentedTabs items={[{ key: 'chat', label: 'Chat' }, { key: 'people', label: 'People · 2.4K' }, { key: 'about', label: 'About' }]} value={sheet ?? 'chat'} onChange={(k) => setSheet(k)} />
        <View style={{ flex: 1 }}>{sheet === 'chat' ? <ChatList items={chat} pinned="Market tour starts at the fountain at 10:00 🎄" /> : null}</View>
      </BottomSheet>

      <InviteToStageSheet visible={invite} hostName="thao15 nguyen15" hostAvatar={IMG.host}
        onJoin={() => { setInvite(false); setHand(false); setOnStage(true); setGrid(true); toast.show("You're on stage"); }}
        onDecline={() => { setInvite(false); setHand(false); }} />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0A10' },
  scrimT: { position: 'absolute', left: 0, right: 0, top: 0, height: 190 },
  scrimB: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '62%' },
  top: { position: 'absolute', left: 0, right: 0, top: 0, flexDirection: 'row', alignItems: 'center', gap: 7, paddingLeft: 4, paddingRight: 14 },
  sub: { position: 'absolute', left: 14, right: 14, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  grid: { position: 'absolute', left: 10, right: 10 },
  hand: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  rail: { position: 'absolute', right: 10 },
  hearts: { position: 'absolute', right: 34 },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, gap: 12, paddingHorizontal: 12 },
});
