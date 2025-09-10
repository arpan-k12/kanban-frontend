import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import UseToast from "../../../hooks/useToast";
import {
  getUserPermissionsAPI,
  updateUserPermissionsAPI,
} from "../../../api/users.api";

interface Permission {
  id: string;
  name: string;
  assigned: boolean;
  userPermissionId?: string | null;
}

interface Feature {
  id: string;
  name: string;
  permissions: Permission[];
}

const validationSchema = Yup.object({
  features: Yup.array().of(
    Yup.object({
      id: Yup.string().required(),
      name: Yup.string().required(),
      permissions: Yup.array().of(
        Yup.object({
          id: Yup.string().required(),
          name: Yup.string().required(),
          assigned: Yup.boolean().required(),
          userPermissionId: Yup.string().nullable(),
        })
      ),
    })
  ),
});

export default function EditDashboard() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getUserPermissionsAPI", id],
    queryFn: () => getUserPermissionsAPI(id!),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: (values: { permissionsByFeature: Record<string, string[]> }) =>
      updateUserPermissionsAPI(id!, values),
    onSuccess: (data) => {
      if (data?.status) {
        UseToast(data.message, "success");
        navigate("/dashboard");
      }
    },
    onError: (error) => {
      console.error(error);
      UseToast(error.message || "Failed to update permissions", "error");
    },
  });

  const formik = useFormik<{ features: Feature[] }>({
    enableReinitialize: true,
    initialValues: {
      features: data?.features || [],
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload = {
        permissionsByFeature: values.features.reduce((acc, feature) => {
          acc[feature.id] = feature.permissions
            .filter((p: Permission) => p.assigned)
            .map((p: Permission) => p.id);
          return acc;
        }, {} as Record<string, string[]>),
      };
      await mutation.mutateAsync(payload);
    },
  });

  if (isLoading) return <div className="p-6">Loading user permissions...</div>;
  if (isError)
    return (
      <div className="p-6 text-red-600">Failed to load user permissions.</div>
    );

  const togglePermission = (featureIndex: number, permIndex: number) => {
    const updatedFeatures = [...formik.values.features];
    updatedFeatures[featureIndex].permissions[permIndex].assigned =
      !updatedFeatures[featureIndex].permissions[permIndex].assigned;
    formik.setFieldValue("features", updatedFeatures);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <div className="max-w-xl">
          <h3 className="text-xl font-bold text-gray-900">
            Edit User Permissions
          </h3>
          <p className="text-gray-500 text-sm">User: {data?.user?.user_name}</p>
        </div>
        <div className="md:w-fit">
          <button
            className="font-medium inline-flex items-center justify-center cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2" />
            Back
          </button>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        {formik.values.features.map((feature, fIdx) => (
          <div key={feature.id} className="border rounded-lg p-4">
            <h4 className="text-lg font-semibold capitalize">{feature.name}</h4>
            <div className="flex flex-wrap gap-4 mt-2">
              {feature.permissions.map((perm: any, pIdx: number) => (
                <label
                  key={perm.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={perm.assigned}
                    onChange={() => togglePermission(fIdx, pIdx)}
                  />
                  <span className="text-sm select-none">
                    {perm.name.replace("can_", "").toUpperCase()}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
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
