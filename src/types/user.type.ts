import type { Organization } from "./organization.type";
import type { Permissions } from "./permission.type";

export interface User {
  id: string;
  username: string;
  email: string;
  organization?: Organization;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  permissions: Permissions;
}

// ///

export interface adminUser {
  id: number;
  user_name: string;
  email: string;
  role: string;
}
