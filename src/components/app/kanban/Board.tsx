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
import { GetKanbanColumnsAPI } from "../../../api/kanbanColumnAPI";
import { fetchCardsAPI, moveCard } from "../../../api/cardAPI";
import InquiryModal from "../InquiryModal";
import { createInquiryCardAPI } from "../../../api/inquiryAPI";
import type { ColumnType } from "../../../types/column.type";
import type { CardData } from "../../../types/card.type";
import { toast } from "react-toastify";
import Card from "./Card";
import { useOrganization } from "../../../context/app/OrganizationContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "../../../types/user.type";
import UseToast from "../../../hooks/useToast";
import { useAuthStore } from "../../../store/authStore";

const Board: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const { selectedOrg } = useOrganization();
  const { hasPermission } = useAuthStore();

  const {
    data: columns = [],
    isLoading: isColumnsLoading,
    isError: isColumnsError,
  } = useQuery<ColumnType[]>({
    queryKey: ["kanbanColumns"],
    queryFn: async () => {
      const cols = await GetKanbanColumnsAPI();
      return cols.sort((a, b) => a.position - b.position);
    },
  });

  const [queryParams, setQueryParams] = useState<{
    organizationId: string;
    columnId?: string | null;
    sort?: string[];
  }>({
    organizationId: selectedOrg ?? "",
    columnId: null,
    sort: [],
  });

  useEffect(() => {
    if (selectedOrg) {
      setQueryParams((prev) => ({
        ...prev,
        organizationId: selectedOrg,
      }));
    }
  }, [selectedOrg]);

  const { data: cards = [], refetch: refetchCards } = useQuery({
    queryKey: ["fetchCardsAPI", queryParams],
    queryFn: ({ queryKey }) => {
      const [, params] = queryKey as [string, typeof queryParams];
      return fetchCardsAPI(params);
    },
    enabled: !!selectedOrg,
  });

  // const handleSortChange = (columnId: string, selected: string[]) => {
  //   setQueryParams({ organizationId: selectedOrg, columnId, sort: selected });
  // };

  const handleSortChange = (columnId: string, selected: string[]) => {
    setQueryParams((prev) => {
      if (selected.length > 0) {
        return {
          ...prev,
          organizationId: selectedOrg,
          columnId,
          sort: selected,
        };
      } else {
        return {
          ...prev,
          organizationId: selectedOrg,
          columnId: null,
          sort: [],
        };
      }
    });
  };

  const { mutateAsync: mutateMoveCard, isPending: isMovingCard } = useMutation({
    mutationFn: ({
      id,
      destinationColumnId,
      newCard_position,
    }: {
      id: string;
      destinationColumnId: string;
      newCard_position: number;
    }) => moveCard(id, destinationColumnId, newCard_position),
    onSuccess: async () => {
      await refetchCards();
      UseToast("Card moved successfully!", "success");
    },
    onError: () => {
      UseToast("Failed to move card!", "error");
    },
  });

  const { mutateAsync: mutateCreateInquiryCard, isPending: isCreatingCard } =
    useMutation({
      mutationFn: (data: {
        organization_id: string;
        customer_id: string;
        commodity: string;
        budget: number;
      }) => createInquiryCardAPI(data),
      onSuccess: async () => {
        UseToast("Card Created successfully!", "success");

        await refetchCards();
      },
      onError: (error: any) => {
        console.error("Failed to add card:", error);
        UseToast(error, "error");
      },
    });

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

    // const updatedCards = cards.map((c) => {
    //   if (c.column_id === activeCard.column_id && c.id !== activeCardId) {
    //     return sourceCards.find((sc) => sc.id === c.id)!;
    //   }
    //   if (c.column_id === destinationColumnId || c.id === activeCardId) {
    //     return newDestinationCards.find((dc: any) => dc.id === c.id)!;
    //   }
    //   return c;
    // });

    // setCards(updatedCards);

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

  const handleAddCard = async (data: {
    customerId: string;
    commodity: string;
    budget: number;
  }) => {
    if (!selectedOrg) {
      UseToast("you don't have permission to create card", "error");
    } else {
      await mutateCreateInquiryCard({
        organization_id: selectedOrg,
        customer_id: data.customerId,
        commodity: data.commodity,
        budget: data.budget,
      });
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
        {hasPermission("can_create", "card") && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Add Card
          </button>
        )}
      </div>

      <div className="flex flex-wrap justify-evenly gap-6 p-6">
        {columns.map((col) => {
          const sortedCards = cards.filter((c) => c.column_id === col.id);
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
                reloadCards={refetchCards}
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
                <Card cardData={card} reloadCards={refetchCards} />
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
