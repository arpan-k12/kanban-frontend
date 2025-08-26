import React from "react";
import CardEditor from "./CardEditor";
import type { CardData } from "../../types/card.type";
import { updateCard } from "../../api/cardAPI";
import { Pencil } from "lucide-react";

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
  if (isEditing) {
    return (
      <CardEditor
        initialData={{ summary: cardData.summary || "" }}
        onSave={async (updated) => {
          await updateCard(cardData.id, updated.summary);
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
      <p
        className={`text-xs text-gray-600 ${cardData?.summary ? "" : "italic"}`}
      >
        {cardData?.summary ? cardData?.summary : "No summary"}
      </p>
    </div>
  );
};

export default SummaryCard;
