// import api from ".";
import type { AxiosResponse } from "../types/Axios";
import type { CardData } from "../types/card.type";
import { request } from "./request";

// export const fetchCards = async (): Promise<CardData[]> => {
//   const response = await api.get<{ data: CardData[] }>("/card");
//   return response.data.data;
// };

// export const fetchCards = async (params?: {
//   columnId?: string;
//   sort?: string[];
//   organizationId?: string;
// }): Promise<CardData[]> => {
//   const apiParams: any = {};
//   if (params?.columnId) apiParams.columnId = params.columnId;
//   if (params?.sort) apiParams.sort = params.sort.join(",");
//   if (params?.organizationId) apiParams.organizationId = params.organizationId;
//   const response = await api.get<{ data: CardData[] }>("/card", {
//     params: apiParams,
//   });
//   return response.data.data;
// };

// export const moveCard = async (
//   id: string,
//   destinationColumnId: string,
//   newCard_position: number
// ): Promise<CardData> => {
//   const response = await api.patch<{ data: CardData }>(`/card/${id}`, {
//     columnId: destinationColumnId,
//     card_position: newCard_position,
//   });
//   return response.data.data;
// };

// export const updateCardSummary = async (
//   id: string,
//   summary: string
// ): Promise<CardData> => {
//   const response = await api.patch<{ data: CardData }>(`/card/summary/${id}`, {
//     summary,
//   });
//   return response.data.data;
// };

export const fetchCardsAPI = async (params?: {
  columnId?: string | null;
  sort?: string[];
  organizationId?: string;
}): Promise<CardData[]> => {
  const apiParams: Record<string, any> = {};

  if (params?.columnId) apiParams.columnId = params.columnId;
  if (params?.sort && params.sort.length > 0) {
    apiParams.sort = params.sort.join(",");
  }
  if (params?.organizationId) apiParams.organizationId = params.organizationId;

  const response: AxiosResponse<CardData[]> = await request({
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
): Promise<CardData> => {
  const response: AxiosResponse<CardData> = await request({
    url: `card/${id}`,
    method: "PATCH",
    body: {
      columnId: destinationColumnId,
      card_position: newCard_position,
    },
  });

  return response?.data ?? ({} as CardData);
};

export const updateCardSummaryAPI = async (
  id: string,
  summary: string
): Promise<CardData> => {
  const response: AxiosResponse<CardData> = await request({
    url: `card/summary/${id}`,
    method: "PATCH",
    body: { summary },
  });

  return response?.data ?? ({} as CardData);
};
