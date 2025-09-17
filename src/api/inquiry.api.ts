import type { Inquiry } from "../types/inquiry.type";
import type { AxiosResponse } from "../types/Axios";

import { request } from "./request";

export const createInquiryCardAPI = async (data: {
  organization_id: string;
  customer_id: string;
  product_id: string;
  quantity: number;
  price: number;
  budget: number;
  identification_code: string;
}): Promise<Inquiry[]> => {
  const response: AxiosResponse<Inquiry[]> = await request({
    url: "inquiry",
    method: "POST",
    body: data,
  });

  return response?.data ?? [];
};

export const updateInquiryAPI = async (
  id: string,
  data: {
    customer_id: string;
    commodity: string;
    budget: number;
  }
): Promise<Inquiry> => {
  const response: AxiosResponse<Inquiry> = await request({
    url: `inquiry/${id}`,
    method: "PATCH",
    body: data,
  });

  return response?.data ?? ({} as Inquiry);
};

export const GetUniqueIdentificationCodeAPI = async () => {
  const response: AxiosResponse<any> = await request({
    url: `inquiry/code/generate`,
    method: "GET",
  });
  return response?.data ?? [];
};
