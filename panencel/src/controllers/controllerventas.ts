import { useCallback, useEffect, useState } from 'react';
import { Period } from '../models/periodo';
import {
  SalesPeriodData,
  getSalesByPeriod,
} from '../repositories/repositoryventas';

export function useSalesController(period: Period, enabled: boolean = true) {
  const [data, setData] = useState<SalesPeriodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError('');
    try {
      setData(await getSalesByPeriod(period));
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'No se pudieron cargar las ventas.',
      );
    } finally {
      setLoading(false);
    }
  }, [period, enabled]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}