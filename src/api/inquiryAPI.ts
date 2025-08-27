import type { Inquiry } from "../types/inquiry.type";
import api from "./index";

export const createInquiryCard = async (data: {
  customer_id: string;
  commodity: string;
  budget: number;
}): Promise<Inquiry> => {
  const response = await api.post<{ data: Inquiry }>("/inquiry", data);
  return response.data.data;
};

export const updateInquiry = async (
  id: string,
  data: {
    customer_id: string;
    commodity: string;
    budget: number;
  }
): Promise<Inquiry> => {
  const response = await api.patch<{ data: Inquiry }>(`/inquiry/${id}`, data);
  return response.data.data;
};
