import React, { useMemo, useState } from 'react';
// CAMBIO 1: se quitó `Alert` de los imports porque ya no mostramos la alerta
// "Pedido en preparación"; ahora el botón Continuar navega a la pantalla de pedido.
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { useAuth } from '../context/AuthContext';
// CAMBIO 2: se importa el nuevo contexto del carrito.
import { useCart } from '../context/CartContext';
import { CATEGORIES, PRODUCTS } from '../data/mockData';
import { Product } from '../types';
import { colors, radius, spacing } from '../theme';

const ALL = 'Todos';

// CAMBIO 3: ahora recibe `onContinue` por props. Antes la pantalla no sabía
// cómo avanzar; así App.tsx decide a dónde ir (Checkout) y MenuScreen solo avisa
// que el usuario quiere continuar.
interface Props {
  onContinue: () => void;
}

export function MenuScreen({ onContinue }: Props) {
  const { user, logout } = useAuth();
  const [category, setCategory] = useState<string>(ALL);

  // CAMBIO 4: el carrito ya no vive en un useState local de esta pantalla.
  // Si se quedaba aquí, al pasar a Checkout se perdería (MenuScreen se desmonta).
  // Ahora vive en CartContext y lo compartimos entre Menú, Checkout y Pedido listo.
  // Reemplaza a: useState del carrito, el useMemo de { total, count }, y las
  // funciones `add` y `remove` que antes estaban definidas aquí.
  const { cart, total, count, add, remove } = useCart();

  const visibleProducts = useMemo(
    () => (category === ALL ? PRODUCTS : PRODUCTS.filter((p) => p.category === category)),
    [category],
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
            {/* CAMBIO 5: antes abría Alert.alert('Pedido en preparación', ...).
                Ahora llama a onContinue para ir a la pantalla "Tu pedido". */}
            <AppButton title="Continuar" onPress={onContinue} />
          </View>
        </View>
      )}
    </View>
  );
}

// Los estilos no cambiaron.
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
