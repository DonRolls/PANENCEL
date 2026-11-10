export type CatalogStatus = 'active' | 'inactive';

export interface Catalog {
  id: string;
  name: string;
  description: string;
  status: CatalogStatus;
  productIds: string[];
}
