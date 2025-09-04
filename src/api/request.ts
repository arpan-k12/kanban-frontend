import axios from "axios";
import type { AxiosResponse, ResponseType } from "axios";

axios.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");

    if (!config.headers) {
      config.headers = {} as any;
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    config.headers["Content-Type"] = "application/json";

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    if (response.headers["content-type"]?.includes("application/json")) {
      const data = response.data;
      if (data.status) {
        return data;
      } else {
        return Promise.reject(data);
      }
    } else if (response.status === 200) {
      return response;
    }

    return Promise.reject(response);
  },
  function (error) {
    if (error?.response?.status === 403) {
      // removeUser();
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
    }

    const message =
      error.response?.status === 404
        ? "API not found."
        : error?.response?.data?.message || "Something went wrong";

    return Promise.reject(message);
  }
);

export const request = async ({
  url,
  method = "GET",
  params,
  body,
  headers,
  responseType,
}: {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  params?: any;
  body?: any;
  headers?: any;
  responseType?: ResponseType;
}) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const res: AxiosResponse = await axios.request({
    url: BASE_URL + url,
    method,
    params,
    data: body,
    headers,
    responseType,
  });

  return res;
};
