import React from 'react';
import { ScrollView, ScrollViewProps, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconButton, colors, fonts } from '@ui';
import { useLayout } from '@/lib/layout';

/**
 * Header row for pushed screens: floating round back button · title (text only, strong shadow) · right slot.
 * It floats over the content; content scrolling under it fades out (see <TopFade/>).
 */
export function StackHeader({ title, right, onBack, close }: { title?: string; right?: React.ReactNode; onBack?: () => void; close?: boolean }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  return (
    <View style={[s.header, { paddingTop: insets.top + 6 }]} pointerEvents="box-none">
      <IconButton icon={close ? 'x' : 'chevronLeft'} accessibilityLabel={close ? 'Close' : 'Back'} iconSize={20} onPress={onBack ?? (() => router.back())} />
      <Text style={s.title} numberOfLines={1} accessibilityRole="header">{title}</Text>
      <View style={s.slot}>{right}</View>
    </View>
  );
}

/** Large title header for the 5 tab roots (Guide, On-air, Upcoming, Account). Sticky. */
export function TabHeader({ title, badge, right }: { title: string; badge?: React.ReactNode; right?: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.tabHead, { paddingTop: insets.top + 6 }]} pointerEvents="box-none">
      <View style={s.tabRow}><Text style={s.tabTitle} accessibilityRole="header">{title}</Text>{badge}</View>
      {right}
    </View>
  );
}

/**
 * Soft fade at the top of the screen so content scrolling under the floating header dissolves
 * instead of colliding with the title. Height = status bar + header row.
 */
export function TopFade({ height }: { height?: number }) {
  const insets = useSafeAreaInsets();
  const h = height ?? insets.top + 64;
  return <LinearGradient pointerEvents="none" colors={[colors.bg, 'rgba(15,14,20,0.72)', 'rgba(15,14,20,0)']} locations={[0, 0.6, 1]} style={[s.fade, { height: h }]} />;
}

type ScreenProps = ScrollViewProps & {
  /** Stack screen title (back button is added). */
  title?: string;
  /** Large tab title instead of a stack header. */
  tabTitle?: string;
  tabBadge?: React.ReactNode;
  right?: React.ReactNode;
  close?: boolean;
  /** Sticky footer (e.g. "Save profile", "Pay"). */
  footer?: React.ReactNode;
  /** Extra bottom space for the tab bar. */
  tabBar?: boolean;
  contentStyle?: ViewStyle;
  noScroll?: boolean;
  children: React.ReactNode;
};

/** Standard screen scaffold: bg · header · scroll content · top fade · optional footer. */
export function Screen({ title, tabTitle, tabBadge, right, close, footer, tabBar, contentStyle, noScroll, children, ...rest }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const { sideRail } = useLayout();
  const top = insets.top + (tabTitle ? 70 : 62);
  const bottom = (tabBar && !sideRail ? 96 : 24) + (footer ? 84 : 0) + insets.bottom;
  return (
    <View style={[s.root, { paddingLeft: sideRail }]}>
      {noScroll ? <View style={[{ flex: 1, paddingTop: top }, contentStyle]}>{children}</View> : (
        <ScrollView {...rest} contentContainerStyle={[{ paddingTop: top, paddingBottom: bottom }, contentStyle]} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      )}
      <TopFade height={top} />
      {tabTitle ? <TabHeader title={tabTitle} badge={tabBadge} right={right} /> : <StackHeader title={title} right={right} close={close} />}
      {footer && <View style={[s.footer, { paddingBottom: insets.bottom + 10 }]}>{footer}</View>}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { position: 'absolute', left: 0, right: 0, top: 0, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8 },
  title: {
    flex: 1, textAlign: 'center', fontFamily: fonts.bold, fontSize: 17, color: colors.text,
    textShadowColor: 'rgba(0,0,0,0.8)', textShadowRadius: 10, textShadowOffset: { width: 0, height: 1 },
  },
  slot: { width: 44, alignItems: 'flex-end' },
  tabHead: { position: 'absolute', left: 0, right: 0, top: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 6 },
  tabRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  tabTitle: { fontFamily: fonts.extrabold, fontSize: 28, lineHeight: 34, letterSpacing: -0.6, color: colors.text, textShadowColor: 'rgba(0,0,0,0.6)', textShadowRadius: 12 },
  fade: { position: 'absolute', left: 0, right: 0, top: 0 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 16, paddingTop: 12, backgroundColor: 'rgba(15,14,20,0.94)' },
});
