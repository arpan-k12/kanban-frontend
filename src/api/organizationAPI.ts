import type { Organization } from "../types/organization.type";
import type { AxiosResponse } from "../types/user.type.ts";
import { request } from "./request.ts";

// export const getOrganization = async (): Promise<Organization[]> => {
//   const response = await api.get<{ data: Organization[] }>("/organization");
//   return response.data.data;
// };

export const getOrganization = async (): Promise<Organization[]> => {
  const response: AxiosResponse<Organization[]> = await request({
    url: "organization",
    method: "GET",
  });

  return response?.data ?? [];
};
