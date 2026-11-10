import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';

interface Props {
  panelActive: boolean;
  ordersActive: boolean;
  menuActive: boolean;
  onOpenPanel: () => void;
  onOpenOrders: () => void;
  onOpenMenu: () => void;
  onLogout: () => void;
}

export function AdminNav({
  panelActive,
  ordersActive,
  menuActive,
  onOpenPanel,
  onOpenOrders,
  onOpenMenu,
  onLogout,
}: Props) {
  return (
    <View style={styles.nav}>
      <NavButton label="Panel" active={panelActive} onPress={onOpenPanel} />
      <NavButton label="Pedidos" active={ordersActive} onPress={onOpenOrders} />
      <NavButton label="Menú" active={menuActive} onPress={onOpenMenu} />
      <Pressable accessibilityRole="button" onPress={onLogout}>
        <Text style={styles.logout}>Salir</Text>
      </Pressable>
    </View>
  );
}

function NavButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.button, active && styles.buttonActive]}
    >
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  button: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: 10,
  },
  buttonActive: { backgroundColor: colors.cream },
  label: { color: colors.muted, fontSize: 13, fontWeight: '700' },
  labelActive: { color: colors.primaryDark },
  logout: { color: colors.danger, fontSize: 13, fontWeight: '700' },
});