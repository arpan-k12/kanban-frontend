import React from "react";
import type { CustomerType } from "../../../types/customer.type";

interface Props {
  customer: CustomerType | undefined;
  showAvatar?: boolean;
}

const CustomerUI: React.FC<Props> = ({ customer, showAvatar = true }) => {
  return (
    <div className="flex items-center gap-3">
      {showAvatar && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-blue-600 font-semibold">
          {customer?.c_name?.[0]?.toUpperCase() || "?"}
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-gray-800">
          {customer?.c_name}
        </h3>
        <p className="text-xs text-[#262b35]">{customer?.c_email}</p>
      </div>
    </div>
  );
};

export default CustomerUI;
