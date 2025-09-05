export interface Organization {
  id: string;
  name: string;
  address: string;
  phone: string;
  industry: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface AddOrganizationData {
  name: string;
  address: string;
  phone: string;
  industry: string;
}
