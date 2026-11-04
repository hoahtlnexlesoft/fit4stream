import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, IconButton, ReceiptHero, ReceiptItems, ReceiptMeta, RefundSheet, RefundTimeline, ScreenHeader, colors, fonts, useToast, PaymentStatus } from '../../src';
import { IMG } from '../data';

/** Reference receipt with refund request flow. */
export function ReceiptScreen({ onBack }: { onBack?: () => void }) {
  const toast = useToast();
  const [status, setStatus] = useState<PaymentStatus>('paid');
  const [refund, setRefund] = useState(false);
  const [reason, setReason] = useState(0);
  return (
    <View style={s.root}>
      <ScreenHeader title="Receipt" onBack={onBack} right={<IconButton icon="share" accessibilityLabel="Share receipt" onPress={() => toast.show('Receipt link copied')} />} />
      <ScrollView contentContainerStyle={s.body}>
        <ReceiptHero status={status} amount={6.87} date="Nov 03, 2026 · 9:41 AM" />
        {status === 'pending' && <RefundTimeline steps={[
          { title: 'Refund requested', caption: 'Nov 04, 10:12 AM', done: true },
          { title: 'Approved by organizer', caption: 'Usually within 24h', done: false },
          { title: 'Back on Visa •••• 4242', caption: '5–10 business days', done: false },
        ]} />}
        <ReceiptItems image={IMG.xmas} title="Danang Christmas Market 2026" orderId="F4S-261103-0412" total={6.87}
          lines={[{ label: '2 × Standard ticket', amount: 7.98 }, { label: 'Promo XMAS20', amount: -1.6 }, { label: 'Service fee', amount: 0.49 }]} />
        <ReceiptMeta brand="visa" method="Visa •••• 4242" txId="ch_3Q0412Xa9LkT" billedTo="Tran Nguyen" />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button title="Download PDF" icon="inbox" variant="secondary" style={{ flex: 1 }} onPress={() => toast.show('Receipt PDF saved')} />
          <Button title="Email receipt" icon="mail" variant="secondary" style={{ flex: 1 }} onPress={() => toast.show('Receipt sent to your email')} />
        </View>
        {status === 'paid' && <Text style={s.refund} onPress={() => setRefund(true)}>Request a refund</Text>}
      </ScrollView>
      <RefundSheet visible={refund} onClose={() => setRefund(false)} amount={6.38} destination="Visa •••• 4242" fee={0.49} reason={reason} onReason={setReason}
        onSubmit={() => { setRefund(false); setStatus('pending'); toast.show('Refund requested'); }} />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  body: { padding: 16, gap: 16, paddingBottom: 40 },
  refund: { alignSelf: 'center', paddingVertical: 10, fontFamily: fonts.semibold, fontSize: 14.5, color: colors.dangerText },
});
