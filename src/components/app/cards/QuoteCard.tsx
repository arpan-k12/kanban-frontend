import React from "react";
import CardEditor from "../common/CardEditor";
import type { CardData } from "../../../types/card.type";
import { Pencil } from "lucide-react";
import { createQuoteAPI, updateQuoteAPI } from "../../../api/quoteAPI";
import { useMutation } from "@tanstack/react-query";
import UseToast from "../../../hooks/useToast";
import { useAuthStore } from "../../../store/authStore";

interface Props {
  cardData: CardData;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  reloadCards: () => void;
}

const QuoteCard: React.FC<Props> = ({
  cardData,
  isEditing,
  setIsEditing,
  reloadCards,
}) => {
  const { hasPermission } = useAuthStore();
  const { customer, inquiry, quote } = cardData;

  const { mutateAsync: mutateCreateQuote, isPending: isCreating } = useMutation(
    {
      mutationFn: (data: {
        card_id: string;
        amount: number;
        valid_until: string;
      }) => createQuoteAPI(data),
      onSuccess: async () => {
        UseToast("Quote Created successfully", "success");
        await reloadCards();
      },
      onError: (error: any) => {
        UseToast(error, "error");
      },
    }
  );
  // Mutation: update quote
  const { mutateAsync: mutateUpdateQuote, isPending: isUpdating } = useMutation(
    {
      mutationFn: (vars: {
        quoteId: string;
        amount: number;
        valid_until: string;
      }) =>
        updateQuoteAPI(vars.quoteId, {
          amount: vars.amount,
          valid_until: vars.valid_until,
        }),
      onSuccess: async () => {
        UseToast("Quote Updated successfully", "success");

        await reloadCards();
      },
      onError: (error: any) => {
        UseToast(error, "error");
      },
    }
  );

  return (
    <div className="relative border rounded-md p-2 bg-white shadow-sm">
      {(!quote
        ? hasPermission("can_create", "quote")
        : hasPermission("can_edit", "quote")) && (
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
      {cardData?.summary && (
        <p className="mt-1 text-xs text-gray-600">
          <span className="font-medium">Summary:</span> {cardData?.summary}
        </p>
      )}
      {quote && (
        <div className="mt-2 text-xs text-gray-800">
          <div className="font-medium">💰 {quote.amount}</div>
          <span>⏳ {new Date(quote.valid_until).toLocaleDateString()}</span>
        </div>
      )}

      {isEditing && (
        <CardEditor
          initialData={{
            amount: quote?.amount?.toString() || "",
            valid_until:
              quote?.valid_until || new Date().toISOString().split("T")[0],
          }}
          onSave={async (updated) => {
            if (quote?.id) {
              await mutateUpdateQuote({
                quoteId: quote.id,
                amount: Number(updated.amount),
                valid_until: updated.valid_until,
              });
            } else {
              await mutateCreateQuote({
                card_id: cardData.id,
                amount: Number(updated.amount),
                valid_until: updated.valid_until,
              });
            }
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default QuoteCard;
