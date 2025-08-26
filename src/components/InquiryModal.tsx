import React, { useEffect, useState } from "react";
import { getAllCustomer } from "../api/customerAPI";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

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

  if (!isOpen) return null;

  const validationSchema = Yup.object().shape({
    customerId: Yup.string().required("Customer is required"),
    commodity: Yup.string().trim().required("Commodity is required"),
    budget: Yup.number()
      .typeError("Budget must be a number")
      .positive("Budget must be greater than 0")
      .required("Budget is required"),
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        <h2 className="text-lg font-semibold mb-4">Create New Card</h2>

        <Formik
          initialValues={{ customerId: "", commodity: "", budget: "" }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            onAdd(values);
            resetForm();
            onClose();
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  as="select"
                  name="customerId"
                  className="w-full border rounded p-2"
                >
                  <option value="">Select a customer</option>
                  {customers.map((cust) => (
                    <option key={cust.id} value={cust.id}>
                      {cust.c_name} ({cust.c_email})
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="customerId"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <Field
                  type="text"
                  name="commodity"
                  placeholder="Commodity"
                  className="w-full border rounded p-2"
                />
                <ErrorMessage
                  name="commodity"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <Field
                  type="number"
                  name="budget"
                  placeholder="Budget"
                  className="w-full border rounded p-2"
                />
                <ErrorMessage
                  name="budget"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {isSubmitting ? "Adding..." : "Add"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default InquiryModal;
