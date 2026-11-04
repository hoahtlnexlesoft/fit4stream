import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon, IconName } from '../../icons';
import { Button } from '../core/Button';
import { colors, fonts } from '../../theme';

export type ConfirmDialogProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  /** Secondary button action (defaults to onClose) */
  onCancel?: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  icon?: IconName;
  /** danger = red confirm (Delete account, Payment declined) */
  tone?: 'default' | 'danger';
  /** Stack buttons vertically with confirm first (used by Payment declined) */
  stacked?: boolean;
  children?: React.ReactNode;
};

/** Centered alert dialog (Log out, Delete account, Payment declined). Never a bottom sheet for destructive confirms. */
export function ConfirmDialog({ visible, onClose, onConfirm, onCancel, title, message, confirmLabel, cancelLabel = 'Cancel', icon = 'logOut', tone = 'default', stacked, children }: ConfirmDialogProps) {
  const danger = tone === 'danger';
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={s.scrim} onPress={onClose}>
        <Pressable style={s.card} accessibilityRole="alert">
          <View style={[s.ic, danger && { backgroundColor: colors.dangerSoft }]}><Icon name={icon} size={33} color={danger ? colors.dangerText : colors.primary} /></View>
          <Text style={s.title}>{title}</Text>
          <Text style={s.msg}>{message}</Text>
          {children}
          <View style={stacked ? s.col : s.row}>
            {stacked ? <>
              <Button title={confirmLabel} onPress={onConfirm} block />
              <Button title={cancelLabel} onPress={onCancel ?? onClose} variant="secondary" block />
            </> : <>
              <Button title={cancelLabel} onPress={onCancel ?? onClose} variant="secondary" style={{ flex: 1 }} />
              <Button title={confirmLabel} onPress={onConfirm} variant={danger ? 'danger' : 'primary'} style={{ flex: 1 }} />
            </>}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: colors.scrim, alignItems: 'center', justifyContent: 'center', padding: 28 },
  card: { width: '100%', maxWidth: 340, alignItems: 'center', padding: 22, borderRadius: 24, backgroundColor: colors.surfaceSolid },
  ic: { width: 68, height: 68, borderRadius: 34, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.text, textAlign: 'center' },
  msg: { marginTop: 8, marginBottom: 18, fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.textSecondary, textAlign: 'center' },
  row: { flexDirection: 'row', gap: 10, alignSelf: 'stretch' },
  col: { gap: 8, alignSelf: 'stretch' },
});
