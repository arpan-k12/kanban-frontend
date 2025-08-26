import React from "react";
import { useDroppable } from "@dnd-kit/core";
import Card from "./Card";

interface ColumnProps {
  id: string;
  name: string;
  cards: any[];
  reloadCards: () => void;
}

const Column: React.FC<ColumnProps> = ({ id, name, cards, reloadCards }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col bg-gray-100 rounded-lg shadow-md p-4 w-72 transition-colors ${
        isOver ? "bg-blue-100" : "bg-gray-100"
      }`}
    >
      <h2 className="text-lg font-semibold mb-4">{name}</h2>
      <div className="flex flex-col gap-3">
        {cards.length > 0 ? (
          cards.map((card) => (
            <Card key={card?.id} cardData={card} reloadCards={reloadCards} />
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">No cards yet...</p>
        )}
      </div>
    </div>
  );
};

export default Column;
