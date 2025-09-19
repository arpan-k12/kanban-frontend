import React from "react";
import type { CardDataType } from "../../../types/card.type";
import { Pencil } from "lucide-react";
import { updateInquiryAPI } from "../../../api/inquiry.api";
import { useMutation } from "@tanstack/react-query";
import UseToast from "../../../hooks/useToast";
import { useAuthStore } from "../../../store/authStore";
import EditInquiryModal from "../inquiryModal/EditInquiryModal";
import CustomerUI from "../../../ui/app/cardUI/CustomerUI";
import InquiryUI from "../../../ui/app/cardUI/InquiryUI";

interface Props {
  cardData: CardDataType;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  reloadCards: () => void;
}

const InquiryCard: React.FC<Props> = ({
  cardData,
  isEditing,
  setIsEditing,
  reloadCards,
}) => {
  const { hasPermission } = useAuthStore();
  const { customer, inquiry } = cardData;

  const { mutateAsync: mutateInquiry } = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: {
        budget: number;
        grand_total: number;
        items: {
          id?: string;
          product_id: string;
          quantity: number;
          total_price: number;
        }[];
      };
    }) => updateInquiryAPI(id, body),
  });

  return (
    <>
      <div className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-lg">
        {hasPermission("can_edit", "inquiry") && (
          <button
            onClick={() => setIsEditing(true)}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute right-3 top-3 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
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
      </div>

      {/* Edit Modal */}
      {isEditing && inquiry && customer && (
        <EditInquiryModal
          inquiry={inquiry}
          customer={customer}
          onClose={() => setIsEditing(false)}
          onSubmit={async (values) => {
            try {
              await mutateInquiry({
                id: inquiry.id,
                body: {
                  budget: Number(values.budget),
                  grand_total: Number(values.grand_total),
                  items: values.items.map((item: any) => ({
                    id: item.id,
                    product_id: item.product_id,
                    quantity: Number(item.quantity),
                    total_price: Number(item.total_price),
                  })),
                },
              });

              await reloadCards();
              UseToast("Inquiry updated successfully!", "success");
              setIsEditing(false);
            } catch (error: any) {
              UseToast(error?.message || "Failed to update inquiry", "error");
            }
          }}
        />
      )}
    </>
  );
};

export default InquiryCard;
