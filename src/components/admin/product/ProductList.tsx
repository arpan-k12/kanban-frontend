import React, { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import type { Product } from "../../../types/product.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CommonTable from "../common/CommonTable";
import type { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import { deleteProductAPI } from "../../../api/product.api";
import DeleteModel from "../common/DeleteModel";
import UseToast from "../../../hooks/useToast";
import { BASE_URL } from "../../../config/dotenv.config";
import ProductImgSlider from "./ProductImgSlider";

interface ProductListProps {
  data: Product[];
}

export default function ProductList({ data }: ProductListProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  const { mutate: deleteProduct } = useMutation({
    mutationFn: (id: string) => deleteProductAPI(id),
    onSuccess: (res: any) => {
      UseToast(res?.message || "Product deleted successfully", "success");
      queryClient.invalidateQueries({ queryKey: ["GetProductAPI"] });
      setIsDeleteModalOpen(false);
    },
    onError: (error: any) => {
      console.error(error);
      UseToast(error?.message || "Failed to delete product", "error");
    },
  });

  const columns: ColumnDef<Product>[] = [
    { accessorKey: "name", header: "Product Name" },
    {
      accessorKey: "category",
      header: "Category Name",
      cell: ({ row }) => {
        return row.original?.categories?.name;
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const desc = row.original.description || "";
        const shortDesc = desc.length > 30 ? desc.slice(0, 30) + "..." : desc;
        return (
          <div className="relative group cursor-pointer w-max">
            <span>{shortDesc}</span>
            {desc && (
              <div className="absolute left-0 top-full mt-1 hidden w-96 rounded-md bg-gray-700 px-2 py-1 text-sm text-white shadow-lg group-hover:block z-10">
                {desc}
              </div>
            )}
          </div>
        );
      },
    },
    { accessorKey: "price", header: "Price" },
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const product = row.original;

        if (!product.image || product.image.length === 0) {
          return <span className="text-gray-400 italic">No Image</span>;
        }

        return <ProductImgSlider product={product} BASE_URL={BASE_URL} />;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                navigate(`/product/edit-product/${product.id}`);
              }}
              className="text-blue-600 hover:text-blue-800 cursor-pointer"
              aria-label="Edit Product"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => {
                setSelectedProductId(product.id);
                setIsDeleteModalOpen(true);
              }}
              className="text-red-600 hover:text-red-800 cursor-pointer"
              aria-label="Delete Product"
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
        onDelete={deleteProduct}
        selectedId={selectedProductId}
      />
    </>
  );
}
