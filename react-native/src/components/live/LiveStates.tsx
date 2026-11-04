import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { Button } from '../core/Button';
import { PressableScale } from '../core/PressableScale';
import { Icon, IconName } from '../../icons';
import { colors, fonts } from '../../theme';

/** Shown over the player when the stream drops; auto-hide when the connection recovers. */
export function ReconnectingOverlay() {
  return (
    <View style={s.rc} accessibilityLiveRegion="assertive">
      <ActivityIndicator color="#fff" />
      <Text style={s.rcT}>Reconnecting…</Text>
      <Text style={s.rcS}>Your connection is weak</Text>
    </View>
  );
}

export type LiveEndedProps = {
  endedAt: string; title: string;
  stats: { icon: IconName; value: string; label: string }[];
  rating: number; onRate: (n: number) => void;
  replayNotify: boolean; onToggleReplay: () => void;
  onShare: () => void; onHome: () => void;
};

/** "Live ended" summary: glowing flag badge, 4 stat tiles, inline star rating, replay notify, Share / Back to Home. */
export function LiveEnded(p: LiveEndedProps) {
  const g = useRef(new Animated.Value(0)).current;
  useEffect(() => { const a = Animated.loop(Animated.sequence([Animated.timing(g, { toValue: 1, duration: 1500, useNativeDriver: true }), Animated.timing(g, { toValue: 0, duration: 1500, useNativeDriver: true })])); a.start(); return () => a.stop(); }, [g]);
  return (
    <View style={s.wrap}>
      <View style={s.badge}>
        <Animated.View style={[s.glow, { opacity: g.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }), transform: [{ scale: g.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.1] }) }] }]} />
        <LinearGradient colors={[colors.primary, colors.live]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.ic}>
          <Svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ transform: [{ rotate: '6deg' }] }}><Path d="M4 22V4M4 4h12l-2 4 2 4H4" /></Svg>
        </LinearGradient>
      </View>
      <Text style={s.k}>LIVE ENDED · {p.endedAt}</Text>
      <Text style={s.h}>Thanks for watching!</Text>
      <Text style={s.p}>{p.title}</Text>
      <View style={s.stats}>
        {p.stats.map((x) => (
          <View key={x.label} style={s.st}>
            <View style={s.stIc}><Icon name={x.icon} size={17} color={colors.primaryText} filled={x.icon === 'heart'} /></View>
            <Text style={s.stV}>{x.value}</Text><Text style={s.stL}>{x.label}</Text>
          </View>
        ))}
      </View>
      <View style={s.card}>
        <Text style={s.cardT}>How was the event?</Text>
        <View style={s.stars}>
          {[1, 2, 3, 4, 5].map((n) => (
            <PressableScale key={n} onPress={() => p.onRate(n)} scaleTo={0.85} accessibilityLabel={`${n} stars`} style={s.star}>
              <Icon name="star" size={30} filled color={n <= p.rating ? colors.primary : 'rgba(255,255,255,0.18)'} />
            </PressableScale>
          ))}
        </View>
      </View>
      <View style={[s.card, s.replay]}>
        <View style={s.rpIc}><Icon name="play" size={16} color={colors.purpleText} /></View>
        <View style={{ flex: 1 }}><Text style={s.rpT}>Replay coming soon</Text><Text style={s.rpS}>We'll notify you when it's ready</Text></View>
        <PressableScale onPress={p.onToggleReplay} scaleTo={0.9} accessibilityLabel="Notify me about the replay" style={[s.rpB, p.replayNotify && { backgroundColor: colors.successSoft }]}>
          <Icon name={p.replayNotify ? 'check' : 'bell'} size={15} color={p.replayNotify ? colors.successText : '#fff'} />
        </PressableScale>
      </View>
      <View style={s.acts}>
        <Button title="Share" icon="share" variant="secondary" size="lg" onPress={p.onShare} style={{ flex: 1 }} />
        <Button title="Back to Home" icon="home" size="lg" onPress={p.onHome} style={{ flex: 1 }} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  rc: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: 'rgba(8,8,12,0.62)' },
  rcT: { marginTop: 6, fontFamily: fonts.bold, fontSize: 15, color: '#fff' },
  rcS: { fontFamily: fonts.regular, fontSize: 12.5, color: 'rgba(255,255,255,0.6)' },
  wrap: { alignItems: 'center', paddingHorizontal: 20 },
  badge: { width: 86, height: 86, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  glow: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(244,164,37,0.28)' },
  ic: { width: 86, height: 86, borderRadius: 28, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-6deg' }] },
  k: { fontFamily: fonts.bold, fontSize: 11.5, letterSpacing: 1.1, color: 'rgba(255,255,255,0.55)' },
  h: { marginTop: 6, fontFamily: fonts.extrabold, fontSize: 28, lineHeight: 34, letterSpacing: -0.5, color: '#fff' },
  p: { marginTop: 4, fontFamily: fonts.regular, fontSize: 14, color: 'rgba(255,255,255,0.6)' },
  stats: { marginTop: 20, flexDirection: 'row', gap: 8, alignSelf: 'stretch' },
  st: { flex: 1, alignItems: 'center', gap: 3, paddingTop: 12, paddingBottom: 10, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.07)' },
  stIc: { width: 32, height: 32, borderRadius: 11, backgroundColor: 'rgba(244,164,37,0.16)', alignItems: 'center', justifyContent: 'center', marginBottom: 3 },
  stV: { fontFamily: fonts.extrabold, fontSize: 16, color: '#fff', fontVariant: ['tabular-nums'] },
  stL: { fontFamily: fonts.regular, fontSize: 11, color: 'rgba(255,255,255,0.5)' },
  card: { marginTop: 12, alignSelf: 'stretch', padding: 14, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.07)' },
  cardT: { textAlign: 'center', fontFamily: fonts.semibold, fontSize: 14.5, color: '#fff' },
  stars: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 8 },
  star: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  replay: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rpIc: { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  rpT: { fontFamily: fonts.semibold, fontSize: 14, color: '#fff' },
  rpS: { fontFamily: fonts.regular, fontSize: 12, color: 'rgba(255,255,255,0.55)' },
  rpB: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  acts: { marginTop: 18, flexDirection: 'row', gap: 10, alignSelf: 'stretch' },
});
