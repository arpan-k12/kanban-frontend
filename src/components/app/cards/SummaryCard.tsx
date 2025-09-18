import React from "react";
import CardEditor from "../common/CardEditor";
import type { CardData } from "../../../types/card.type";
import { Pencil } from "lucide-react";
import { updateCardSummaryAPI } from "../../../api/card.api";
import { useMutation } from "@tanstack/react-query";
import UseToast from "../../../hooks/useToast";
import { useAuthStore } from "../../../store/authStore";

interface Props {
  cardData: CardData;
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
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-gray-800">
          {customer?.c_name}
        </h3>
        <p className="text-xs text-gray-500">{customer?.c_email}</p>
      </div>

      <p className="text-xs text-gray-700">
        <span className="font-medium">Number of Product: </span>
        {inquiry?.items?.length}
      </p>

      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-600">
        {inquiry?.grand_total && (
          <p>
            <span className="font-medium">Total Price: </span>₹
            {inquiry?.grand_total}
          </p>
        )}
        {inquiry?.budget && (
          <p>
            <span className="font-medium">Budget: </span>₹{inquiry?.budget}
          </p>
        )}
        {inquiry?.identification_code && (
          <p>
            <span className="font-medium">Code: </span>
            {inquiry?.identification_code}
          </p>
        )}
      </div>

      {cardData?.summary && (
        <p className="mt-2 text-xs text-gray-600">
          <span className="font-medium">Summary:</span> {cardData?.summary}
        </p>
      )}

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
