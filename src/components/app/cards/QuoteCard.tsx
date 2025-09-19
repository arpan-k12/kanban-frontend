import React from "react";
import CardEditor from "../common/CardEditor";
import type { CardData } from "../../../types/card.type";
import { Pencil } from "lucide-react";
import { createQuoteAPI, updateQuoteAPI } from "../../../api/quote.api";
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
    <div className="relative rounded-xl border border-gray-200 bg-white p-4  transition-shadow duration-200">
      {(!quote
        ? hasPermission("can_create", "quote")
        : hasPermission("can_edit", "quote")) && (
        <button
          onClick={() => setIsEditing(true)}
          disabled={isCreating || isUpdating}
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
      {quote && (
        <div className="mt-2 text-xs text-gray-800 space-y-1">
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
