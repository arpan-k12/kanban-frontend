import type { AxiosResponse } from "../types/Axios";
import type { CardDataType } from "../types/card.type";
import { request } from "./request";

export const fetchCardsAPI = async (params?: {
  columnId?: string | null;
  sort?: string[];
  organizationId?: string;
}): Promise<CardDataType[]> => {
  const apiParams: Record<string, any> = {};

  if (params?.columnId) apiParams.columnId = params.columnId;
  if (params?.sort && params.sort.length > 0) {
    apiParams.sort = params.sort.join(",");
  }
  if (params?.organizationId) apiParams.organizationId = params.organizationId;

  const response: AxiosResponse<CardDataType[]> = await request({
    url: "card",
    method: "GET",
    params: apiParams,
  });

  return response?.data ?? [];
};

export const moveCard = async (
  id: string,
  destinationColumnId: string,
  newCard_position: number
): Promise<CardDataType> => {
  const response: AxiosResponse<CardDataType> = await request({
    url: `card/${id}`,
    method: "PATCH",
    body: {
      columnId: destinationColumnId,
      card_position: newCard_position,
    },
  });

  return response?.data ?? ({} as CardDataType);
};

export const updateCardSummaryAPI = async (
  id: string,
  summary: string
): Promise<any> => {
  const response: AxiosResponse<CardDataType> = await request({
    url: `card/summary/${id}`,
    method: "PATCH",
    body: { summary },
  });

  return response;
};
