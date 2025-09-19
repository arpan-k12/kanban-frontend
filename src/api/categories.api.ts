import type { AxiosResponse } from "../types/Axios.ts";
import type { categoriesType } from "../types/categories.type.ts";
import { request } from "./request.ts";

export const getCategoriesAPI = async () => {
  const response: AxiosResponse<categoriesType[]> = await request({
    url: `category`,
    method: "GET",
  });
  return response?.data ?? [];
};
