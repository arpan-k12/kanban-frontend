import React, { useEffect } from "react";
import { GetAllCustomerAPI } from "../../api/customer.api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import type { Customer } from "../../types/customer.type";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "../../types/product.type";
import { GetProductAPI } from "../../api/product.api";
import { GetUniqueIdentificationCodeAPI } from "../../api/inquiry.api";
import { RefreshCcw } from "lucide-react";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: {
    customerId: string;
    productId: string;
    quantity: number;
    price: number;
    budget: number;
    identification_code: string;
  }) => void;
}

const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const {
    data: uniqueCode,
    isLoading: isLoadingCode,
    refetch: refetchCode,
  } = useQuery({
    queryKey: ["GetUniqueIdentificationCodeAPI"],
    queryFn: GetUniqueIdentificationCodeAPI,
    enabled: isOpen,
  });

  const {
    data: customers = [],
    isLoading,
    isError,
  } = useQuery<Customer[]>({
    queryKey: ["GetAllCustomerAPI"],
    queryFn: GetAllCustomerAPI,
    enabled: isOpen,
  });

  const {
    data: products = [],
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = useQuery<Product[]>({
    queryKey: ["GetProductAPI"],
    queryFn: () => GetProductAPI(),
    enabled: isOpen,
  });

  if (!isOpen) return null;

  if (isLoading) return <div>Loading customers...</div>;
  if (isError) return <div>Failed to load customers.</div>;

  const validationSchema = Yup.object().shape({
    customerId: Yup.string().required("Customer is required"),
    productId: Yup.string().required("Product is required"),
    quantity: Yup.number()
      .min(1, "Quantity must be at least 1")
      .required("Quantity is required"),
    budget: Yup.number()
      .typeError("Budget must be a number")
      .positive("Budget must be greater than 0")
      .required("Budget is required"),
    identification_code: Yup.string().required(
      "Identification code is required"
    ),
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[420px] relative">
        <h2 className="text-xl font-semibold mb-5 text-gray-800">
          Create New Inquiry
        </h2>

        <Formik
          initialValues={{
            customerId: "",
            productId: "",
            quantity: 1,
            price: 0,
            budget: "",
            identification_code: uniqueCode || "",
          }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            onAdd({
              customerId: values.customerId,
              productId: values.productId,
              quantity: values.quantity,
              price: values.price,
              budget: Number(values.budget),
              identification_code: values.identification_code,
            });
            resetForm();
            onClose();
          }}
        >
          {({ values, setFieldValue, isSubmitting }) => {
            useEffect(() => {
              const selectedProduct = products.find(
                (p) => p.id === values.productId
              );
              if (selectedProduct) {
                const unitPrice = Number(selectedProduct.price);
                setFieldValue("price", unitPrice * values.quantity);
              }
            }, [values.productId, values.quantity, setFieldValue, products]);

            return (
              <Form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer
                  </label>
                  <Field
                    as="select"
                    name="customerId"
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product
                  </label>
                  <Field
                    as="select"
                    name="productId"
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a product</option>
                    {products.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.name} (₹{prod.price})
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="productId"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <Field
                    type="number"
                    name="quantity"
                    min="1"
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="quantity"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <Field
                    type="number"
                    name="price"
                    disabled
                    className="w-full border rounded-lg p-2 bg-gray-100 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget
                  </label>
                  <Field
                    type="number"
                    name="budget"
                    placeholder="Budget"
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="budget"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Identification Code
                  </label>
                  <div className="flex items-center gap-2">
                    <Field
                      type="text"
                      name="identification_code"
                      disabled
                      className="flex-1 border rounded-lg p-2 bg-gray-100 text-gray-600"
                    />
                    <button
                      type="button"
                      disabled={!!uniqueCode}
                      onClick={() => refetchCode()}
                      className={`p-2 rounded-full ${
                        uniqueCode
                          ? "bg-gray-300 cursor-not-allowed text-gray-500"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      }`}
                      title={
                        uniqueCode
                          ? "Code already generated"
                          : "Generate new code"
                      }
                    >
                      <RefreshCcw
                        size={18}
                        className={isLoadingCode ? "animate-spin" : ""}
                      />
                    </button>
                  </div>
                  <ErrorMessage
                    name="identification_code"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                  {isLoadingCode && (
                    <p className="text-xs text-gray-400 mt-1">
                      Generating code...
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || isLoadingCode}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {isSubmitting ? "Adding..." : "Add"}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default InquiryModal;
