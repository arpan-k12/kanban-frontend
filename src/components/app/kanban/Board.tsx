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
import { GetKanbanColumnsAPI } from "../../../api/kanbanColumn.api";
import { fetchCardsAPI, moveCard } from "../../../api/card.api";
import InquiryModal from "../inquiryModal/InquiryModal";
import { createInquiryCardAPI } from "../../../api/inquiry.api";
import type { ColumnType } from "../../../types/column.type";
import Card from "./Card";
import { useOrganization } from "../../../context/app/OrganizationContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import UseToast from "../../../hooks/useToast";
import { useAuthStore } from "../../../store/authStore";
import { handleDragEndHelper } from "../../../utils/dragUtils";
import type { ItemInput } from "../../../types/inquiryItem.type";

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
        grand_total: number;
        budget: number;
        identification_code: string;
        items: ItemInput[];
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

  const handleDragEnd = (event: DragEndEvent) =>
    handleDragEndHelper({
      event,
      cards,
      columns,
      mutateMoveCard,
      setActiveCardId,
    });

  const handleAddCard = async (data: {
    customerId: string;
    grand_total: number;
    budget: number;
    identification_code: string;
    items: ItemInput[];
  }) => {
    if (!selectedOrg) {
      UseToast("you don't have permission to create card", "error");
    } else {
      await mutateCreateInquiryCard({
        organization_id: selectedOrg,
        customer_id: data?.customerId,
        grand_total: data?.grand_total,
        budget: data?.budget,
        identification_code: data?.identification_code,
        items: data?.items,
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
    <>
      {selectedOrg && (
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
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                + Add Card
              </button>
            )}
          </div>

          <div className="flex flex-wrap justify-evenly gap-6 p-1">
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
      )}
    </>
  );
};

export default Board;
