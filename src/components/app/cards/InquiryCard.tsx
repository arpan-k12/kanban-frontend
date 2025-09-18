import React from "react";
import type { CardData } from "../../../types/card.type";
import CardEditor from "../common/CardEditor";
import { Pencil } from "lucide-react";
import { updateCustomerAPI } from "../../../api/customer.api";
import { updateInquiryAPI } from "../../../api/inquiry.api";
import { useMutation } from "@tanstack/react-query";
import UseToast from "../../../hooks/useToast";
import { useAuthStore } from "../../../store/authStore";
import EditInquiryModal from "../EditInquiryModal";

interface Props {
  cardData: CardData;
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
  const { customer, inquiry, customer_id } = cardData;

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
      <div className="relative rounded-xl border border-gray-200 bg-white p-4  transition-shadow duration-200">
        {hasPermission("can_edit", "inquiry") && (
          <button
            onClick={() => setIsEditing(true)}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 cursor-pointer"
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
      </div>
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
