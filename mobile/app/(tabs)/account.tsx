import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Avatar, ConfirmDialog, Icon, IconButton, IconName, LogoMark, PressableScale, colors, fonts, useToast } from '@ui';
import { Screen } from '@/components/Screen';
import { AuthFoot, LoginForm } from '@/components/Auth';
import { ME } from '@/data';
import { myAvatar } from '@/data/images';
import { useStore } from '@/lib/store';
import { useLayout } from '@/lib/layout';

/** Account: member card · Activity · Settings · Delete account. Signed out → inline sign-in form. */
export default function Account() {
  const router = useRouter();
  const toast = useToast();
  const store = useStore();
  const { wide } = useLayout();
  const [confirm, setConfirm] = useState<null | 'logout' | 'delete'>(null);
  const search = <IconButton icon="search" accessibilityLabel="Search" onPress={() => router.push('/search')} />;

  if (!store.authed) {
    return (
      <Screen tabTitle="Account" tabBar keyboardShouldPersistTaps="handled">
        <View style={[s.pad, wide && s.narrow]}>
          <View style={s.gaHead}>
            <View style={s.appIc}><LogoMark size={38} /></View>
            <View style={{ flex: 1 }}><Text style={s.gaT}>Sign in to Fit4Stream</Text><Text style={s.gaS}>Register for events, join live streams and keep your tickets in one place.</Text></View>
          </View>
          <View style={s.gaForm}><LoginForm /></View>
          <AuthFoot q="Don’t have an account?" a="Sign up" onPress={() => router.push('/signup')} />
        </View>
      </Screen>
    );
  }

  const Row = ({ icon, title, sub, onPress, muted }: { icon: IconName; title: string; sub?: string; onPress: () => void; muted?: boolean }) => (
    <PressableScale onPress={onPress} style={s.row}>
      <View style={[s.ric, muted && { backgroundColor: 'rgba(138,154,176,0.16)' }]}><Icon name={icon} size={19} color={muted ? '#8A9AB0' : colors.purpleText} /></View>
      <View style={{ flex: 1 }}><Text style={s.rt}>{title}</Text>{sub && <Text style={s.rs}>{sub}</Text>}</View>
      <Icon name="chevronRight" size={17} color={colors.textSubtle} />
    </PressableScale>
  );

  return (
    <Screen tabTitle="Account" right={search} tabBar>
      <View style={[s.pad, wide && s.narrow]}>
        {/* member card */}
        <LinearGradient colors={['#392163', '#1F1630', '#15121C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.card}>
          <View style={s.mark} pointerEvents="none"><LogoMark size={150} /></View>
          <View style={s.cardTop}>
            <View style={s.brand}><LogoMark size={18} /><Text style={s.brandT}>FIT4STREAM MEMBER</Text></View>
            <View style={s.plan}><Text style={s.planT}>Free</Text></View>
          </View>
          <View style={s.id}>
            <Avatar uri={myAvatar()} name={`${ME.first} ${ME.last}`} size={64} ring="subtle" />
            <View style={{ flex: 1, minWidth: 0 }}><Text style={s.name} numberOfLines={1}>{ME.first} {ME.last}</Text><Text style={s.email} numberOfLines={1}>{ME.email}</Text></View>
          </View>
          <View style={s.stats}>
            {[[ME.tickets, 'Tickets', '/my-events'], [ME.following, 'Following', '/search?tab=channels'], [ME.reviews, 'Reviews', '/reviews']].map(([n, l, to], i) => (
              <React.Fragment key={String(l)}>
                {i > 0 && <View style={s.sDiv} />}
                <PressableScale onPress={() => router.push(to as any)} style={s.stat}><Text style={s.statN}>{n}</Text><Text style={s.statL}>{l}</Text></PressableScale>
              </React.Fragment>
            ))}
          </View>
          <PressableScale onPress={() => router.push('/profile')} style={s.edit}><Icon name="userCircle" size={16} color="#fff" /><Text style={s.editT}>Edit profile</Text></PressableScale>
        </LinearGradient>

        <Text style={s.gl}>Activity</Text>
        <View style={s.group}>
          <Row icon="ticket" title="My Events" sub="Created and purchased events" onPress={() => router.push('/my-events')} />
          <Row icon="dollar" title="Payment History" sub="Invoices and transactions" onPress={() => router.push('/payments')} />
        </View>
        <Text style={s.gl}>Settings</Text>
        <View style={s.group}>
          <Row icon="lock" title="Security" sub="Change your account password" onPress={() => router.push('/security')} />
          <Row icon="bell" title="Notifications" sub="Live alerts and reminders" onPress={() => router.push('/notifications')} />
          <Row icon="logOut" title="Log out" muted onPress={() => setConfirm('logout')} />
        </View>
        <View style={s.foot}>
          <Text style={s.del} onPress={() => setConfirm('delete')}>Delete account</Text>
          <Text style={s.ver}>Fit4Stream · v1.0</Text>
        </View>
      </View>

      <ConfirmDialog visible={!!confirm} onClose={() => setConfirm(null)}
        icon={confirm === 'delete' ? 'trash' : 'logOut'} tone={confirm === 'delete' ? 'danger' : 'default'}
        title={confirm === 'delete' ? 'Delete your account?' : 'Log out of Fit4Stream?'}
        message={confirm === 'delete' ? 'Your profile, channel and purchase history will be removed. This can’t be undone.' : 'You can sign back in any time with your email.'}
        confirmLabel={confirm === 'delete' ? 'Delete' : 'Log out'}
        onConfirm={() => { const k = confirm; setConfirm(null); store.signOut(); router.navigate('/'); toast.show(k === 'delete' ? 'Account deleted' : 'Logged out'); }} />
    </Screen>
  );
}

const s = StyleSheet.create({
  pad: { paddingHorizontal: 16 },
  narrow: { maxWidth: 560, alignSelf: 'center', width: '100%' },
  card: { borderRadius: 24, padding: 18, overflow: 'hidden', marginTop: 4 },
  mark: { position: 'absolute', right: -30, bottom: -30, opacity: 0.05 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  brandT: { fontFamily: fonts.bold, fontSize: 10.5, letterSpacing: 1.4, color: 'rgba(255,255,255,0.7)' },
  plan: { height: 22, paddingHorizontal: 9, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.12)', justifyContent: 'center' },
  planT: { fontFamily: fonts.bold, fontSize: 11, color: '#fff' },
  id: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 18 },
  name: { fontFamily: fonts.bold, fontSize: 19, color: '#fff' },
  email: { fontFamily: fonts.regular, fontSize: 12.5, color: 'rgba(255,255,255,0.6)', marginTop: 3 },
  stats: { flexDirection: 'row', alignItems: 'center', marginTop: 18, paddingVertical: 12, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.22)' },
  stat: { flex: 1, alignItems: 'center' },
  statN: { fontFamily: fonts.extrabold, fontSize: 19, color: '#fff' },
  statL: { fontFamily: fonts.medium, fontSize: 11.5, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  sDiv: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.12)' },
  edit: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.1)', marginTop: 14 },
  editT: { fontFamily: fonts.bold, fontSize: 14, color: '#fff' },
  gl: { fontFamily: fonts.bold, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: colors.textMuted, marginTop: 26, marginBottom: 10, marginLeft: 4 },
  group: { borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.045)', overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 13 },
  ric: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  rt: { fontFamily: fonts.semibold, fontSize: 15, color: '#fff' },
  rs: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.textMuted, marginTop: 2 },
  foot: { alignItems: 'center', gap: 8, marginTop: 28 },
  del: { fontFamily: fonts.semibold, fontSize: 14, color: colors.dangerText, padding: 6 },
  ver: { fontFamily: fonts.regular, fontSize: 12, color: colors.textSubtle },
  gaHead: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 4 },
  appIc: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#1B1921', alignItems: 'center', justifyContent: 'center' },
  gaT: { fontFamily: fonts.bold, fontSize: 18, color: '#fff' },
  gaS: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18, color: colors.textSecondary, marginTop: 3 },
  gaForm: { marginTop: 22 },
});
