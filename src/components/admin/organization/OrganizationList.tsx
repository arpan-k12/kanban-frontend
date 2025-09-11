import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Organization } from "../../../types/organization.type";
import { deleteOrganizationAPI } from "../../../api/organization.api";
import UseToast from "../../../hooks/useToast";
import DeleteModel from "../common/DeleteModel";

interface OrganizationListProps {
  data: Organization[];
}

export default function OrganizationList({ data }: OrganizationListProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<
    string | null
  >(null);

  const { mutate: deleteOrganization } = useMutation({
    mutationFn: (id: string) => deleteOrganizationAPI(id),
    onSuccess: (res: any) => {
      UseToast(res?.message || "Organization deleted successfully", "success");
      queryClient.invalidateQueries({ queryKey: ["GetOrganizationAPI"] });
      setIsDeleteModalOpen(false);
    },
    onError: (error: any) => {
      console.error(error);
      UseToast(error?.message || "Failed to delete organization", "error");
    },
  });

  const columns: ColumnDef<Organization>[] = [
    { accessorKey: "name", header: "Organization Name" },
    { accessorKey: "address", header: "Address" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "industry", header: "Industry" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const org = row.original;
        return (
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                navigate(`/organization/edit-organization/${org.id}`);
              }}
              className="text-blue-600 hover:text-blue-800 cursor-pointer"
              aria-label="Edit Organization"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => {
                setSelectedOrganizationId(org.id);
                setIsDeleteModalOpen(true);
              }}
              className="text-red-600 hover:text-red-800 cursor-pointer"
              aria-label="Delete Organization"
            >
              <Trash2 size={18} />
            </button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
      <table className="min-w-full border-collapse text-sm">
        <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
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
          {table.getRowModel().rows.map((row, rowIndex) => (
            <tr
              key={row.id}
              className={`${
                rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-indigo-50 transition-colors duration-200`}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-6 py-3 text-gray-700 text-sm border-t"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <DeleteModel
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={deleteOrganization}
        selectedId={selectedOrganizationId}
      />
    </div>
  );
}
