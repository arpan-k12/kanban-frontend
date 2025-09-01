import api from "./index.ts";
import type { Organization } from "../types/organization.type";

export const getOrganization = async (): Promise<Organization[]> => {
  const response = await api.get<{ data: Organization[] }>("/organization");
  return response.data.data;
};
