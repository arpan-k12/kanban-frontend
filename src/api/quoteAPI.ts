import type { Quote } from "../types/quote.type";
import api from "./index";

export const createQuote = async (data: {
  card_id: string;
  amount: number;
  valid_until: string;
}): Promise<Quote> => {
  const response = await api.post<{ data: Quote }>("/quote", data);
  return response.data.data;
};

export const updateQuote = async (
  quoteId: string,
  data: { amount: number; valid_until: string }
): Promise<Quote> => {
  const response = await api.patch<{ data: Quote }>(`/quote/${quoteId}`, data);
  return response.data.data;
};
