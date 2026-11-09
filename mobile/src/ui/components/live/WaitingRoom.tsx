import React, { useEffect, useRef } from 'react';
import { Animated, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Circle, Defs, LinearGradient as SvgGrad, Stop } from 'react-native-svg';
import { Avatar, AvatarStack } from '../core/Avatar';
import { Button } from '../core/Button';
import { LiveDot } from '../event/LiveDot';
import { colors, fonts } from '../../theme';

const pad = (n: number) => (n < 10 ? '0' : '') + n;

function PulseRing({ delay }: { delay: number }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const a = Animated.loop(Animated.sequence([Animated.delay(delay), Animated.timing(v, { toValue: 1, duration: 3600, useNativeDriver: true }), Animated.timing(v, { toValue: 0, duration: 0, useNativeDriver: true })]));
    a.start(); return () => a.stop();
  }, [delay, v]);
  return <Animated.View style={[s.ring, { opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.7, 0] }), transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [1, 1.7] }) }] }]} />;
}

export type WaitingRoomProps = {
  cover: string; hostAvatar?: string; hostName: string; title: string; startsAt: string;
  /** seconds remaining / total seconds (for the progress ring) */
  remaining: number; total: number;
  waitingCount: number; waitingPeople: { uri?: string; name: string }[];
  reminderOn: boolean; onToggleReminder: () => void; onInvite: () => void;
};

/** Pre-show lobby: Ken-Burns cover, host avatar with countdown ring + pulse, glass MIN:SEC, crowd, Remind / Invite. */
export function WaitingRoom(p: WaitingRoomProps) {
  const R = 92, C = 2 * Math.PI * R, prog = p.total ? p.remaining / p.total : 0;
  const kb = useRef(new Animated.Value(0)).current;
  useEffect(() => { const a = Animated.loop(Animated.sequence([Animated.timing(kb, { toValue: 1, duration: 24000, useNativeDriver: true }), Animated.timing(kb, { toValue: 0, duration: 24000, useNativeDriver: true })])); a.start(); return () => a.stop(); }, [kb]);
  return (
    <View style={s.root}>
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ scale: kb.interpolate({ inputRange: [0, 1], outputRange: [1.04, 1.14] }) }] }]}>
        <ImageBackground source={{ uri: p.cover }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      </Animated.View>
      <LinearGradient colors={['rgba(8,7,12,0.55)', 'rgba(8,7,12,0.62)', 'rgba(8,7,12,0.9)', '#0B0A10']} locations={[0, 0.35, 0.7, 1]} style={StyleSheet.absoluteFill} />
      <View style={s.center}>
        <View style={s.hero}>
          <PulseRing delay={0} /><PulseRing delay={1200} /><PulseRing delay={2400} />
          <Svg width={204} height={204} style={StyleSheet.absoluteFill}>
            <Defs><SvgGrad id="wr" x1="0" y1="0" x2="1" y2="1"><Stop offset="0" stopColor={colors.brandYellow} /><Stop offset="1" stopColor={colors.danger} /></SvgGrad></Defs>
            <Circle cx={102} cy={102} r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={4} />
            <Circle cx={102} cy={102} r={R} fill="none" stroke="url(#wr)" strokeWidth={4} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - prog)} transform="rotate(-90 102 102)" />
          </Svg>
          <View style={s.avWrap}><Avatar uri={p.hostAvatar} name={p.hostName} size={152} /></View>
          <LinearGradient colors={[colors.primary, colors.live]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.tag}><LiveDot /><Text style={s.tagT}>STARTING SOON</Text></LinearGradient>
        </View>
        <View style={s.cd} accessibilityRole="timer" accessibilityLabel={`${Math.floor(p.remaining / 60)} minutes ${p.remaining % 60} seconds`}>
          {[[pad(Math.floor(p.remaining / 60)), 'MIN'], [pad(p.remaining % 60), 'SEC']].map(([v, l], i) => (
            <React.Fragment key={l}>
              {i === 1 && <Text style={s.colon}>:</Text>}
              <BlurView intensity={30} tint="dark" style={s.box}><Text style={s.num}>{v}</Text><Text style={s.unit}>{l}</Text></BlurView>
            </React.Fragment>
          ))}
        </View>
        <Text style={s.title}>{p.title}</Text>
        <Text style={s.sub}>Hosted by <Text style={{ color: '#fff', fontFamily: fonts.semibold }}>{p.hostName}</Text> · starts at {p.startsAt}</Text>
        <View style={s.crowd}><AvatarStack people={p.waitingPeople} /><Text style={s.crowdT}><Text style={{ color: '#fff', fontFamily: fonts.bold }}>{p.waitingCount}</Text> people are waiting</Text></View>
        <View style={s.acts}>
          <Button title={p.reminderOn ? 'Reminder on' : 'Remind me'} icon={p.reminderOn ? 'check' : 'bell'} variant="secondary" size="lg" onPress={p.onToggleReminder} style={{ flex: 1 }} />
          <Button title="Invite friends" icon="share" size="lg" onPress={p.onInvite} style={{ flex: 1 }} />
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bgDeep, overflow: 'hidden' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  hero: { width: 204, height: 204, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', width: 204, height: 204, borderRadius: 102, borderWidth: 1.5, borderColor: 'rgba(244,164,37,0.45)' },
  avWrap: { borderRadius: 90, borderWidth: 6, borderColor: 'rgba(10,9,14,0.55)' },
  tag: { position: 'absolute', bottom: -6, flexDirection: 'row', alignItems: 'center', gap: 7, height: 28, paddingHorizontal: 12, borderRadius: 14 },
  tagT: { fontFamily: fonts.extrabold, fontSize: 11.5, letterSpacing: 1, color: '#fff' },
  cd: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 34 },
  box: { width: 92, paddingTop: 12, paddingBottom: 10, borderRadius: 20, overflow: 'hidden', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.06)' },
  num: { fontFamily: fonts.extrabold, fontSize: 46, lineHeight: 50, letterSpacing: -1, color: '#fff', fontVariant: ['tabular-nums'] },
  unit: { marginTop: 2, fontFamily: fonts.bold, fontSize: 10.5, letterSpacing: 1.5, color: 'rgba(255,255,255,0.5)' },
  colon: { fontFamily: fonts.bold, fontSize: 40, lineHeight: 70, color: 'rgba(255,255,255,0.4)' },
  title: { marginTop: 26, fontFamily: fonts.extrabold, fontSize: 22, lineHeight: 28, letterSpacing: -0.3, color: '#fff', textAlign: 'center' },
  sub: { marginTop: 6, fontFamily: fonts.regular, fontSize: 13.5, color: 'rgba(255,255,255,0.6)', textAlign: 'center' },
  crowd: { marginTop: 18, flexDirection: 'row', alignItems: 'center', gap: 10, height: 38, paddingLeft: 8, paddingRight: 14, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.07)' },
  crowdT: { fontFamily: fonts.regular, fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  acts: { marginTop: 26, flexDirection: 'row', gap: 10, alignSelf: 'stretch' },
});
