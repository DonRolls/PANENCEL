import { Period } from '../models/periodo';
import { salesByPeriod } from '../fixtures/mock';

export interface SalesProduct {
  id: string;
  name: string;
  units: number;
  total: number;
}

export interface SalesPeriodData {
  collected: number;
  deltaPercent: number;
  deltaLabel: string;
  paidOrders: number;
  averageTicket: number;
  pendingOrders: number;
  pendingTotal: number;
  topProducts: SalesProduct[];
}

// TEMPORAL · Fixture en memoria.
// Origen real: vistas admin_sales_summary_by_day + admin_top_products en Supabase.
// Se elimina cuando se implemente la consulta real.
export async function getSalesByPeriod(
  period: Period,
): Promise<SalesPeriodData> {
  return salesByPeriod[period];
}