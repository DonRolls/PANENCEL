import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { QrPlaceholder } from '../components/QrPlaceholder';
import { Order } from '../types';
import { colors, radius, spacing } from '../theme';

interface Props {
  order: Order;
  onNewOrder: () => void;
}

export function OrderSuccessScreen({ order, onNewOrder }: Props) {
  const isCash = order.method === 'efectivo';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.brand}>PANADERÍA</Text>

      <View style={styles.check}>
        <Text style={styles.checkMark}>✓</Text>
      </View>
      <Text style={styles.title}>¡Pedido listo!</Text>
      <Text style={styles.subtitle}>
        {isCash
          ? 'Muestra este código en caja para pagar y recoger tu pan.'
          : 'Muestra este código en caja para recoger tu pan.'}
      </Text>

      <View style={styles.card}>
        <Text style={styles.codeLabel}>CÓDIGO DE TU PEDIDO</Text>
        <Text style={styles.code}>{order.code}</Text>

        <View style={styles.qr}>
          <QrPlaceholder seed={order.code} />
        </View>
        <Text style={styles.qrCaption}>Ejemplo visual de código QR</Text>

        <View style={styles.divider} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total · MXN</Text>
          <Text style={styles.totalLabel}>${order.total.toFixed(2)}</Text>
        </View>

        <View style={styles.methodBox}>
          <Text style={styles.methodTitle}>
            Método de pago: {isCash ? 'Efectivo' : 'Tarjeta'}
          </Text>
          <Text style={styles.methodHint}>
            {isCash ? 'Pendiente de pago en caja' : 'Pago registrado (demo)'}
          </Text>
        </View>
      </View>

      <View style={styles.note}>
        <Text style={styles.noteText}>
          Guarda una captura de esta pantalla para tener tu código a mano.
        </Text>
      </View>

      <AppButton variant="dark" title="Hacer un nuevo pedido" onPress={onNewOrder} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, paddingBottom: spacing.xl },
  brand: { color: colors.text, fontSize: 12, fontWeight: '700', letterSpacing: 2 },
  check: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  checkMark: { fontSize: 32, color: colors.text },
  title: { fontSize: 26, fontWeight: '800', color: colors.text, textAlign: 'center', marginTop: spacing.md },
  subtitle: { color: colors.muted, textAlign: 'center', marginTop: 6, marginBottom: spacing.md },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.md },
  codeLabel: { textAlign: 'center', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, color: colors.text, marginTop: spacing.sm },
  code: { textAlign: 'center', fontSize: 34, fontWeight: '800', color: colors.text, marginVertical: spacing.md },
  qr: { alignItems: 'center' },
  qrCaption: { textAlign: 'center', color: colors.muted, marginVertical: spacing.sm },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  totalLabel: { fontWeight: '700', color: colors.text },
  methodBox: { backgroundColor: colors.cream, borderRadius: radius.md, padding: spacing.md },
  methodTitle: { fontWeight: '700', color: colors.text },
  methodHint: { color: colors.muted, marginTop: 2 },
  note: { backgroundColor: colors.cream, borderRadius: radius.md, padding: spacing.md, marginVertical: spacing.md },
  noteText: { color: colors.muted },
});
