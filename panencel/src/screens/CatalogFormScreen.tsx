import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors, fontSize, radius, spacing } from '../theme';
import { Catalog, CatalogStatus, Product } from '../types';

interface Props {
  /** Si se pasa, el formulario edita ese catálogo; si no, crea uno nuevo. */
  catalog?: Catalog;
  products: Product[];
  onSave: (data: Omit<Catalog, 'id'>) => void;
  onCancel: () => void;
}

const STATUSES: { key: CatalogStatus; label: string }[] = [
  { key: 'active', label: 'Activo' },
  { key: 'inactive', label: 'Inactivo' },
];

export function CatalogFormScreen({ catalog, products, onSave, onCancel }: Props) {
  const [name, setName] = useState(catalog?.name ?? '');
  const [description, setDescription] = useState(catalog?.description ?? '');
  const [status, setStatus] = useState<CatalogStatus>(catalog?.status ?? 'active');
  const [productIds, setProductIds] = useState<string[]>(catalog?.productIds ?? []);

  const toggleProduct = (id: string) =>
    setProductIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Falta el nombre', 'Escribe un nombre para el catálogo.');
      return;
    }
    onSave({ name: name.trim(), description: description.trim(), status, productIds });
  };

  return (
    <ScreenContainer
      title="Crear / editar catálogo"
      subtitle="Usa este formulario para añadir una categoría o modificar una existente."
    >
      <Field label="Nombre del catálogo">
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Pan dulce"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
      </Field>

      <Field label="Descripción">
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Panes dulces y repostería de la casa"
          placeholderTextColor={colors.textMuted}
          multiline
          style={[styles.input, styles.multiline]}
        />
      </Field>

      <Field label="Estado">
        <View style={styles.chips}>
          {STATUSES.map(({ key, label }) => (
            <Chip
              key={key}
              label={label}
              selected={status === key}
              onPress={() => setStatus(key)}
            />
          ))}
        </View>
      </Field>

      <Field label="Productos asignados">
        <View style={styles.chips}>
          {products.map((p) => (
            <Chip
              key={p.id}
              label={p.name}
              selected={productIds.includes(p.id)}
              onPress={() => toggleProduct(p.id)}
            />
          ))}
        </View>
      </Field>

      <View style={styles.saveWrap}>
        <PrimaryButton label="Guardar catálogo" onPress={handleSave} />
      </View>

      <Pressable onPress={onCancel} accessibilityRole="button">
        <Text style={styles.cancel}>Cancelar y volver a catálogos</Text>
      </Pressable>

      <Text style={styles.footnote}>
        El administrador define libremente el nombre y los productos de cada
        categoría.
      </Text>
    </ScreenContainer>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[styles.chip, selected && styles.chipActive]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: spacing.lg },
  label: {
    marginBottom: spacing.sm,
    fontSize: fontSize.md,
    fontWeight: '800',
    color: colors.text,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
  },
  multiline: { minHeight: 72, textAlignVertical: 'top' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  chipActive: { backgroundColor: colors.dark, borderColor: colors.dark },
  chipText: { fontSize: fontSize.sm, fontWeight: '700', color: colors.text },
  chipTextActive: { color: colors.onDark },
  saveWrap: { marginTop: spacing.sm },
  cancel: {
    marginTop: spacing.lg,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  footnote: {
    marginTop: spacing.lg,
    fontSize: fontSize.sm,
    lineHeight: 19,
    color: colors.textMuted,
  },
});
