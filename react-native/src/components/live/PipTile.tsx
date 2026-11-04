import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { PressableScale } from '../core/PressableScale';
import { colors, fonts } from '../../theme';

/**
 * Small 16:9 picture-in-picture tile (top-right). Tap = swap with the main view.
 * Default: main = event broadcast (sharp, full-bleed), PiP = host camera.
 * Replace <Image> with your video view (e.g. react-native-video / LiveKit VideoView).
 */
export function PipTile({ uri, label, onSwap, width = 108, children }: { uri?: string; label: string; onSwap: () => void; width?: number; children?: React.ReactNode }) {
  return (
    <PressableScale onPress={onSwap} scaleTo={0.95} accessibilityLabel={`Swap to ${label}`} style={[s.tile, { width, height: width * 9 / 16 }]}>
      {children ?? (uri ? <Image source={{ uri }} style={StyleSheet.absoluteFill} resizeMode="cover" /> : null)}
      <View style={s.tag}><View style={s.dot} /><Text style={s.tagT}>{label}</Text></View>
      <View style={s.sw}>
        <Svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><Path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></Svg>
      </View>
    </PressableScale>
  );
}

const s = StyleSheet.create({
  tile: { borderRadius: 14, overflow: 'hidden', backgroundColor: '#222', borderWidth: 1, borderColor: 'rgba(255,255,255,0.28)' },
  tag: { position: 'absolute', left: 6, bottom: 6, flexDirection: 'row', alignItems: 'center', gap: 4, height: 17, paddingHorizontal: 6, borderRadius: 6, backgroundColor: 'rgba(10,9,14,0.6)' },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.live },
  tagT: { fontFamily: fonts.bold, fontSize: 10, color: '#fff' },
  sw: { position: 'absolute', right: 6, top: 6, width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(10,9,14,0.55)', alignItems: 'center', justifyContent: 'center' },
});
