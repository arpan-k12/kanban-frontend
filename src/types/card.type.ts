import type { Column } from "./column.type";
import type { Customer } from "./customer.type";
import type { Inquiry } from "./inquiry.type";

export interface CardData {
  id: string;
  column_id: string;
  customer_id: string;
  inquiry_id: string;
  assigned_to: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  column: Column;
  inquiry: Inquiry;
  customer: Customer;
}
