import type { ColumnType } from "../types/column.type";
import api from "./index";

export const fetchKanbanColumns = async (): Promise<ColumnType[]> => {
  const response = await api.get<{ data: ColumnType[] }>("/kanbancolumns");
  return response.data.data;
};
