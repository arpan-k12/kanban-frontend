import React from "react";
import type { CardData } from "../../../types/card.type";
import CardEditor from "../common/CardEditor";
import { Pencil } from "lucide-react";
import { updateCustomerAPI } from "../../../api/customer.api";
import { updateInquiryAPI } from "../../../api/inquiry.api";
import { useMutation } from "@tanstack/react-query";
import UseToast from "../../../hooks/useToast";
import { useAuthStore } from "../../../store/authStore";

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

  const { mutateAsync: mutateCustomer } = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: {
        c_name: string;
        c_email: string;
      };
    }) => updateCustomerAPI(id, body),
  });

  const { mutateAsync: mutateInquiry } = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: { customer_id: string; commodity: string; budget: number };
    }) => updateInquiryAPI(id, body),
  });

  return (
    <div className="relative bg-white p-4  transition-shadow duration-200">
      {hasPermission("can_edit", "inquiry") && (
        <button
          onClick={() => setIsEditing(true)}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 text-gray-400 hover:text-blue-600"
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

      {inquiry?.product?.name && (
        <p className="text-xs text-gray-700">
          <span className="font-medium">Product: </span>
          {inquiry?.product?.name}
        </p>
      )}

      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-600">
        {inquiry?.quantity && (
          <p>
            <span className="font-medium">Qty: </span>
            {inquiry?.quantity}
          </p>
        )}
        {inquiry?.price && (
          <p>
            <span className="font-medium">Price: </span>₹{inquiry?.price}
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

      {isEditing && (
        <div className="mt-3">
          <CardEditor
            initialData={{
              c_name: customer?.c_name || "",
              c_email: customer?.c_email || "",
              budget: inquiry?.budget?.toString() || "",
            }}
            onSave={async (updated: any) => {
              try {
                await mutateCustomer({
                  id: customer_id,
                  body: {
                    c_name: updated.c_name,
                    c_email: updated.c_email,
                  },
                });

                if (inquiry?.id) {
                  await mutateInquiry({
                    id: inquiry.id,
                    body: {
                      customer_id,
                      commodity: updated.commodity,
                      budget: Number(updated.budget),
                    },
                  });
                }

                await reloadCards();
                UseToast("Inquiry updated successfully!", "success");
                setIsEditing(false);
              } catch (error: any) {
                UseToast(error, "error");
              }
            }}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      )}
    </div>
  );
};

export default InquiryCard;
