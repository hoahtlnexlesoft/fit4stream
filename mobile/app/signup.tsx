import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, TextField } from '@ui';
import { Screen } from '@/components/Screen';
import { AuthFoot } from '@/components/Auth';
import { useStore } from '@/lib/store';

/** Create account. TODO(api): POST /auth/signup. */
export default function Signup() {
  const router = useRouter();
  const { signIn } = useStore();
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [pw, setPw] = useState('');
  return (
    <Screen title="Create account" close footer={<Button title="Create account" block size="lg" onPress={() => { signIn(); router.dismissAll(); }} />}>
      <View style={s.body}>
        <TextField label="Full name" icon="user" placeholder="Your name" value={name} onChangeText={setName} autoComplete="name" />
        <TextField label="Email" icon="mail" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextField label="Password" icon="lock" placeholder="At least 8 characters" value={pw} onChangeText={setPw} secure autoComplete="new-password" />
        <AuthFoot q="Already have an account?" a="Sign in" onPress={() => router.replace('/login')} />
      </View>
    </Screen>
  );
}
const s = StyleSheet.create({ body: { paddingHorizontal: 16, gap: 16 } });
