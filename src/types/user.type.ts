import type {
  AxiosRequestConfig,
  AxiosResponseHeaders,
  RawAxiosResponseHeaders,
} from "axios";
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

export type AxiosResponse<T = any, D = any> = {
  data: T;
  message?: string;
  status: number;
  accessToken?: string | null;
  statusText: string;
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
  config: AxiosRequestConfig<D>;
  request?: any;
  position?: any;
};
