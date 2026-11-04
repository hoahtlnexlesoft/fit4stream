import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LiveEnded, WaitingRoom, useToast } from '../../src';
import { IMG } from '../data';

export function WaitingRoomScreen() {
  const [rem, setRem] = useState(299);
  const [rem2, setRemind] = useState(false);
  useEffect(() => { const i = setInterval(() => setRem((r) => (r > 0 ? r - 1 : 299)), 1000); return () => clearInterval(i); }, []);
  return <WaitingRoom cover={IMG.xmas} hostAvatar={IMG.host} hostName="thao15 nguyen15" title="Danang Christmas Market 2026" startsAt="9:43 AM"
    remaining={rem} total={300} waitingCount={318} waitingPeople={[{ name: 'Sandra', uri: IMG.a2 }, { name: 'Nhan', uri: IMG.a1 }, { name: 'Linh', uri: IMG.a4 }, { name: 'Minh', uri: IMG.a3 }]}
    reminderOn={rem2} onToggleReminder={() => setRemind(!rem2)} onInvite={() => {}} />;
}

export function LiveEndedScreen({ onHome }: { onHome?: () => void }) {
  const toast = useToast();
  const [rating, setRating] = useState(0);
  const [notify, setNotify] = useState(false);
  return (
    <View style={{ flex: 1, backgroundColor: '#0B0A10' }}>
      <ImageBackground source={{ uri: IMG.xmas }} style={StyleSheet.absoluteFill} blurRadius={40} />
      <LinearGradient colors={['rgba(8,7,12,0.6)', 'rgba(8,7,12,0.85)', '#0B0A10']} style={StyleSheet.absoluteFill} />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <LiveEnded endedAt="NOV 03, 11:59 AM" title="Danang Christmas Market 2026"
          stats={[{ icon: 'clock', value: '2h 17m', label: 'Duration' }, { icon: 'eye', value: '2.4K', label: 'Watched' }, { icon: 'heart', value: '1.2K', label: 'Likes' }, { icon: 'message', value: '386', label: 'Messages' }]}
          rating={rating} onRate={(n) => { setRating(n); toast.show(`Thanks for rating ${n}★`); }}
          replayNotify={notify} onToggleReplay={() => setNotify(!notify)} onShare={() => {}} onHome={() => onHome?.()} />
      </View>
    </View>
  );
}
