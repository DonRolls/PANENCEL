export interface Product {
  id: string;
  name: string;
  description: string;   // nuevo
  category: string;
  price: number;
  emoji: string;
  available: boolean;
  catalogIds: string[];
}