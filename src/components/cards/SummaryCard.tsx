import React from "react";
import CardEditor from "./CardEditor";
import type { CardData } from "../../types/card.type";
import { Pencil } from "lucide-react";
import { showSuccess } from "../../utils/toastUtils";
import { updateCardSummary } from "../../api/cardAPI";

interface Props {
  cardData: CardData;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  reloadCards: () => void;
}

const SummaryCard: React.FC<Props> = ({
  cardData,
  isEditing,
  setIsEditing,
  reloadCards,
}) => {
  const { customer, inquiry } = cardData;

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

      {isEditing && (
        // <CardEditor
        //   initialData={{
        //     amount: quote?.amount?.toString() || "",
        //     valid_until:
        //       quote?.valid_until || new Date().toISOString().split("T")[0],
        //   }}
        //   onSave={async (updated) => {
        //     if (quote?.id) {
        //       await updateQuote(quote.id, {
        //         amount: Number(updated.amount),
        //         valid_until: updated.valid_until,
        //       });
        //       showSuccess("Quote Updated successfully");
        //     } else {
        //       await createQuote({
        //         card_id: cardData.id,
        //         amount: Number(updated.amount),
        //         valid_until: updated.valid_until,
        //       });
        //       showSuccess("Quote Created successfully");
        //     }

        //     await reloadCards();
        //     setIsEditing(false);
        //   }}
        //   onCancel={() => setIsEditing(false)}
        // />
        <CardEditor
          initialData={{ summary: cardData.summary || "" }}
          onSave={async (updated) => {
            await updateCardSummary(cardData.id, updated.summary);
            await reloadCards();
            showSuccess("Inquiry Updated successfully");
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default SummaryCard;
