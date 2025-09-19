import React, { useEffect } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import type { InquiryType } from "../../../types/inquiry.type";
import type { CustomerType } from "../../../types/customer.type";
import type { Product } from "../../../types/product.type";
import { GetProductAPI } from "../../../api/product.api";
import { useQuery } from "@tanstack/react-query";
import { Plus, Trash2, X } from "lucide-react";

interface EditInquiryModalProps {
  inquiry: InquiryType;
  customer: CustomerType;
  onClose: () => void;
  onSubmit: (values: any) => void;
}

const validationSchema = Yup.object({
  budget: Yup.number().required("Budget is required").min(1),
  items: Yup.array()
    .of(
      Yup.object().shape({
        product_id: Yup.string().required("Product is required"),
        quantity: Yup.number().required("Quantity is required").min(1),
        total_price: Yup.number().required("Total price is required"),
      })
    )
    .min(1, "At least one product is required"),
});

export default function EditInquiryModal({
  inquiry,
  customer,
  onClose,
  onSubmit,
}: EditInquiryModalProps) {
  const {
    data: products = [],
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = useQuery<Product[]>({
    queryKey: ["GetProductAPI"],
    queryFn: () => GetProductAPI(),
    enabled: true,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Edit Inquiry</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X />
          </button>
        </div>

        {isLoadingProducts && <p>Loading products...</p>}
        {isErrorProducts && (
          <p className="text-red-500">Failed to load products.</p>
        )}

        <div className="p-6 overflow-auto max-h-[64vh]">
          <Formik
            initialValues={{
              budget: inquiry?.budget,
              identification_code: inquiry?.identification_code,
              customer_name: customer?.c_name,
              customer_email: customer?.c_email,
              items: inquiry?.items.map((item) => ({
                id: item?.id,
                product_id: item?.product_id,
                quantity: Number(item?.quantity),
                unit_price: Number(item?.product?.price || 0),
                total_price: Number(item?.total_price),
              })),
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              const grandTotal = values.items.reduce(
                (sum, it) => sum + Number(it.total_price || 0),
                0
              );
              onSubmit({ ...values, grand_total: grandTotal });
            }}
          >
            {({ values, setFieldValue }) => {
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
                (sum, it) => sum + Number(it.total_price || 0),
                0
              );

              return (
                <Form className="space-y-6 p-5">
                  <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Customer
                      </label>
                      <input
                        type="text"
                        value={`${values?.customer_name} (${values?.customer_email})`}
                        disabled
                        className="w-full border rounded-lg p-2 bg-gray-100 text-gray-600"
                      />
                    </div>
                    <div className="col-span-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Identification Code
                      </label>
                      <input
                        type="text"
                        value={values?.identification_code}
                        disabled
                        className="w-full border rounded-lg p-2 bg-gray-100 text-gray-600"
                      />
                    </div>
                  </div>
                  <div className="col-span-12 flex justify-end mt-1">
                    <FieldArray name="items">
                      {(arrayHelpers) => (
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-medium">Products</h3>
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
                              className="flex items-center gap-1 px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <div className="space-y-2">
                            {values?.items.map((item, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-12 gap-2 items-center"
                              >
                                <div className="col-span-5">
                                  <Field
                                    as="select"
                                    name={`items.${index}.product_id`}
                                    className="w-full border rounded-lg p-2"
                                  >
                                    <option value="">Select a product</option>
                                    {products
                                      .filter(
                                        (prod) =>
                                          !values?.items.some(
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
                                    className="text-red-500 text-sm"
                                  />
                                </div>
                                <div className="col-span-2">
                                  <Field
                                    type="number"
                                    name={`items.${index}.quantity`}
                                    min="1"
                                    className="w-full border rounded-lg p-2"
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
                                    className={`p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 ${
                                      values?.items?.length === 1
                                        ? "cursor-not-allowed"
                                        : "cursor-pointer"
                                    } `}
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
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
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Save
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
}
