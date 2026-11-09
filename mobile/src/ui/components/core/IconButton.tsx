import React from 'react';
import { StyleSheet, Text, View, StyleProp, ViewStyle } from 'react-native';
import { PressableScale } from './PressableScale';
import { Icon, IconName } from '../../icons';
import { colors, fonts, TAP } from '../../theme';

export type IconButtonProps = {
  icon: IconName;
  onPress?: () => void;
  accessibilityLabel: string;
  /** chip = solid #25232C fill (headers), glass = translucent over video, plain = no fill, primary = amber */
  variant?: 'chip' | 'glass' | 'plain' | 'primary';
  size?: number;
  iconSize?: number;
  active?: boolean;
  /** Small notification dot (e.g. bell) */
  dot?: boolean;
  /** Count badge (e.g. unread chat) */
  count?: number;
  filled?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Round 44px icon button. Borderless by design (no stroke, no shadow).
 * NOTE: do not put BlurView behind these on iOS — it causes a seam line during transitions; the solid chip fill is intentional.
 */
export function IconButton({ icon, onPress, accessibilityLabel, variant = 'chip', size = TAP, iconSize = 18, active, dot, count, filled, style }: IconButtonProps) {
  const bg = active ? colors.primary : variant === 'chip' ? '#25232C' : variant === 'glass' ? colors.glass : variant === 'primary' ? colors.primary : 'transparent';
  const fg = active || variant === 'primary' ? colors.onPrimary : colors.text;
  return (
    <PressableScale onPress={onPress} scaleTo={0.88} accessibilityLabel={accessibilityLabel} accessibilityState={{ selected: !!active }}
      hitSlop={size < TAP ? (TAP - size) / 2 : 0}
      style={[s.btn, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg }, style]}>
      <Icon name={icon} size={iconSize} color={fg} filled={filled} />
      {dot && <View style={s.dot} />}
      {count != null && count > 0 && <View style={s.count}><Text style={s.countT}>{count > 99 ? '99+' : count}</Text></View>}
    </PressableScale>
  );
}

const s = StyleSheet.create({
  btn: { alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', top: 9, right: 10, width: 9, height: 9, borderRadius: 5, backgroundColor: colors.danger, borderWidth: 2, borderColor: '#25232C' },
  count: { position: 'absolute', top: -2, right: -2, minWidth: 18, height: 18, paddingHorizontal: 4, borderRadius: 9, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  countT: { fontFamily: fonts.bold, fontSize: 10.5, color: colors.onPrimary },
});
