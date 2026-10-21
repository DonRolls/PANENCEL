import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from './AppButton';
import { AppInput } from './AppInput';
import { colors, radius, spacing } from '../theme';

interface Props {
  visible: boolean;
  total: number;
  onClose: () => void;
  onPay: () => void;
}

const digits = (v: string) => v.replace(/\D/g, '');
const formatCard = (v: string) => digits(v).slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
const formatExpiry = (v: string) => {
  const d = digits(v).slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
};

export function CardPaymentModal({ visible, total, onClose, onPay }: Props) {
  const [holder, setHolder] = useState('');
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
      >
        <View style={styles.sheet}>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.title}>Pago con tarjeta</Text>
              <Pressable
                onPress={onClose}
                style={styles.close}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Cerrar"
              >
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>

            <Text style={styles.total}>Total a pagar · ${total.toFixed(2)} MXN</Text>
            <Text style={styles.demo}>Vista de ejemplo. No ingreses datos reales de tu tarjeta.</Text>

            <AppInput
              label="Nombre del titular"
              placeholder="Como aparece en la tarjeta"
              autoCapitalize="characters"
              value={holder}
              onChangeText={setHolder}
            />
            <AppInput
              label="Número de tarjeta"
              placeholder="0000 0000 0000 0000"
              keyboardType="number-pad"
              value={number}
              onChangeText={(t) => setNumber(formatCard(t))}
            />
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <AppInput
                  label="Vencimiento"
                  placeholder="MM / AA"
                  keyboardType="number-pad"
                  value={expiry}
                  onChangeText={(t) => setExpiry(formatExpiry(t))}
                />
              </View>
              <View style={{ flex: 1 }}>
                <AppInput
                  label="CVV"
                  placeholder="•••"
                  keyboardType="number-pad"
                  secureTextEntry
                  maxLength={4}
                  value={cvv}
                  onChangeText={(t) => setCvv(digits(t))}
                />
              </View>
            </View>

            <AppButton variant="dark" title={`Pagar $${total.toFixed(2)} · Demo`} onPress={onPay} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', padding: spacing.md, backgroundColor: colors.overlay },
  sheet: {
    maxHeight: '92%',
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.background,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  close: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { color: colors.text, fontWeight: '700' },
  total: { fontWeight: '700', color: colors.text, marginBottom: 4 },
  demo: { color: colors.muted, marginBottom: spacing.md },
  row: { flexDirection: 'row', gap: spacing.sm },
});
