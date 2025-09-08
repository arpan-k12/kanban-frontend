import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { Edit, ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { UserOrganizationType } from "../../../types/userOrganization";
import type { Organization } from "../../../types/organization.type";

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

  const userTable = useReactTable({
    data,
    columns: userColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
      <table className="min-w-full border-collapse text-sm">
        <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
          {userTable.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200">
          {userTable.getRowModel().rows.map((row, rowIndex) => {
            const user = row.original;
            return (
              <React.Fragment key={user.id}>
                <tr
                  className={`${
                    rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-indigo-50 transition-colors duration-200`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-3 text-gray-700 border-t"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>

                {expanded[user.id] && user.organizations?.length > 0 && (
                  <tr className="bg-gray-50">
                    <td></td>
                    <td
                      colSpan={row.getVisibleCells().length - 1}
                      className="px-10 py-3 border-t"
                    >
                      <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm">
                        <table className="min-w-full border-collapse text-sm">
                          <thead className="bg-gray-100">
                            {orgColumns.map((col) => (
                              <th
                                key={col.header as string}
                                className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b"
                              >
                                {col.header as string}
                              </th>
                            ))}
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {user.organizations.map((org, index) => (
                              <tr
                                key={org.id}
                                className={`${
                                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                } hover:bg-indigo-50 transition-colors duration-200`}
                              >
                                {orgColumns.map((col) => (
                                  <td
                                    key={col.header as string}
                                    className="px-4 py-2 text-gray-700"
                                  >
                                    {/* @ts-expect-error col.accessorKey is keyof Organization */}
                                    {org[col.accessorKey as keyof Organization]}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
