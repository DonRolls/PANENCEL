import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { salesByPeriod } from '../data/mock';
import { colors, fontSize, radius, spacing } from '../theme';
import { Period } from '../types';
import { formatMXN } from '../utils/format';

const PERIODS: { key: Period; label: string }[] = [
  { key: 'today', label: 'Hoy' },
  { key: 'week', label: 'Semana' },
  { key: 'month', label: 'Mes' },
];

export function SalesSummaryScreen({
  onManageCatalogs,
}: {
  onManageCatalogs: () => void;
}) {
  const [period, setPeriod] = useState<Period>('today');
  const data = salesByPeriod[period];

  return (
    <ScreenContainer
      title="Resumen de ventas"
      subtitle="Así va tu panadería. Datos de ejemplo."
      footer={
        <PrimaryButton
          label="Acceso temporal: gestionar catálogos"
          onPress={onManageCatalogs}
        />
      }
    >
      {/* Selector de periodo */}
      <View style={styles.segment}>
        {PERIODS.map(({ key, label }) => {
          const selected = key === period;
          return (
            <Pressable
              key={key}
              onPress={() => setPeriod(key)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={[styles.segmentItem, selected && styles.segmentItemActive]}
            >
              <Text
                style={[styles.segmentText, selected && styles.segmentTextActive]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Ventas cobradas */}
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>Ventas cobradas · MXN</Text>
        <Text style={styles.heroValue}>{formatMXN(data.collected)}</Text>
        <Text style={styles.heroDelta}>
          {data.deltaPercent}% más que {data.deltaLabel}
        </Text>
      </View>

      {/* Pedidos y ticket */}
      <View style={styles.row}>
        <View style={[styles.card, styles.flex]}>
          <Text style={styles.cardLabel}>Pedidos cobrados</Text>
          <Text style={styles.cardValue}>{data.paidOrders}</Text>
        </View>
        <View style={[styles.card, styles.flex]}>
          <Text style={styles.cardLabel}>Ticket promedio</Text>
          <Text style={styles.cardValue}>{formatMXN(data.averageTicket)}</Text>
        </View>
      </View>

      {/* Pendientes */}
      <View style={styles.pending}>
        <Text style={styles.pendingText}>
          {data.pendingOrders} pedidos por cobrar
        </Text>
        <Text style={styles.pendingText}>{formatMXN(data.pendingTotal)}</Text>
      </View>

      {/* Más vendidos */}
      <Text style={styles.sectionTitle}>Productos más vendidos</Text>
      <View style={styles.listCard}>
        {data.topProducts.map((p) => (
          <View key={p.id} style={styles.productRow}>
            <View>
              <Text style={styles.productName}>{p.name}</Text>
              <Text style={styles.productUnits}>{p.units} unidades</Text>
            </View>
            <Text style={styles.productTotal}>{formatMXN(p.total)}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.footnote}>
        Las ventas incluyen solo pedidos cobrados. Los pendientes no se suman al
        total.
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },

  segment: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    padding: 4,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: radius.md,
  },
  segmentItemActive: { backgroundColor: colors.dark },
  segmentText: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
  },
  segmentTextActive: { color: colors.onDark },

  hero: {
    marginTop: spacing.lg,
    backgroundColor: colors.dark,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  heroLabel: { color: colors.onDark, fontSize: fontSize.sm, fontWeight: '700' },
  heroValue: {
    color: colors.onDark,
    fontSize: fontSize.hero,
    fontWeight: '800',
    marginVertical: spacing.sm,
  },
  heroDelta: { color: colors.onDark, fontSize: fontSize.xs, fontWeight: '700' },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  cardLabel: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textMuted,
  },
  cardValue: {
    marginTop: spacing.sm,
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.text,
  },

  pending: {
    marginTop: spacing.md,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pendingText: { fontSize: fontSize.sm, fontWeight: '800', color: colors.text },

  sectionTitle: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.text,
  },
  listCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  productName: { fontSize: fontSize.md, fontWeight: '800', color: colors.text },
  productUnits: {
    marginTop: 2,
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  productTotal: { fontSize: fontSize.md, fontWeight: '800', color: colors.text },

  footnote: {
    marginTop: spacing.lg,
    fontSize: fontSize.sm,
    lineHeight: 19,
    color: colors.textMuted,
  },
});
