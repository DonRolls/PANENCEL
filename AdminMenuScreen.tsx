import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { colors, fontSize, radius, spacing } from '../../theme';

interface Props {
  onOpenSales: () => void;
  onOpenProducts: () => void;
  onOpenCategories: () => void;
  onLogout: () => void;
}

export function AdminMenuScreen({
  onOpenSales,
  onOpenProducts,
  onOpenCategories,
  onLogout,
}: Props) {
  return (
    <ScreenContainer
      title="Panel de administración"
      subtitle="Elige qué quieres gestionar."
    >
      <MenuCard
        icon="📊"
        title="Consultar ventas"
        description="Cobros, pedidos y productos más vendidos."
        onPress={onOpenSales}
      />
      <MenuCard
        icon="🥐"
        title="Productos"
        description="Crea panes con nombre, imagen, precio y disponibilidad."
        onPress={onOpenProducts}
      />
      <MenuCard
        icon="🗂"
        title="Categorías"
        description="Agrupa productos para mostrarlos a tus clientes."
        onPress={onOpenCategories}
      />

      <Pressable
        onPress={onLogout}
        accessibilityRole="button"
        style={({ pressed }) => [styles.logoutCard, pressed && styles.pressed]}
      >
        <Text style={styles.logoutIcon}>🚪</Text>
        <View style={styles.textWrap}>
          <Text style={styles.logoutTitle}>Cerrar sesión</Text>
          <Text style={styles.logoutDescription}>
            Salir de la cuenta de administrador en este dispositivo.
          </Text>
        </View>
      </Pressable>
    </ScreenContainer>
  );
}

function MenuCard({
  icon,
  title,
  description,
  onPress,
}: {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  pressed: { opacity: 0.85 },
  icon: { fontSize: 32 },
  textWrap: { flex: 1 },
  title: { fontSize: fontSize.lg, fontWeight: '800', color: colors.text },
  description: { marginTop: 4, fontSize: fontSize.sm, color: colors.textMuted },
  chevron: { fontSize: 28, color: colors.textMuted },

  // Cerrar sesión: mismo layout que las tarjetas, pero con acento de "peligro"
  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.xl,
    borderWidth: 1,
    borderColor: '#FDECEA',
  },
  logoutIcon: { fontSize: 32 },
  logoutTitle: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: '#B71C1C',
  },
  logoutDescription: {
    marginTop: 4,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
});