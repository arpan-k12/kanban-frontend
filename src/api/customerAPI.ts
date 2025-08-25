import api from "./index";

export const getAllCustomer = async () => {
  const response = await api.get("/customer");
  return response.data.data;
};
