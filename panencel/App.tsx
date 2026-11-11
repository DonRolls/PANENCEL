import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CartProvider, useCart } from './src/context/CartContext';
import { Order, PaymentMethod } from './src/models/pedido';
import { useCatalogsController } from './src/controllers/controllercatalogo';
import { useProductsController } from './src/controllers/controllerproducto';
import { useOrdersController } from './src/controllers/controllerorden';
import { useSalesController } from './src/controllers/controllerventas';
import { Period } from './src/models/periodo';
import { CatalogInput } from './src/repositories/repositorycatalogos';
import { ProductInput } from './src/repositories/repositoryproductos';
import { AdminNav } from './src/components/AdminNav';
import { CheckoutScreen } from './src/screens/cliente/CheckoutScreen';
import { AdminMenuScreen } from './src/screens/administrador/AdminMenuScreen';
import { ProductFormScreen } from './src/screens/administrador/ProductFormScreen';
import { ProductsScreen } from './src/screens/administrador/ProductsScreen';
import { CatalogFormScreen } from './src/screens/administrador/CatalogFormScreen';
import { CatalogsScreen } from './src/screens/administrador/CatalogsScreen';
import { OrdersScreen } from './src/screens/administrador/OrdersScreen';
import { CartScreen } from './src/screens/cliente/CartScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { MenuScreen } from './src/screens/cliente/MenuScreen';
import { OrderSuccessScreen } from './src/screens/cliente/OrderSuccessScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { SalesSummaryScreen } from './src/screens/administrador/SalesSummaryScreen';
import { colors, spacing } from './src/theme';

type Screen =
  | 'login'
  | 'register'
  | 'menu'
  | 'cart'
  | 'checkout'
  | 'success'
  | 'admin-menu'
  | 'sales'
  | 'orders'
  | 'catalogs'
  | 'catalog-form'
  | 'products'
  | 'product-form';

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
  const { user, loading: authLoading, logout } = useAuth();
  const { clear, count, lines, total, setProducts: setCartProducts } = useCart();
  const [screen, setScreen] = useState<Screen>('login');
  const [order, setOrder] = useState<Order | null>(null);
  const [editingCatalogId, setEditingCatalogId] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [salesPeriod, setSalesPeriod] = useState<Period>('today');
  const isAdmin = user?.role === 'admin';
  const dataEnabled = !authLoading && !!user;

  // ── Controllers ────────────────────────────────────────────────────────
  const {
  data: salesData,
  loading: salesLoading,
  error: salesError,
  refresh: refreshSales,
} = useSalesController(salesPeriod, dataEnabled && isAdmin);
  const {
    catalogs,
    loading: catalogsLoading,
    error: catalogsError,
    refresh: refreshCatalogs,
    save: saveCatalog,
    remove: removeCatalog,
  } = useCatalogsController(dataEnabled);

  const {
    products,
    loading: productsLoading,
    error: productsError,
    refresh: refreshProducts,
    save: saveProduct,
    remove: removeProduct,
  } = useProductsController(dataEnabled);

  const { orders, checkout, confirmCashPayment, markCompleted } =
    useOrdersController();

  const catalogLoading = catalogsLoading || productsLoading;
  const catalogError = catalogsError || productsError;

  // Sincroniza productos al carrito (para resolver nombre/precio de líneas)
  useEffect(() => {
    setCartProducts(products);
  }, [products, setCartProducts]);

  // ── Handlers que cruzan catálogo ↔ producto (junction comparte ambas) ──
  const handleRefreshAll = useCallback(() => {
    void refreshCatalogs();
    void refreshProducts();
  }, [refreshCatalogs, refreshProducts]);

  const handleSaveCatalog = useCallback(
    async (data: CatalogInput, id?: string) => {
      await saveCatalog(data, id);
      await refreshProducts();
    },
    [saveCatalog, refreshProducts],
  );

  const handleSaveProduct = useCallback(
    async (data: ProductInput, id?: string) => {
      await saveProduct(data, id);
      await refreshCatalogs();
    },
    [saveProduct, refreshCatalogs],
  );

  const handleDeleteCatalog = useCallback(
    async (id: string) => {
      try {
        await removeCatalog(id);
        await refreshProducts();
      } catch (cause) {
        Alert.alert(
          'No se pudo eliminar el catálogo',
          cause instanceof Error ? cause.message : 'Inténtalo de nuevo.',
        );
      }
    },
    [removeCatalog, refreshProducts],
  );

  const handleDeleteProduct = useCallback(
    async (id: string) => {
      try {
        await removeProduct(id);
        await refreshCatalogs();
      } catch (cause) {
        Alert.alert(
          'No se pudo eliminar el producto',
          cause instanceof Error ? cause.message : 'Inténtalo de nuevo.',
        );
      }
    },
    [removeProduct, refreshCatalogs],
  );

  // ── Navegación ────────────────────────────────────────────────────────
  const openCatalogForm = (id: string | null = null) => {
    setEditingCatalogId(id);
    setScreen('catalog-form');
  };

  const openProductForm = (id: string | null = null) => {
    setEditingProductId(id);
    setScreen('product-form');
  };

  const handleLogout = async () => {
    try {
      await logout();
      clear();
      setScreen('login');
      setOrder(null);
    } catch (cause) {
      Alert.alert(
        'No se pudo cerrar sesión',
        cause instanceof Error ? cause.message : 'Inténtalo de nuevo.',
      );
    }
  };

  // ── Back físico (Android) ── se queda aquí por decisión de diseño ─────
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!user && screen === 'register') {
        setScreen('login');
        return true;
      }
      if (user && screen === 'checkout') {
        setScreen('cart');
        return true;
      }
      if (user && screen === 'cart') {
        setScreen('menu');
        return true;
      }
      if (user && screen === 'success') {
        setOrder(null);
        setScreen('menu');
        return true;
      }
      if (isAdmin && screen === 'product-form') {
        setScreen('products');
        return true;
      }
      if (isAdmin && screen === 'catalog-form') {
        setScreen('catalogs');
        return true;
      }
      if (
        isAdmin &&
        (screen === 'products' ||
          screen === 'catalogs' ||
          screen === 'sales' ||
          screen === 'orders')
      ) {
        setScreen('admin-menu');
        return true;
      }
      return false;
    });

    return () => subscription.remove();
  }, [user, isAdmin, screen]);

  // ── Checkout ──────────────────────────────────────────────────────────
