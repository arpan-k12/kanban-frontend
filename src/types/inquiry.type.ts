import type { inquiryItemType } from "./inquiryItem.type";
import type { Product } from "./product.type";

export interface InquiryType {
  id: string;
  customer_id: string;
  grand_total: string;
  product_id: string;
  quantity: string;
  price: string;
  budget: number;
  identification_code: string;
  items: inquiryItemType[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  product?: Product;
}
