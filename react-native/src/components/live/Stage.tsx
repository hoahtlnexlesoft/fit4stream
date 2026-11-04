import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar } from '../core/Avatar';
import { RoleChip } from '../core/Badge';
import { Equalizer } from '../event/LiveDot';
import { PressableScale } from '../core/PressableScale';
import { Icon } from '../../icons';
import { colors, fonts } from '../../theme';

export type Speaker = { id: string; name: string; role: 'Host' | 'Organizer' | 'Guest' | 'You'; avatar?: string; cameraOn: boolean; micOn: boolean; speaking?: boolean };

export const MicIcon = ({ on, size = 12, color = '#fff' }: { on: boolean; size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    {on ? <><Rect x={9} y={3} width={6} height={11} rx={3} /><Path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></>
      : <Path d="M9 9v2a3 3 0 0 0 5.1 2.1M15 9.3V6a3 3 0 0 0-5.7-1.3M5 11a7 7 0 0 0 11.5 5.3M19 11a7 7 0 0 1-.6 2.9M12 18v3M3 3l18 18" />}
  </Svg>
);
export const CamIcon = ({ on, size = 18, color = '#fff' }: { on: boolean; size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Rect x={2.5} y={6.5} width={13} height={11} rx={2.5} /><Path d="M15.5 10.5l6-3.5v10l-6-3.5" />{!on && <Path d="M3 3l18 18" />}
  </Svg>
);

/**
 * One participant tile on stage (portrait). Speaking = amber ring + glow + equalizer. Muted = red mic badge top-left.
 * Camera off = avatar on a dark plum gradient. Replace <Image> with the participant's video track.
 */
export function SpeakerTile({ s: p, style }: { s: Speaker; style?: object }) {
  return (
    <View style={[t.tile, p.speaking && t.speaking, style]}>
      {p.cameraOn && p.avatar ? <Image source={{ uri: p.avatar }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        : <LinearGradient colors={['#2B2537', '#17151D']} style={t.noCam}><Avatar uri={p.avatar} name={p.name} size={64} /></LinearGradient>}
      <LinearGradient colors={['rgba(8,7,12,0)', 'rgba(8,7,12,0.78)']} locations={[0.55, 1]} style={StyleSheet.absoluteFill} pointerEvents="none" />
      {!p.micOn && <View style={t.muted} accessibilityLabel="Muted"><MicIcon on={false} /></View>}
      {p.speaking && <View style={t.eq}><Equalizer height={12} /></View>}
      <View style={t.tag}>
        <Text style={t.name} numberOfLines={1}>{p.name}</Text>
        <RoleChip role={p.role} />
      </View>
    </View>
  );
}

/** Multi-speaker grid: 1 → full, 2 → side by side, 3 → host spans the left column + 2 stacked right, 4 → 2×2. */
export function StageGrid({ speakers, height = 360, gap = 8 }: { speakers: Speaker[]; height?: number; gap?: number }) {
  const n = speakers.length;
  const tile = (sp: Speaker) => <SpeakerTile key={sp.id} s={sp} style={{ flex: 1 }} />;
  if (n <= 2) return <View style={{ height, flexDirection: 'row', gap }}>{speakers.map(tile)}</View>;
  if (n === 3) return (
    <View style={{ height, flexDirection: 'row', gap }}>
      {tile(speakers[0])}
      <View style={{ flex: 1, gap }}>{speakers.slice(1).map(tile)}</View>
    </View>
  );
  return (
    <View style={{ height, gap }}>
      <View style={{ flex: 1, flexDirection: 'row', gap }}>{speakers.slice(0, 2).map(tile)}</View>
      <View style={{ flex: 1, flexDirection: 'row', gap }}>{speakers.slice(2, 4).map(tile)}</View>
    </View>
  );
}

/** Bar shown while the viewer is on stage: status · mic · camera · Leave. */
export function OnStageBar({ micOn, camOn, onMic, onCam, onLeave }: { micOn: boolean; camOn: boolean; onMic: () => void; onCam: () => void; onLeave: () => void }) {
  return (
    <View style={t.bar}>
      <View style={t.st}><View style={t.stDot} /><Text style={t.stT}>You're on stage</Text></View>
      <View style={{ flex: 1 }} />
      <PressableScale onPress={onMic} scaleTo={0.9} accessibilityLabel={micOn ? 'Mute mic' : 'Unmute mic'} style={[t.b, !micOn && t.bOff]}><MicIcon on={micOn} size={17} color={micOn ? '#fff' : colors.dangerText} /></PressableScale>
      <PressableScale onPress={onCam} scaleTo={0.9} accessibilityLabel={camOn ? 'Camera off' : 'Camera on'} style={[t.b, !camOn && t.bOff]}><CamIcon on={camOn} color={camOn ? '#fff' : colors.dangerText} /></PressableScale>
      <PressableScale onPress={onLeave} style={t.leave} accessibilityLabel="Leave stage"><Text style={t.leaveT}>Leave</Text></PressableScale>
    </View>
  );
}

/** Pending raise-hand banner. */
export function HandRaisedBanner({ onLower }: { onLower: () => void }) {
  return (
    <View style={t.hand} accessibilityLiveRegion="polite">
      <Icon name="hand" size={16} color={colors.primaryText} />
      <Text style={t.handT}>Hand raised · waiting for host</Text>
      <PressableScale onPress={onLower} style={t.lower} accessibilityLabel="Lower hand"><Text style={t.lowerT}>Lower</Text></PressableScale>
    </View>
  );
}

const t = StyleSheet.create({
  tile: { borderRadius: 20, overflow: 'hidden', backgroundColor: '#1C1A22' },
  speaking: { borderWidth: 2, borderColor: colors.primary, shadowColor: colors.primary, shadowOpacity: 0.45, shadowRadius: 13, shadowOffset: { width: 0, height: 0 } },
  noCam: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  eq: { position: 'absolute', right: 10, top: 10, padding: 6, borderRadius: 9, backgroundColor: 'rgba(10,9,14,0.5)' },
  muted: { position: 'absolute', left: 10, top: 10, width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(229,72,77,0.92)', alignItems: 'center', justifyContent: 'center' },
  tag: { position: 'absolute', left: 10, right: 10, bottom: 10, gap: 3, alignItems: 'flex-start' },
  name: { maxWidth: '100%', fontFamily: fonts.bold, fontSize: 13, color: '#fff' },
  bar: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingLeft: 14, paddingRight: 8, borderRadius: 18, backgroundColor: 'rgba(20,18,26,0.82)' },
  st: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  stDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  stT: { fontFamily: fonts.semibold, fontSize: 13.5, color: '#fff' },
  b: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  bOff: { backgroundColor: 'rgba(231,70,69,0.18)' },
  leave: { height: 40, paddingHorizontal: 16, borderRadius: 20, backgroundColor: colors.danger, justifyContent: 'center' },
  leaveT: { fontFamily: fonts.bold, fontSize: 13.5, color: '#fff' },
  hand: { flexDirection: 'row', alignItems: 'center', gap: 9, alignSelf: 'center', paddingVertical: 6, paddingLeft: 12, paddingRight: 6, borderRadius: 18, backgroundColor: 'rgba(20,16,10,0.78)', borderWidth: 1, borderColor: 'rgba(244,164,37,0.4)' },
  handT: { fontFamily: fonts.semibold, fontSize: 12.5, color: colors.primaryText },
  lower: { height: 26, paddingHorizontal: 10, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.12)', justifyContent: 'center' },
  lowerT: { fontFamily: fonts.semibold, fontSize: 12, color: '#fff' },
});
