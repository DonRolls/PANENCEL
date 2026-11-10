import { Order } from '../models/pedido';
import { ORDER_FIXTURES } from '../fixtures/orders';

// TODO: migrar a Supabase (orders + order_items) cuando se complete
// el flujo de creación/consulta de pedidos en el cliente.
// Por ahora mantiene el comportamiento actual basado en fixtures.
export async function listOrders(): Promise<Order[]> {
  return ORDER_FIXTURES;
}