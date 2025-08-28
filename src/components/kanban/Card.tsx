import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import type { CardData } from "../../types/card.type";
import InquiryCard from "../cards/InquiryCard";
import SummaryCard from "../cards/SummaryCard";
import QuoteCard from "../cards/QuoteCard";
import DecisionCard from "../cards/DecisionCard";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface CardProps {
  cardData: CardData;
  reloadCards: () => void;
}
const Card: React.FC<CardProps> = ({ cardData, reloadCards }) => {
  const { id, column } = cardData;
  const [isEditing, setIsEditing] = useState(false);

  // const { attributes, listeners, setNodeRef, transform, isDragging } =
  //   useDraggable({
  //     id,
  //     disabled: isEditing,
  //   });
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    disabled: isEditing,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  // const styles = {
  //   transform: transform
  //     ? `translate(${transform.x}px, ${transform.y}px)`
  //     : undefined,
  //   transition,
  //   zIndex: isDragging ? 999 : "auto",
  // };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      id={id}
      className={`bg-white rounded-lg shadow-md p-3 cursor-grab ${
        isDragging ? "opacity-100" : "opacity-95"
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
