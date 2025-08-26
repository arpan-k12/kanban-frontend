import api from "./index";

export const createDecision = (data: {
  card_id: string;
  decision: string;
  reason: string;
}) => {
  return api.post(`/decision`, data);
};

export const updateDecision = (
  decisionId: string,
  data: { decision: string; reason: string }
) => {
  return api.patch(`/decision/${decisionId}`, data);
};
