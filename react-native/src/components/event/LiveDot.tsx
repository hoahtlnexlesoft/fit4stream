import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../theme';

/** Pulsing dot. */
export function LiveDot({ color = '#fff', size = 6 }: { color?: string; size?: number }) {
  const o = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const a = Animated.loop(Animated.sequence([Animated.timing(o, { toValue: 0.3, duration: 700, useNativeDriver: true }), Animated.timing(o, { toValue: 1, duration: 700, useNativeDriver: true })]));
    a.start(); return () => a.stop();
  }, [o]);
  return <Animated.View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, opacity: o }} />;
}

/** Animated equalizer bars (speaking / live). */
export function Equalizer({ color = colors.primary, height = 12 }: { color?: string; height?: number }) {
  const bars = [useRef(new Animated.Value(0.4)).current, useRef(new Animated.Value(0.8)).current, useRef(new Animated.Value(0.6)).current];
  useEffect(() => {
    const loops = bars.map((b, i) => Animated.loop(Animated.sequence([
      Animated.timing(b, { toValue: 1, duration: 300 + i * 90, useNativeDriver: true }),
      Animated.timing(b, { toValue: 0.3, duration: 300 + i * 90, useNativeDriver: true }),
    ])));
    loops.forEach((l) => l.start()); return () => loops.forEach((l) => l.stop());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 2, height }} accessibilityLabel="Speaking">
      {bars.map((b, i) => <Animated.View key={i} style={{ width: 2.5, height, borderRadius: 2, backgroundColor: color, transform: [{ scaleY: b }] }} />)}
    </View>
  );
}

/** Red "LIVE" pill with equalizer, as on Home cards. */
export function LiveBadge() {
  return (
    <View style={s.pill}><Equalizer color="#fff" height={10} /><Text style={s.t}>LIVE</Text></View>
  );
}

const s = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 26, paddingHorizontal: 10, borderRadius: 8, backgroundColor: colors.live, alignSelf: 'flex-start' },
  t: { fontFamily: fonts.extrabold, fontSize: 12, letterSpacing: 1, color: '#fff' },
});
