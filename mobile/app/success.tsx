import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Badge, Button, Icon, colors, fonts } from '@ui';
import { getEvent, shortDate, startTime } from '@/data';

const CONFETTI = [colors.primary, colors.brandCyan, colors.brandCoral, colors.brandYellow, colors.purpleText];

/** Registration success: confetti · emblem · mini ticket · "Join live now" / "Maybe later". */
export default function Success() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const e = getEvent(id ?? 'xmas');
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const fall = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    Animated.timing(fall, { toValue: 1, duration: 2400, useNativeDriver: true }).start();
  }, [fall]);
  return (
    <View style={[s.root, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 16 }]}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {Array.from({ length: 26 }, (_, i) => (
          <Animated.View key={i} style={{
            position: 'absolute', left: ((i * 37) % 100) / 100 * width, top: -20, width: i % 3 ? 8 : 6, height: i % 3 ? 8 : 14, borderRadius: i % 4 ? 2 : 8, backgroundColor: CONFETTI[i % 5],
            opacity: fall.interpolate({ inputRange: [0, 0.8, 1], outputRange: [1, 1, 0] }),
            transform: [{ translateY: fall.interpolate({ inputRange: [0, 1], outputRange: [0, height * (0.5 + (i % 7) * 0.06)] }) }, { rotate: fall.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${(i % 2 ? 1 : -1) * 540}deg`] }) }],
          }} />
        ))}
      </View>
      <View style={s.emb}><View style={s.embIn}><Icon name="ticket" size={64} color={colors.primary} /></View><View style={s.ok}><Icon name="check" size={22} color="#08130C" /></View></View>
      <Text style={s.h1}>Registration successful!</Text>
      <Text style={s.p}>A confirmation email with your event access details has been sent to your inbox. If you don't receive it shortly, please check your spam or junk folder.</Text>
      <View style={s.ticket}>
        <Image source={{ uri: e.image }} style={s.th} />
        <View style={{ flex: 1, minWidth: 0 }}><Text style={s.tt} numberOfLines={1}>{e.title}</Text><Text style={s.ts}>{e.status === 'live' ? 'Live now' : 'Upcoming'} · {shortDate(e)} · {startTime(e)}</Text></View>
        <Badge tone="purchased" label="Purchased" />
      </View>
      <View style={{ flex: 1 }} />
      <View style={s.acts}>
        <Button title={e.status === 'live' ? 'Join live now' : 'View event'} variant={e.status === 'live' ? 'live' : 'primary'} size="lg" block onPress={() => router.replace(e.status === 'live' ? `/player/${e.id}` : `/event/${e.id}`)} />
        <Text style={s.later} onPress={() => router.back()}>Maybe later</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, alignItems: 'center' },
  emb: { width: 200, height: 200, borderRadius: 48, backgroundColor: '#392163', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  embIn: { width: 130, height: 130, borderRadius: 34, backgroundColor: 'rgba(15,14,20,0.5)', alignItems: 'center', justifyContent: 'center' },
  ok: { position: 'absolute', right: 14, top: 14, width: 40, height: 40, borderRadius: 20, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' },
  h1: { marginTop: 36, marginHorizontal: 24, textAlign: 'center', fontFamily: fonts.extrabold, fontSize: 26, color: '#fff' },
  p: { marginTop: 12, marginHorizontal: 32, textAlign: 'center', fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.textSecondary },
  ticket: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 24, marginHorizontal: 16, alignSelf: 'stretch', padding: 10, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.05)' },
  th: { width: 64, height: 44, borderRadius: 10 },
  tt: { fontFamily: fonts.bold, fontSize: 14, color: '#fff' },
  ts: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  acts: { alignSelf: 'stretch', paddingHorizontal: 16, gap: 12, maxWidth: 520, width: '100%' },
  later: { textAlign: 'center', paddingVertical: 10, fontFamily: fonts.semibold, fontSize: 14.5, color: colors.textSecondary },
});
