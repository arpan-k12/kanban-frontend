import api from "./index";

export interface AuthResponse {
  status: string;
  statusCode: number;
  message: string;
  data: {
    id: string;
    user_name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  token: string;
}

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/signin", {
    email,
    password,
  });

  return res.data;
};

export const signupUser = async (
  user_name: string,
  email: string,
  password: string,
  confirmPassword: string
): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/signup", {
    user_name,
    email,
    password,
    confirmPassword,
  });

  return res.data;
};

export const logoutUser = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
