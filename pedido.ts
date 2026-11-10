import { OrderItem } from './detalle-pedido';

export type PaymentMethod = 'efectivo' | 'tarjeta';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type FulfillmentStatus =
  | 'pending'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled';

export interface Order {
  code: string;
  total: number;
  count: number;
  method: PaymentMethod;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  createdAt: string;
  items: OrderItem[];
}
