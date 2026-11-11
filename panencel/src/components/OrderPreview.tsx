import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Order, PaymentStatus } from '../models/pedido';
import { colors, radius, spacing } from '../theme';

interface Props {
  order: Order;
  showCode?: boolean;
}

const currency = (amount: number) => `$${amount.toFixed(2)} MXN`;

const paymentLabels: Record<PaymentStatus, string> = {
  paid: 'PAGADA',
  pending: 'PENDIENTE DE PAGO',
  failed: 'PAGO RECHAZADO',
  refunded: 'REEMBOLSADA',
};

export function OrderPreview({ order, showCode = true }: Props) {
  const isPaid = order.paymentStatus === 'paid';

  return (
    <View style={styles.card}>
      <View style={[styles.status, isPaid ? styles.paidStatus : styles.unpaidStatus]}>
        <Text style={[styles.statusText, isPaid ? styles.paidText : styles.unpaidText]}>
          {paymentLabels[order.paymentStatus]}
        </Text>
      </View>
      {showCode && <Text style={styles.code}>Pedido {order.code}</Text>}

      <View style={styles.items}>
        {order.items.map((item, index) => (
          <View
            key={`${item.productId ?? item.name}-${index}`}
            style={styles.itemRow}
          >
            <Text style={styles.itemName}>
              {item.quantity} × {item.name}
            </Text>
            <Text style={styles.itemTotal}>
              {currency(item.unitPrice * item.quantity)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.totalRow}>
        <View>
          <Text style={styles.totalLabel}>Total del pedido</Text>
          <Text style={styles.method}>
            Pago con {order.method === 'tarjeta' ? 'tarjeta' : 'efectivo'}
          </Text>
        </View>
        <Text style={styles.total}>{currency(order.total)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    padding: spacing.md,
    gap: spacing.md,
  },
  status: {
    alignSelf: 'flex-start',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  paidStatus: { backgroundColor: '#E8F5E9' },
  unpaidStatus: { backgroundColor: '#FDECEA' },
  statusText: { fontSize: 13, fontWeight: '900', letterSpacing: 0.5 },
  paidText: { color: '#1B5E20' },
  unpaidText: { color: '#B71C1C' },
  code: { color: colors.text, fontSize: 18, fontWeight: '800' },
  items: { borderTopWidth: 1, borderTopColor: colors.border },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
  itemName: { color: colors.text, flex: 1, fontWeight: '600' },
  itemTotal: { color: colors.text, fontWeight: '700' },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: { color: colors.text, fontWeight: '800' },
  method: { color: colors.muted, fontSize: 13, marginTop: 4 },
  total: { color: colors.text, fontSize: 18, fontWeight: '900' },
});
