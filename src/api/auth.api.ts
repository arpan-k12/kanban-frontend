import api from "./index";

// export interface AuthResponse {
//   status: string;
//   statusCode: number;
//   message: string;
//   data: {
//     id: string;
//     user_name: string;
//     email: string;
//     role: string;
//     createdAt: string;
//     updatedAt: string;
//   };
//   token: string;
// }

// export const loginUser = async (
//   email: string,
//   password: string
// ): Promise<AuthResponse> => {
//   const res = await api.post<AuthResponse>("/auth/signin", {
//     email,
//     password,
//   });

//   return res.data;
// };

// export const signupUser = async (
//   user_name: string,
//   email: string,
//   password: string,
//   confirmPassword: string
// ): Promise<AuthResponse> => {
//   const res = await api.post<AuthResponse>("/auth/signup", {
//     user_name,
//     email,
//     password,
//     confirmPassword,
//   });

//   return res.data;
// };

// export const logoutUser = (): void => {
//   localStorage.removeItem("token");
//   localStorage.removeItem("user");
// };

// ///////

import { request } from "./request";

// export interface AuthResponse {
//   status: string;
//   statusCode: number;
//   message: string;
//   data: {
//     id: string;
//     user_name: string;
//     email: string;
//     role: string;
//     createdAt: string;
//     updatedAt: string;
//   };
//   token: string;
// }

export const loginUserAPI = async (
  email: string,
  password: string
): Promise<any> => {
  const response = await request({
    url: "auth/signin",
    method: "POST",
    body: { email, password },
  });

  return response;
};

export const signupUserAPI = async (
  user_name: string,
  email: string,
  password: string,
  confirmPassword: string
): Promise<any> => {
  const response = await request({
    url: "auth/signup",
    method: "POST",
    body: { user_name, email, password, confirmPassword },
  });

  return response;
};

export const logoutUser = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
