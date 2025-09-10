import type { AxiosResponse } from "../types/Axios";
import { request } from "./request";

export const GetUsersOrganizationAPI = async () => {
  const response: AxiosResponse<any> = await request({
    url: `user-organization`,
    method: "GET",
  });
  return response?.data ?? [];
};

export const AssignUserOrganizationAPI = async (body: any) => {
  const response: AxiosResponse<any> = await request({
    url: `user-organization/assign-org`,
    method: "PUT",
    body,
  });

  return response;
};

export const getUsersOrganizationByIdAPI = async (id: string) => {
  const response: AxiosResponse<any> = await request({
    url: `user-organization/${id}`,
    method: "GET",
  });

  return response?.data;
};
