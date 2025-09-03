import type { Customer } from "../types/customer.type";

// export const getAllCustomer = async (): Promise<Customer[]> => {
//   const response = await api.get<{ data: Customer[] }>("/customer");
//   return response.data.data;
// };

// export const updateCustomer = async (
//   id: string,
//   name: string,
//   email: string
// ): Promise<Customer> => {
//   const response = await api.patch<{ data: Customer }>(`/customer/${id}`, {
//     c_name: name,
//     c_email: email,
//   });
//   return response.data.data;
// };

// import {} from "../types/project";
import type { AxiosResponse } from "../types/user.type";
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
