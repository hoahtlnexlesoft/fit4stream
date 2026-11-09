import React from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton, LogoMark, colors, fonts } from '@ui';
import { AuthFoot, LoginForm } from '@/components/Auth';
import { photo } from '@/data/images';
import { useStore } from '@/lib/store';

/** Sign in (modal). Opened directly or by `requireAuth(reason)`; after success the pending action runs. */
export default function Login() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { authReason } = useStore();
  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Image source={{ uri: photo('hero') }} style={s.hero} />
      <LinearGradient colors={['rgba(15,14,20,0.2)', 'rgba(15,14,20,0.85)', colors.bg]} locations={[0, 0.6, 1]} style={s.hero} />
      <ScrollView contentContainerStyle={[s.body, { paddingTop: insets.top + 90, paddingBottom: insets.bottom + 24 }]} keyboardShouldPersistTaps="handled">
        <View style={s.icon}><LogoMark size={52} /></View>
        <Text style={s.h1}>Welcome back</Text>
        <Text style={s.p}>{authReason ?? 'Sign in to see your scheduled events and join live streams.'}</Text>
        <View style={{ marginTop: 24 }}><LoginForm onDone={() => router.back()} /></View>
        <AuthFoot q="Don’t have an account?" a="Sign up" onPress={() => router.replace('/signup')} />
      </ScrollView>
      <View style={[s.back, { top: insets.top + 6 }]}><IconButton icon="chevronLeft" accessibilityLabel="Back" onPress={() => router.back()} /></View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  hero: { position: 'absolute', left: 0, right: 0, top: 0, height: 340 },
  body: { paddingHorizontal: 20 },
  icon: { width: 76, height: 76, borderRadius: 22, backgroundColor: '#1B1921', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
  h1: { marginTop: 18, textAlign: 'center', fontFamily: fonts.extrabold, fontSize: 28, color: '#fff' },
  p: { marginTop: 6, textAlign: 'center', fontFamily: fonts.regular, fontSize: 14.5, lineHeight: 21, color: colors.textSecondary },
  back: { position: 'absolute', left: 12 },
});
