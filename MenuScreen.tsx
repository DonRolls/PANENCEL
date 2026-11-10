import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Catalog } from '../../models/catalogo';
import { Product } from '../../models/producto';
import { colors, radius, spacing } from '../../theme';

interface Props {
  catalogs: Catalog[];
  products: Product[];
  loading: boolean;
  error: string;
  onRefresh: () => void;
  onContinue: () => void;
  onLogout: () => void;
}

export function MenuScreen({
  catalogs,
  products,
  loading,
  error,
  onRefresh,
  onContinue,
  onLogout,
}: Props) {
  const { user } = useAuth();
  const [catalogId, setCatalogId] = useState<string | null>(null);

  const { cart, total, count, add, remove } = useCart();

  const activeCatalogIds = useMemo(
    () => new Set(catalogs.filter((catalog) => catalog.status === 'active').map((c) => c.id)),
    [catalogs],
  );

  const visibleProducts = useMemo(
    () =>
      products.filter((product) => {
        const productCatalogIds = product.catalogIds ?? [];
        if (catalogId) {
          return (
            activeCatalogIds.has(catalogId) &&
            productCatalogIds.includes(catalogId)
          );
        }
        return productCatalogIds.some((id) => activeCatalogIds.has(id));
      }),
    [activeCatalogIds, catalogId, products],
  );

  const renderItem = ({ item }: { item: Product }) => {
    const qty = cart[item.id] ?? 0;
    return (
      <View style={[styles.card, !item.available && { opacity: 0.5 }]}>
        <Text style={styles.emoji}>{item.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        </View>
        {item.available ? (
          <View style={styles.qtyRow}>
            {qty > 0 && (
              <>
                <Pressable style={styles.qtyBtn} onPress={() => remove(item)}>
                  <Text style={styles.qtyBtnText}>−</Text>
                </Pressable>
                <Text style={styles.qty}>{qty}</Text>
              </>
            )}
            <Pressable style={styles.qtyBtn} onPress={() => add(item)}>
              <Text style={styles.qtyBtnText}>+</Text>
            </Pressable>
          </View>
        ) : (
          <Text style={styles.soldOut}>Agotado</Text>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.hello}>Hola, {user?.name}</Text>
          <Text style={styles.role}>
            {user?.role === 'admin' ? 'Administrador' : user?.role === 'cliente' ? 'Cliente' : 'Modo invitado'}
          </Text>
        </View>
        <Pressable onPress={onLogout} hitSlop={8}>
          <Text style={styles.logout}>Salir</Text>
        </Pressable>
      </View>

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Pressable
            key="all-catalogs"
            onPress={() => setCatalogId(null)}
            style={[styles.chip, catalogId === null && styles.chipActive]}
          >
            <Text style={[styles.chipText, catalogId === null && { color: '#FFF' }]}>
              Todos
            </Text>
          </Pressable>
          {catalogs.map((catalog) => {
            const selected = catalogId === catalog.id;
            return (
              <Pressable
                key={catalog.id}
                onPress={() => setCatalogId(catalog.id)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                style={[
                  styles.chip,
                  selected && styles.chipActive,
                  catalog.status === 'inactive' && styles.inactiveChip,
                ]}
              >
                <Text style={[styles.chipText, selected && { color: '#FFF' }]}>
                  {catalog.name} · {catalog.status === 'active' ? 'Activo' : 'Inactivo'}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {error ? (
        <View style={styles.message}>
          <Text style={styles.errorText}>{error}</Text>
          <AppButton title="Reintentar" variant="link" onPress={onRefresh} />
        </View>
      ) : null}
      {catalogId && !activeCatalogIds.has(catalogId) ? (
        <Text style={styles.inactiveMessage}>
          Este catálogo está inactivo y sus productos no se pueden pedir.
        </Text>
      ) : null}
      {loading ? <Text style={styles.empty}>Cargando catálogos…</Text> : null}
      {!loading && !error && catalogs.length === 0 ? (
        <Text style={styles.empty}>Aún no hay catálogos disponibles.</Text>
      ) : null}

      <FlatList
        data={visibleProducts}
        keyExtractor={(p) => p.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: spacing.md, gap: spacing.sm }}
        ListEmptyComponent={
          !loading && catalogs.length > 0 && !error ? (
            <Text style={styles.empty}>
              {catalogId && !activeCatalogIds.has(catalogId)
                ? 'No hay productos disponibles en este catálogo.'
                : 'No hay productos en los catálogos activos.'}
            </Text>
          ) : undefined
        }
      />

      {count > 0 && (
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerCount}>{count} artículo(s)</Text>
            <Text style={styles.footerTotal}>Total: ${total.toFixed(2)}</Text>
          </View>
          <View style={{ width: 150 }}>
            <AppButton title="Continuar" onPress={onContinue} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.primary,
  },
  hello: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  role: { color: '#F6E9D8' },
  logout: { color: '#FFF', fontWeight: '700' },
  chips: { padding: spacing.md, gap: spacing.sm },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.card,
  },
  chipActive: { backgroundColor: colors.primary },
  inactiveChip: { borderColor: colors.danger },
  chipText: { color: colors.primary, fontWeight: '600' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emoji: { fontSize: 36 },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  category: { color: colors.muted, fontSize: 12 },
  price: { color: colors.primaryDark, fontWeight: '700', marginTop: 2 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: { color: '#FFF', fontSize: 20, lineHeight: 22, fontWeight: '700' },
  qty: { fontWeight: '700', color: colors.text, minWidth: 16, textAlign: 'center' },
  soldOut: { color: colors.danger, fontWeight: '700' },
  message: {
    marginHorizontal: spacing.md,
    padding: spacing.md,
    backgroundColor: '#FDECEA',
    borderRadius: radius.md,
  },
  errorText: { color: colors.danger, fontWeight: '600' },
  inactiveMessage: {
    marginHorizontal: spacing.md,
    color: colors.danger,
    fontWeight: '700',
  },
  empty: {
    padding: spacing.lg,
    textAlign: 'center',
    color: colors.muted,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerCount: { color: colors.muted },
  footerTotal: { fontSize: 18, fontWeight: '800', color: colors.text },
});
