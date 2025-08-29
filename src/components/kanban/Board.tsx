import React, { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Column from "./Column";
import { fetchKanbanColumns } from "../../api/kanbanColumnAPI";
import { fetchCards, moveCard } from "../../api/cardAPI";
import InquiryModal from "../InquiryModal";
import { createInquiryCard } from "../../api/inquiryAPI";
import type { ColumnType } from "../../types/column.type";
import type { CardData } from "../../types/card.type";
import { toast } from "react-toastify";
import { showError, showSuccess } from "../../utils/toastUtils";
import Card from "./Card";

const Board: React.FC = () => {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [cards, setCards] = useState<CardData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [sortFields, setSortFields] = useState<{
    [columnId: string]: string[];
  }>({});

  const loadCards = async (columnId?: string, selected?: string[]) => {
    try {
      // Only send sort fields for the selected column
      const sortParams =
        columnId && selected && selected.length > 0
          ? { columnId, sort: selected }
          : {};

      console.log(sortParams, "sortParams");

      const allCards = await fetchCards(sortParams);
      setCards(allCards);
    } catch (error: any) {
      console.log(error, "Failed to fetch cards:");
      showError(error, "Failed to load cards");
    }
  };

  const handleSortChange = (columnId: string, selected: string[]) => {
    setSortFields((prev) => ({ ...prev, [columnId]: selected }));
    loadCards(columnId, selected);
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

  // const handleDragEnd = async (event: any) => {
  //   const { over, active } = event;
  //   if (!over || !active) return;
  //   const cardId = active.id as string;
  //   const newColumnId = over.id as string;
  //   const card = cards.find((c) => c.id === cardId);
  //   if (!card) return;
  //   const position = card?.column?.position;
  //   if (position === 1 && !card?.inquiry_id) {
  //     toast.warning("Please fill the inquiry before moving this card!");
  //     return;
  //   }
  //   if (position === 2 && !card?.summary) {
  //     toast.warning("Please fill the summary before moving this card!");
  //     return;
  //   }
  //   if (position === 3 && !card?.quote_id) {
  //     toast.warning("Please attach a quote before moving this card!");
  //     return;
  //   }
  //   const oldColumn = columns.find((col) => col.id === card.column_id);
  //   const newColumn = columns.find((col) => col.id === newColumnId);
  //   if (!oldColumn || !newColumn) return;
  //   if (newColumn.position !== oldColumn.position + 1) {
  //     return;
  //   }
  //   const newCardsInColumn = cards.filter((c) => c.column_id === newColumnId);
  //   const newPosition = newCardsInColumn.length + 1;
  //   setCards((prev) =>
  //     prev.map((c) =>
  //       c.id === cardId
  //         ? { ...c, column_id: newColumnId, position: newPosition }
  //         : c
  //     )
  //   );
  //   try {
  //     await moveCard(cardId, newColumnId);
  //     await loadCards();
  //     toast.success("Card moved successfully!");
  //   } catch (err) {
  //     console.error("Failed to update card:", err);
  //     toast.error("Failed to move card!");
  //   }
  // };
  const handleDragStart = (event: any) => {
    setActiveCardId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCardId(null);
    if (!over || !active) return;

    const activeCardId = active.id as string;
    const overCardId = over.id as string;

    const activeCard = cards.find((c) => c.id === activeCardId);
    const overCard = cards.find((c) => c.id === overCardId);

    if (!activeCard) return;

    let destinationColumnId = overCard?.column_id || String(over.id);
    let destinationCards = cards
      .filter((c) => c.column_id === destinationColumnId)
      .sort((a, b) => (a.card_position ?? 0) - (b.card_position ?? 0));

    let overIndex = overCard
      ? destinationCards.findIndex((c) => c.id === overCardId)
      : destinationCards.length;

    if (activeCard.column_id !== destinationColumnId) {
      const position = activeCard?.column?.position;
      if (position === 1 && !activeCard?.inquiry_id) {
        toast.warning("Please fill the inquiry before moving this card!");
        return;
      }
      if (position === 2 && !activeCard?.summary) {
        toast.warning("Please fill the summary before moving this card!");
        return;
      }
      if (position === 3 && !activeCard?.quote_id) {
        toast.warning("Please attach a quote before moving this card!");
        return;
      }
      const oldColumn = columns.find((col) => col.id === activeCard.column_id);
      const newColumn = columns.find((col) => col.id === destinationColumnId);
      if (!oldColumn || !newColumn) return;
      if (newColumn.position !== oldColumn.position + 1) {
        return;
      }
    }

    let sourceCards = cards
      .filter(
        (c) => c.column_id === activeCard.column_id && c.id !== activeCardId
      )
      .sort((a, b) => (a.card_position ?? 0) - (b.card_position ?? 0));

    let newDestinationCards: any = [
      ...destinationCards.slice(0, overIndex),
      { ...activeCard, column_id: destinationColumnId },
      ...destinationCards.slice(overIndex),
    ];

    newDestinationCards = newDestinationCards.map((c: any, idx: any) => ({
      ...c,
      card_position: idx + 1,
    }));
    sourceCards = sourceCards.map((c, idx) => ({
      ...c,
      card_position: idx + 1,
    }));

    const updatedCards = cards.map((c) => {
      if (c.column_id === activeCard.column_id && c.id !== activeCardId) {
        return sourceCards.find((sc) => sc.id === c.id)!;
      }
      if (c.column_id === destinationColumnId || c.id === activeCardId) {
        return newDestinationCards.find((dc: any) => dc.id === c.id)!;
      }
      return c;
    });

    setCards(updatedCards);

    try {
      await moveCard(
        activeCardId,
        destinationColumnId,
        newDestinationCards[overIndex].card_position
      );
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
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
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
        {columns.map((col) => {
          const sortedCards = cards.filter((c) => c.column_id === col.id);
          // .sort((a, b) => (a.card_position ?? 0) - (b.card_position ?? 0));
          return (
            <SortableContext
              key={col.id}
              id={col.id}
              items={sortedCards.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <Column
                id={col.id}
                column={col}
                cards={sortedCards}
                reloadCards={loadCards}
                onSortChange={handleSortChange}
              />
            </SortableContext>
          );
        })}
      </div>
      <DragOverlay>
        {activeCardId
          ? (() => {
              const card = cards.find((c) => c.id === activeCardId);
              return card ? (
                <Card cardData={card} reloadCards={loadCards} />
              ) : null;
            })()
          : null}
      </DragOverlay>
      <InquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddCard}
      />
    </DndContext>
  );
};

export default Board;
