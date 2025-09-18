import React from "react";
import type { Customer } from "../../types/customer.type";

interface Props {
  customer: Customer | undefined;
}

const Customer: React.FC<Props> = ({ customer }) => {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-800">
        {customer?.c_name}
      </h3>
      <p className="text-xs text-gray-500">{customer?.c_email}</p>
    </div>
  );
};

export default Customer;
