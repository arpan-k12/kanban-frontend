import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import type { CardData } from "../../types/card.type";
import InquiryCard from "../cards/InquiryCard";
import SummaryCard from "../cards/SummaryCard";
import QuoteCard from "../cards/QuoteCard";
import DecisionCard from "../cards/DecisionCard";

interface CardProps {
  cardData: CardData;
  reloadCards: () => void;
}
const Card: React.FC<CardProps> = ({ cardData, reloadCards }) => {
  const { id, column } = cardData;
  const [isEditing, setIsEditing] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      disabled: isEditing,
    });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      id={id}
      className={`bg-white rounded-lg shadow-md p-3 cursor-grab ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {column.position === 1 && (
        <InquiryCard
          cardData={cardData}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          reloadCards={reloadCards}
        />
      )}
      {column.position === 2 && (
        <SummaryCard
          cardData={cardData}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          reloadCards={reloadCards}
        />
      )}
      {column.position === 3 && (
        <QuoteCard
          cardData={cardData}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          reloadCards={reloadCards}
        />
      )}
      {column.position === 4 && (
        <DecisionCard
          cardData={cardData}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          reloadCards={reloadCards}
        />
      )}
    </div>
  );
};

export default Card;
