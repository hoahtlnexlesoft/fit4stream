import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Icon } from '../../icons';
import { colors, fonts } from '../../theme';

export type PaymentBrand = 'apple' | 'google' | 'visa' | 'mastercard' | 'new';

const AppleA = ({ size = 13, color = '#fff' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}><Path d="M16.37 12.6c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.82-.81-3-.79-1.54.02-2.96.9-3.76 2.27-1.6 2.78-.41 6.9 1.15 9.16.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.77.74 2.98.72 1.23-.02 2.01-1.12 2.76-2.23.87-1.28 1.23-2.51 1.25-2.58-.03-.01-2.39-.92-2.41-3.64zM14.1 5.86c.63-.77 1.06-1.83.94-2.9-.91.04-2.02.61-2.67 1.37-.58.67-1.1 1.76-.96 2.8 1.02.08 2.06-.52 2.69-1.27z" /></Svg>
);
const GoogleG = ({ size = 12 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48">
    <Path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.5z" />
    <Path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <Path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <Path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.5z" />
  </Svg>
);
export { AppleA, GoogleG };

/** 46×32 brand chip for payment methods. */
export function PaymentLogo({ brand, small }: { brand: PaymentBrand; small?: boolean }) {
  const box = [s.box, small && s.small];
  switch (brand) {
    case 'apple': return <View style={[...box, { backgroundColor: '#000', borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.3)' }]}><AppleA size={small ? 10 : 13} /><Text style={[s.pay, { color: '#fff' }, small && s.paySm]}>Pay</Text></View>;
    case 'google': return <View style={[...box, { backgroundColor: '#fff' }]}><GoogleG size={small ? 9 : 12} /><Text style={[s.pay, { color: '#3C4043' }, small && s.paySm]}> Pay</Text></View>;
    case 'mastercard': return <View style={[...box, { backgroundColor: '#24222B' }]}><View style={[s.mc, { backgroundColor: '#EB001B' }]} /><View style={[s.mc, { backgroundColor: '#F79E1B', marginLeft: -6, opacity: 0.9 }]} /></View>;
    case 'new': return <View style={[...box, { backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.18)' }]}><Icon name="plus" size={18} /></View>;
    default: return <View style={[...box, { backgroundColor: '#1A1F71' }]}><Text style={[s.visa, small && { fontSize: 9.5 }]}>VISA</Text></View>;
  }
}

const s = StyleSheet.create({
  box: { width: 46, height: 32, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  small: { width: 34, height: 23, borderRadius: 6 },
  pay: { fontFamily: fonts.semibold, fontSize: 12.5, marginLeft: 1 },
  paySm: { fontSize: 9.5 },
  mc: { width: 15, height: 15, borderRadius: 8 },
  visa: { fontFamily: fonts.extrabold, fontStyle: 'italic', fontSize: 12.5, color: '#fff', letterSpacing: 0.3 },
});
