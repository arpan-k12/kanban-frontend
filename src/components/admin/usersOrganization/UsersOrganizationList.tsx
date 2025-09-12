import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Edit, ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { UserOrganizationType } from "../../../types/userOrganization";
import type { Organization } from "../../../types/organization.type";
import CommonTable from "../common/CommonTable";

const ROLE_MAP: Record<string, string> = {
  "0": "Admin",
  "1": "User",
};

interface UsersOrganizationListProps {
  data: UserOrganizationType[];
}

export default function UsersOrganizationList({
  data,
}: UsersOrganizationListProps) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (userId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const userColumns: ColumnDef<UserOrganizationType>[] = [
    {
      id: "expander",
      header: "",
      cell: ({ row }) => {
        const user = row.original;
        return user.organizations?.length > 0 ? (
          <button
            onClick={() => toggleExpand(user.id)}
            className="text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            {expanded[user.id] ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>
        ) : null;
      },
    },
    {
      header: "User Name",
      accessorKey: "user_name",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: ({ getValue }) => ROLE_MAP[getValue() as string] ?? getValue(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <button
            onClick={() =>
              navigate(
                `/users-organization/edit-assign-organization/${user.id}`
              )
            }
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
            aria-label="Edit Organization"
          >
            <Edit size={18} />
          </button>
        );
      },
    },
  ];

  const orgColumns: ColumnDef<Organization>[] = [
    { header: "Organization Name", accessorKey: "name" },
    { header: "Industry", accessorKey: "industry" },
    { header: "Address", accessorKey: "address" },
    { header: "Phone", accessorKey: "phone" },
  ];

  return (
    <>
      <CommonTable
        data={data}
        columns={userColumns}
        expandableRow={(user) =>
          expanded[user.id] && user.organizations?.length > 0 ? (
            <div className="px-6 py-3">
              <CommonTable
                data={user.organizations}
                columns={orgColumns}
                striped
                withBorder
              />
            </div>
          ) : null
        }
      />
    </>
  );
}
