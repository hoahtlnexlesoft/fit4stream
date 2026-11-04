import React, { useRef } from 'react';
import { Animated, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { motion } from '../../theme';

const APressable = Animated.createAnimatedComponent(Pressable);

export type PressableScaleProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  /** Scale while pressed. Default 0.97 (0.88 for small icon buttons). */
  scaleTo?: number;
  /** Light haptic tick on press. */
  haptic?: boolean;
  children?: React.ReactNode;
};

/** Base tappable: spring scale on press + optional haptic. Every button in the kit builds on this. Layout styles (flex, width…) apply directly. */
export function PressableScale({ style, scaleTo = motion.pressScale, haptic = true, onPressIn, onPressOut, onPress, children, ...rest }: PressableScaleProps) {
  const v = useRef(new Animated.Value(1)).current;
  const to = (n: number) => Animated.spring(v, { toValue: n, useNativeDriver: true, speed: 40, bounciness: n === 1 ? 8 : 0 }).start();
  return (
    <APressable
      accessibilityRole="button"
      {...rest}
      onPressIn={(e) => { to(scaleTo); onPressIn?.(e); }}
      onPressOut={(e) => { to(1); onPressOut?.(e); }}
      onPress={(e) => { if (haptic) Haptics.selectionAsync().catch(() => {}); onPress?.(e); }}
      style={[style, { transform: [{ scale: v }] }]}
    >
      {children}
    </APressable>
  );
}
