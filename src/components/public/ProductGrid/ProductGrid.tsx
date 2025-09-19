import type { Product } from "../../../types/product.type";
import { BASE_URL } from "../../../config/dotenv.config";
import { Link } from "react-router-dom";

interface ProductGridProps {
  data: Product[];
}

export default function ProductGrid({ data }: ProductGridProps) {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {data.map((product) => (
          <Link
            key={product?.id}
            to={`/product/detail/${product?.id}`}
            className="group cursor-pointer bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
          >
            <div
              key={product?.id}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="relative h-52 w-full overflow-hidden flex justify-center">
                <img
                  src={`${BASE_URL}${product?.image[0]}`}
                  alt={product?.name}
                  className="w-auto h-auto object-cover hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-blue-400 text-white text-xs px-3 py-1 rounded-full shadow-md">
                  {product?.categories?.name}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {product?.name}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1 flex-grow">
                  {product?.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xl font-bold text-blue-600">
                    ₹{product?.price}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
