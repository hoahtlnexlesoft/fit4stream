import React, { useEffect, useRef, useState } from 'react';
import { Image, ImageBackground, StyleSheet, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ActionRail, BottomSheet, ChatComposer, ChatItem, ChatList, ChatOverlay, FloatingReaction, HandRaisedBanner, HostPill, IconButton,
  InviteToStageSheet, LiveEnded, LiveStatusPill, OnStageBar, PipTile, ReactionTray, SegmentedTabs, Speaker, StageGrid, ViewerPill, WaitingRoom, colors, useToast,
} from '@ui';
import { ShareSheet } from '@/components/ShareSheet';
import { getEvent, shortDate, startTime } from '@/data';
import { avatar, myAvatar } from '@/data/images';

/**
 * Player. `?state=waiting` → lobby with countdown, `?state=ended` → summary, default → live.
 * TODO(video): replace the main <Image> with your player (react-native-video / LiveKit / Agora / IVS) and feed chat from your socket.
 */
export default function Player() {
  const { id, state, chat: openChat } = useLocalSearchParams<{ id: string; state?: 'waiting' | 'ended'; chat?: string }>();
  const e = getEvent(id);
  const router = useRouter();
  const [mode, setMode] = useState<'live' | 'waiting' | 'ended'>(state ?? (e.status === 'ended' ? 'ended' : 'live'));
  if (mode === 'waiting') return <Waiting id={e.id} onStart={() => setMode('live')} />;
  if (mode === 'ended') return <Ended id={e.id} onHome={() => router.navigate('/')} />;
  return <Live id={e.id} openChat={openChat === '1'} onEnd={() => setMode('ended')} />;
}

function Waiting({ id, onStart }: { id: string; onStart: () => void }) {
  const e = getEvent(id);
  const toast = useToast();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [rem, setRem] = useState(299);
  const [remind, setRemind] = useState(false);
  const [share, setShare] = useState(false);
  useEffect(() => { const i = setInterval(() => setRem((r) => (r > 0 ? r - 1 : 0)), 1000); return () => clearInterval(i); }, []);
  useEffect(() => { if (rem === 0) onStart(); }, [rem, onStart]);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bgDeep }}>
      <WaitingRoom cover={e.image} hostAvatar={avatar(e.organizer)} hostName={e.organizer} title={e.title} startsAt={startTime(e)}
        remaining={rem} total={300} waitingCount={318}
        waitingPeople={[{ name: 'Sandra Smith', uri: avatar('Sandra Smith') }, { name: 'Nhan Doan', uri: avatar('Nhan Doan') }, { name: 'Linh Tran', uri: avatar('Linh Tran') }, { name: 'Minh Pham', uri: avatar('Minh Pham') }]}
        reminderOn={remind} onToggleReminder={() => { setRemind(!remind); if (!remind) toast.show('We’ll ping you when it starts'); }} onInvite={() => setShare(true)} />
      <View style={[s.close, { top: insets.top + 6 }]}><IconButton icon="chevronLeft" variant="glass" accessibilityLabel="Back" onPress={() => router.back()} /></View>
      <ShareSheet event={e} visible={share} onClose={() => setShare(false)} />
    </View>
  );
}

function Ended({ id, onHome }: { id: string; onHome: () => void }) {
  const e = getEvent(id);
  const toast = useToast();
  const [rating, setRating] = useState(0);
  const [notify, setNotify] = useState(false);
  const [share, setShare] = useState(false);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bgDeep }}>
      <ImageBackground source={{ uri: e.image }} style={StyleSheet.absoluteFill} blurRadius={40} />
      <LinearGradient colors={['rgba(8,7,12,0.6)', 'rgba(8,7,12,0.85)', colors.bgDeep]} style={StyleSheet.absoluteFill} />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <LiveEnded endedAt={`${shortDate(e).toUpperCase()}, 11:59 AM`} title={e.title}
          stats={[{ icon: 'clock', value: '2h 17m', label: 'Duration' }, { icon: 'eye', value: '2.4K', label: 'Watched' }, { icon: 'heart', value: '1.2K', label: 'Likes' }, { icon: 'message', value: '386', label: 'Messages' }]}
          rating={rating} onRate={(n) => { setRating(n); toast.show(`Thanks for rating ${n}★`); }}
          replayNotify={notify} onToggleReplay={() => setNotify(!notify)} onShare={() => setShare(true)} onHome={onHome} />
      </View>
      <ShareSheet event={e} visible={share} onClose={() => setShare(false)} />
    </View>
  );
}

