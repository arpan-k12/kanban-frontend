import type { AxiosResponse } from "../types/Axios.ts";
import { request } from "./request.ts";

export const GetOrganizationAPI = async () => {
  const response: AxiosResponse<any> = await request({
    url: `organization`,
    method: "GET",
  });
  return response?.data ?? [];
};

export const AddOrganizationAPI = async (body: any) => {
  const response: AxiosResponse<any> = await request({
    url: `organization`,
    method: "POST",
    body,
  });

  return response;
};

export const getOrganizationByIdAPI = async (id: string) => {
  const response: AxiosResponse<any> = await request({
    url: `organization/${id}`,
    method: "GET",
  });

  return response;
};

export const updateOrganizationAPI = async (id: string, body: any) => {
  const response: AxiosResponse<any> = await request({
    url: `organization/${id}`,
    method: "PATCH",
    body,
  });

  return response;
};

export const deleteOrganizationAPI = async (id: string) => {
  const response: AxiosResponse<any> = await request({
    url: `organization/${id}`,
    method: "DELETE",
  });

  return response;
};
