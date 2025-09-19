import React from "react";
import type { InquiryType } from "../../../types/inquiry.type";

interface Props {
  inquiry: InquiryType | undefined;
}

const InquiryUI: React.FC<Props> = ({ inquiry }) => {
  return (
    <>
      <p className="text-sm text-gray-600 mb-2">
        <span className="font-medium">Number of Products: </span>
        {inquiry?.items?.length ?? 0}
      </p>

      <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
        {inquiry?.grand_total !== undefined && (
          <div className="">
            <span className="text-[#262b35]">Total Price</span>
            <p className="font-semibold text-green-600">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(Number(inquiry?.grand_total ?? 0))}
            </p>
          </div>
        )}
        {inquiry?.budget !== undefined && (
          <div className="">
            <span className="text-[#262b35]">Budget</span>
            <p className={`font-semibold text-yellow-600`}>
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(Number(inquiry?.budget ?? 0))}
            </p>
          </div>
        )}
        {inquiry?.identification_code && (
          <div className="col-span-2 flex">
            <span className="text-[#262b35]">Code: </span>
            <div className="font-medium text-[#868685]">
              &nbsp; {inquiry?.identification_code}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default InquiryUI;
