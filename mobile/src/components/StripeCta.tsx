import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, Pattern, Rect } from 'react-native-svg';
import { Icon, IconName, PressableScale, colors, fonts } from '@ui';

/**
 * Big detail CTA. `variant`:
 *  - primary  → solid amber
 *  - waiting  → amber with moving diagonal stripes ("Enter waiting room")
 *  - ended    → grey with static stripes ("Event ended")
 */
export function StripeCta({ label, icon, variant = 'primary', onPress }: { label: string; icon: IconName; variant?: 'primary' | 'waiting' | 'ended'; onPress: () => void }) {
  const x = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (variant !== 'waiting') return;
    const a = Animated.loop(Animated.timing(x, { toValue: 1, duration: 1100, easing: Easing.linear, useNativeDriver: true }));
    a.start(); return () => a.stop();
  }, [variant, x]);
  const ended = variant === 'ended';
  const fg = ended ? 'rgba(255,255,255,0.6)' : colors.onPrimary;
  return (
    <PressableScale onPress={onPress} style={[s.btn, { backgroundColor: ended ? 'rgba(255,255,255,0.08)' : colors.primary }]} accessibilityLabel={label}>
      {variant !== 'primary' && (
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { right: -28, transform: [{ translateX: x.interpolate({ inputRange: [0, 1], outputRange: [-28, 0] }) }] }]}>
          <Svg width="100%" height="100%">
            <Defs><Pattern id="st" width={14} height={14} patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><Rect width={7} height={14} fill={ended ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.22)'} /></Pattern></Defs>
            <Rect width="100%" height="100%" fill="url(#st)" />
          </Svg>
        </Animated.View>
      )}
      <View style={s.row}><Icon name={icon} size={18} color={fg} filled={icon === 'play'} /><Text style={[s.t, { color: fg }]} numberOfLines={1}>{label}</Text></View>
    </PressableScale>
  );
}

const s = StyleSheet.create({
  btn: { flex: 1, height: 56, borderRadius: 28, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16 },
  t: { fontFamily: fonts.bold, fontSize: 16 },
});
