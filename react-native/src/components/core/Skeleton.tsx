import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';

/** Shimmer placeholder block used while screens load. */
export function Skeleton({ width, height, radius = 8, style }: { width: number | `${number}%`; height: number; radius?: number; style?: StyleProp<ViewStyle> }) {
  const o = useRef(new Animated.Value(0.45)).current;
  useEffect(() => {
    const a = Animated.loop(Animated.sequence([
      Animated.timing(o, { toValue: 0.9, duration: 700, useNativeDriver: true }),
      Animated.timing(o, { toValue: 0.45, duration: 700, useNativeDriver: true }),
    ]));
    a.start();
    return () => a.stop();
  }, [o]);
  return <Animated.View style={[{ width, height, borderRadius: radius, backgroundColor: 'rgba(255,255,255,0.08)', opacity: o }, style]} />;
}
