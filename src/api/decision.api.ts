import type { DecisionType } from "../types/decision.type";
import type { AxiosResponse } from "../types/Axios";
import { request } from "./request";

export const createDecisionAPI = async (body: {
  card_id: string;
  decision: string;
  reason: string;
}): Promise<DecisionType> => {
  const response: AxiosResponse<DecisionType> = await request({
    url: "decision",
    method: "POST",
    body,
  });

  return response?.data ?? ({} as DecisionType);
};

export const updateDecisionAPI = async (
  decisionId: string,
  body: { decision: string; reason: string }
): Promise<DecisionType> => {
  const response: AxiosResponse<DecisionType> = await request({
    url: `decision/${decisionId}`,
    method: "PATCH",
    body,
  });

  return response?.data ?? ({} as DecisionType);
};
