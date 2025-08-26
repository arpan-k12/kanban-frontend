import api from "./index";

export const getAllCustomer = async () => {
  const response = await api.get("/customer");
  return response.data.data;
};

export const updateCustomer = async (
  id: string,
  name: string,
  email: string
) => {
  const response = await api.patch(`/customer/${id}`, {
    c_name: name,
    c_email: email,
  });
  return response.data;
};
