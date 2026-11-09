import React from 'react';
import { Text as RNText, TextProps, TextStyle } from 'react-native';
import { type as T, colors } from '../../theme';

type Variant = keyof typeof T;
export type AppTextProps = TextProps & { variant?: Variant; color?: string; align?: TextStyle['textAlign'] };

/** Typography wrapper — always use this instead of raw <Text> so fonts stay consistent. */
export function Text({ variant = 'body', color, align, style, ...rest }: AppTextProps) {
  return <RNText {...rest} style={[T[variant], { color: color ?? colors.text, textAlign: align }, style]} />;
}
