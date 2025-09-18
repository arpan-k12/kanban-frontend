import type { Product } from "./product.type";

export interface ItemInput {
  product_id: string;
  quantity: number;
  unit_price?: number;
  total_price: number;
}

export interface inquiryItemType {
  id: string;
  inquiry_id: string;
  product_id: string;
  quantity: string;
  total_price: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  product: Product;
}
