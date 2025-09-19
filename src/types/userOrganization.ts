import type { OrganizationType } from "./organization.type";

export interface UserOrganizationType {
  id: string;
  role: string;
  user_name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  organizations: OrganizationType[];
}
