import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, View, StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton } from '../core/IconButton';
import { colors, fonts } from '../../theme';

export type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  /** Show the X button in the header (default true when title is set) */
  closable?: boolean;
  /** Fixed height as fraction of screen (e.g. 0.72 for the chat sheet). Omit to fit content. */
  heightRatio?: number;
  children: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
};

/**
 * Bottom sheet: dim scrim, 24px top radius, thin 36×4 grab handle, slides up.
 * Covers the tab bar (rendered in a Modal). Used for Share, Invite to stage, Add card, Refund, Rate, Live chat.
 */
export function BottomSheet({ visible, onClose, title, closable, heightRatio, children, contentStyle }: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const y = useRef(new Animated.Value(1)).current;
  useEffect(() => { Animated.spring(y, { toValue: visible ? 0 : 1, useNativeDriver: true, damping: 22, stiffness: 220 }).start(); }, [visible, y]);
  const H = Dimensions.get('window').height;
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={s.scrim} onPress={onClose} accessibilityLabel="Close" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.kav} pointerEvents="box-none">
        <Animated.View style={[s.sheet, { paddingBottom: insets.bottom + 12, height: heightRatio ? H * heightRatio : undefined, transform: [{ translateY: y.interpolate({ inputRange: [0, 1], outputRange: [0, H] }) }] }, contentStyle]}
          accessibilityViewIsModal>
          <View style={s.grab} />
          {(title || closable) && (
            <View style={s.head}>
              <Text style={s.title}>{title}</Text>
              {(closable ?? !!title) && <IconButton icon="x" iconSize={18} size={36} accessibilityLabel="Close" onPress={onClose} />}
            </View>
          )}
          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.scrim },
  kav: { flex: 1, justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.sheet, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingTop: 10, gap: 14 },
  grab: { alignSelf: 'center', width: 36, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.22)', marginBottom: 4 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontFamily: fonts.bold, fontSize: 19, color: colors.text },
});
