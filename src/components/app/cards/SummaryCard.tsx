import React from "react";
import CardEditor from "../common/CardEditor";
import type { CardDataType } from "../../../types/card.type";
import { Pencil } from "lucide-react";
import { updateCardSummaryAPI } from "../../../api/card.api";
import { useMutation } from "@tanstack/react-query";
import UseToast from "../../../hooks/useToast";
import { useAuthStore } from "../../../store/authStore";
import CustomerUI from "../../../ui/app/cardUI/CustomerUI";
import InquiryUI from "../../../ui/app/cardUI/InquiryUI";
import SummaryUI from "../../../ui/app/cardUI/SummaryUI";

interface Props {
  cardData: CardDataType;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  reloadCards: () => void;
}

const SummaryCard: React.FC<Props> = ({
  cardData,
  isEditing,
  setIsEditing,
  reloadCards,
}) => {
  const { hasPermission } = useAuthStore();
  const { customer, inquiry } = cardData;

  const { mutateAsync: mutateCardSummary } = useMutation({
    mutationFn: ({ id, summary }: { id: string; summary: string }) =>
      updateCardSummaryAPI(id, summary),
    onSuccess: async (data: any) => {
      if (data?.status) {
        UseToast(data.message, "success");
      }
    },
    onError: (error: any) => {
      console.error(error);
      UseToast(error, "error");
    },
  });

  return (
    <div className="relative rounded-xl border border-gray-200 bg-white p-4  transition-shadow duration-200">
      {(!cardData?.summary
        ? hasPermission("can_create", "discussion")
        : hasPermission("can_edit", "discussion")) && (
        <button
          onClick={() => setIsEditing(true)}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute top-2 right-2 text-gray-500 hover:text-blue-600 cursor-pointer"
          aria-label="Edit inquiry"
        >
          <Pencil size={16} />
        </button>
      )}

      <div className="mb-4">
        <CustomerUI customer={customer} />
      </div>
      <div>
        <InquiryUI inquiry={inquiry} />
      </div>

      {cardData?.summary && <SummaryUI cardData={cardData} />}

      {isEditing && (
        <CardEditor
          initialData={{ summary: cardData.summary || "" }}
          onSave={async (updated) => {
            await mutateCardSummary({
              id: cardData.id,
              summary: updated.summary,
            });
            await reloadCards();
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default SummaryCard;
