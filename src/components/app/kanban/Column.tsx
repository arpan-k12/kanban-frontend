import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import Card from "./Card";
import { SortAsc } from "lucide-react";
import MultiSelectDropdown from "../common/MultiSelectDropdown";
import { multiOptions } from "../../../helper/multiOptions";
import type { ColumnType } from "../../../types/column.type";

interface ColumnProps {
  id: string;
  column: ColumnType;
  cards: any[];
  reloadCards: () => void;
  onSortChange?: (columnId: string, selected: string[]) => void;
}

const Column: React.FC<ColumnProps> = ({
  id,
  column,
  cards,
  reloadCards,
  onSortChange,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  // const [showDropdown, setShowDropdown] = useState(false);
  // const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // const handleSortChange = (items: string[]) => {
  //   setSelectedItems(items);
  //   if (onSortChange) onSortChange(id, items);
  // };

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col bg-[#f7fdd7] rounded-lg shadow-md p-4 mh-[43rem] h-fit overflow-y-auto  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100  [&::-webkit-scrollbar-thumb]:bg-gray-300 w-72 transition-colors ${
    isOver ? "bg-[#f7fdd7]" : "bg-[#f7fdd7]"
  }`}
    >
      <div className="flex justify-between">
        <div className="text-lg font-semibold mb-4">{column?.name}</div>
        {/* <div
          className="flex items-center gap-1 text-sm cursor-pointer"
          onClick={() => setShowDropdown((v) => !v)}
        >
          SortBy <SortAsc size={18} />
          {showDropdown && (
            <MultiSelectDropdown
              options={multiOptions(column?.position)}
              selected={selectedItems}
              onChange={handleSortChange}
              keepOpen
            />
          )}
        </div> */}
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
  );
};

export default Column;
