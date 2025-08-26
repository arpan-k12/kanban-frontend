import React from "react";
import CardEditor from "./CardEditor";
import type { CardData } from "../../types/card.type";
import { Pencil } from "lucide-react";
import { toast } from "react-toastify";
import { createDecision, updateDecision } from "../../api/decisionAPI";

interface Props {
  cardData: CardData;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  reloadCards: () => void;
}

const QuoteCard: React.FC<Props> = ({
  cardData,
  isEditing,
  setIsEditing,
  reloadCards,
}) => {
  const { customer, inquiry, decision } = cardData;

  // if (isEditing) {
  //   return (
  //     <CardEditor
  //       initialData={{
  //         amount: quote?.amount?.toString() || "",
  //         valid_until:
  //           quote?.valid_until || new Date().toISOString().split("T")[0],
  //       }}
  //       onSave={async (updated) => {
  //         if (quote?.id) {
  //           await updateQuote(quote.id, {
  //             amount: Number(updated.amount),
  //             valid_until: updated.valid_until,
  //           });
  //           toast.success("Quote Updated successfully!");
  //         } else {
  //           await createQuote({
  //             card_id: cardData.id,
  //             amount: Number(updated.amount),
  //             valid_until: updated.valid_until,
  //           });
  //           toast.success("Quote Created successfully!");
  //         }

  //         await reloadCards();
  //         setIsEditing(false);
  //       }}
  //       onCancel={() => setIsEditing(false)}
  //     />
  //   );
  // }

  return (
    <div className="relative border rounded-md p-2 bg-white shadow-sm">
      <button
        onClick={() => setIsEditing(true)}
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute top-2 right-2 text-gray-500 hover:text-blue-600 cursor-pointer"
        aria-label="Edit inquiry"
      >
        <Pencil size={16} />
      </button>
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
      {decision && !isEditing && (
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
              await updateDecision(decision.id, {
                decision: updated.decision,
                reason: updated.reason,
              });
              toast.success("Decision Updated successfully!");
            } else {
              await createDecision({
                card_id: cardData.id,
                decision: updated.decision,
                reason: updated.reason,
              });
              toast.success("Decision Created successfully!");
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

export default QuoteCard;
