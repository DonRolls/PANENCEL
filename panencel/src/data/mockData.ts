import { Product, User } from '../types';

// Sustituye a la tabla "usuarios" de la base de datos.
export const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Administrador', email: 'admin@panencel.com', password: 'admin123', role: 'admin' },
  { id: 'u2', name: 'María López', email: 'cliente@panencel.com', password: 'cliente123', role: 'cliente' },
];

export const GUEST_USER: User = {
  id: 'guest',
  name: 'Invitado',
  email: '',
  password: '',
  role: 'invitado',
};

// Sustituye a la tabla "categorias".
export const CATEGORIES: string[] = ['Pan dulce', 'Pan salado', 'Bebidas', 'Pasteles'];

// Sustituye a la tabla "productos".
export const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Concha', category: 'Pan dulce', price: 12, emoji: '🥐', available: true },
  { id: 'p2', name: 'Cuernito', category: 'Pan dulce', price: 14, emoji: '🥐', available: true },
  { id: 'p3', name: 'Oreja', category: 'Pan dulce', price: 15, emoji: '🍪', available: false },
  { id: 'p4', name: 'Bolillo', category: 'Pan salado', price: 5, emoji: '🥖', available: true },
  { id: 'p5', name: 'Telera', category: 'Pan salado', price: 6, emoji: '🍞', available: true },
  { id: 'p6', name: 'Café americano', category: 'Bebidas', price: 25, emoji: '☕', available: true },
  { id: 'p7', name: 'Chocolate caliente', category: 'Bebidas', price: 30, emoji: '🍫', available: true },
  { id: 'p8', name: 'Jugo de naranja', category: 'Bebidas', price: 28, emoji: '🍊', available: true },
  { id: 'p9', name: 'Rebanada de pastel de chocolate', category: 'Pasteles', price: 45, emoji: '🍰', available: true },
  { id: 'p10', name: 'Rebanada de pastel de tres leches', category: 'Pasteles', price: 48, emoji: '🎂', available: true },
];
