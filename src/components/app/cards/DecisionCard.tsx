import React from "react";
import type { CardData } from "../../../types/card.type";
import { Pencil } from "lucide-react";
import CardEditor from "../common/CardEditor";
import { createDecisionAPI, updateDecisionAPI } from "../../../api/decisionAPI";
import { useMutation } from "@tanstack/react-query";
import UseToast from "../../../hooks/useToast";

interface Props {
  cardData: CardData;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  reloadCards: () => void;
}

const DecisionCard: React.FC<Props> = ({
  cardData,
  isEditing,
  setIsEditing,
  reloadCards,
}) => {
  const { customer, inquiry, decision, quote } = cardData;

  const { mutateAsync: mutateCreateDecision } = useMutation({
    mutationFn: createDecisionAPI,
  });

  const { mutateAsync: mutateUpdateDecision } = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: { decision: string; reason: string };
    }) => updateDecisionAPI(id, body),
  });

  return (
    <div className="relative border rounded-md p-2 bg-white shadow-sm">
      {!decision && (
        <button
          onClick={() => setIsEditing(true)}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute top-2 right-2 text-gray-500 hover:text-blue-600 cursor-pointer"
          aria-label="Edit inquiry"
        >
          <Pencil size={16} />
        </button>
      )}
      <h3 className="text-sm font-semibold text-gray-700">
        {customer?.c_name}
      </h3>
      <p className="text-xs text-gray-500">{customer?.c_email}</p>
      {inquiry?.commodity && (
        <p className="text-xs text-gray-600">
          <span className="font-medium">Commodity:</span> {inquiry?.commodity}
        </p>
      )}
      {inquiry?.budget && (
        <p className="text-xs text-gray-600">
          <span className="font-medium">Budget:</span> {inquiry?.budget}
        </p>
      )}
      {cardData?.summary && (
        <p className="mt-1 text-xs text-gray-600">
          <span className="font-medium">Summary:</span> {cardData?.summary}
        </p>
      )}
      {quote && (
        <div className="mt-2 text-xs text-gray-800">
          <div className="font-medium">💰 {quote.amount}</div>
          <span>⏳ {new Date(quote.valid_until).toLocaleDateString()}</span>
        </div>
      )}
      {decision && (
        <div>
          <p className="mt-1 text-xs text-gray-600">
            <span className="font-medium">Decision:</span>
          </p>

          {decision.decision === "pass" ? (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
              ✅ Passed
            </span>
          ) : (
            <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
              ❌ Failed
            </span>
          )}
          {decision.reason && (
            <p className="mt-1 text-xs text-gray-600 italic">
              <span className="font-medium">Reason:</span> {decision.reason}
            </p>
          )}
        </div>
      )}

      {isEditing && (
        <CardEditor
          initialData={{
            decision: decision?.decision || "",
            reason: decision?.reason || "",
          }}
          onSave={async (updated) => {
            if (decision?.id) {
              await mutateUpdateDecision({
                id: decision.id,
                body: {
                  decision: updated.decision,
                  reason: updated.reason,
                },
              });
              UseToast("Decision Updated successfully", "success");
            } else {
              await mutateCreateDecision({
                card_id: cardData.id,
                decision: updated.decision,
                reason: updated.reason,
              });
              UseToast("Decision Created successfully", "success");
            }

            await reloadCards();
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
          type="decision"
        />
      )}
    </div>
  );
};

export default DecisionCard;
