import type { AxiosResponse } from "../types/Axios.ts";
import { request } from "./request.ts";

export const GetProductAPI = async (search?: string) => {
  const response: AxiosResponse<any> = await request({
    url: `product`,
    method: "GET",
    params: search ? { search } : {},
  });
  return response?.data ?? [];
};

export const AddProductAPI = async (formData?: FormData) => {
  const response: AxiosResponse<any> = await request({
    url: `product`,
    method: "POST",
    body: formData,
  });

  return response;
};

export const getProductByIdAPI = async (id: string) => {
  const response: AxiosResponse<any> = await request({
    url: `product/${id}`,
    method: "GET",
  });

  return response?.data;
};

export const updateProductAPI = async (id: string, body: any) => {
  const response: AxiosResponse<any> = await request({
    url: `product/${id}`,
    method: "PATCH",
    body,
  });

  return response;
};

export const deleteProductAPI = async (id: string) => {
  const response: AxiosResponse<any> = await request({
    url: `product/${id}`,
    method: "DELETE",
  });

  return response;
};
