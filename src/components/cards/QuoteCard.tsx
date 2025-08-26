import React from "react";
import CardEditor from "./CardEditor";
import type { CardData } from "../../types/card.type";
import { createQuote, updateQuote } from "../../api/quoteAPI";
import { Pencil } from "lucide-react";

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
  const quote = cardData?.quote;

  if (isEditing) {
    return (
      <CardEditor
        initialData={{
          amount: quote?.amount?.toString() || "",
          valid_until:
            quote?.valid_until || new Date().toISOString().split("T")[0],
        }}
        onSave={async (updated) => {
          if (quote?.id) {
            await updateQuote(quote.id, {
              amount: Number(updated.amount),
              valid_until: updated.valid_until,
            });
          } else {
            await createQuote({
              card_id: cardData.id,
              amount: Number(updated.amount),
              valid_until: updated.valid_until,
            });
          }

          await reloadCards();
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
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
      {quote ? (
        <div className="mt-2 text-xs text-gray-800">
          <div className="font-medium">💰 {quote.amount}</div>
          <span>⏳ {new Date(quote.valid_until).toLocaleDateString()}</span>
        </div>
      ) : (
        <p className="text-xs italic text-gray-400 mt-2">No quote yet</p>
      )}
    </div>
  );
};

export default QuoteCard;
