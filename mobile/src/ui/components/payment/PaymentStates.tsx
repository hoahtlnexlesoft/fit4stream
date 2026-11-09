import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Modal, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import Svg, { Circle, Defs, Line, LinearGradient as SvgGrad, Stop } from 'react-native-svg';
import { ConfirmDialog } from '../feedback/ConfirmDialog';
import { PaymentLogo, PaymentBrand } from './PaymentLogo';
import { colors, fonts } from '../../theme';

/** Full-screen processing overlay: spinning amber arc around the payment logo. */
export function ProcessingOverlay({ visible, brand, title, amountLine }: { visible: boolean; brand: PaymentBrand; title: string; amountLine: string }) {
  const r = useRef(new Animated.Value(0)).current;
  useEffect(() => { if (!visible) return; const a = Animated.loop(Animated.timing(r, { toValue: 1, duration: 1100, easing: Easing.linear, useNativeDriver: true })); a.start(); return () => a.stop(); }, [visible, r]);
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <BlurView intensity={40} tint="dark" style={s.proc}>
        <View style={s.ring}>
          {/* static tick track */}
          <Svg width={140} height={140} viewBox="0 0 140 140" style={StyleSheet.absoluteFill}>
            {Array.from({ length: 40 }).map((_, i) => { const a = (i / 40) * Math.PI * 2; return <Line key={i} x1={70 + Math.cos(a) * 60} y1={70 + Math.sin(a) * 60} x2={70 + Math.cos(a) * 66} y2={70 + Math.sin(a) * 66} stroke="rgba(255,255,255,0.12)" strokeWidth={2} strokeLinecap="round" />; })}
          </Svg>
          {/* spinning comet arc (purple → amber), same as the page loader */}
          <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ rotate: r.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }]}>
            <Svg width={140} height={140} viewBox="0 0 140 140">
              <Defs><SvgGrad id="comet" x1="0" y1="1" x2="1" y2="0"><Stop offset="0" stopColor="#A85AD0" stopOpacity="0" /><Stop offset="0.6" stopColor="#A85AD0" stopOpacity="0.9" /><Stop offset="1" stopColor={colors.primary} /></SvgGrad></Defs>
              <Circle cx={70} cy={70} r={54} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={3} />
              <Circle cx={70} cy={70} r={54} fill="none" stroke="url(#comet)" strokeWidth={3} strokeLinecap="round" strokeDasharray={`${Math.PI * 54} ${Math.PI * 54}`} />
            </Svg>
          </Animated.View>
          <View style={s.logo}><PaymentLogo brand={brand} /></View>
        </View>
        <Text style={s.t} accessibilityLiveRegion="polite">{title}</Text>
        <Text style={s.a}>{amountLine}</Text>
        <Text style={s.n}>Please keep the app open. This usually takes a few seconds.</Text>
      </BlurView>
    </Modal>
  );
}

/** Payment declined dialog with the failed method + reason. */
export function PaymentDeclinedDialog({ visible, method, reason, onRetry, onChangeMethod, onClose }: { visible: boolean; method: { brand: PaymentBrand; title: string }; reason: string; onRetry: () => void; onChangeMethod: () => void; onClose: () => void }) {
  return (
    <ConfirmDialog visible={visible} onClose={onClose} onConfirm={onChangeMethod} onCancel={onRetry} title="Payment declined" icon="cardOff" tone="danger" stacked
      message="Your bank declined this charge, so no money was taken. Try again or choose another method." confirmLabel="Use another method" cancelLabel="Try again">
      <View style={s.fail}>
        <PaymentLogo brand={method.brand} />
        <View><Text style={s.fT}>{method.title}</Text><Text style={s.fR}>{reason}</Text></View>
      </View>
    </ConfirmDialog>
  );
}

const s = StyleSheet.create({
  proc: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 40, backgroundColor: 'rgba(12,10,18,0.9)' },
  ring: { width: 140, height: 140, alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  logo: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  t: { fontFamily: fonts.bold, fontSize: 18, color: '#fff', textAlign: 'center' },
  a: { fontFamily: fonts.regular, fontSize: 14, color: 'rgba(255,255,255,0.65)' },
  n: { marginTop: 14, fontFamily: fonts.regular, fontSize: 12.5, color: 'rgba(255,255,255,0.4)', textAlign: 'center' },
  fail: { flexDirection: 'row', alignItems: 'center', gap: 12, alignSelf: 'stretch', padding: 12, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.05)', marginTop: -4, marginBottom: 16 },
  fT: { fontFamily: fonts.semibold, fontSize: 14, color: '#fff' },
  fR: { fontFamily: fonts.regular, fontSize: 12, color: colors.dangerText },
});
