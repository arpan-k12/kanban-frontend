import api from "./index";

export const fetchCards = async () => {
  const response = await api.get("/card");
  return response.data.data;
};

export const updateCard = async (id: string, summary: string) => {
  const response = await api.patch(`/card/summary/${id}`, { summary });
  return response.data.data;
};

export const moveCard = async (id: string, newColumnId: string) => {
  const response = await api.patch(`/card/${id}`, {
    columnId: newColumnId,
  });
  return response.data.data;
};
