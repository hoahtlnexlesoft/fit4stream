import React from 'react';
import { Image, StyleSheet, Text, View, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts } from '../../theme';

const SEEDS = ['#A57AD8', '#39CAE0', '#F4A425', '#E74645', '#39C87C', '#33438D'];

export type AvatarProps = {
  uri?: string;
  name?: string;
  size?: number;
  /** Ring style: none, live (amber→red gradient, e.g. host speaking), subtle (2px dark gap ring) */
  ring?: 'none' | 'live' | 'subtle';
  seed?: number;
  style?: StyleProp<ViewStyle>;
};

export const initials = (n = '') => {
  const w = n.trim().split(/\s+/);
  return ((w[0]?.[0] ?? '') + (w[1]?.[0] ?? w[0]?.[1] ?? '')).toUpperCase();
};

/** Round avatar with initials fallback and optional "live" gradient ring. */
export function Avatar({ uri, name = '', size = 40, ring = 'none', seed = 0, style }: AvatarProps) {
  const inner = (
    <View style={[{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', backgroundColor: SEEDS[seed % SEEDS.length] }, s.center]}>
      {uri ? <Image source={{ uri }} style={{ width: size, height: size }} accessibilityIgnoresInvertColors />
        : <Text style={{ fontFamily: fonts.bold, fontSize: size * 0.38, color: '#fff' }}>{initials(name)}</Text>}
    </View>
  );
  if (ring === 'none') return <View style={style} accessibilityLabel={name}>{inner}</View>;
  const pad = ring === 'live' ? 2.5 : 2;
  return (
    <View style={style} accessibilityLabel={name}>
      {ring === 'live'
        ? <LinearGradient colors={[colors.primary, colors.live]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: pad, borderRadius: size }}>
            <View style={{ padding: 1.5, borderRadius: size, backgroundColor: '#1A1820' }}>{inner}</View>
          </LinearGradient>
        : <View style={{ padding: pad, borderRadius: size, backgroundColor: 'rgba(255,255,255,0.18)' }}>{inner}</View>}
    </View>
  );
}

/** Overlapping avatar stack (e.g. "318 people are waiting"). */
export function AvatarStack({ people, size = 24, max = 4 }: { people: { uri?: string; name: string }[]; size?: number; max?: number }) {
  return (
    <View style={s.stack}>
      {people.slice(0, max).map((p, i) => (
        <View key={p.name + i} style={{ marginLeft: i ? -size * 0.3 : 0, borderRadius: size, borderWidth: 2, borderColor: '#1D1B22' }}>
          <Avatar uri={p.uri} name={p.name} size={size} seed={i} />
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  stack: { flexDirection: 'row', alignItems: 'center' },
});
