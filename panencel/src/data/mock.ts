import { Period } from '../types';

interface SalesProduct {
  id: string;
  name: string;
  units: number;
  total: number;
}

interface SalesPeriod {
  collected: number;
  deltaPercent: number;
  deltaLabel: string;
  paidOrders: number;
  averageTicket: number;
  pendingOrders: number;
  pendingTotal: number;
  topProducts: SalesProduct[];
}

export const salesByPeriod: Record<Period, SalesPeriod> = {
  today: {
    collected: 4280,
    deltaPercent: 12,
    deltaLabel: 'ayer',
    paidOrders: 86,
    averageTicket: 49.77,
    pendingOrders: 4,
    pendingTotal: 215,
    topProducts: [
      { id: 'p1', name: 'Concha', units: 42, total: 504 },
      { id: 'p4', name: 'Bolillo', units: 36, total: 180 },
      { id: 'p6', name: 'Café americano', units: 18, total: 450 },
    ],
  },
  week: {
    collected: 28650,
    deltaPercent: 8,
    deltaLabel: 'la semana pasada',
    paidOrders: 574,
    averageTicket: 49.91,
    pendingOrders: 12,
    pendingTotal: 680,
    topProducts: [
      { id: 'p1', name: 'Concha', units: 286, total: 3432 },
      { id: 'p4', name: 'Bolillo', units: 244, total: 1220 },
      { id: 'p6', name: 'Café americano', units: 132, total: 3300 },
    ],
  },
  month: {
    collected: 118420,
    deltaPercent: 15,
    deltaLabel: 'el mes pasado',
    paidOrders: 2378,
    averageTicket: 49.8,
    pendingOrders: 38,
    pendingTotal: 2140,
    topProducts: [
      { id: 'p1', name: 'Concha', units: 1180, total: 14160 },
      { id: 'p4', name: 'Bolillo', units: 1015, total: 5075 },
      { id: 'p6', name: 'Café americano', units: 582, total: 14550 },
    ],
  },
};
