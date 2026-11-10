import { Catalog } from '../models/catalogo';
import { requireSupabase } from '../supabase/client';

export type CatalogInput = Omit<Catalog, 'id'>;

export async function listCatalogs(): Promise<Catalog[]> {
  const client = requireSupabase();
  const [categoriesResult, linksResult] = await Promise.all([
    client
      .from('categories')
      .select('id, name, description, is_active')
      .order('name'),
    client.from('category_products').select('category_id, product_id'),
  ]);

  if (categoriesResult.error) throw categoriesResult.error;
  if (linksResult.error) throw linksResult.error;

  return categoriesResult.data.map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description,
    status: category.is_active ? 'active' : 'inactive',
    productIds: linksResult.data
      .filter((link) => link.category_id === category.id)
      .map((link) => link.product_id),
  }));
}

export async function saveCatalog(
  input: CatalogInput,
  catalogId?: string,
): Promise<void> {
  const { error } = await requireSupabase().rpc('admin_save_category', {
    p_category_id: catalogId ?? null,
    p_name: input.name,
    p_description: input.description,
    p_is_active: input.status === 'active',
    p_product_ids: input.productIds,
  });
  if (error) throw error;
}

export async function deleteCatalog(catalogId: string): Promise<void> {
  const { error } = await requireSupabase()
    .from('categories')
    .delete()
    .eq('id', catalogId);
  if (error) throw error;
}
