import React from "react";
import type { CardData } from "../../types/card.type";
import CardEditor from "./CardEditor";
import { Pencil } from "lucide-react";
import { toast } from "react-toastify";
import { updateCard } from "../../api/cardAPI";

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
  const { customer, inquiry } = cardData;

  return (
    <div className="relative border rounded-md p-2 bg-white shadow-sm">
      <button
        onClick={() => setIsEditing(true)}
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute top-2 right-2 text-gray-500 hover:text-blue-600 cursor-pointer"
        aria-label="Edit inquiry"
      >
        <Pencil size={16} />
      </button>
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
      {cardData?.summary && !isEditing && (
        <p className="mt-1 text-xs text-gray-600">
          <span className="font-medium">Summary:</span> {cardData?.summary}
        </p>
      )}
      <br />
      {isEditing && (
        // <CardEditor
        //   initialData={{
        //     c_name: customer?.c_name || "",
        //     c_email: customer?.c_email || "",
        //     commodity: inquiry?.commodity || "",
        //     budget: inquiry?.budget || "",
        //   }}
        //   onSave={async (updated: any) => {
        //     await updateCustomer(customer_id, updated.c_name, updated.c_email);
        //     await updateInquiry(
        //       inquiry?.id,
        //       customer_id,
        //       updated?.commodity,
        //       updated?.budget
        //     );
        //     await reloadCards();
        //     toast.success("Inquiry Updated successfully!");
        //     setIsEditing(false);
        //   }}
        //   onCancel={() => setIsEditing(false)}
        // />
        <CardEditor
          initialData={{ summary: cardData.summary || "" }}
          onSave={async (updated) => {
            await updateCard(cardData.id, updated.summary);
            await reloadCards();
            toast.success("Inquiry Updated successfully!");
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default InquiryCard;
