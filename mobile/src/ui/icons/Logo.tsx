import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors, fonts } from '../theme';

/** Official Fit4Stream brand mark (from assets/Logos/f4s-mark.svg). */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 618 618">
      <Defs>
        <LinearGradient id="f4a" x1="422.388" y1="72.6262" x2="431.77" y2="415.549" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#782F8D" /><Stop offset="1" stopColor="#392163" />
        </LinearGradient>
        <LinearGradient id="f4b" x1="459.242" y1="14.4246" x2="73.952" y2="371.941" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#33438D" /><Stop offset="1" stopColor="#39CAE0" />
        </LinearGradient>
        <LinearGradient id="f4c" x1="49.9063" y1="148.978" x2="392.559" y2="506.129" gradientUnits="userSpaceOnUse">
          <Stop offset="0.2" stopColor="#E74645" /><Stop offset="1" stopColor="#FACD60" />
        </LinearGradient>
      </Defs>
      <Path fill="#fff" d="M245.823 30.0916L30.7393 244.929C-4.1252 279.753 -4.12519 336.215 30.7393 371.04L245.823 585.877C280.687 620.702 337.214 620.702 372.078 585.877L587.162 371.04C622.026 336.215 622.026 279.753 587.162 244.929L372.078 30.0916C337.214 -4.73292 280.687 -4.73292 245.823 30.0916Z" />
      <Path fill="url(#f4a)" fillRule="evenodd" d="M454.54 106.519L584.292 236.122C623.878 275.663 623.878 340.275 584.292 379.816L380.514 583.361C356.177 607.669 322.373 616.999 290.666 611.414C339.148 594.024 381.912 553.848 413.365 506.373C451.998 448.235 473.793 378.991 468.455 327.644C464.198 286.707 448.44 275.917 413.047 251.736L410.759 250.212L307.187 172.971C295.304 164.847 281.007 156.215 266.266 151.899C257.243 149.233 248.156 148.218 239.324 149.804C279.8 120.355 374.414 94.7768 454.476 106.519H454.54Z" />
      <Path fill="url(#f4b)" fillRule="evenodd" d="M28.8104 240.501L236.655 32.6402C276.242 -6.90091 340.927 -6.90091 380.514 32.6402L454.476 106.582C438.527 103.662 422.133 101.948 405.74 101.377C335.907 98.8383 265.44 116.356 224.392 147.709C220.579 150.629 217.148 153.485 214.161 156.278C213.717 156.595 213.335 156.849 212.891 157.166L213.018 157.357C191.35 178.111 190.333 197.406 188.427 234.535C188.427 234.535 185.885 397.904 189.698 412.692C192.303 422.784 196.624 432.05 203.55 439.095C201.517 438.397 199.483 437.636 197.323 436.747C136.958 409.074 48.7625 320.028 28.6833 240.564L28.8104 240.501Z" />
      <Path fill="url(#f4c)" d="M454.794 332.72C454.476 329.674 453.142 321.486 452.951 320.28C451.236 330.182 446.025 338.94 439.036 346.557C427.916 358.616 421.562 363.312 407.9 370.421L284.057 434.715C246.059 454.454 229.094 463.339 190.905 447.726C143.058 428.178 51.2407 334.561 29.573 240.246C-5.8197 280.041 -4.48533 341.479 33.6397 379.624L235.829 581.582L237.418 583.169C243.454 589.198 250.126 594.276 257.116 598.465C264.931 603.098 281.325 609.508 291.365 611.222C341.944 595.99 377.082 552.577 409.806 503.325C447.804 446.076 460.004 382.861 454.794 332.657V332.72Z" />
    </Svg>
  );
}

/** Mark + "Fit4Stream" wordmark, as used in the Home header. */
export function Logo({ size = 28, showWordmark = true }: { size?: number; showWordmark?: boolean }) {
  return (
    <View style={s.row} accessibilityRole="image" accessibilityLabel="Fit4Stream">
      <LogoMark size={size} />
      {showWordmark && <Text style={[s.word, { fontSize: size * 0.78 }]}>Fit4Stream</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  word: { fontFamily: fonts.bold, color: colors.text, letterSpacing: -0.4 },
});
