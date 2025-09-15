import type { categories } from "./categories.type";

export interface Product {
  id: string;
  name: string;
  category_id: string;
  image: string[];
  description: string;
  price: number;
  categories: categories;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ProductFormValues {
  name: string;
  category_id: string;
  description: string;
  price: number;
  image: File[];
}