const handleConfirmOrder = (method: PaymentMethod) => {
  const newOrder = checkout(method, { lines, total, count });
  setOrder(newOrder);
  clear();
  setScreen('success');
};

  // ── Render ────────────────────────────────────────────────────────────
  let content: React.ReactNode;

  if (authLoading) {
    content = (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando sesión…</Text>
      </View>
    );
  } else if (!user) {
    content =
      screen === 'register' ? (
        <RegisterScreen onGoLogin={() => setScreen('login')} />
      ) : (
        <LoginScreen onGoRegister={() => setScreen('register')} />
      );
  } else if (
    isAdmin &&
    (screen === 'login' || screen === 'register' || screen === 'admin-menu')
  ) {
    content = (
      <AdminMenuScreen
        onOpenSales={() => setScreen('sales')}
        onOpenProducts={() => setScreen('products')}
        onOpenCategories={() => setScreen('catalogs')}
        onLogout={handleLogout}
      />
    );
  } else if (isAdmin && screen === 'sales') {
  content = (
    <SalesSummaryScreen
      data={salesData}
      loading={salesLoading}
      error={salesError}
      period={salesPeriod}
      onPeriodChange={setSalesPeriod}
      onRetry={refreshSales}
      onBackToPanel={() => setScreen('admin-menu')}
    />
  );
  } else if (isAdmin && screen === 'products') {
    content = (
      <ProductsScreen
        products={products}
        loading={catalogLoading}
        error={catalogError}
        onRefresh={handleRefreshAll}
        onCreate={() => openProductForm()}
        onEdit={(id) => openProductForm(id)}
        onDelete={handleDeleteProduct}
        onBack={() => setScreen('admin-menu')}
      />
    );
  } else if (isAdmin && screen === 'product-form') {
    const editingProduct = products.find((p) => p.id === editingProductId);
    content = (
      <ProductFormScreen
        key={editingProduct?.id ?? 'new-product'}
        product={editingProduct}
        catalogs={catalogs}
        onSave={async (values: ProductInput) => {
          try {
            await handleSaveProduct(values, editingProduct?.id);
            setScreen('products');
          } catch (cause) {
            Alert.alert(
              'No se pudo guardar el producto',
              cause instanceof Error ? cause.message : 'Inténtalo de nuevo.',
            );
          }
        }}
        onCancel={() => setScreen('products')}
      />
    );
  } else if (isAdmin && screen === 'catalogs') {
    content = (
      <CatalogsScreen
        catalogs={catalogs}
        products={products}
        loading={catalogLoading}
        error={catalogError}
        onRefresh={handleRefreshAll}
        onCreate={() => openCatalogForm()}
        onEdit={(id) => openCatalogForm(id)}
        onDelete={handleDeleteCatalog}
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
        onSave={async (data: CatalogInput) => {
          try {
            await handleSaveCatalog(data, editingCatalog?.id);
            setScreen('catalogs');
          } catch (cause) {
            Alert.alert(
              'No se pudo guardar el catálogo',
              cause instanceof Error ? cause.message : 'Inténtalo de nuevo.',
            );
          }
        }}
        onCancel={() => setScreen('catalogs')}
      />
    );
  } else if (isAdmin && screen === 'orders') {
    content = (
      <OrdersScreen
        orders={orders}
        onConfirmCashPayment={confirmCashPayment}
        onMarkCompleted={markCompleted}
      />
    );
  } else if (screen === 'cart') {
    content = (
      <CartScreen
        onBack={() => setScreen('menu')}
        onContinue={() => setScreen('checkout')}
      />
    );
  } else if (screen === 'checkout') {
    content = (
      <CheckoutScreen
        onBack={() => setScreen('cart')}
        onConfirm={handleConfirmOrder}
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
    content = (
      <MenuScreen
        catalogs={catalogs}
        products={products}
        loading={catalogLoading}
        error={catalogError}
        onRefresh={handleRefreshAll}
        onContinue={() => setScreen('cart')}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      {isAdmin && screen !== 'login' && screen !== 'register' && (
        <AdminNav
          panelActive={
            screen === 'admin-menu' ||
            screen === 'sales' ||
            screen === 'products' ||
            screen === 'product-form' ||
            screen === 'catalogs' ||
            screen === 'catalog-form'
          }
          ordersActive={screen === 'orders'}
          menuActive={
            screen === 'menu' ||
            screen === 'cart' ||
            screen === 'checkout' ||
            screen === 'success'
          }
          onOpenPanel={() => setScreen('admin-menu')}
          onOpenOrders={() => setScreen('orders')}
          onOpenMenu={() => setScreen('menu')}
          onLogout={handleLogout}
        />
      )}
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  loadingText: { color: colors.muted },
});