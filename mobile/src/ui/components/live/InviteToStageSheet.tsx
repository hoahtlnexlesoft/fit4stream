import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BottomSheet } from '../feedback/BottomSheet';
import { Avatar } from '../core/Avatar';
import { Button } from '../core/Button';
import { MicIcon } from './Stage';
import { colors, fonts } from '../../theme';

/** Host invited the viewer to speak (after raising hand). */
export function InviteToStageSheet({ visible, hostName, hostAvatar, onJoin, onDecline }: { visible: boolean; hostName: string; hostAvatar?: string; onJoin: () => void; onDecline: () => void }) {
  return (
    <BottomSheet visible={visible} onClose={onDecline}>
      <View style={s.wrap}>
        <View style={s.av}><Avatar uri={hostAvatar} name={hostName} size={64} /><View style={s.hand}><Text style={{ fontSize: 15 }}>✋</Text></View></View>
        <Text style={s.h}>{hostName} invited you to speak</Text>
        <Text style={s.p}>Everyone watching will hear you. You can turn your camera on after joining.</Text>
        <View style={s.pre}>
          <View style={s.mic}><MicIcon on size={17} /></View>
          <View><Text style={s.preT}>Microphone on</Text><Text style={s.preS}>Camera off · you can change this anytime</Text></View>
        </View>
        <Button title="Join stage" onPress={onJoin} size="lg" block />
        <Button title="Not now" onPress={onDecline} variant="ghost" size="md" />
      </View>
    </BottomSheet>
  );
}

const s = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 0 },
  av: { marginTop: 8, marginBottom: 14 },
  hand: { position: 'absolute', right: -6, bottom: -4, width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.sheet },
  h: { fontFamily: fonts.bold, fontSize: 19, lineHeight: 25, color: '#fff', textAlign: 'center', marginBottom: 6 },
  p: { fontFamily: fonts.regular, fontSize: 13.5, lineHeight: 19, color: colors.textSecondary, textAlign: 'center', maxWidth: 300, marginBottom: 16 },
  pre: { flexDirection: 'row', alignItems: 'center', gap: 12, alignSelf: 'stretch', padding: 12, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.05)', marginBottom: 16 },
  mic: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  preT: { fontFamily: fonts.semibold, fontSize: 14, color: '#fff' },
  preS: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted },
});
