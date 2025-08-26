import React from "react";
import CardEditor from "./CardEditor";
import type { CardData } from "../../types/card.type";
import { createDecision, updateDecision } from "../../api/decisionAPI";
import { Pencil } from "lucide-react";

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
  const decision = cardData?.decision;
  if (isEditing) {
    return (
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
          } else {
            await createDecision({
              card_id: cardData.id,
              decision: updated.decision,
              reason: updated.reason,
            });
          }

          await reloadCards();
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
        type="decision"
      />
    );
  }

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
      {decision ? (
        <div>
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
            <p className="mt-1 text-gray-600 italic">{decision.reason}</p>
          )}
        </div>
      ) : (
        <p className="text-xs italic text-gray-400">No decision yet</p>
      )}
    </div>
  );
};

export default DecisionCard;
