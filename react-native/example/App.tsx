import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans';
import { SegmentedTabs, ToastProvider, colors } from '../src';
import { GalleryScreen } from './screens/GalleryScreen';
import { LivePlayerScreen } from './screens/LivePlayerScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { ReceiptScreen } from './screens/ReceiptScreen';
import { LiveEndedScreen, WaitingRoomScreen } from './screens/LobbyScreens';

type Demo = 'gallery' | 'live' | 'waiting' | 'ended' | 'checkout' | 'receipt';

/** Demo app: switch between the reference screens with the pill bar at the top. */
export default function App() {
  const [loaded] = useFonts({ PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold });
  const [demo, setDemo] = useState<Demo>('gallery');
  if (!loaded) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <StatusBar style="light" />
        <View style={{ flex: 1, backgroundColor: colors.bg }}>
          {demo === 'gallery' && <GalleryScreen />}
          {demo === 'live' && <LivePlayerScreen onBack={() => setDemo('gallery')} />}
          {demo === 'waiting' && <WaitingRoomScreen />}
          {demo === 'ended' && <LiveEndedScreen onHome={() => setDemo('gallery')} />}
          {demo === 'checkout' && <CheckoutScreen onBack={() => setDemo('gallery')} onPaid={() => setDemo('receipt')} />}
          {demo === 'receipt' && <ReceiptScreen onBack={() => setDemo('checkout')} />}
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 96, paddingHorizontal: 12 }} pointerEvents="box-none">
            <SegmentedTabs scroll value={demo} onChange={setDemo} items={[
              { key: 'gallery', label: 'Gallery' }, { key: 'live', label: 'Live' }, { key: 'waiting', label: 'Waiting' }, { key: 'ended', label: 'Ended' }, { key: 'checkout', label: 'Checkout' }, { key: 'receipt', label: 'Receipt' },
            ]} />
          </View>
        </View>
      </ToastProvider>
    </SafeAreaProvider>
  );
}
