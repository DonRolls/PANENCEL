import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CartProvider, useCart } from './src/context/CartContext';
import { CATEGORIES, PRODUCTS } from './src/data/mockData';
import { Catalog, Order, PaymentMethod, Product } from './src/types';
import { CheckoutScreen } from './src/screens/CheckoutScreen';
import { CatalogFormScreen } from './src/screens/CatalogFormScreen';
import { CatalogsScreen } from './src/screens/CatalogsScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { MenuScreen } from './src/screens/MenuScreen';
import { OrderSuccessScreen } from './src/screens/OrderSuccessScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { SalesSummaryScreen } from './src/screens/SalesSummaryScreen';
import { colors, spacing } from './src/theme';

type Screen =
  | 'login'
  | 'register'
  | 'menu'
  | 'checkout'
  | 'success'
  | 'sales'
  | 'catalogs'
  | 'catalog-form';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const { user, logout } = useAuth();
  const { clear, count, total } = useCart();
  const [screen, setScreen] = useState<Screen>('login');
  const [order, setOrder] = useState<Order | null>(null);
  const [products] = useState<Product[]>(PRODUCTS);
  const [catalogs, setCatalogs] = useState<Catalog[]>(() =>
    CATEGORIES.map((name, index) => ({
      id: `catalog-${index + 1}`,
      name,
      description: '',
      status: 'active',
      productIds: PRODUCTS.filter((product) => product.category === name).map(
        (product) => product.id,
      ),
    })),
  );
  const [editingCatalogId, setEditingCatalogId] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin';
  const openCatalogForm = (id: string | null = null) => {
    setEditingCatalogId(id);
    setScreen('catalog-form');
  };

  const confirmOrder = (method: PaymentMethod) => {
    setOrder({
      code: `PN${Date.now().toString().slice(-6)}`,
      total,
      count,
      method,
    });
    clear();
    setScreen('success');
  };

  let content;
  if (!user) {
    content =
      screen === 'register' ? (
        <RegisterScreen onGoLogin={() => setScreen('login')} />
      ) : (
        <LoginScreen onGoRegister={() => setScreen('register')} />
      );
  } else if (
    isAdmin &&
    (screen === 'sales' || screen === 'login' || screen === 'register')
  ) {
    content = <SalesSummaryScreen onManageCatalogs={() => setScreen('catalogs')} />;
  } else if (isAdmin && screen === 'catalogs') {
    content = (
      <CatalogsScreen
        catalogs={catalogs}
        products={products}
        onCreate={() => openCatalogForm()}
        onEdit={(id) => openCatalogForm(id)}
        onDelete={(id) =>
          setCatalogs((current) => current.filter((catalog) => catalog.id !== id))
        }
      />
    );
  } else if (isAdmin && screen === 'catalog-form') {
    const editingCatalog = catalogs.find(
      (catalog) => catalog.id === editingCatalogId,
    );
    content = (
      <CatalogFormScreen
        key={editingCatalog?.id ?? 'new-catalog'}
        catalog={editingCatalog}
        products={products}
        onSave={(data) => {
          if (editingCatalog) {
            setCatalogs((current) =>
              current.map((catalog) =>
                catalog.id === editingCatalog.id
                  ? { ...data, id: editingCatalog.id }
                  : catalog,
              ),
            );
          } else {
            setCatalogs((current) => [
              ...current,
              { ...data, id: `catalog-${Date.now()}` },
            ]);
          }
          setScreen('catalogs');
        }}
        onCancel={() => setScreen('catalogs')}
      />
    );
  } else if (screen === 'checkout') {
    content = (
      <CheckoutScreen
        onBack={() => setScreen('menu')}
        onConfirm={confirmOrder}
      />
    );
  } else if (screen === 'success' && order) {
    content = (
      <OrderSuccessScreen
        order={order}
        onNewOrder={() => {
          setOrder(null);
          setScreen('menu');
        }}
      />
    );
  } else {
    content = <MenuScreen onContinue={() => setScreen('checkout')} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      {isAdmin && screen !== 'login' && screen !== 'register' && (
        <View style={styles.adminNav}>
          <AdminNavButton
            label="Ventas"
            active={screen === 'sales'}
            onPress={() => setScreen('sales')}
          />
          <AdminNavButton
            label="Catálogos"
            active={screen === 'catalogs' || screen === 'catalog-form'}
            onPress={() => setScreen('catalogs')}
          />
          <AdminNavButton
            label="Menú"
            active={screen === 'menu' || screen === 'checkout' || screen === 'success'}
            onPress={() => setScreen('menu')}
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              logout();
              clear();
              setScreen('login');
              setOrder(null);
            }}
          >
            <Text style={styles.logout}>Salir</Text>
          </Pressable>
        </View>
      )}
      {content}
    </SafeAreaView>
  );
}

function AdminNavButton({
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
      style={[styles.navButton, active && styles.navButtonActive]}
    >
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  adminNav: {
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
  navButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: 10,
  },
  navButtonActive: { backgroundColor: colors.cream },
  navLabel: { color: colors.muted, fontSize: 13, fontWeight: '700' },
  navLabelActive: { color: colors.primaryDark },
  logout: { color: colors.danger, fontSize: 13, fontWeight: '700' },
});
