import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PressableScale } from '../core/PressableScale';
import { Avatar } from '../core/Avatar';
import { Icon } from '../../icons';
import { colors, fonts } from '../../theme';

/**
 * Top-left host + event pill on the live player. Placed at the TOP (not under the chat) so it never reads as a chat line.
 * Avatar shows the amber→red "live" ring while the host is speaking.
 */
export function HostPill({ name, avatar, subtitle, speaking = true, following, onFollow, onPress }: {
  name: string; avatar?: string; subtitle: string; speaking?: boolean; following: boolean; onFollow: () => void; onPress?: () => void;
}) {
  return (
    <View style={s.pill}>
      <PressableScale onPress={onPress} style={s.main} accessibilityLabel={`${name}, host`}>
        <Avatar uri={avatar} name={name} size={33} ring={speaking ? 'live' : 'subtle'} />
        <View style={s.txt}>
          <Text style={s.n} numberOfLines={1}>{name}</Text>
          <Text style={s.sub} numberOfLines={1}>{subtitle}</Text>
        </View>
      </PressableScale>
      <PressableScale onPress={onFollow} scaleTo={0.9} accessibilityLabel={following ? 'Following' : 'Follow'} style={[s.follow, following && s.following]}>
        {following ? <Icon name="check" size={14} /> : <Text style={s.fT}>Follow</Text>}
      </PressableScale>
    </View>
  );
}

const s = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 48, paddingLeft: 5, paddingRight: 6, borderRadius: 24, backgroundColor: 'rgba(12,11,16,0.42)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', flexShrink: 1 },
  main: { flexDirection: 'row', alignItems: 'center', gap: 9, flexShrink: 1 },
  txt: { flexShrink: 1, maxWidth: 170 },
  n: { fontFamily: fonts.bold, fontSize: 13.5, lineHeight: 17, color: '#fff' },
  sub: { fontFamily: fonts.regular, fontSize: 11.5, lineHeight: 15, color: 'rgba(255,255,255,0.6)' },
  follow: { height: 30, paddingHorizontal: 13, borderRadius: 15, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  following: { width: 30, paddingHorizontal: 0, backgroundColor: 'rgba(255,255,255,0.14)' },
  fT: { fontFamily: fonts.bold, fontSize: 12.5, color: colors.onPrimary },
});
