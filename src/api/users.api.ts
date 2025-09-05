import type { AxiosResponse } from "../types/Axios";
import { request } from "./request";

export const GetAllUsersAPI = async () => {
  const response: AxiosResponse<any> = await request({
    url: `users`,
    method: "GET",
  });
  return response?.data ?? [];
};
