import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View, Pressable } from 'react-native';
import { Icon, IconName } from '../../icons';
import { colors, fonts, radius } from '../../theme';

export type TextFieldProps = TextInputProps & {
  label?: string;
  icon?: IconName;
  error?: string;
  hint?: string;
  /** Renders an eye toggle */
  secure?: boolean;
  right?: React.ReactNode;
};

/** Labeled input: 50px, filled surface, amber focus ring, red ring + message on error. */
export function TextField({ label, icon, error, hint, secure, right, style, onFocus, onBlur, ...rest }: TextFieldProps) {
  const [focus, setFocus] = useState(false);
  const [hidden, setHidden] = useState(!!secure);
  const ring = error ? colors.danger : focus ? colors.primary : 'transparent';
  return (
    <View style={s.wrap}>
      {label && <Text style={s.label}>{label}</Text>}
      <View style={[s.box, { borderColor: ring }]}>
        {icon && <Icon name={icon} size={18} color={colors.textMuted} />}
        <TextInput
          {...rest}
          secureTextEntry={hidden}
          placeholderTextColor={colors.textSubtle}
          selectionColor={colors.primary}
          onFocus={(e) => { setFocus(true); onFocus?.(e); }}
          onBlur={(e) => { setFocus(false); onBlur?.(e); }}
          style={[s.input, style]}
        />
        {secure && <Pressable onPress={() => setHidden(!hidden)} accessibilityLabel={hidden ? 'Show password' : 'Hide password'} hitSlop={10}><Icon name={hidden ? 'eyeOff' : 'eye'} size={18} color={colors.textMuted} /></Pressable>}
        {right}
      </View>
      {error ? <View style={s.msg}><Icon name="x" size={13} color={colors.dangerText} /><Text style={[s.msgT, { color: colors.dangerText }]}>{error}</Text></View>
        : hint ? <Text style={[s.msgT, { color: colors.textSubtle, marginTop: 8 }]}>{hint}</Text> : null}
    </View>
  );
}

/** Pill search input used on Search / Guide. */
export function SearchField(props: TextInputProps) {
  return (
    <View style={[s.box, s.search]}>
      <Icon name="search" size={18} color={colors.textMuted} />
      <TextInput returnKeyType="search" placeholderTextColor={colors.textSubtle} selectionColor={colors.primary} {...props} style={s.input} />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { gap: 6 },
  label: { fontFamily: fonts.semibold, fontSize: 12.5, color: colors.textSecondary },
  box: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 50, paddingHorizontal: 14, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1.5 },
  input: { flex: 1, fontFamily: fonts.regular, fontSize: 15.5, color: colors.text, paddingVertical: 12 },
  search: { borderRadius: radius.full, borderColor: 'transparent', minHeight: 46 },
  msg: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  msgT: { fontFamily: fonts.regular, fontSize: 12.5 },
});
