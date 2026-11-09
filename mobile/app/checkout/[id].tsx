import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AddCardSheet, CheckoutEventCard, OrderSummary, PayBar, PaymentDeclinedDialog, PaymentMethod, PaymentMethodList, ProcessingOverlay,
  PromoCodeField, SecureNote, TicketPicker, TicketType, colors, fonts, useToast,
} from '@ui';
import { Screen } from '@/components/Screen';
import { FEE, durationLabel, getEvent, money, shortDate, startTime } from '@/data';
import { useStore } from '@/lib/store';
import { useLayout } from '@/lib/layout';

const TICKETS: TicketType[] = [
  { id: 'std', name: 'Standard', description: 'Live access · 48h replay', price: 3.99 },
  { id: 'vip', name: 'All-access', description: 'Live + backstage chat · 30-day replay', price: 9.99, badge: 'Best value' },
];
const METHODS: PaymentMethod[] = [
  { id: 'apple', brand: 'apple', title: 'Apple Pay', subtitle: 'Visa •••• 4242' },
  { id: 'google', brand: 'google', title: 'Google Pay', subtitle: 'Fast checkout' },
  { id: 'visa', brand: 'visa', title: 'Visa •••• 4242', subtitle: 'Expires 12/27 · Default' },
  { id: 'mc', brand: 'mastercard', title: 'Mastercard •••• 8812', subtitle: 'Expires 05/27' },
];

/**
 * Checkout: ticket type + qty · promo (try XMAS20) · payment method · summary · Pay.
 * Demo: Mastercard always declines. TODO(psp): Stripe PaymentSheet / Apple Pay / Google Pay in `pay()`.
 */
export default function Checkout() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const e = getEvent(id);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const store = useStore();
  const { wide } = useLayout();
  const [tix, setTix] = useState('std');
  const [qty, setQty] = useState(1);
  const [code, setCode] = useState<string>();
  const [codeErr, setCodeErr] = useState<string>();
  const [methods, setMethods] = useState(METHODS);
  const [method, setMethod] = useState('apple');
  const [addCard, setAddCard] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [declined, setDeclined] = useState(false);

  const t = TICKETS.find((x) => x.id === tix)!;
  const sub = t.price * qty, disc = code ? sub * 0.2 : 0, total = sub - disc + FEE;
  const m = methods.find((x) => x.id === method)!;
  const pay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      if (m.brand === 'mastercard') return setDeclined(true);
      store.register(e.id); router.replace(`/success?id=${e.id}`);
    }, 2200);
  };

  const left = (
    <>
      <CheckoutEventCard image={e.image} title={e.title} meta={`${shortDate(e)} · ${startTime(e)} · ${durationLabel(e)}`} live={e.status === 'live'} />
      <Sec title="Ticket"><TicketPicker tickets={TICKETS} value={tix} onChange={setTix} qty={qty} onQty={setQty} /></Sec>
      <Sec title="Promo code">
        <PromoCodeField applied={code} appliedLabel={`20% off tickets · −${money(disc)}`} error={codeErr} hint="Try XMAS20 for 20% off"
          onApply={(c) => { if (c.toUpperCase() === 'XMAS20') { setCode('XMAS20'); setCodeErr(undefined); toast.show('Code applied — 20% off'); } else setCodeErr('This code is invalid or has expired'); }}
          onRemove={() => setCode(undefined)} />
      </Sec>
    </>
  );
  const right = (
    <>
      <Sec title="Payment method"><PaymentMethodList methods={methods} value={method} onChange={setMethod} onAddCard={() => setAddCard(true)} /></Sec>
      <Sec title="Order summary">
        <OrderSummary total={total} lines={[
          { label: `${qty} × ${t.name} ticket`, amount: sub },
          ...(code ? [{ label: `Promo ${code}`, amount: -disc, tone: 'discount' as const }] : []),
          { label: 'Service fee', amount: FEE },
        ]} />
      </Sec>
      <SecureNote>Payments are encrypted. Full refund up to 24 hours before the event starts. <Text style={{ textDecorationLine: 'underline', color: colors.textSecondary }}>Refund policy</Text></SecureNote>
    </>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Screen title="Checkout" keyboardShouldPersistTaps="handled" contentStyle={{ paddingBottom: insets.bottom + 110 }}>
        {wide
          ? <View style={s.two}><View style={s.col}>{left}</View><View style={s.col}>{right}</View></View>
          : <View style={s.body}>{left}{right}</View>}
      </Screen>
      <View style={s.bar}><PayBar total={total} method={m.brand} onPay={pay} bottomInset={insets.bottom} /></View>

      <AddCardSheet visible={addCard} onClose={() => setAddCard(false)} onAdd={({ last4 }) => {
        const nid = 'new-' + last4; setMethods((x) => [...x, { id: nid, brand: 'visa', title: `Visa •••• ${last4}`, subtitle: 'Just added' }]); setMethod(nid); setAddCard(false); toast.show('Card added');
      }} />
      <ProcessingOverlay visible={processing} brand={m.brand} title={m.brand === 'apple' ? 'Confirming with Apple Pay…' : m.brand === 'google' ? 'Confirming with Google Pay…' : 'Processing payment…'} amountLine={`${money(total)} · ${m.title}`} />
      <PaymentDeclinedDialog visible={declined} method={{ brand: m.brand, title: m.title }} reason="Insufficient funds · code 51"
        onRetry={() => { setDeclined(false); setTimeout(pay, 50); }} onChangeMethod={() => { setDeclined(false); setMethod('visa'); }} onClose={() => setDeclined(false)} />
    </View>
  );
}

function Sec({ title, children }: { title: string; children: React.ReactNode }) {
  return <View style={{ gap: 12 }}><Text style={s.h}>{title}</Text>{children}</View>;
}

const s = StyleSheet.create({
  body: { paddingHorizontal: 16, gap: 28 },
  two: { flexDirection: 'row', gap: 24, paddingHorizontal: 24, maxWidth: 1000, alignSelf: 'center', width: '100%' },
  col: { flex: 1, gap: 28 },
  h: { fontFamily: fonts.bold, fontSize: 16, color: colors.text },
  bar: { position: 'absolute', left: 0, right: 0, bottom: 0 },
});
