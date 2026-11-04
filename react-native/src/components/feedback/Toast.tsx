import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../../icons';
import { colors, fonts } from '../../theme';

type ToastCtx = { show: (msg: string) => void };
const Ctx = createContext<ToastCtx>({ show: () => {} });
export const useToast = () => useContext(Ctx);

/** Wrap the app once: <ToastProvider>…</ToastProvider>, then `useToast().show('Card added')`. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const [msg, setMsg] = useState('');
  const o = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const show = useCallback((m: string) => {
    setMsg(m);
    if (timer.current) clearTimeout(timer.current);
    Animated.spring(o, { toValue: 1, useNativeDriver: true }).start();
    timer.current = setTimeout(() => Animated.timing(o, { toValue: 0, duration: 200, useNativeDriver: true }).start(), 2200);
  }, [o]);
  return (
    <Ctx.Provider value={{ show }}>
      {children}
      <Animated.View pointerEvents="none" accessibilityLiveRegion="polite"
        style={[s.toast, { top: insets.top + 8, opacity: o, transform: [{ translateY: o.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }]}>
        <Icon name="check" size={16} color={colors.successText} /><Text style={s.t}>{msg}</Text>
      </Animated.View>
    </Ctx.Provider>
  );
}

const s = StyleSheet.create({
  toast: { position: 'absolute', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 8, height: 44, paddingHorizontal: 18, borderRadius: 22, backgroundColor: 'rgba(20,18,26,0.95)' },
  t: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text },
});
