import { useCallback, useEffect, useState } from 'react';
import { Catalog } from '../models/catalogo';
import {
  CatalogInput,
  deleteCatalog,
  listCatalogs,
  saveCatalog,
} from '../repositories/repositorycatalogos';

export function useCatalogsController(enabled: boolean = true) {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError('');
    try {
      setCatalogs(await listCatalogs());
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'No se pudieron cargar las categorías.',
      );
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const save = useCallback(
    async (input: CatalogInput, id?: string) => {
      await saveCatalog(input, id);
      await refresh();
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteCatalog(id);
      await refresh();
    },
    [refresh],
  );

  return { catalogs, loading, error, refresh, save, remove };
}