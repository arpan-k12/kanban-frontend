// src/utils/dragUtils.ts
import type { DragEndEvent } from "@dnd-kit/core";
import type { CardData } from "../types/card.type";
import type { ColumnType } from "../types/column.type";
import { toast } from "react-toastify";

interface HandleDragEndParams {
  event: DragEndEvent;
  cards: CardData[];
  columns: ColumnType[];
  mutateMoveCard: (args: {
    id: string;
    destinationColumnId: string;
    newCard_position: number;
  }) => Promise<unknown>;
  setActiveCardId: (id: string | null) => void;
}

export const handleDragEndHelper = async ({
  event,
  cards,
  columns,
  mutateMoveCard,
  setActiveCardId,
}: HandleDragEndParams) => {
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

  let newDestinationCards: CardData[] = [
    ...destinationCards.slice(0, overIndex),
    { ...activeCard, column_id: destinationColumnId },
    ...destinationCards.slice(overIndex),
  ];

  newDestinationCards = newDestinationCards.map((c, idx) => ({
    ...c,
    card_position: idx + 1,
  }));
  sourceCards = sourceCards.map((c, idx) => ({
    ...c,
    card_position: idx + 1,
  }));

  const newCardPosition = newDestinationCards[overIndex].card_position;

  if (
    activeCard.column_id === destinationColumnId &&
    activeCard.card_position === newCardPosition
  ) {
    return;
  }

  await mutateMoveCard({
    id: activeCardId,
    destinationColumnId,
    newCard_position: newCardPosition,
  });
};
