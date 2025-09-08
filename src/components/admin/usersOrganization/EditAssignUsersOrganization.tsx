import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  GetOrganizationAPI,
  getUsersOrganizationByIdAPI,
} from "../../../api/organizationAPI";
import { GetAllUsersAPI } from "../../../api/users.api";
import { AssignUserOrganizationAPI } from "../../../api/usersOrganization.api";
import UseToast from "../../../hooks/useToast";
import MultiSelectDropdown from "../../app/common/MultiSelectDropdown";

const validationSchema = Yup.object({
  user_id: Yup.string().required("User is required"),
  organization_ids: Yup.array()
    .of(Yup.string().required())
    .min(1, "At least one organization is required"),
});

export default function EditAssignUsersOrganization() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: mappingData, isLoading: mappingLoading } = useQuery({
    queryKey: ["getUsersOrganizationByIdAPI", id],
    queryFn: () => getUsersOrganizationByIdAPI(id!),
    enabled: !!id,
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["GetAllUsersAPI"],
    queryFn: GetAllUsersAPI,
  });

  const { data: orgsData, isLoading: orgsLoading } = useQuery({
    queryKey: ["GetOrganizationAPI"],
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

  useEffect(() => {
    if (mappingData?.data) {
      formik.setValues({
        user_id: mappingData.data.id,
        organization_ids:
          mappingData.data.organizations?.map((org: any) => org.id) || [],
      });
    }
  }, [mappingData]);

  if (mappingLoading || usersLoading || orgsLoading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          Edit User-Organization Assignment
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
        <div>
          <label className="block text-sm font-medium">User</label>
          <select
            name="user_id"
            value={formik.values.user_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={true}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm bg-gray-100"
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

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/users-organization")}
            className="px-4 py-2 bg-gray-200 rounded-md text-sm hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            {mutation.isPending ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
