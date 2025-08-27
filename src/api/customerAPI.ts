import type { Customer } from "../types/customer.type";
import api from "./index";

export const getAllCustomer = async (): Promise<Customer[]> => {
  const response = await api.get<{ data: Customer[] }>("/customer");
  return response.data.data;
};

export const updateCustomer = async (
  id: string,
  name: string,
  email: string
): Promise<Customer> => {
  const response = await api.patch<{ data: Customer }>(`/customer/${id}`, {
    c_name: name,
    c_email: email,
  });
  return response.data.data;
};
