import { useNavigate, useParams } from "react-router-dom";
import { getProductByIdAPI } from "../../api/product.api";
import { useQuery } from "@tanstack/react-query";
import ProductImgSlider from "../../components/admin/product/ProductImgSlider";
import { BASE_URL } from "../../config/dotenv.config";
import ProductDetailsImgSlider from "./ProductDetailsImgSlider";
import { ArrowLeft } from "lucide-react";

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getProductByIdAPI", id],
    queryFn: () => getProductByIdAPI(id!),
    enabled: !!id,
  });

  if (!product) {
    return (
      <div className="p-8 text-center text-gray-600">Loading product...</div>
    );
  }
  return (
    <div>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="md:w-fit">
          <button
            className="font-medium inline-flex items-center justify-center cursor-pointer hover:text-blue-600"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 hover:text-blue-600" />
            Back
          </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6 capitalize">
          {product.name}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex justify-center">
            <ProductDetailsImgSlider product={product} BASE_URL={BASE_URL} />
          </div>

          <div className="flex flex-col space-y-4">
            <p className="text-lg text-gray-700 capitalize">
              <span className="font-semibold">Category: </span>
              {product.categories?.name}
            </p>
            <p className="text-2xl font-bold text-blue-500">₹{product.price}</p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Description
          </h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
}
