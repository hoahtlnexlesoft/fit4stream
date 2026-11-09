import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, TextField, colors, fonts, useToast } from '@ui';
import { Screen } from '@/components/Screen';
import { ME } from '@/data';

/** Reset password. TODO(api): POST /auth/forgot. */
export default function Forgot() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState(ME.email);
  return (
    <Screen title="Reset password" footer={<Button title="Send reset link" block size="lg" onPress={() => { toast.show('Reset link sent to your email'); router.back(); }} />}>
      <View style={s.body}>
        <Text style={s.p}>Enter the email you signed up with and we’ll send you a link to reset your password.</Text>
        <TextField label="Email" icon="mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      </View>
    </Screen>
  );
}
const s = StyleSheet.create({ body: { paddingHorizontal: 16, gap: 16 }, p: { fontFamily: fonts.regular, fontSize: 14.5, lineHeight: 21, color: colors.textSecondary } });
