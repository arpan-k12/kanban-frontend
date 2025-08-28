import React from "react";
import { useDroppable } from "@dnd-kit/core";
import Card from "./Card";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

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
    // <SortableContext
    //   id={id}
    //   items={cards}
    //   strategy={verticalListSortingStrategy}
    // >
    <div
      ref={setNodeRef}
      className={`flex flex-col bg-gray-100 rounded-lg shadow-md p-4 h-[43rem] overflow-y-auto  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100  [&::-webkit-scrollbar-thumb]:bg-gray-300 w-72 transition-colors ${
    isOver ? "bg-blue-100" : "bg-gray-100"
  }`}
    >
      <div className="flex justify-between">
        <div className="text-lg font-semibold mb-4">{name}</div>
        <div className="text-sm ">SortBy </div>
      </div>
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
    // </SortableContext>
  );
};

export default Column;
