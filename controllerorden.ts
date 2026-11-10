import { useCallback, useState } from 'react';
import { Order, PaymentMethod } from '../models/pedido';
import { ORDER_FIXTURES } from '../fixtures/orders';
import type { CartLine } from '../context/CartContext';

export interface CartSnapshot {
  lines: CartLine[];
  total: number;
  count: number;
}

// Estado local mientras migramos pedidos a Supabase.
// Cuando esté listo, checkout() llamará a orderRepository.create().
export function useOrdersController() {
  const [orders, setOrders] = useState<Order[]>(ORDER_FIXTURES);

  const checkout = useCallback(
    (method: PaymentMethod, cart: CartSnapshot): Order => {
      const newOrder: Order = {
        code: `PN${Date.now().toString().slice(-6)}`,
        total: cart.total,
        count: cart.count,
        method,
        paymentStatus: method === 'tarjeta' ? 'paid' : 'pending',
        fulfillmentStatus: 'pending',
        createdAt: new Date().toISOString(),
        items: cart.lines.map(({ product, qty }) => ({
          productId: product.id,
          name: product.name,
          unitPrice: product.price,
          quantity: qty,
        })),
      };
      setOrders((current) => [newOrder, ...current]);
      return newOrder;
    },
    [],
  );

  const confirmCashPayment = useCallback((code: string) => {
    setOrders((current) =>
      current.map((order) =>
        order.code === code ? { ...order, paymentStatus: 'paid' } : order,
      ),
    );
  }, []);

  const markCompleted = useCallback((code: string) => {
    setOrders((current) =>
      current.map((order) =>
        order.code === code
          ? { ...order, fulfillmentStatus: 'completed' }
          : order,
      ),
    );
  }, []);

  return { orders, checkout, confirmCashPayment, markCompleted };
}