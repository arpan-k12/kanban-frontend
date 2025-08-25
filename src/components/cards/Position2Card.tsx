import React, { useState } from "react";
import CardEditor from "./CardEditor";
import type { CardData } from "../../types/card.type";

interface Props {
  cardData: CardData;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

const Position2Card: React.FC<Props> = ({
  cardData,
  isEditing,
  setIsEditing,
}) => {
  if (isEditing) {
    return (
      <CardEditor
        initialData={{ summary: cardData.summary || "" }}
        onSave={async (updated) => {
          // 🔹 API call to update card summary
          // await updateCardApi(cardData.id, { summary: updated.summary });
          console.log("Save Position2 data:", updated);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div onDoubleClick={() => setIsEditing(true)}>
      <p
        className={`text-xs text-gray-600 ${cardData?.summary ? "" : "italic"}`}
      >
        {cardData?.summary ? cardData?.summary : "No summary"}
      </p>
    </div>
  );
};

export default Position2Card;
