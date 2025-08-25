import api from "./index";

export const createInquiryCard = (data: {
  customer_id: string;
  commodity: string;
  budget: string;
}) => {
  return api.post("/inquiry", data).then((res) => res.data);
};
