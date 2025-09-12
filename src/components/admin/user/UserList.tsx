import { type ColumnDef } from "@tanstack/react-table";
import type { User } from "../../../types/user.type";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CommonTable from "../common/CommonTable";

interface UserListProps {
  data: User[];
}

const ROLE_MAP: Record<string, string> = {
  "0": "Admin",
  "1": "User",
};

export default function UserList({ data }: UserListProps) {
  const navigate = useNavigate();

  const columns: ColumnDef<User>[] = [
    { accessorKey: "user_name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ getValue }) => {
        const role = getValue<string>();
        return ROLE_MAP[role] ?? role;
      },
    },
    {
      accessorKey: "permissions",
      header: "Permissions",
      cell: ({ row }) => {
        const permsByFeature = row.original.permissions?.byFeature ?? {};
        const features = Object.entries(permsByFeature);

        return (
          <div className="space-y-2">
            {features.map(([feature, perms]) => (
              <div key={feature} className="flex">
                <div className="text-xs mr-4 mt-1 font-semibold text-gray-600 mb-1 capitalize">
                  {feature}
                </div>
                <div className="flex flex-wrap gap-1">
                  {perms.map((perm) => (
                    <span
                      key={perm}
                      className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                navigate(`/dashboard/edit-dashboard/${user.id}`);
              }}
              className="text-blue-600 hover:text-blue-800 cursor-pointer"
              aria-label="Edit Organization"
            >
              <Edit size={18} />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <CommonTable data={data} columns={columns} />
    </>
  );
}
