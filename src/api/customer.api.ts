import type { Customer } from "../types/customer.type";
import type { AxiosResponse } from "../types/Axios";

import { request } from "./request";

export const GetAllCustomerAPI = async () => {
  const response: AxiosResponse<any> = await request({
    url: `customer`,
    method: "GET",
  });
  return response?.data ?? [];
};

export const updateCustomerAPI = async (
  id: string,
  body: { c_name: string; c_email: string }
): Promise<Customer> => {
  const response: AxiosResponse<Customer> = await request({
    url: `customer/${id}`,
    method: "PATCH",
    body,
  });

  return response?.data ?? ({} as Customer);
};
