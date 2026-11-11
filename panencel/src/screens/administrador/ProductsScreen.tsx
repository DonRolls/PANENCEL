import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ScreenContainer } from '../../components/ScreenContainer';
import { colors, fontSize, radius, spacing } from '../../theme';
import { Product } from '../../models/producto';

const currency = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });
const formatMXN = (v: number) => currency.format(v);

interface Props {
  products: Product[];
  loading: boolean;
  error: string;
  onRefresh: () => void;
  onCreate: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export function ProductsScreen({
  products, loading, error, onRefresh, onCreate, onEdit, onDelete, onBack,
}: Props) {
  const handleDelete = (p: Product) =>
    Alert.alert(
      'Eliminar producto',
      `¿Seguro que quieres eliminar "${p.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => onDelete(p.id) },
      ],
    );

  return (
    <ScreenContainer
      title="Productos"
      subtitle="Crea y administra los productos que tus clientes pueden ordenar."
    >
      <Pressable onPress={onBack} accessibilityRole="button">
        <Text style={styles.back}>‹ Volver al panel</Text>
      </Pressable>

      <PrimaryButton label="Crear producto" onPress={onCreate} />

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.error}>{error}</Text>
          <PrimaryButton label="Reintentar" onPress={onRefresh} />
        </View>
      ) : null}
      {loading ? <Text style={styles.empty}>Cargando productos…</Text> : null}

      {products.map((product) => (
        <View key={product.id} style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.emoji}>{product.emoji || '🍞'}</Text>
            <View style={styles.info}>
              <View style={styles.titleRow}>
                <Text style={styles.name}>{product.name}</Text>
                <Text style={[styles.status, product.available ? styles.available : styles.unavailable]}>
                  {product.available ? 'DISPONIBLE' : 'NO DISPONIBLE'}
                </Text>
              </View>
              {product.description ? (
                <Text style={styles.description}>{product.description}</Text>
              ) : null}
              <Text style={styles.price}>{formatMXN(product.price)}</Text>
              <Text style={styles.category}>
                {product.category || 'Sin categoría'}
              </Text>
            </View>
          </View>
          <View style={styles.actions}>
            <Pressable
              onPress={() => onEdit(product.id)}
              accessibilityRole="button"
              style={({ pressed }) => [styles.action, pressed && styles.pressed]}
            >
              <Text style={styles.actionLabel}>✎ Editar</Text>
            </Pressable>
            <Pressable
              onPress={() => handleDelete(product)}
              accessibilityRole="button"
              style={({ pressed }) => [styles.action, pressed && styles.pressed]}
            >
              <Text style={styles.actionLabel}>🗑 Eliminar</Text>
            </Pressable>
          </View>
        </View>
      ))}

      {!loading && !error && products.length === 0 && (
        <Text style={styles.empty}>
          Aún no hay productos. Toca “Crear producto” para añadir el primero.
        </Text>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  back: { color: colors.primaryDark, fontSize: 16, fontWeight: '800', marginBottom: spacing.md },
  card: {
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  emoji: { fontSize: 40 },
  info: { flex: 1, gap: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  name: { fontSize: fontSize.md, fontWeight: '800', color: colors.text, flex: 1 },
  description: { fontSize: fontSize.sm, color: colors.textMuted },
  price: { fontSize: fontSize.md, fontWeight: '800', color: colors.text },
  category: { fontSize: fontSize.xs, color: colors.textMuted },
  status: {
    fontSize: fontSize.xs, fontWeight: '900',
    paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  available:   { color: '#1B5E20', backgroundColor: '#E8F5E9' },
  unavailable: { color: '#B71C1C', backgroundColor: '#FDECEA' },
  actions: { flexDirection: 'row', gap: spacing.sm },
  action: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.surfaceMuted, borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  pressed: { opacity: 0.75 },
  actionLabel: { fontSize: fontSize.xs, fontWeight: '700', color: colors.text },
  empty: { marginTop: spacing.xl, textAlign: 'center', color: colors.textMuted, fontSize: fontSize.md },
  errorBox: {
    marginTop: spacing.md, padding: spacing.md, borderRadius: radius.md,
    backgroundColor: '#FDECEA', gap: spacing.sm,
  },
  error: { color: '#B71C1C', fontWeight: '600' },
});