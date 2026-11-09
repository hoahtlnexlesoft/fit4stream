import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon, IconName, colors, fonts } from '@ui';

/** Event details info list (icon · label · value). */
export function InfoList({ children }: { children: React.ReactNode }) {
  return <View style={s.list}>{children}</View>;
}
export function InfoLine({ icon, label, value, last }: { icon: IconName; label: string; value: React.ReactNode; last?: boolean }) {
  return (
    <View style={[s.row, last && { borderBottomWidth: 0 }]}>
      <Icon name={icon} size={17} color={colors.textMuted} />
      <Text style={s.l}>{label}</Text>
      <View style={s.v}>{typeof value === 'string' ? <Text style={s.vt}>{value}</Text> : value}</View>
    </View>
  );
}
/** Formats row: shows 2 + "+N more" when there are more than 3 formats. */
export function FormatLine({ formats }: { formats: string[] }) {
  const [open, setOpen] = useState(false);
  const extra = formats.length - 3;
  const shown = open || extra <= 0 ? formats : formats.slice(0, 2);
  return (
    <InfoLine icon="ticket" label={formats.length > 1 ? 'Formats' : 'Format'} value={
      <View style={{ alignItems: 'flex-end', gap: 4 }}>
        {shown.map((f) => <Text key={f} style={s.vt}>{f}</Text>)}
        {extra > 0 && <Text style={s.more} onPress={() => setOpen(!open)}>{open ? 'Show less' : `+${formats.length - 2} more`}</Text>}
      </View>
    } />
  );
}
/** Text clamped to N lines with More / Less. */
export function ClampText({ text, lines = 4, style }: { text: string; lines?: number; style?: object }) {
  const [more, setMore] = useState(false);
  const [over, setOver] = useState(false);
  return (
    <View>
      <Text style={style} numberOfLines={more ? undefined : lines} onTextLayout={(e) => { if (!more && e.nativeEvent.lines.length >= lines) setOver(true); }}>{text}</Text>
      {(over || text.length > 220) && (
        <Text style={s.clampMore} onPress={() => setMore(!more)}>{more ? 'Less' : 'More'}</Text>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  list: { borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.045)', paddingHorizontal: 14 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.border },
  l: { width: 92, fontFamily: fonts.medium, fontSize: 13.5, color: colors.textMuted },
  v: { flex: 1, alignItems: 'flex-end' },
  vt: { fontFamily: fonts.semibold, fontSize: 13.5, color: '#fff', textAlign: 'right' },
  more: { fontFamily: fonts.bold, fontSize: 12.5, color: colors.primaryText },
  clampMore: { marginTop: 6, fontFamily: fonts.bold, fontSize: 14, color: colors.primaryText },
});
