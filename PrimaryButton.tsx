import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fontSize, radius, spacing } from '../theme';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export function PrimaryButton({ label, onPress, disabled = false }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        (pressed || disabled) && styles.pressed,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.dark,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  pressed: { opacity: 0.85 },
  label: {
    color: colors.onDark,
    fontSize: fontSize.md,
    fontWeight: '800',
  },
});
