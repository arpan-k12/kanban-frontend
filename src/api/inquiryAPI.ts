import api from "./index";

export const createInquiryCard = (data: {
  customer_id: string;
  commodity: string;
  budget: string;
}) => {
  return api.post("/inquiry", data).then((res) => res.data);
};

export const updateInquiry = (
  id: string,
  customer_id: string,
  commodity: string,
  budget: number
) => {
  return api
    .patch(`/inquiry/${id}`, {
      customer_id,
      commodity,
      budget,
    })
    .then((res) => res.data);
};
