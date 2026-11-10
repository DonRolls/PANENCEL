import { Product } from '../models/producto';
import { requireSupabase } from '../supabase/client';

export interface ProductInput {
  name: string;
  description: string;
  emoji: string;
  price: number;
  available: boolean;
  catalogIds: string[];
}

export async function listProducts(): Promise<Product[]> {
  const client = requireSupabase();
  const [productsResult, categoriesResult, linksResult] = await Promise.all([
    client
      .from('products')
      .select('id, name, description, price, emoji, is_available')
      .order('name'),
    client.from('categories').select('id, name'),
    client.from('category_products').select('category_id, product_id'),
  ]);

  if (productsResult.error) throw productsResult.error;
  if (categoriesResult.error) throw categoriesResult.error;
  if (linksResult.error) throw linksResult.error;

  const catalogNames = new Map(
    categoriesResult.data.map((category) => [category.id, category.name]),
  );
  const productCatalogs = new Map<string, string[]>();
  for (const link of linksResult.data) {
    const ids = productCatalogs.get(link.product_id) ?? [];
    ids.push(link.category_id);
    productCatalogs.set(link.product_id, ids);
  }

  return productsResult.data.map((product) => {
    const catalogIds = productCatalogs.get(product.id) ?? [];
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      category: catalogIds
        .map((id) => catalogNames.get(id))
        .filter((name): name is string => Boolean(name))
        .join(', '),
      price: Number(product.price),
      emoji: product.emoji,
      available: product.is_available,
      catalogIds,
    };
  });
}

export async function saveProduct(
  input: ProductInput,
  productId?: string,
): Promise<string> {
  const { data, error } = await requireSupabase().rpc('admin_save_product', {
    p_product_id: productId ?? null,
    p_name: input.name,
    p_description: input.description,
    p_emoji: input.emoji,
    p_price: input.price,
    p_is_available: input.available,
    p_category_ids: input.catalogIds,
  });
  if (error) throw error;
  return data as string;
}

export async function deleteProduct(productId: string): Promise<void> {
  const { error } = await requireSupabase()
    .from('products')
    .delete()
    .eq('id', productId);
  if (error) throw error;
}