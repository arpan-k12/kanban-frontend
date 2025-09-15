import type { AxiosResponse } from "../types/Axios.ts";
import { request } from "./request.ts";

export const getCategoriesAPI = async () => {
  const response: AxiosResponse<any> = await request({
    url: `category`,
    method: "GET",
  });
  return response?.data ?? [];
};
