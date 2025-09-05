import type { Organization } from "./organization.type";

export interface User {
  id: string;
  username: string;
  email: string;
  organization?: Organization;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

// ///

export interface adminUser {
  id: number;
  user_name: string;
  email: string;
  role: string;
}
