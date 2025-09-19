import type { ColumnType } from "./column.type";
import type { CustomerType } from "./customer.type";
import type { DecisionType } from "./decision.type";
import type { InquiryType } from "./inquiry.type";
import type { QuoteType } from "./quote.type";

export interface CardDataType {
  id: string;
  column_id: string;
  card_position: number;
  customer_id: string;
  inquiry_id: string;
  quote_id: string;
  decision_id: string;
  assigned_to: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  column: ColumnType;
  inquiry: InquiryType;
  customer?: CustomerType;
  quote?: QuoteType;
  decision?: DecisionType;
}
