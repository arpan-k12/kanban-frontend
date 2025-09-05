import type { Decision } from "../types/decision.type";
import type { AxiosResponse } from "../types/Axios";

import api from "./index";
import { request } from "./request";

// export const createDecision = async (data: {
//   card_id: string;
//   decision: string;
//   reason: string;
// }): Promise<Decision> => {
//   const response = await api.post<{ data: Decision }>("/decision", data);
//   return response.data.data;
// };

// export const updateDecision = async (
//   decisionId: string,
//   data: { decision: string; reason: string }
// ): Promise<Decision> => {
//   const response = await api.patch<{ data: Decision }>(
//     `/decision/${decisionId}`,
//     data
//   );
//   return response.data.data;
// };

export const createDecisionAPI = async (body: {
  card_id: string;
  decision: string;
  reason: string;
}): Promise<Decision> => {
  const response: AxiosResponse<Decision> = await request({
    url: "decision",
    method: "POST",
    body,
  });

  return response?.data ?? ({} as Decision);
};

export const updateDecisionAPI = async (
  decisionId: string,
  body: { decision: string; reason: string }
): Promise<Decision> => {
  const response: AxiosResponse<Decision> = await request({
    url: `decision/${decisionId}`,
    method: "PATCH",
    body,
  });

  return response?.data ?? ({} as Decision);
};
