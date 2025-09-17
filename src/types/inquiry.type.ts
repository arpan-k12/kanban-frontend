import type { Product } from "./product.type";

export interface Inquiry {
  id: string;
  customer_id: string;
  product_id: string;
  quantity: string;
  price: string;
  budget: number;
  identification_code: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  product?: Product;
}
