import type { OrganizationType } from "./organization.type";
import type { PermissionsType } from "./permission.type";

export interface User {
  id: string;
  username: string;
  email: string;
  organization?: OrganizationType;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  permissions: PermissionsType;
}

export interface adminUser {
  id: number;
  user_name: string;
  email: string;
  role: string;
}
