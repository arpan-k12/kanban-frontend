import { type ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Organization } from "../../../types/organization.type";
import { deleteOrganizationAPI } from "../../../api/organization.api";
import UseToast from "../../../hooks/useToast";
import DeleteModel from "../common/DeleteModel";
import CommonTable from "../common/CommonTable";

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

  return (
    <>
      <CommonTable data={data} columns={columns} />
      <DeleteModel
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={deleteOrganization}
        selectedId={selectedOrganizationId}
      />
    </>
  );
}
