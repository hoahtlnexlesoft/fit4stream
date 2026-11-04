import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AddCardSheet, CheckoutEventCard, OrderSummary, PayBar, PaymentDeclinedDialog, PaymentMethodList, ProcessingOverlay,
  PromoCodeField, ScreenHeader, SecureNote, TicketPicker, colors, fonts, money, useToast, PaymentMethod,
} from '../../src';
import { IMG, METHODS, TICKETS } from '../data';

const FEE = 0.49;

/** Reference checkout: ticket type + qty, promo, method, summary, processing, declined, add card. */
export function CheckoutScreen({ onBack, onPaid }: { onBack?: () => void; onPaid?: () => void }) {
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const [tix, setTix] = useState('std');
  const [qty, setQty] = useState(1);
  const [code, setCode] = useState<string>();
  const [codeErr, setCodeErr] = useState<string>();
  const [methods, setMethods] = useState<PaymentMethod[]>(METHODS);
  const [method, setMethod] = useState('apple');
  const [addCard, setAddCard] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [declined, setDeclined] = useState(false);

  const t = TICKETS.find((x) => x.id === tix)!;
  const sub = t.price * qty, disc = code ? sub * 0.2 : 0, total = sub - disc + FEE;
  const m = methods.find((x) => x.id === method)!;

  const pay = () => {
    setProcessing(true);
    // TODO: call your PSP here (Stripe PaymentSheet / Apple Pay / Google Pay)
    setTimeout(() => { setProcessing(false); if (m.brand === 'mastercard') setDeclined(true); else onPaid?.(); }, 2200);
  };

  return (
    <View style={s.root}>
      <ScreenHeader title="Checkout" onBack={onBack} />
      <ScrollView contentContainerStyle={s.body}>
        <CheckoutEventCard image={IMG.xmas} title="Danang Christmas Market 2026" meta="Tue, Nov 3 · 9:43 AM · 137 min" live />
        <Section title="Ticket"><TicketPicker tickets={TICKETS} value={tix} onChange={setTix} qty={qty} onQty={setQty} /></Section>
        <Section title="Promo code">
          <PromoCodeField applied={code} appliedLabel={`20% off tickets · −${money(disc)}`} error={codeErr} hint="Try XMAS20 for 20% off"
            onApply={(c) => { if (c === 'XMAS20') { setCode(c); setCodeErr(undefined); toast.show('Code applied — 20% off'); } else setCodeErr('This code is invalid or has expired'); }}
            onRemove={() => setCode(undefined)} />
        </Section>
        <Section title="Payment method"><PaymentMethodList methods={methods} value={method} onChange={setMethod} onAddCard={() => setAddCard(true)} /></Section>
        <Section title="Order summary">
          <OrderSummary total={total} lines={[
            { label: `${qty} × ${t.name} ticket`, amount: sub },
            ...(code ? [{ label: `Promo ${code}`, amount: -disc, tone: 'discount' as const }] : []),
            { label: 'Service fee', amount: FEE },
          ]} />
        </Section>
        <SecureNote>Payments are encrypted. Full refund up to 24 hours before the event starts. <Text style={{ textDecorationLine: 'underline', color: colors.textSecondary }}>Refund policy</Text></SecureNote>
      </ScrollView>
      <PayBar total={total} method={m.brand} onPay={pay} bottomInset={insets.bottom} />

      <AddCardSheet visible={addCard} onClose={() => setAddCard(false)} onAdd={({ last4 }) => {
        const id = 'new-' + last4; setMethods((x) => [...x, { id, brand: 'visa', title: `Visa •••• ${last4}`, subtitle: 'Just added' }]); setMethod(id); setAddCard(false); toast.show('Card added');
      }} />
      <ProcessingOverlay visible={processing} brand={m.brand} title={m.brand === 'apple' ? 'Confirming with Apple Pay…' : m.brand === 'google' ? 'Confirming with Google Pay…' : 'Processing payment…'} amountLine={`${money(total)} · ${m.title}`} />
      <PaymentDeclinedDialog visible={declined} method={{ brand: m.brand, title: m.title }} reason="Insufficient funds · code 51"
        onRetry={() => { setDeclined(false); setTimeout(pay, 50); }} onChangeMethod={() => { setDeclined(false); setMethod('visa'); }} onClose={() => setDeclined(false)} />
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <View style={{ gap: 12 }}><Text style={s.h}>{title}</Text>{children}</View>;
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  body: { padding: 16, paddingTop: 10, gap: 28, paddingBottom: 24 },
  h: { fontFamily: fonts.bold, fontSize: 16, color: colors.text },
});
