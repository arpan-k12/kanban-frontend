import React, { useEffect } from "react";
import { GetAllCustomerAPI } from "../../api/customer.api";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import type { Customer } from "../../types/customer.type";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "../../types/product.type";
import { GetProductAPI } from "../../api/product.api";
import { GetUniqueIdentificationCodeAPI } from "../../api/inquiry.api";
import { RefreshCcw, Plus, Trash2 } from "lucide-react";

interface ItemInput {
  productId: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: {
    customerId: string;
    items: ItemInput[];
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
    identification_code: Yup.string().required(
      "Identification code is required"
    ),
    items: Yup.array()
      .of(
        Yup.object().shape({
          productId: Yup.string().required("Product is required"),
          quantity: Yup.number()
            .min(1, "Quantity must be at least 1")
            .required("Quantity is required"),
        })
      )
      .min(1, "At least one product is required"),
    budget: Yup.number()
      .typeError("Budget must be a number")
      .positive("Budget must be greater than 0")
      .required("Budget is required"),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Create New Inquiry
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Scrollable content area */}
        <div className="p-6 overflow-auto max-h-[64vh]">
          <Formik
            initialValues={{
              customerId: "",
              identification_code: uniqueCode || "",
              items: [
                {
                  productId: "",
                  quantity: 1,
                  unit_price: 0,
                  total_price: 0,
                },
              ] as ItemInput[],
              budget: "",
            }}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              const prepared = {
                customerId: values.customerId,
                items: values.items.map((it) => ({
                  productId: it.productId,
                  quantity: Number(it.quantity),
                  unit_price: Number(it.unit_price),
                  total_price: Number(it.total_price),
                })),
                budget: Number(values.budget),
                identification_code: values.identification_code,
              };
              onAdd(prepared);
              resetForm();
              onClose();
            }}
          >
            {({ values, setFieldValue, isSubmitting }) => {
              // Recalculate unit_price/total_price for each item whenever products or quantities change
              useEffect(() => {
                (values.items || []).forEach((item, idx) => {
                  const prod = products.find((p) => p.id === item.productId);
                  const unit = prod ? Number(prod.price) : 0;
                  const qty = Number(item.quantity) || 0;
                  const total = Number((unit * qty).toFixed(2));
                  // only set if different to avoid unnecessary updates
                  if (item.unit_price !== unit) {
                    setFieldValue(`items.${idx}.unit_price`, unit, false);
                  }
                  if (item.total_price !== total) {
                    setFieldValue(`items.${idx}.total_price`, total, false);
                  }
                });
                // eslint-disable-next-line react-hooks/exhaustive-deps
              }, [values.items, products]);

              // helper to compute grand total (optional)
              const grandTotal = values.items.reduce(
                (s, it) => s + Number(it.total_price || 0),
                0
              );

              return (
                <Form className="space-y-6">
                  {/* First row: Customer + Identification code + Add row */}
                  <div className="flex gap-4">
                    <div className="flex-1">
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

                    <div className="w-[260px]">
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
                            uniqueCode ? "Code already generated" : "Generate"
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

                    <div className="w-12 flex items-end">
                      {/* Add new row button */}
                      <FieldArray name="items">
                        {(arrayHelpers) => (
                          <button
                            type="button"
                            onClick={() =>
                              arrayHelpers.push({
                                productId: "",
                                quantity: 1,
                                unit_price: 0,
                                total_price: 0,
                              })
                            }
                            title="Add product row"
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white hover:bg-green-700"
                          >
                            <Plus size={16} />
                          </button>
                        )}
                      </FieldArray>
                    </div>
                  </div>

                  {/* Product rows */}
                  <div>
                    <FieldArray name="items">
                      {(arrayHelpers) => (
                        <div className="space-y-3">
                          {(values.items || []).map((item, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-12 gap-3 items-center"
                            >
                              <div className="col-span-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Product
                                </label>
                                <Field
                                  as="select"
                                  name={`items.${index}.productId`}
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
                                  name={`items.${index}.productId`}
                                  component="p"
                                  className="text-red-500 text-sm mt-1"
                                />
                              </div>

                              <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Qty
                                </label>
                                <Field
                                  type="number"
                                  name={`items.${index}.quantity`}
                                  min="1"
                                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                />
                                <ErrorMessage
                                  name={`items.${index}.quantity`}
                                  component="p"
                                  className="text-red-500 text-sm mt-1"
                                />
                              </div>

                              <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Unit
                                </label>
                                <Field
                                  type="number"
                                  name={`items.${index}.unit_price`}
                                  disabled
                                  className="w-full border rounded-lg p-2 bg-gray-100 text-gray-600"
                                />
                              </div>

                              <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Total
                                </label>
                                <Field
                                  type="number"
                                  name={`items.${index}.total_price`}
                                  disabled
                                  className="w-full border rounded-lg p-2 bg-gray-100 text-gray-600"
                                />
                              </div>

                              <div className="col-span-12 flex justify-end mt-1">
                                <button
                                  type="button"
                                  onClick={() => arrayHelpers.remove(index)}
                                  className="flex items-center gap-2 px-3 py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200"
                                  title="Remove row"
                                >
                                  <Trash2 size={14} />
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </FieldArray>
                  </div>

                  {/* Budget & summary */}
                  <div className="grid grid-cols-2 gap-4">
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
                        Grand Total
                      </label>
                      <div className="w-full border rounded-lg p-2 bg-gray-50 text-gray-700">
                        ₹{grandTotal.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
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
    </div>
  );
};

export default InquiryModal;
