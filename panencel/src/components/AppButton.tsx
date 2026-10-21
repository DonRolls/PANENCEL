import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius } from '../theme';

interface Props {
  title: string;
  onPress: () => void;
  //agregue dark button emmanuel
 variant?: 'primary' | 'dark' | 'outline' | 'link';
}

export function AppButton({ title, onPress, variant = 'primary' }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'outline' && styles.outline,
        variant === 'link' && styles.link,
        variant === 'dark' && styles.dark,
        pressed && { opacity: 0.75 },
      ]}
    >
      <Text style={[styles.text, variant !== 'primary' && { color: colors.primary }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { paddingVertical: 14, borderRadius: radius.md, alignItems: 'center' },
  primary: { backgroundColor: colors.primary },
  //agregue dark button emmanuel
  dark: { backgroundColor: colors.text },
  outline: { borderWidth: 1.5, borderColor: colors.primary },
  link: { paddingVertical: 8 },
  text: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
