import type { CardData } from "../types/card.type";
import api from "./index";

export const fetchCards = async (): Promise<CardData[]> => {
  const response = await api.get<{ data: CardData[] }>("/card");
  return response.data.data;
};

export const updateCardSummary = async (
  id: string,
  summary: string
): Promise<CardData> => {
  const response = await api.patch<{ data: CardData }>(`/card/summary/${id}`, {
    summary,
  });
  return response.data.data;
};

export const moveCard = async (
  id: string,
  destinationColumnId: string,
  newCard_position: number
): Promise<CardData> => {
  const response = await api.patch<{ data: CardData }>(`/card/${id}`, {
    columnId: destinationColumnId,
    card_position: newCard_position,
  });
  return response.data.data;
};
