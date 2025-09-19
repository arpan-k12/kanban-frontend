import React from "react";
import type { QuoteType } from "../../../types/quote.type";
import { Clock, IndianRupee } from "lucide-react";

interface Props {
  quote: QuoteType | undefined;
}

const QuoteUI: React.FC<Props> = ({ quote }) => {
  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(quote?.amount ?? 0));

  const formattedDate =
    quote?.valid_until &&
    new Date(quote.valid_until).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  return (
    <>
      <div className="mt-2 text-sm text-gray-700">
        <div className="flex">
          <div className="text-[#262b35]">Quote Amount:</div>
          <div className="flex items-center ml-2 font-semibold text-green-600">
            {formattedAmount}
          </div>
        </div>

        {formattedDate && (
          <div className="mt-1 flex items-center gap-1 text-sm">
            <div className=" text-[#262b35]">valid Until:</div>
            <Clock className="h-4 w-4 text-[#868685]" />
            <span className="text-[#868685]">{formattedDate}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default QuoteUI;