const SEED_CHAT = (host: string): ChatItem[] => [
  { id: '1', kind: 'msg', name: host, avatar: avatar(host), role: 'Host', text: 'Welcome everyone to the market tour!' },
  { id: '2', kind: 'msg', name: 'Nhan Doan', avatar: avatar('Nhan Doan'), role: 'Organizer', text: 'Q&A opens after the tour — raise your hand to join the stage!' },
  { id: '3', kind: 'system', text: 'Sandra Smith joined the stage' },
  { id: '4', kind: 'msg', name: 'Tom Bradley', avatar: avatar('Tom Bradley'), text: 'Greetings from Sydney!' },
  { id: '5', kind: 'msg', name: 'Linh Tran', avatar: avatar('Linh Tran'), text: 'Love the decorations ✨' },
];
const POOL: [string, string][] = [['Hana Nguyen', 'This is so cozy 🎄'], ['Sally', 'The fireplace 😍'], ['Minh Pham', 'Can you show the food stalls?'], ['Marc John', 'Great stream quality'], ['Kee Desmond', 'Where is this exactly?']];

function Live({ id, openChat, onEnd }: { id: string; openChat: boolean; onEnd: () => void }) {
  const e = getEvent(id);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const toast = useToast();
  const hostAv = avatar(e.organizer);
  const [swap, setSwap] = useState(false);
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
  const [share, setShare] = useState(false);
  const [sheet, setSheet] = useState<null | 'chat' | 'people' | 'about'>(openChat ? 'chat' : null);
  const [chat, setChat] = useState<ChatItem[]>(SEED_CHAT(e.organizer));
  const [reactions, setReactions] = useState<{ id: number; emoji?: string }[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  // demo live feed — replace with your chat socket
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const next = () => { t = setTimeout(() => { const [n, txt] = POOL[Math.floor(Math.random() * POOL.length)]; setChat((c) => [...c.slice(-30), { id: String(Date.now()), kind: 'msg', name: n, avatar: avatar(n), text: txt }]); next(); }, 1600 + Math.random() * 2200); };
    next(); return () => { clearTimeout(t); if (timer.current) clearTimeout(timer.current); };
  }, []);
  const react = (emoji?: string) => { setTray(false); setReactions((r) => [...r.slice(-10), { id: Date.now() + Math.random(), emoji }]); };
  const raiseHand = () => {
    if (hand) { setHand(false); if (timer.current) clearTimeout(timer.current); return; }
    setHand(true); timer.current = setTimeout(() => setInvite(true), 2800); // demo: host invites after 2.8s
  };
  const speakers: Speaker[] = [
    { id: 'h', name: e.organizer, role: 'Host', avatar: hostAv, cameraOn: true, micOn: true, speaking: true },
    { id: 'o', name: 'Nhan Doan', role: 'Organizer', avatar: avatar('Nhan Doan'), cameraOn: true, micOn: true },
    { id: 'g', name: 'Sandra Smith', role: 'Guest', avatar: avatar('Sandra Smith'), cameraOn: true, micOn: false },
    ...(onStage ? [{ id: 'me', name: 'You', role: 'You' as const, avatar: myAvatar(), cameraOn: cam, micOn: mic }] : []),
  ];
  const pinned = 'Market tour starts at the fountain at 10:00 🎄';

  return (
    <View style={s.root}>
      <Image source={{ uri: swap ? hostAv ?? e.image : e.image }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      <LinearGradient colors={['rgba(8,7,12,0.72)', 'rgba(8,7,12,0)']} style={s.scrimT} pointerEvents="none" />
      <LinearGradient colors={['rgba(8,7,12,0)', 'rgba(8,7,12,0.35)', 'rgba(8,7,12,0.82)', 'rgba(8,7,12,0.96)']} locations={[0, 0.38, 0.68, 1]} style={s.scrimB} pointerEvents="none" />

      {grid && <View style={[s.grid, { top: insets.top + 58 }]}><StageGrid speakers={speakers} height={Math.min(340, width * 0.85)} /></View>}

      <View style={[s.top, { paddingTop: insets.top + 6 }]}>
        <IconButton icon="chevronLeft" variant="plain" accessibilityLabel="Minimize" onPress={() => router.back()} iconSize={24} />
        <LiveStatusPill elapsed="01:01:05" />
        <ViewerPill count="2.4K" onPress={() => setSheet('people')} />
        <View style={{ flex: 1 }} />
        <IconButton icon={muted ? 'x' : 'volume'} variant="glass" size={38} accessibilityLabel={muted ? 'Unmute' : 'Mute'} onPress={() => setMuted(!muted)} />
        <IconButton icon="grid" variant="glass" size={38} accessibilityLabel="Speakers view" active={grid} onPress={() => setGrid(!grid)} />
        {!onStage && <IconButton icon="hand" variant="glass" size={38} accessibilityLabel={hand ? 'Lower hand' : 'Raise hand'} active={hand} onPress={raiseHand} />}
      </View>

      {!grid && (
        <View style={[s.sub, { top: insets.top + 56 }]}>
          <HostPill name={e.organizer} avatar={hostAv} subtitle={e.title} following={following}
            onFollow={() => { setFollowing(!following); if (!following) toast.show(`Following ${e.organizer}`); }} onPress={() => router.push(`/organizer/${encodeURIComponent(e.organizer)}`)} />
          <PipTile uri={swap ? e.image : hostAv} label={swap ? 'Live' : 'Host cam'} onSwap={() => setSwap(!swap)} />
        </View>
      )}

      {hand && !invite && <View style={[s.hand, { top: insets.top + 112 }]}><HandRaisedBanner onLower={raiseHand} /></View>}

      {!onStage && (
        <View style={[s.rail, { bottom: insets.bottom + 76 }]}>
          <ActionRail actions={[
            { key: 'like', icon: 'thumbsUp', label: '1.2K', active: liked, onPress: () => { setLiked(!liked); if (!liked) react(); } },
            { key: 'rate', icon: 'star', label: 'Rate', onPress: onEnd },
            { key: 'chat', icon: 'message', label: 'Chat', onPress: () => setSheet('chat') },
            { key: 'share', icon: 'share', label: 'Share', onPress: () => setShare(true) },
          ]} />
        </View>
      )}
      <View style={[s.hearts, { bottom: insets.bottom + 330 }]} pointerEvents="none">
        {reactions.map((r) => <FloatingReaction key={r.id} emoji={r.emoji} onDone={() => setReactions((x) => x.filter((y) => y.id !== r.id))} />)}
      </View>

      <View style={[s.bottom, { paddingBottom: insets.bottom + 10 }]}>
        <View style={{ paddingRight: onStage ? 0 : 64 }}><ChatOverlay items={chat} pinned={pinned} onPress={() => setSheet('chat')} max={onStage ? 2 : 4} /></View>
        {onStage && <OnStageBar micOn={mic} camOn={cam} onMic={() => setMic(!mic)} onCam={() => setCam(!cam)} onLeave={() => { setOnStage(false); toast.show('You left the stage'); }} />}
        {tray && <ReactionTray onPick={react} />}
        <ChatComposer onHeart={() => react()} onReactions={() => setTray(!tray)}
          onSend={(t) => setChat((c) => [...c, { id: String(Date.now()), kind: 'msg', name: 'You', avatar: myAvatar(), text: t, me: true }])} />
      </View>

      <BottomSheet visible={!!sheet} onClose={() => setSheet(null)} heightRatio={0.72}>
        <SegmentedTabs items={[{ key: 'chat', label: 'Chat' }, { key: 'people', label: 'People · 2.4K' }, { key: 'about', label: 'About' }]} value={sheet ?? 'chat'} onChange={(k) => setSheet(k)} />
        <View style={{ flex: 1 }}>{sheet === 'chat' ? <ChatList items={chat} pinned={pinned} /> : null}</View>
      </BottomSheet>
      <InviteToStageSheet visible={invite} hostName={e.organizer} hostAvatar={hostAv}
        onJoin={() => { setInvite(false); setHand(false); setOnStage(true); setGrid(true); toast.show("You're on stage"); }}
        onDecline={() => { setInvite(false); setHand(false); }} />
      <ShareSheet event={e} visible={share} onClose={() => setShare(false)} />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bgDeep },
  close: { position: 'absolute', left: 12 },
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
