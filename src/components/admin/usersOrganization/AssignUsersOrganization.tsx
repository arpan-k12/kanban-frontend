import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { GetAllUsersAPI } from "../../../api/users.api";
import { GetOrganizationAPI } from "../../../api/organizationAPI";
import { AssignUserOrganizationAPI } from "../../../api/usersOrganization.api";
import UseToast from "../../../hooks/useToast";
import MultiSelectDropdown from "../../app/common/MultiSelectDropdown";

const validationSchema = Yup.object({
  user_id: Yup.string().required("User is required"),
  organization_ids: Yup.array()
    .of(Yup.string().required())
    .min(1, "At least one organization is required"),
});

export default function AssignUsersOrganization() {
  const navigate = useNavigate();

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["GetAllUsersAPI"],
    queryFn: GetAllUsersAPI,
  });

  const { data: orgsData, isLoading: orgsLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: GetOrganizationAPI,
  });

  const mutation = useMutation({
    mutationFn: (data: { user_id: string; organization_ids: string[] }) =>
      AssignUserOrganizationAPI(data),
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

  const formik = useFormik({
    initialValues: {
      user_id: "",
      organization_ids: [] as string[],
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
        <h3 className="text-xl font-bold text-gray-900">
          Assign User to Organization(s)
        </h3>
        <button
          className="font-medium inline-flex items-center justify-center cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2" />
          Back
        </button>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        {/* User Select */}
        <div>
          <label className="block text-sm font-medium">User</label>
          <select
            name="user_id"
            value={formik.values.user_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={usersLoading}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select a user</option>
            {usersData?.map((user: any) => (
              <option key={user.id} value={user.id}>
                {user.user_name} ({user.email}) - Role:{" "}
                {user.role === "0" ? "Admin" : "User"}
              </option>
            ))}
          </select>
          {formik.errors.user_id && formik.touched.user_id && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.user_id}</p>
          )}
        </div>

        {/* Multi-Select Organization */}
        <div>
          <label className="block text-sm font-medium">Organizations</label>
          <MultiSelectDropdown
            options={
              orgsData?.map((org: any) => ({
                label: `${org.name} (${org.industry})`,
                value: org.id,
              })) || []
            }
            selected={formik.values.organization_ids}
            onChange={(val) => formik.setFieldValue("organization_ids", val)}
          />
          {formik.errors.organization_ids &&
            formik.touched.organization_ids && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.organization_ids as string}
              </p>
            )}
        </div>

        {/* Actions */}
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
            {mutation.isPending ? "Assigning..." : "Assign"}
          </button>
        </div>
      </form>
    </div>
  );
}
