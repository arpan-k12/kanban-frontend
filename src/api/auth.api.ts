import api from "./index";

export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/auth/signin", { email, password });
  return res.data;
};

export const signupUser = async (
  username: string,
  email: string,
  password: string
) => {
  const res = await api.post("/auth/signup", { username, email, password });
  return res.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
