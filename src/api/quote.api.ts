import type { QuoteType } from "../types/quote.type";
import type { AxiosResponse } from "../types/Axios";
import { request } from "./request";

export const createQuoteAPI = async (body: {
  card_id: string;
  amount: number;
  valid_until: string;
}): Promise<QuoteType> => {
  const response: AxiosResponse<QuoteType> = await request({
    url: "quote",
    method: "POST",
    body,
  });

  return response?.data ?? ({} as QuoteType);
};

export const updateQuoteAPI = async (
  quoteId: string,
  body: { amount: number; valid_until: string }
): Promise<QuoteType> => {
  const response: AxiosResponse<QuoteType> = await request({
    url: `quote/${quoteId}`,
    method: "PATCH",
    body,
  });

  return response?.data ?? ({} as QuoteType);
};
