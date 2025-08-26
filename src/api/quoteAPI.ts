import api from "./index";

export const createQuote = (data: {
  card_id: string;
  amount: number;
  valid_until: string;
}) => {
  return api.post(`/quote`, data);
};

export const updateQuote = (
  quoteId: string,
  data: { amount: number; valid_until: string }
) => {
  return api.patch(`/quote/${quoteId}`, data);
};
