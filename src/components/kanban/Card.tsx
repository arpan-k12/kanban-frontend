import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import type { CardData } from "../../types/card.type";
import Position1Card from "../cards/Position1Card";
import Position2Card from "../cards/Position2Card";

interface CardProps {
  cardData: CardData;
}
const Card: React.FC<CardProps> = ({ cardData }) => {
  const {
    id,
    column_id,
    customer_id,
    inquiry_id,
    assigned_to,
    summary,
    createdAt,
    updatedAt,
    deletedAt,
    column,
    inquiry,
    customer,
  } = cardData;
  const [isEditing, setIsEditing] = useState(false);

  console.log(cardData, "card");

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
      className={`bg-white rounded-lg shadow-md p-3 cursor-grab ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {column.position === 1 && (
        <Position1Card
          cardData={cardData}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      )}
      {column.position === 2 && (
        <Position2Card
          cardData={cardData}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      )}
    </div>
  );
};

export default Card;
