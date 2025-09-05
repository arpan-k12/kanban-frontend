// import type { ColumnType } from "../types/column.type";
// import api from "./index";

// export const fetchKanbanColumns = async (): Promise<ColumnType[]> => {
//   const response = await api.get<{ data: ColumnType[] }>("/kanbancolumns");
//   return response.data.data;
// };

import type { ColumnType } from "../types/column.type";
import type { AxiosResponse } from "../types/Axios";
import { request } from "./request";

export const GetKanbanColumnsAPI = async (): Promise<ColumnType[]> => {
  const response: AxiosResponse<any> = await request({
    url: "kanbancolumns",
    method: "GET",
  });

  return response?.data ?? [];
};
