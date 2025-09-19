import React from "react";
import type { CardDataType } from "../../../types/card.type";
import { Pencil } from "lucide-react";
import CardEditor from "../common/CardEditor";
import {
  createDecisionAPI,
  updateDecisionAPI,
} from "../../../api/decision.api";
import { useMutation } from "@tanstack/react-query";
import UseToast from "../../../hooks/useToast";
import { useAuthStore } from "../../../store/authStore";
import CustomerUI from "../../../ui/app/cardUI/CustomerUI";
import InquiryUI from "../../../ui/app/cardUI/InquiryUI";
import SummaryUI from "../../../ui/app/cardUI/SummaryUI";
import QuoteUI from "../../../ui/app/cardUI/QuoteUI";
import DecisionUI from "../../../ui/app/cardUI/DecisionUI";

interface Props {
  cardData: CardDataType;
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
  const { hasPermission } = useAuthStore();
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
    <div className="relative rounded-xl border border-gray-200 bg-white p-4  transition-shadow duration-200">
      {!decision && hasPermission("can_create", "decision") && (
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
      <div className="mb-4">
        <CustomerUI customer={customer} />
      </div>
      <div>
        <InquiryUI inquiry={inquiry} />
      </div>
      {cardData?.summary && <SummaryUI cardData={cardData} />}

      {quote && <QuoteUI quote={quote} />}

      {decision && <DecisionUI decision={decision} />}

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
