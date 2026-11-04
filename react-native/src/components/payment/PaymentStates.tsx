import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Modal, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { ConfirmDialog } from '../feedback/ConfirmDialog';
import { PaymentLogo, PaymentBrand } from './PaymentLogo';
import { colors, fonts } from '../../theme';

/** Full-screen processing overlay: spinning amber arc around the payment logo. */
export function ProcessingOverlay({ visible, brand, title, amountLine }: { visible: boolean; brand: PaymentBrand; title: string; amountLine: string }) {
  const r = useRef(new Animated.Value(0)).current;
  useEffect(() => { if (!visible) return; const a = Animated.loop(Animated.timing(r, { toValue: 1, duration: 900, easing: Easing.linear, useNativeDriver: true })); a.start(); return () => a.stop(); }, [visible, r]);
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <BlurView intensity={40} tint="dark" style={s.proc}>
        <View style={s.ring}>
          <Animated.View style={[s.arc, { transform: [{ rotate: r.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }]} />
          <PaymentLogo brand={brand} />
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
    <ConfirmDialog visible={visible} onClose={onClose} onConfirm={onChangeMethod} onCancel={onRetry} title="Payment declined" icon="x" tone="danger" stacked
      message="Your bank declined this charge, so no money was taken. Try again or choose another method." confirmLabel="Use another method" cancelLabel="Try again">
      <View style={s.fail}>
        <PaymentLogo brand={method.brand} />
        <View><Text style={s.fT}>{method.title}</Text><Text style={s.fR}>{reason}</Text></View>
      </View>
    </ConfirmDialog>
  );
}

const s = StyleSheet.create({
  proc: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 40, backgroundColor: 'rgba(10,9,14,0.7)' },
  ring: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginBottom: 18, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 3, borderColor: 'rgba(255,255,255,0.07)' },
  arc: { position: 'absolute', top: -3, left: -3, right: -3, bottom: -3, borderRadius: 48, borderWidth: 3, borderColor: 'transparent', borderTopColor: colors.primary, borderRightColor: colors.primary },
  t: { fontFamily: fonts.bold, fontSize: 18, color: '#fff', textAlign: 'center' },
  a: { fontFamily: fonts.regular, fontSize: 14, color: 'rgba(255,255,255,0.65)' },
  n: { marginTop: 14, fontFamily: fonts.regular, fontSize: 12.5, color: 'rgba(255,255,255,0.4)', textAlign: 'center' },
  fail: { flexDirection: 'row', alignItems: 'center', gap: 12, alignSelf: 'stretch', padding: 12, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.05)', marginTop: -4, marginBottom: 16 },
  fT: { fontFamily: fonts.semibold, fontSize: 14, color: '#fff' },
  fR: { fontFamily: fonts.regular, fontSize: 12, color: colors.dangerText },
});
