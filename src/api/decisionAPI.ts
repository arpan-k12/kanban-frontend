import type { Decision } from "../types/decision.type";
import api from "./index";

export const createDecision = async (data: {
  card_id: string;
  decision: string;
  reason: string;
}): Promise<Decision> => {
  const response = await api.post<{ data: Decision }>("/decision", data);
  return response.data.data;
};

export const updateDecision = async (
  decisionId: string,
  data: { decision: string; reason: string }
): Promise<Decision> => {
  const response = await api.patch<{ data: Decision }>(
    `/decision/${decisionId}`,
    data
  );
  return response.data.data;
};
