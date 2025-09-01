import type {
  AxiosRequestConfig,
  AxiosResponseHeaders,
  RawAxiosResponseHeaders,
} from "axios";

export interface User {
  id: string;
  username: string;
  email: string;
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
