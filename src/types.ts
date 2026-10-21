export type Role = 'admin' | 'cliente' | 'invitado';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  emoji: string;
  available: boolean;
}

export type AuthResult = { ok: true } | { ok: false; message: string };

//funciones agregadas por emmanuel

export type PaymentMethod = 'efectivo' | 'tarjeta';

export interface Order {
  code: string;
  total: number;
  count: number;
  method: PaymentMethod;
}
