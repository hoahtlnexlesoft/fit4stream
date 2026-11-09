import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Skeleton as SK, colors } from '@ui';

/** Skeletons mirror the real layout of each screen 1:1 so nothing jumps when data arrives. */
const Row = ({ children, style }: { children: React.ReactNode; style?: object }) => <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 10 }, style]}>{children}</View>;
const Sec = ({ w }: { w: number }) => <Row style={{ justifyContent: 'space-between', marginBottom: 12 }}><SK width={w} height={18} /><SK width={64} height={14} /></Row>;
const Card = ({ w = 216 }: { w?: number }) => <View style={[s.card, { width: w }]}><SK width="100%" height={Math.round(w * 9 / 16)} radius={0} /><View style={{ padding: 12, gap: 8 }}><SK width="82%" height={13} /><SK width="55%" height={10} /></View></View>;

export function HomeSkeleton() {
  const { width } = useWindowDimensions();
  const cw = Math.min(346, width - 84);
  return (
    <View style={s.wrap}>
      <View style={{ alignItems: 'center', marginTop: 6 }}><SK width={cw} height={Math.round(cw * 0.824)} radius={22} /></View>
      <View style={[s.pad, { marginTop: 24 }]}><Sec w={110} />{[0, 1].map((i) => <Row key={i} style={[s.box, { marginTop: i ? 10 : 0 }]}><SK width={92} height={58} radius={14} /><View style={{ flex: 1, gap: 8 }}><SK width="80%" height={13} /><SK width="55%" height={10} /></View><SK width={64} height={34} radius={17} /></Row>)}</View>
      <View style={[s.pad, { marginTop: 24 }]}><Sec w={130} /><Row style={{ gap: 12 }}>{[0, 1, 2, 3, 4].map((i) => <SK key={i} width={70} height={70} radius={35} />)}</Row></View>
      <View style={[s.pad, { marginTop: 24 }]}><Sec w={90} /><Row style={{ gap: 12 }}><Card /><Card /></Row></View>
    </View>
  );
}

export function ListSkeleton({ hero }: { hero?: boolean }) {
  return (
    <View style={[s.wrap, s.pad]}>
      {hero && <SK width="100%" height={330} radius={22} />}
      <View style={{ marginTop: hero ? 22 : 0 }}><Sec w={110} /></View>
      {[0, 1, 2].map((i) => <Row key={i} style={[s.box, { marginTop: 10 }]}><SK width={92} height={64} radius={14} /><View style={{ flex: 1, gap: 8 }}><SK width="85%" height={13} /><SK width="50%" height={10} /></View><SK width={76} height={34} radius={17} /></Row>)}
    </View>
  );
}

export function DetailSkeleton() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SK width="100%" height={300 + insets.top * 0} radius={0} />
      <View style={[s.pad, { alignItems: 'center', gap: 10, marginTop: 14 }]}>
        <SK width="82%" height={24} /><SK width="56%" height={24} /><SK width="68%" height={13} />
        <SK width="100%" height={62} radius={18} style={{ marginTop: 10 }} />
        <Row style={{ width: '100%', marginTop: 8 }}><View style={{ flex: 1 }}><SK width="100%" height={56} radius={28} /></View><SK width={56} height={56} radius={28} /><SK width={56} height={56} radius={28} /></Row>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1 },
  pad: { paddingHorizontal: 16 },
  box: { padding: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.035)' },
  card: { borderRadius: 16, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.035)' },
});
