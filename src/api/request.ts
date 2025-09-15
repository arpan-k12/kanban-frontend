import axios from "axios";
import type { AxiosResponse, ResponseType } from "axios";
import { useAuthStore } from "../store/authStore";
import UseToast from "../hooks/useToast";

axios.interceptors.request.use(
  function (config) {
    let authToken = useAuthStore.getState().token;

    useAuthStore.subscribe((state) => {
      authToken = state.token;
    });

    if (!config.headers) {
      config.headers = {} as any;
    }

    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`;
    }

    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

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
    if (error?.response?.status === 400) {
      useAuthStore.getState().logout();
      UseToast(error?.message, "error");
      // localStorage.removeItem("token");
      // window.location.href = "/signin";
    }
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      useAuthStore.getState().logout();
      // localStorage.removeItem("token");
      UseToast(error?.message || "User No longer exist", "error");
      window.location.href = "/signin";
    }

    // if (error?.response?.status === 401) {
    //   localStorage.removeItem("token");
    // }

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
