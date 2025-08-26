import api from "./index";

export const fetchKanbanColumns = async () => {
  const response = await api.get("/kanbancolumns");
  return response.data.data;
};
