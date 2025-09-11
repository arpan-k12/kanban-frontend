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
    <div className="relative border rounded-md p-2 bg-white shadow-sm">
      {hasPermission("can_edit", "inquiry") && (
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
      <h3 className="text-sm font-semibold text-gray-700">
        {customer?.c_name}
      </h3>
      <p className="text-xs text-gray-500">{customer?.c_email}</p>
      {inquiry?.commodity && (
        <p className="text-xs text-gray-600">
          <span className="font-medium">Commodity:</span> {inquiry?.commodity}
        </p>
      )}
      {inquiry?.budget && (
        <p className="text-xs text-gray-600">
          <span className="font-medium">Budget:</span> {inquiry?.budget}
        </p>
      )}
      {isEditing && (
        <CardEditor
          initialData={{
            c_name: customer?.c_name || "",
            c_email: customer?.c_email || "",
            commodity: inquiry?.commodity || "",
            budget: inquiry?.budget?.toString() || "",
          }}
          onSave={async (updated: any) => {
            // await updateCustomer(customer_id, updated.c_name, updated.c_email);
            // await updateInquiry(inquiry?.id, {
            //   customer_id,
            //   commodity: updated?.commodity,
            //   budget: updated?.budget,
            // });
            // await reloadCards();

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
      )}
    </div>
  );
};

export default InquiryCard;
