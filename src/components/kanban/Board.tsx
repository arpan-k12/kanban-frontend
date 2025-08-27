import React, { useEffect, useState } from "react";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Column from "./Column";
import { fetchKanbanColumns } from "../../api/kanbanColumnAPI";
import { fetchCards, moveCard } from "../../api/cardAPI";
import InquiryModal from "../InquiryModal";
import { createInquiryCard } from "../../api/inquiryAPI";
import type { ColumnType } from "../../types/column.type";
import type { CardData } from "../../types/card.type";
import { toast } from "react-toastify";
import { showError, showSuccess } from "../../utils/toastUtils";

const Board: React.FC = () => {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [cards, setCards] = useState<CardData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadCards = async () => {
    try {
      const allCards = await fetchCards();
      setCards(allCards);
    } catch (error: any) {
      console.log(error, "Failed to fetch cards:");
      showError(error, "Failed to load cards");
    }
  };

  useEffect(() => {
    const loadColumns = async () => {
      try {
        const cols = await fetchKanbanColumns();
        setColumns(cols.sort((a: any, b: any) => a.position - b.position));

        await loadCards();
      } catch (error) {
        console.error("Failed to fetch board data:", error);
        toast.error("Something went wrong!");
      }
    };

    loadColumns();
  }, []);

  const handleDragEnd = async (event: any) => {
    const { over, active } = event;
    if (!over || !active) return;
    const cardId = active.id as string;
    const newColumnId = over.id as string;
    const card = cards.find((c) => c.id === cardId);
    if (!card) return;
    const position = card?.column?.position;
    if (position === 1 && !card?.inquiry_id) {
      toast.warning("Please fill the inquiry before moving this card!");
      return;
    }
    if (position === 2 && !card?.summary) {
      toast.warning("Please fill the summary before moving this card!");
      return;
    }
    if (position === 3 && !card?.quote_id) {
      toast.warning("Please attach a quote before moving this card!");
      return;
    }
    const oldColumn = columns.find((col) => col.id === card.column_id);
    const newColumn = columns.find((col) => col.id === newColumnId);
    if (!oldColumn || !newColumn) return;
    if (newColumn.position !== oldColumn.position + 1) {
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
      await moveCard(cardId, newColumnId);
      await loadCards();
      toast.success("Card moved successfully!");
    } catch (err) {
      console.error("Failed to update card:", err);
      toast.error("Failed to move card!");
    }
  };

  const handleAddCard = async (data: {
    customerId: string;
    commodity: string;
    budget: number;
  }) => {
    try {
      await createInquiryCard({
        customer_id: data.customerId,
        commodity: data.commodity,
        budget: data.budget,
      });
      showSuccess("Card Created successfully!");
      await loadCards();
    } catch (error) {
      console.error("Failed to add card:", error);
      showError(error, "Failed to Created card");
    }
  };

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 6 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 150, tolerance: 5 },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
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
            reloadCards={loadCards}
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
