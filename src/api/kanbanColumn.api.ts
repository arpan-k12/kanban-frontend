import type { ColumnType } from "../types/column.type";
import type { AxiosResponse } from "../types/Axios";
import { request } from "./request";

export const GetKanbanColumnsAPI = async (): Promise<ColumnType[]> => {
  const response: AxiosResponse<ColumnType[]> = await request({
    url: "kanbancolumns",
    method: "GET",
  });

  return response?.data ?? [];
};
