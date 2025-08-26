import type { ColumnType } from "./column.type";
import type { Customer } from "./customer.type";
import type { Decision } from "./decision.type";
import type { Inquiry } from "./inquiry.type";
import type { Quote } from "./quote.type";

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
  column: ColumnType;
  inquiry: Inquiry;
  customer?: Customer;
  quote?: Quote;
  decision?: Decision;
}
