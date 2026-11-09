import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { BottomNav, TabKey, colors } from '@ui';
import { SideRail } from '@/components/SideRail';
import { useLayout } from '@/lib/layout';

const ROUTE: Record<TabKey, string> = { home: 'index', guide: 'guide', onair: 'onair', upcoming: 'upcoming', account: 'account' };
const KEY: Record<string, TabKey> = { index: 'home', guide: 'guide', onair: 'onair', upcoming: 'upcoming', account: 'account' };

/** 5 tab roots. Phones get the kit's BottomNav; wide screens (tablet / unfolded) get a SideRail. */
export default function TabsLayout() {
  const { wide } = useLayout();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Tabs
        screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}
        tabBar={({ state, navigation }) => {
          const active = KEY[state.routes[state.index].name] ?? 'home';
          const go = (k: TabKey) => navigation.navigate(ROUTE[k]);
          return wide ? <SideRail active={active} onChange={go} /> : <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}><BottomNav active={active} onChange={go} /></View>;
        }}>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="guide" />
        <Tabs.Screen name="onair" />
        <Tabs.Screen name="upcoming" />
        <Tabs.Screen name="account" />
      </Tabs>
    </View>
  );
}
