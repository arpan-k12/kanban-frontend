import type { AxiosResponse } from "../types/Axios";
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
  password: string,
  recaptcha: any
): Promise<any> => {
  const response = await request({
    url: "auth/signin",
    method: "POST",
    body: { email, password, recaptcha },
  });

  return response;
};

export const signupUserAPI = async (
  user_name: string,
  email: string,
  password: string,
  confirmPassword: string,
  recaptcha: string
): Promise<any> => {
  const response = await request({
    url: "auth/signup",
    method: "POST",
    body: { user_name, email, password, confirmPassword, recaptcha },
  });

  return response;
};

export const verifySigninOtpAPI = async (userId: string, otp: string) => {
  const response: AxiosResponse<any> = await request({
    url: `auth/verify-signin-otp`,
    method: "POST",
    body: { userId, otp },
  });
  return response;
};

export const verifySignupOtpAPI = async (email: string, otp: string) => {
  const response: AxiosResponse<any> = await request({
    url: `auth/verify-signup-otp`,
    method: "POST",
    body: { email, otp },
  });
  return response;
};

export const logoutUser = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
