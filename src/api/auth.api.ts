import api from "./index";

export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/auth/signin", { email, password });
  return res.data;
};

export const signupUser = async (
  user_name: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  const res = await api.post("/auth/signup", {
    user_name,
    email,
    password,
    confirmPassword,
  });
  return res.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
