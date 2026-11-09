import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { BottomSheet, Button, EmptyState, Icon, PressableScale, RatingSummary, ReviewCard, colors, fonts, useToast } from '@ui';
import { Screen } from '@/components/Screen';
import { Chips } from '@/components/Chips';
import { avatar } from '@/data/images';
import { useStore } from '@/lib/store';

const REVIEWS = [
  { n: 'Linh Tran', av: 'r1', r: 5, d: '2 days ago', ev: 'Danang Christmas Market 2026', t: 'Great stream quality and the host kept the chat lively the whole time. Felt like being there in person.', h: 12 },
  { n: 'Minh Pham', av: 'r2', r: 4, d: '1 week ago', ev: 'Acoustic night: Live from the studio', t: 'Loved the setlist. Audio dropped once for a few seconds, otherwise smooth.', h: 5 },
  { n: 'Hana Nguyen', av: 'r3', r: 5, d: '2 weeks ago', ev: 'Welcome to our topic about SEO marketing', t: 'Clear, practical and the Q&A at the end answered exactly what I needed.', h: 9 },
  { n: 'David Le', av: 'r1', r: 3, d: '3 weeks ago', ev: 'For payout batch 5.Nov-1', t: 'Good content but it started 10 minutes late.', h: 1 },
];

/** Rating & Review: summary + distribution · star filter · cards with Helpful · Write a review sheet. TODO(api). */
export default function Reviews() {
  const toast = useToast();
  const store = useStore();
  const [tab, setTab] = useState<'all' | '5' | '4' | 'low'>('all');
  const [helped, setHelped] = useState<Record<string, boolean>>({});
  const [write, setWrite] = useState(false);
  const [rate, setRate] = useState(0);
  const [text, setText] = useState('');
  const list = REVIEWS.filter((r) => tab === 'all' || (tab === '5' && r.r === 5) || (tab === '4' && r.r === 4) || (tab === 'low' && r.r <= 3));
  return (
    <Screen title="Rating & Review" footer={<Button title="Write a review" icon="star" block size="lg" onPress={() => store.requireAuth('Sign in to write a review', () => setWrite(true))} />}>
      <View style={s.pad}><RatingSummary score={4.96} reviews={379} distribution={[341, 28, 7, 2, 1]} /></View>
      <View style={{ marginVertical: 14 }}><Chips items={[['all', 'All'], ['5', '5 ★'], ['4', '4 ★'], ['low', '3 ★ & below']]} value={tab} onChange={setTab} /></View>
      <View style={[s.pad, { gap: 12 }]}>
        {list.length ? list.map((r, i) => {
          const k = r.n + i, on = !!helped[k];
          return (
            <View key={k}>
              <ReviewCard name={r.n} avatar={avatar(r.n)} rating={r.r} date={r.d} text={r.t} />
              <View style={s.foot}>
                <View style={s.ev}><Icon name="ticket" size={13} color={colors.textMuted} /><Text style={s.evT} numberOfLines={1}>{r.ev}</Text></View>
                <PressableScale onPress={() => setHelped((o) => ({ ...o, [k]: !on }))} style={[s.help, on && { backgroundColor: colors.primarySoft }]}><Icon name="thumbsUp" size={14} color={on ? colors.primary : colors.textSecondary} filled={on} /><Text style={[s.helpT, on && { color: colors.primaryText }]}>{r.h + (on ? 1 : 0)}</Text></PressableScale>
              </View>
            </View>
          );
        }) : <EmptyState icon="star" title="No reviews here" body="Try another filter." />}
      </View>
      <BottomSheet visible={write} onClose={() => setWrite(false)} title="How was the event?">
        <View style={s.stars}>{[1, 2, 3, 4, 5].map((n) => <PressableScale key={n} onPress={() => setRate(n)} accessibilityLabel={`${n} stars`}><Icon name="star" size={34} color={n <= rate ? colors.primary : 'rgba(255,255,255,0.25)'} filled={n <= rate} /></PressableScale>)}</View>
        <TextInput value={text} onChangeText={setText} multiline placeholder="Share what you liked or what could be better…" placeholderTextColor={colors.textSubtle} style={s.ta} />
        <Button title="Post review" block size="lg" disabled={!rate} onPress={() => { setWrite(false); toast.show('Thanks! Your review is posted'); }} />
      </BottomSheet>
    </Screen>
  );
}
const s = StyleSheet.create({
  pad: { paddingHorizontal: 16 },
  foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingHorizontal: 4, paddingTop: 8 },
  ev: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 },
  evT: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted },
  help: { flexDirection: 'row', alignItems: 'center', gap: 5, height: 30, paddingHorizontal: 11, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.06)' },
  helpT: { fontFamily: fonts.bold, fontSize: 12.5, color: colors.textSecondary },
  stars: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginVertical: 14 },
  ta: { minHeight: 96, borderRadius: 16, padding: 14, backgroundColor: 'rgba(255,255,255,0.06)', color: '#fff', fontFamily: fonts.regular, fontSize: 15, textAlignVertical: 'top', marginBottom: 14 },
});
