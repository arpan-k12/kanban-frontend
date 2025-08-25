import React, { useState } from "react";
import type { CardData } from "../../types/card.type";
import CardEditor from "./CardEditor";

interface Props {
  cardData: CardData;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

const Position1Card: React.FC<Props> = ({
  cardData,
  isEditing,
  setIsEditing,
}) => {
  const { customer, inquiry } = cardData;

  if (isEditing) {
    return (
      <CardEditor
        initialData={{
          c_name: customer?.c_name || "",
          c_email: customer?.c_email || "",
          commodity: inquiry?.commodity || "",
          budget: inquiry?.budget || "",
        }}
        onSave={async (updated: any) => {
          // await updateCustomerApi(cardData.customer_id, updated);
          // await updateInquiryApi(cardData.inquiry_id, updated);
          console.log("Save Position1 data:", updated);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div onDoubleClick={() => setIsEditing(true)}>
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
    </div>
  );
};

export default Position1Card;
