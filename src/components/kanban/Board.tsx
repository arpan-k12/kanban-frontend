import React, { useEffect, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import Column from "./Column";
import { fetchKanbanColumns } from "../../api/kanbanColumnApi";
import { fetchCards, moveCard } from "../../api/cardApi";
import InquiryModal from "../InquiryModal";
import { createInquiryCard } from "../../api/inquiryAPI";

interface ColumnType {
  id: string;
  name: string;
  position: number;
}

interface CardType {
  id: string;
  column_id: string;
  summary?: string;
  customer?: {
    c_name: string;
    c_email: string;
    commodity?: string;
    budget?: string;
  };
}

const Board: React.FC = () => {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [cards, setCards] = useState<CardType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadCards = async () => {
    try {
      const allCards = await fetchCards();
      setCards(allCards);
    } catch (error) {
      console.error("Failed to fetch cards:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const cols = await fetchKanbanColumns();
        setColumns(cols.sort((a: any, b: any) => a.position - b.position));

        await loadCards();
      } catch (error) {
        console.error("Failed to fetch board data:", error);
      }
    };

    loadData();
  }, []);

  const handleDragEnd = async (event: any) => {
    const { over, active } = event;
    if (!over || !active) return;

    const cardId = active.id as string;
    const newColumnId = over.id as string;

    const card = cards.find((c) => c.id === cardId);
    if (!card) return;

    const oldColumn = columns.find((col) => col.id === card.column_id);
    const newColumn = columns.find((col) => col.id === newColumnId);

    if (!oldColumn || !newColumn) return;

    if (newColumn.position < oldColumn.position) {
      console.log("You can't move card backwards!");
      return;
    }

    const newCardsInColumn = cards.filter((c) => c.column_id === newColumnId);
    const newPosition = newCardsInColumn.length + 1;

    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId
          ? { ...c, column_id: newColumnId, position: newPosition }
          : c
      )
    );

    try {
      console.log(`Moving card ${cardId} to column ${newColumnId} }`);
      console.log(cardId, newColumnId);

      await moveCard(cardId, newColumnId);
      await loadCards();
    } catch (err) {
      console.error("Failed to update card:", err);
    }
  };

  const handleAddCard = async (data: {
    customerId: string;
    commodity: string;
    budget: string;
  }) => {
    try {
      await createInquiryCard({
        customer_id: data.customerId,
        commodity: data.commodity,
        budget: data.budget,
      });
      await loadCards();
    } catch (error) {
      console.error("Failed to add card:", error);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-bold">Kanban Board</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Card
        </button>
      </div>

      <div className="flex flex-wrap justify-evenly gap-6 p-6">
        {columns.map((col) => (
          <Column
            key={col.id}
            id={col.id}
            name={col.name}
            cards={cards.filter((c) => c.column_id === col.id)}
          />
        ))}
      </div>
      <InquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddCard}
      />
    </DndContext>
  );
};

export default Board;
