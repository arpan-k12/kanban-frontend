import { useQuery } from "@tanstack/react-query";
import type { Product } from "../../types/product.type";
import { GetProductAPI } from "../../api/product.api";
import ProductGrid from "../../components/public/ProductGrid/ProductGrid";
import { useSearchStore } from "../../store/searchStore";

export default function PublicProductPage() {
  const { searchQuery } = useSearchStore();

  console.log(searchQuery, "kkk");

  const {
    data: product = [],
    isLoading,
    isError,
  } = useQuery<Product[]>({
    queryKey: ["GetProductAPI", searchQuery],
    queryFn: () => GetProductAPI(searchQuery),
    enabled: true,
  });

  if (isLoading) {
    return <div className="p-6">Loading Product...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-600">Failed to load Product.</div>;
  }
  return (
    <div className="p-6">
      <ProductGrid data={product} />
    </div>
  );
}
