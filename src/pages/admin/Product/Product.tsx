import { useQuery } from "@tanstack/react-query";

import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import type { Product } from "../../../types/product.type";
import { GetProductAPI } from "../../../api/product.api";
import ProductList from "../../../components/admin/product/ProductList";

export default function Product() {
  const {
    data: product = [],
    isLoading,
    isError,
  } = useQuery<Product[]>({
    queryKey: ["GetProductAPI"],
    queryFn: () => GetProductAPI(),
  });

  if (isLoading) {
    return <div className="p-6">Loading Product...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-600">Failed to load Product.</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mt-5 mb-5">
        <h1 className="text-xl md:text-2xl  font-semibold text-gray-900">
          Product
        </h1>
        <Link to={"add-Product"}>
          <button className="flex px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Product
          </button>
        </Link>
      </div>

      <ProductList data={product} />
    </div>
  );
}
