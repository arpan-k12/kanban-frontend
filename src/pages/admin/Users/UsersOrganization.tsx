import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import type { UserOrganizationType } from "../../../types/userOrganization";
import { GetUsersOrganizationAPI } from "../../../api/usersOrganization.api";
import UsersOrganizationList from "../../../components/admin/usersOrganization/UsersOrganizationList";

export default function UsersOrganization() {
  const {
    data: usersOrganization = [],
    isLoading,
    isError,
  } = useQuery<UserOrganizationType[]>({
    queryKey: ["GetUsersOrganizationAPI"],
    queryFn: GetUsersOrganizationAPI,
  });

  if (isLoading) {
    return <div className="p-6">Loading organizations...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-600">Failed to load organizations.</div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mt-5 mb-5">
        <h1 className="text-xl md:text-2xl  font-semibold text-gray-900">
          user's Organization
        </h1>
        <Link to={"assign-organization"}>
          <button className="flex px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm">
            <Plus className="h-4 w-4 mr-2" />
            Assign Organization
          </button>
        </Link>
      </div>

      <UsersOrganizationList data={usersOrganization} />
    </div>
  );
}
