import React, { useEffect } from "react";
import { GetAllCustomerAPI } from "../../api/customer.api";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import type { Customer } from "../../types/customer.type";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "../../types/product.type";
import { GetProductAPI } from "../../api/product.api";
import { GetUniqueIdentificationCodeAPI } from "../../api/inquiry.api";
import { RefreshCcw, Plus, Trash2, X } from "lucide-react";
import type { ItemInput } from "../../types/inquiryItem.type";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: {
    customerId: string;
    grand_total: number;
    budget: number;
    identification_code: string;
    items: ItemInput[];
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
          product_id: Yup.string().required("Product is required"),
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
            <X />
          </button>
        </div>

        <div className="p-6 overflow-auto max-h-[64vh]">
          <Formik
            initialValues={{
              customerId: "",
              identification_code: uniqueCode || "",
              items: [
                {
                  product_id: "",
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
              const grandTotal = values.items.reduce(
                (s, it) => s + Number(it.total_price || 0),
                0
              );

              const prepared = {
                customerId: values.customerId,
                budget: Number(values.budget),
                identification_code: values.identification_code,
                grand_total: grandTotal,
                items: values.items.map((it) => ({
                  product_id: it.product_id,
                  quantity: Number(it.quantity),
                  total_price: Number(it.total_price),
                })),
              };
              onAdd(prepared);
              resetForm();
              onClose();
            }}
          >
            {({ values, setFieldValue, isSubmitting }) => {
              useEffect(() => {
                (values.items || []).forEach((item, idx) => {
                  const prod = products.find((p) => p.id === item.product_id);
                  const unit = prod ? Number(prod.price) : 0;
                  const qty = Number(item.quantity) || 0;
                  const total = Number((unit * qty).toFixed(2));
                  if (item.unit_price !== unit) {
                    setFieldValue(`items.${idx}.unit_price`, unit, false);
                  }
                  if (item.total_price !== total) {
                    setFieldValue(`items.${idx}.total_price`, total, false);
                  }
                });
              }, [values.items, products]);

              const grandTotal = values.items.reduce(
                (s, it) => s + Number(it.total_price || 0),
                0
              );

              return (
                <Form className="space-y-6">
                  <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Customer
                      </label>
                      <Field
                        as="select"
                        name="customerId"
                        className="w-full border rounded-lg p-2 text-gray-600"
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

                    <div className="col-span-5">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Identification Code
                      </label>
                      <Field
                        type="text"
                        name="identification_code"
                        disabled
                        className="w-full border rounded-lg p-2 bg-gray-100 text-gray-600"
                      />
                    </div>

                    <div className="col-span-1">
                      <button
                        type="button"
                        disabled={!!uniqueCode}
                        onClick={() => refetchCode()}
                        className={`p-2 rounded-full mt-4 ${
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
                  </div>

                  <div className="grid grid-cols-12 gap-3 items-center mb-0">
                    <div className="col-span-5 ">Product</div>
                    <div className="col-span-2 ">Qty</div>
                    <div className="col-span-2 ">Unit</div>
                    <div className="col-span-2 ">Total</div>
                    <div className="col-span-1  mt-1">
                      <FieldArray name="items">
                        {(arrayHelpers) => (
                          <button
                            type="button"
                            onClick={() =>
                              arrayHelpers.push({
                                product_id: "",
                                quantity: 1,
                                unit_price: 0,
                                total_price: 0,
                              })
                            }
                            title="Add product row"
                            className="flex items-center justify-center w-8 h-8 rounded-md bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                          >
                            <Plus size={16} />
                          </button>
                        )}
                      </FieldArray>
                    </div>
                  </div>

                  <div>
                    <FieldArray name="items">
                      {(arrayHelpers) => (
                        <div className="space-y-3">
                          {(values.items || []).map((item, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-12 gap-3 items-center"
                            >
                              <div className="col-span-5">
                                <Field
                                  as="select"
                                  name={`items.${index}.product_id`}
                                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">Select a product</option>
                                  {products
                                    .filter(
                                      (prod) =>
                                        !values.items.some(
                                          (it, idx) =>
                                            idx !== index &&
                                            it.product_id === prod.id
                                        )
                                    )
                                    .map((prod) => (
                                      <option key={prod.id} value={prod.id}>
                                        {prod.name} (₹{prod.price})
                                      </option>
                                    ))}
                                </Field>
                                <ErrorMessage
                                  name={`items.${index}.product_id`}
                                  component="p"
                                  className="text-red-500 text-sm mt-1"
                                />
                              </div>

                              <div className="col-span-2">
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
                                <Field
                                  type="number"
                                  name={`items.${index}.unit_price`}
                                  disabled
                                  className="w-full border rounded-lg p-2 bg-gray-100 text-gray-600"
                                />
                              </div>

                              <div className="col-span-2">
                                <Field
                                  type="number"
                                  name={`items.${index}.total_price`}
                                  disabled
                                  className="w-full border rounded-lg p-2 bg-gray-100 text-gray-600"
                                />
                              </div>

                              <div className="col-span-1">
                                <button
                                  type="button"
                                  disabled={values?.items?.length === 1}
                                  onClick={() => arrayHelpers.remove(index)}
                                  className={`px-3 py-1 mt-2 rounded-md bg-red-100 text-red-700 hover:bg-red-200 ${
                                    values?.items?.length === 1
                                      ? "cursor-not-allowed"
                                      : "cursor-pointer"
                                  } `}
                                  title="Remove row"
                                >
                                  <Trash2 size={20} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </FieldArray>
                  </div>

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
                      disabled={isSubmitting || isLoadingCode || !uniqueCode}
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
