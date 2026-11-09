import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';
import { PressableScale } from './PressableScale';
import { Icon, IconName } from '../../icons';
import { colors, fonts, radius, shadow } from '../../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'live' | 'danger' | 'wallet';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconRight?: IconName;
  loading?: boolean;
  disabled?: boolean;
  block?: boolean;
  style?: StyleProp<ViewStyle>;
};

const H: Record<ButtonSize, number> = { sm: 36, md: 46, lg: 54 };
const FS: Record<ButtonSize, number> = { sm: 13.5, md: 15, lg: 16 };
const BG: Record<ButtonVariant, string> = { primary: colors.primary, secondary: colors.surfaceStrong, ghost: 'transparent', live: colors.live, danger: colors.danger, wallet: '#000' };
const FG: Record<ButtonVariant, string> = { primary: colors.onPrimary, secondary: colors.text, ghost: colors.textSecondary, live: '#fff', danger: '#fff', wallet: '#fff' };

/** Pill button. `primary` = amber CTA (Join, Pay, Register). `ghost` = text-only "Maybe later". */
export function Button({ title, onPress, variant = 'primary', size = 'md', icon, iconRight, loading, disabled, block, style }: ButtonProps) {
  const fg = FG[variant];
  return (
    <PressableScale onPress={onPress} disabled={disabled || loading} accessibilityLabel={title} accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      style={[s.base, { height: H[size], borderRadius: H[size] / 2, backgroundColor: BG[variant], paddingHorizontal: size === 'sm' ? 14 : 20 },
        variant === 'primary' && shadow.glow, variant === 'wallet' && s.wallet, block && s.block, (disabled && !loading) && s.disabled, style]}>
      {loading ? <ActivityIndicator color={fg} /> : (
        <View style={s.row}>
          {icon && <Icon name={icon} size={size === 'sm' ? 15 : 17} color={fg} />}
          <Text style={[s.label, { color: fg, fontSize: FS[size] }]} numberOfLines={1}>{title}</Text>
          {iconRight && <Icon name={iconRight} size={size === 'sm' ? 15 : 17} color={fg} />}
        </View>
      )}
    </PressableScale>
  );
}

const s = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontFamily: fonts.bold },
  block: { alignSelf: 'stretch' },
  disabled: { opacity: 0.4 },
  wallet: { borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.25)' },
});
