import React from "react";
import type { CardDataType } from "../../../types/card.type";

interface Props {
  cardData: CardDataType | undefined;
}

const SummaryUI: React.FC<Props> = ({ cardData }) => {
  return (
    <>
      <div className="mt-2 text-sm">
        <span className="text-[#262b35]">Summary:</span>
        <span className="font-medium ml-2 text-[#868685]">
          {cardData?.summary}
        </span>
      </div>
    </>
  );
};

export default SummaryUI;
