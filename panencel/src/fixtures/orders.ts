import { Order } from '../models/pedido';

export const ORDER_FIXTURES: Order[] = [
  {
    code: 'PN-DEMO-1042',
    total: 49,
    count: 3,
    method: 'tarjeta',
    paymentStatus: 'paid',
    fulfillmentStatus: 'ready',
    createdAt: '2026-10-24T18:30:00.000Z',
    items: [
      { productId: 'p1', name: 'Concha', unitPrice: 12, quantity: 2 },
      { productId: 'p6', name: 'Café americano', unitPrice: 25, quantity: 1 },
    ],
  },
  {
    code: 'PN-DEMO-1043',
    total: 31,
    count: 3,
    method: 'efectivo',
    paymentStatus: 'pending',
    fulfillmentStatus: 'pending',
    createdAt: '2026-10-24T18:45:00.000Z',
    items: [
      { productId: 'p4', name: 'Bolillo', unitPrice: 5, quantity: 2 },
      { productId: 'p7', name: 'Chocolate caliente', unitPrice: 21, quantity: 1 },
    ],
  },
];
