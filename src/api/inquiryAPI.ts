import type { Inquiry } from "../types/inquiry.type";
import type { AxiosResponse } from "../types/user.type";
import { request } from "./request";

// export const createInquiryCard = async (data: {
//   customer_id: string;
//   commodity: string;
//   budget: number;
// }): Promise<Inquiry> => {
//   const response = await api.post<{ data: Inquiry }>("/inquiry", data);
//   return response.data.data;
// };

// export const updateInquiry = async (
//   id: string,
//   data: {
//     customer_id: string;
//     commodity: string;
//     budget: number;
//   }
// ): Promise<Inquiry> => {
//   const response = await api.patch<{ data: Inquiry }>(`/inquiry/${id}`, data);
//   return response.data.data;
// };

export const createInquiryCardAPI = async (data: {
  customer_id: string;
  commodity: string;
  budget: number;
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
