import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { colors, radius } from '../../theme';

/** Flat surface card (no border, no shadow) — the default container for grouped content. */
export function Card({ style, padded = true, ...rest }: ViewProps & { padded?: boolean }) {
  return <View {...rest} style={[s.card, padded && s.pad, style]} />;
}

export function Divider({ dashed, style }: { dashed?: boolean; style?: ViewProps['style'] }) {
  return <View style={[{ height: 1, borderTopWidth: 1, borderColor: dashed ? 'rgba(255,255,255,0.14)' : colors.border, borderStyle: dashed ? 'dashed' : 'solid' }, style]} />;
}

const s = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg },
  pad: { padding: 14 },
});
