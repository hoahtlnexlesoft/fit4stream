import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon, IconName } from '../../icons';
import { colors, fonts } from '../../theme';

/** Icon · label ··· value row (event details, receipt meta). */
export function InfoRow({ icon, label, value }: { icon?: IconName; label: string; value: React.ReactNode }) {
  return (
    <View style={s.row}>
      {icon && <View style={s.ic}><Icon name={icon} size={17} color={colors.textSecondary} /></View>}
      <Text style={s.l}>{label}</Text>
      {typeof value === 'string' ? <Text style={s.v} numberOfLines={1}>{value}</Text> : value}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  ic: { width: 34, height: 34, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
  l: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted },
  v: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text, maxWidth: '60%', textAlign: 'right' },
});
