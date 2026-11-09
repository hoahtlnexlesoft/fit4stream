import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts } from '../../theme';

/** 42×26 toggle (green when on) with optional inline label. */
export function Switch({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label?: string }) {
  const x = useRef(new Animated.Value(value ? 1 : 0)).current;
  useEffect(() => { Animated.timing(x, { toValue: value ? 1 : 0, duration: 200, useNativeDriver: false }).start(); }, [value, x]);
  const bg = x.interpolate({ inputRange: [0, 1], outputRange: ['rgba(255,255,255,0.15)', colors.success] });
  const tx = x.interpolate({ inputRange: [0, 1], outputRange: [3, 19] });
  return (
    <Pressable onPress={() => onChange(!value)} accessibilityRole="switch" accessibilityState={{ checked: value }} accessibilityLabel={label} style={s.row}>
      <Animated.View style={[s.track, { backgroundColor: bg }]}><Animated.View style={[s.knob, { transform: [{ translateX: tx }] }]} /></Animated.View>
      {label && <Text style={s.t}>{label}</Text>}
    </Pressable>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 },
  track: { width: 42, height: 26, borderRadius: 13, justifyContent: 'center' },
  knob: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' },
  t: { fontFamily: fonts.regular, fontSize: 14, color: 'rgba(255,255,255,0.8)' },
});
