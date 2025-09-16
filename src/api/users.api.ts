import type { AxiosResponse } from "../types/Axios";
import { request } from "./request";

export const GetAllUsersAPI = async () => {
  const response: AxiosResponse<any> = await request({
    url: `users`,
    method: "GET",
  });
  return response?.data ?? [];
};

export const getUserPermissionsAPI = async (id: string) => {
  const response: AxiosResponse<any> = await request({
    url: `users/${id}/permission`,
    method: "GET",
  });
  return response?.data ?? [];
};

export const updateUserPermissionsAPI = async (id: string, body: any) => {
  const response: AxiosResponse<any> = await request({
    url: `users/${id}/permission`,
    method: "PATCH",
    body,
  });
  return response;
};

// For App route
export const checkUserPermissionsAPI = async () => {
  const response: AxiosResponse<any> = await request({
    url: `users/user-permission`,
    method: "GET",
  });
  return response?.data ?? [];
};
