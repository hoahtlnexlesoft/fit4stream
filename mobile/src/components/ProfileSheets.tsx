import React, { useEffect, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { BottomSheet, Button, Icon, IconName, PressableScale, colors, fonts } from '@ui';
import { MONTHS } from '@/data';

/* ------------------------------------------------------------------ */
/* Gender — 2×2 tiles, closes itself after picking                      */
/* ------------------------------------------------------------------ */
const GOPT: [string, IconName, string][] = [['Female', 'gender', '#F472B6'], ['Male', 'user', '#5B8CF0'], ['Non-binary', 'users', '#A57AD8'], ['Prefer not to say', 'eyeOff', '#8A9AB0']];
export function GenderSheet({ visible, value, onClose, onPick }: { visible: boolean; value: string; onClose: () => void; onPick: (g: string) => void }) {
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Gender">
      <Text style={s.sub}>How would you like to be identified?</Text>
      <View style={s.grid}>
        {GOPT.map(([g, ic, c]) => {
          const on = value === g;
          return (
            <PressableScale key={g} onPress={() => { onPick(g); setTimeout(onClose, 220); }} accessibilityRole="radio" accessibilityState={{ selected: on }}
              style={[s.tile, on && { borderColor: c, backgroundColor: c + '1F' }]}>
              <View style={[s.gi, { backgroundColor: c + '26' }]}><Icon name={ic} size={22} color={c} /></View>
              <Text style={s.gt}>{g}</Text>
              {on && <View style={[s.ck, { backgroundColor: c }]}><Icon name="check" size={12} color="#fff" /></View>}
            </PressableScale>
          );
        })}
      </View>
    </BottomSheet>
  );
}

/* ------------------------------------------------------------------ */
/* Wheel column (snap list). Native alternative: @react-native-community/datetimepicker */
/* ------------------------------------------------------------------ */
const H = 40;
function Wheel({ items, index, onChange }: { items: (string | number)[]; index: number; onChange: (i: number) => void }) {
  const ref = useRef<ScrollView>(null);
  useEffect(() => { setTimeout(() => ref.current?.scrollTo({ y: index * H, animated: false }), 0); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const end = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const k = Math.max(0, Math.min(items.length - 1, Math.round(e.nativeEvent.contentOffset.y / H)));
    if (k !== index) { Haptics.selectionAsync().catch(() => {}); onChange(k); }
  };
  return (
    <ScrollView ref={ref} style={s.col} showsVerticalScrollIndicator={false} snapToInterval={H} decelerationRate="fast"
      onMomentumScrollEnd={end} onScrollEndDrag={(e) => { if (!e.nativeEvent.velocity || Math.abs(e.nativeEvent.velocity.y) < 0.05) end(e); }}
      contentContainerStyle={{ paddingVertical: H * 2 }}>
      {items.map((x, k) => (
        <PressableScale key={k} haptic={false} onPress={() => { ref.current?.scrollTo({ y: k * H, animated: true }); onChange(k); }} style={s.it}>
          <Text style={[s.itT, k === index && s.itOn]}>{x}</Text>
        </PressableScale>
      ))}
    </ScrollView>
  );
}

/** Birthday: preview + age · month / day / year wheels (13+ only) · Save. Value is ISO `YYYY-MM-DD`. */
export function BirthdaySheet({ visible, value, onClose, onSave }: { visible: boolean; value: string; onClose: () => void; onSave: (iso: string) => void }) {
  const init = value ? new Date(value + 'T00:00') : new Date(1995, 0, 1);
  const yrs: number[] = []; for (let y = new Date().getFullYear() - 13; y >= 1930; y--) yrs.push(y);
  const [m, setM] = useState(init.getMonth());
  const [d, setD] = useState(init.getDate() - 1);
  const [y, setY] = useState(Math.max(0, yrs.indexOf(init.getFullYear())));
  const dim = new Date(yrs[y], m + 1, 0).getDate();
  const dd = Math.min(d, dim - 1);
  const t = new Date(); let age = t.getFullYear() - yrs[y]; if (t.getMonth() < m || (t.getMonth() === m && t.getDate() < dd + 1)) age--;
  const iso = `${yrs[y]}-${String(m + 1).padStart(2, '0')}-${String(dd + 1).padStart(2, '0')}`;
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Birthday">
      <View style={s.prev}><Text style={s.prevB}>{MONTHS[m].slice(0, 3)} {dd + 1}, {yrs[y]}</Text><Text style={s.prevS}>{age} years old</Text></View>
      <View style={s.wheel}>
        <View style={s.band} pointerEvents="none" />
        <Wheel items={MONTHS} index={m} onChange={setM} />
        <Wheel key={'d' + dim} items={Array.from({ length: dim }, (_, i) => i + 1)} index={dd} onChange={setD} />
        <Wheel items={yrs} index={y} onChange={setY} />
      </View>
      <Text style={s.note}>Only used to personalise your experience. Not shown publicly.</Text>
      <Button title="Save birthday" block size="lg" onPress={() => onSave(iso)} />
    </BottomSheet>
  );
}

const s = StyleSheet.create({
  sub: { fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary, marginBottom: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: { width: '48.4%', height: 104, borderRadius: 18, padding: 14, justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1.5, borderColor: 'transparent' },
  gi: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  gt: { fontFamily: fonts.bold, fontSize: 14.5, color: '#fff' },
  ck: { position: 'absolute', top: 12, right: 12, width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  prev: { alignItems: 'center', paddingVertical: 12, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.05)', marginBottom: 12 },
  prevB: { fontFamily: fonts.extrabold, fontSize: 22, color: '#fff' },
  prevS: { fontFamily: fonts.medium, fontSize: 13, color: colors.primaryText, marginTop: 2 },
  wheel: { flexDirection: 'row', height: H * 5 },
  band: { position: 'absolute', left: 0, right: 0, top: H * 2, height: H, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.07)' },
  col: { flex: 1 },
  it: { height: H, alignItems: 'center', justifyContent: 'center' },
  itT: { fontFamily: fonts.medium, fontSize: 16, color: 'rgba(255,255,255,0.35)' },
  itOn: { fontFamily: fonts.bold, fontSize: 18, color: '#fff' },
  note: { textAlign: 'center', fontFamily: fonts.regular, fontSize: 12.5, color: colors.textMuted, marginVertical: 14 },
});
