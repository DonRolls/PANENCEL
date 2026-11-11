import { useCallback, useEffect, useState } from 'react';
import { Product } from '../models/producto';
import {
  ProductInput,
  deleteProduct,
  listProducts,
  saveProduct,
} from '../repositories/repositoryproductos';

export function useProductsController(enabled: boolean = true) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError('');
    try {
      setProducts(await listProducts());
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'No se pudieron cargar los productos.',
      );
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const save = useCallback(
    async (input: ProductInput, id?: string) => {
      await saveProduct(input, id);
      await refresh();
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteProduct(id);
      await refresh();
    },
    [refresh],
  );

  return { products, loading, error, refresh, save, remove };
}