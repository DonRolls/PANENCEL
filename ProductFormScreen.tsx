import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ScreenContainer } from '../../components/ScreenContainer';
import { colors, fontSize, radius, spacing } from '../../theme';
import { Catalog } from '../../models/catalogo';
import { Product } from '../../models/producto';
import { ProductInput } from '../../repositories/repositoryproductos';

interface Props {
  product?: Product;
  catalogs: Catalog[];
  onSave: (values: ProductInput) => Promise<void>;
  onCancel: () => void;
}

export function ProductFormScreen({ product, catalogs, onSave, onCancel }: Props) {
  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [emoji, setEmoji] = useState(product?.emoji ?? '');
  const [priceText, setPriceText] = useState(product ? String(product.price) : '');
  const [available, setAvailable] = useState(product?.available ?? true);
  const [catalogIds, setCatalogIds] = useState<string[]>(product?.catalogIds ?? []);
  const [saving, setSaving] = useState(false);

  const toggleCatalog = (id: string) =>
    setCatalogIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Falta el nombre', 'Escribe un nombre para el producto.');
      return;
    }
    const price = Number(priceText.replace(',', '.'));
    if (!Number.isFinite(price) || price < 0) {
      Alert.alert('Precio inválido', 'Escribe un precio mayor o igual a 0.');
      return;
    }
    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        emoji: emoji.trim(),
        price,
        available,
        catalogIds,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer
      title={product ? 'Editar producto' : 'Crear producto'}
      subtitle="Define nombre, imagen, precio y disponibilidad."
    >
      <Field label="Nombre del producto">
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Concha de vainilla"
          placeholderTextColor={colors.textMuted}
          maxLength={100}
          style={styles.input}
        />
      </Field>

      <Field label="Emoji / imagen">
        <TextInput
          value={emoji}
          onChangeText={setEmoji}
          placeholder="🥐"
          placeholderTextColor={colors.textMuted}
          maxLength={4}
          style={styles.input}
        />
        <Text style={styles.helper}>
          Se muestra como imagen del producto en el menú del cliente.
        </Text>
      </Field>

      <Field label="Descripción">
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Pan dulce relleno de vainilla"
          placeholderTextColor={colors.textMuted}
          maxLength={500}
          multiline
          style={[styles.input, styles.multiline]}
        />
      </Field>

      <Field label="Precio (MXN)">
        <TextInput
          value={priceText}
          onChangeText={setPriceText}
          placeholder="25.00"
          placeholderTextColor={colors.textMuted}
          keyboardType="decimal-pad"
          style={styles.input}
        />
      </Field>

      <Field label="Disponibilidad">
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>
            {available ? 'Disponible para ordenar' : 'No disponible'}
          </Text>
          <Switch
            value={available}
            onValueChange={setAvailable}
            trackColor={{ true: colors.dark, false: colors.border }}
          />
        </View>
      </Field>

      <Field label="Categorías">
        {catalogs.length === 0 ? (
          <Text style={styles.helper}>
            Aún no hay categorías. Puedes crear una desde el panel principal.
          </Text>
        ) : (
          <View style={styles.chips}>
            {catalogs.map((c) => (
              <Chip
                key={c.id}
                label={c.name}
                selected={catalogIds.includes(c.id)}
                onPress={() => toggleCatalog(c.id)}
              />
            ))}
          </View>
        )}
      </Field>

      <View style={styles.saveWrap}>
        <PrimaryButton
          label={saving ? 'Guardando…' : product ? 'Guardar cambios' : 'Crear producto'}
          onPress={handleSave}
          disabled={saving}
        />
      </View>

      <Pressable onPress={onCancel} accessibilityRole="button" disabled={saving}>
        <Text style={styles.cancel}>Cancelar y volver a productos</Text>
      </Pressable>
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
  label, selected, onPress,
}: { label: string; selected: boolean; onPress: () => void }) {
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
  label: { marginBottom: spacing.sm, fontSize: fontSize.md, fontWeight: '800', color: colors.text },
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
  helper: { marginTop: spacing.xs, fontSize: fontSize.xs, color: colors.textMuted },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  switchLabel: { fontSize: fontSize.md, color: colors.text, fontWeight: '600' },
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
  cancel: { marginTop: spacing.lg, fontSize: fontSize.sm, color: colors.textMuted },
});