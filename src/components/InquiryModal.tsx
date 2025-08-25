import React, { useEffect, useState } from "react";
import { getAllCustomer } from "../api/customerAPI";

interface Customer {
  id: string;
  c_name: string;
  c_email: string;
}

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: {
    customerId: string;
    commodity: string;
    budget: string;
  }) => void;
}

const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [commodity, setCommodity] = useState("");
  const [budget, setBudget] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      const loadData = async () => {
        try {
          const response = await getAllCustomer();
          setCustomers(response);
        } catch (error) {
          console.error("Failed to fetch customer data:", error);
        }
      };
      loadData();
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!selectedCustomer || !commodity.trim() || !budget.trim()) {
      setError("All fields are required");
      return;
    }
    setError("");
    onAdd({ customerId: selectedCustomer, commodity, budget });
    setSelectedCustomer("");
    setCommodity("");
    setBudget("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        <h2 className="text-lg font-semibold mb-4">Create New Card</h2>

        {/* Customer Dropdown */}
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        >
          <option value="">Select a customer</option>
          {customers.map((cust) => (
            <option key={cust.id} value={cust.id}>
              {cust.c_name} ({cust.c_email})
            </option>
          ))}
        </select>

        {/* Commodity Input */}
        <input
          type="text"
          placeholder="Commodity"
          value={commodity}
          onChange={(e) => setCommodity(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        />

        {/* Budget Input */}
        <input
          type="text"
          placeholder="Budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        />

        {/* Error message */}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default InquiryModal;
