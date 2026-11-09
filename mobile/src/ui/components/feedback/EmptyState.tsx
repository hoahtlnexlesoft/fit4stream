import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon, IconName } from '../../icons';
import { Button } from '../core/Button';
import { colors, fonts } from '../../theme';

/** Empty state: squircle glyph art + title + body + optional action. */
export function EmptyState({ icon = 'calendar', title, body, action, onAction }: { icon?: IconName; title: string; body?: string; action?: string; onAction?: () => void }) {
  return (
    <View style={s.wrap}>
      <LinearGradient colors={['rgba(165,122,216,0.30)', 'rgba(165,122,216,0.08)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.art}>
        <View style={s.inner}><Icon name={icon} size={34} color="#EAD9FF" /></View>
      </LinearGradient>
      <Text style={s.title}>{title}</Text>
      {body && <Text style={s.body}>{body}</Text>}
      {action && <Button title={action} onPress={onAction} variant="secondary" size="md" style={{ marginTop: 18 }} />}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 32 },
  art: { width: 112, height: 112, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  inner: { width: 72, height: 72, borderRadius: 24, backgroundColor: 'rgba(15,14,20,0.55)', alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.text, textAlign: 'center' },
  body: { marginTop: 8, fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.textSecondary, textAlign: 'center' },
});
