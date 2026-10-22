import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors, fontSize, radius, spacing } from '../theme';
import { Catalog, Product } from '../types';

interface Props {
  catalogs: Catalog[];
  products: Product[];
  onCreate: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function productsLabel(count: number): string {
  if (count === 0) return 'Sin productos';
  return count === 1 ? '1 producto' : `${count} productos`;
}

export function CatalogsScreen({
  catalogs,
  products,
  onCreate,
  onEdit,
  onDelete,
}: Props) {
  const handleView = (catalog: Catalog) => {
    const names = catalog.productIds
      .map((id) => products.find((p) => p.id === id)?.name)
      .filter(Boolean)
      .join('\n');
    Alert.alert(catalog.name, names || 'Este catálogo aún no tiene productos.');
  };

  const handleDelete = (catalog: Catalog) => {
    Alert.alert(
      'Eliminar catálogo',
      `¿Seguro que quieres eliminar "${catalog.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onDelete(catalog.id),
        },
      ],
    );
  };

  return (
    <ScreenContainer
      title="Catálogos"
      subtitle="Define las categorías que necesites. Estos nombres son ejemplos."
    >
      <PrimaryButton label="Crear catálogo" onPress={onCreate} />

      {catalogs.map((catalog) => (
        <View key={catalog.id} style={styles.card}>
          <Text style={styles.name}>{catalog.name}</Text>
          <Text style={styles.count}>
            {productsLabel(catalog.productIds.length)}
          </Text>

          <View style={styles.actions}>
            <ActionButton label="Consultar" icon="👁" onPress={() => handleView(catalog)} />
            <ActionButton label="Editar" icon="✎" onPress={() => onEdit(catalog.id)} />
            <ActionButton label="Eliminar" icon="🗑" onPress={() => handleDelete(catalog)} />
          </View>
        </View>
      ))}

      {catalogs.length === 0 && (
        <Text style={styles.empty}>
          Aún no hay catálogos. Toca “Crear catálogo” para añadir el primero.
        </Text>
      )}
    </ScreenContainer>
  );
}

function ActionButton({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.action, pressed && styles.pressed]}
    >
      <Text style={styles.actionIcon}>{icon}</Text>
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  name: { fontSize: fontSize.md, fontWeight: '800', color: colors.text },
  count: { marginTop: spacing.xs, fontSize: fontSize.sm, color: colors.textMuted },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  action: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  pressed: { opacity: 0.75 },
  actionIcon: { fontSize: fontSize.sm },
  actionLabel: { fontSize: fontSize.xs, fontWeight: '700', color: colors.text },
  empty: {
    marginTop: spacing.xl,
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: fontSize.md,
  },
});
