import type { CustomerType } from "../types/customer.type";
import type { AxiosResponse } from "../types/Axios";

import { request } from "./request";

export const GetAllCustomerAPI = async () => {
  const response: AxiosResponse<CustomerType[]> = await request({
    url: `customer`,
    method: "GET",
  });
  return response?.data ?? [];
};

export const updateCustomerAPI = async (
  id: string,
  body: { c_name: string; c_email: string }
): Promise<CustomerType> => {
  const response: AxiosResponse<CustomerType> = await request({
    url: `customer/${id}`,
    method: "PATCH",
    body,
  });

  return response?.data ?? ({} as CustomerType);
};
