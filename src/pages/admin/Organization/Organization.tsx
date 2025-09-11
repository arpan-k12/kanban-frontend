"use client";
import { useQuery } from "@tanstack/react-query";

import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import type { Organization } from "../../../types/organization.type";
import { GetOrganizationAPI } from "../../../api/organization.api";
import OrganizationList from "../../../components/admin/organization/OrganizationList";

export default function Organization() {
  const {
    data: organization = [],
    isLoading,
    isError,
  } = useQuery<Organization[]>({
    queryKey: ["GetOrganizationAPI"],
    queryFn: GetOrganizationAPI,
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
          Organization
        </h1>
        <Link to={"add-Organization"}>
          <button className="flex px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Organization
          </button>
        </Link>
      </div>

      <OrganizationList data={organization} />
    </div>
  );
}
