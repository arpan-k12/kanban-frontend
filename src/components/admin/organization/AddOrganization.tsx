import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { AddOrganizationData } from "../../../types/organization.type";
import { AddOrganizationAPI } from "../../../api/organizationAPI";
import UseToast from "../../../hooks/useToast";

const validationSchema = Yup.object({
  name: Yup.string().trim().required("Organization name is required"),
  address: Yup.string()
    .trim()
    .min(10, "Address must be at least 10 characters long")
    .max(200, "Address must not exceed 200 characters")
    .required("Address is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10,15}$/, "Phone must be between 10–15 digits")
    .required("Phone is required"),
  industry: Yup.string().trim().required("Industry is required"),
});

export default function AddOrganization() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: AddOrganizationData) => AddOrganizationAPI(data),
    onSuccess: (data) => {
      if (data?.status) {
        UseToast(data.message, "success");
        navigate(-1);
      }
    },
    onError: (error: any) => {
      console.error(error);
      UseToast(error, "error");
    },
  });

  const formik = useFormik<AddOrganizationData>({
    initialValues: {
      name: "",
      address: "",
      phone: "",
      industry: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      await mutation.mutateAsync(values);
      resetForm();
    },
  });

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <div className="max-w-xl">
          <h3 className="text-xl font-bold text-gray-900">Add Organization</h3>
        </div>
        <div className="md:w-fit  ">
          <button
            className="font-medium inline-flex items-center justify-center cursor-pointer "
            onClick={() => {
              navigate(-1);
            }}
          >
            <ArrowLeft className=" mr-2" />
            Back
          </button>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium">Organization Name</label>
          <input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter organization name"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {formik.errors.name && formik.touched.name && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Address</label>
          <textarea
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter address"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
          />
          {formik.errors.address && formik.touched.address && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.address}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter phone number"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {formik.errors.phone && formik.touched.phone && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Industry</label>
          <input
            type="text"
            name="industry"
            value={formik.values.industry}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter industry"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {formik.errors.industry && formik.touched.industry && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.industry}
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/organization")}
            className="px-4 py-2 bg-gray-200 rounded-md text-sm hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            {mutation.isPending ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
