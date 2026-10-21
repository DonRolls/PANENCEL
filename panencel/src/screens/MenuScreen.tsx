import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES, PRODUCTS } from '../data/mockData';
import { Product } from '../types';
import { colors, radius, spacing } from '../theme';

const ALL = 'Todos';

export function MenuScreen() {
  const { user, logout } = useAuth();
  const [category, setCategory] = useState<string>(ALL);
  const [cart, setCart] = useState<Record<string, number>>({});

  const visibleProducts = useMemo(
    () => (category === ALL ? PRODUCTS : PRODUCTS.filter((p) => p.category === category)),
    [category],
  );

  const { total, count } = useMemo(() => {
    let t = 0;
    let c = 0;
    for (const p of PRODUCTS) {
      const q = cart[p.id] ?? 0;
      t += q * p.price;
      c += q;
    }
    return { total: t, count: c };
  }, [cart]);

  const add = (p: Product) => setCart((prev) => ({ ...prev, [p.id]: (prev[p.id] ?? 0) + 1 }));
  const remove = (p: Product) =>
    setCart((prev) => {
      const q = (prev[p.id] ?? 0) - 1;
      const next = { ...prev };
      if (q <= 0) delete next[p.id];
      else next[p.id] = q;
      return next;
    });

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
        <Pressable onPress={logout} hitSlop={8}>
          <Text style={styles.logout}>Salir</Text>
        </Pressable>
      </View>

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {[ALL, ...CATEGORIES].map((c) => (
            <Pressable
              key={c}
              onPress={() => setCategory(c)}
              style={[styles.chip, category === c && styles.chipActive]}
            >
              <Text style={[styles.chipText, category === c && { color: '#FFF' }]}>{c}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={visibleProducts}
        keyExtractor={(p) => p.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: spacing.md, gap: spacing.sm }}
      />

      {count > 0 && (
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerCount}>{count} artículo(s)</Text>
            <Text style={styles.footerTotal}>Total: ${total.toFixed(2)}</Text>
          </View>
          <View style={{ width: 150 }}>
            <AppButton
              title="Continuar"
              onPress={() =>
                Alert.alert('Pedido en preparación', 'El proceso de pago se desarrollará en la siguiente actividad.')
              }
            />
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
