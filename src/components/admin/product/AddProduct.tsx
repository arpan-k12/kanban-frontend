import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import UseToast from "../../../hooks/useToast";
import { AddProductAPI } from "../../../api/product.api";
import { getCategoriesAPI } from "../../../api/categories.api";

const validationSchema = Yup.object({
  name: Yup.string().trim().required("Product name is required"),
  category_id: Yup.string().required("Category is required"),
  description: Yup.string().trim().required("Description is required"),
  price: Yup.number()
    .min(1, "Price must be at least 1")
    .required("Price is required"),
  image: Yup.array()
    .min(1, "At least one image is required")
    .max(6, "You can upload up to 6 images")
    .test("fileType", "Only JPG, PNG, or WebP files are allowed", (files) =>
      files
        ? files.every((file) =>
            ["image/jpeg", "image/png", "image/webp"].includes(file.type)
          )
        : true
    )
    .test("fileSize", "Each file must be less than 2MB", (files) =>
      files ? files.every((file) => file.size <= 2 * 1024 * 1024) : true
    ),
});

export default function AddProduct() {
  const navigate = useNavigate();

  const { data: categories } = useQuery({
    queryKey: ["getCategoriesAPI"],
    queryFn: getCategoriesAPI,
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => AddProductAPI(data),
    onSuccess: (data) => {
      if (data?.status) {
        UseToast(data.message, "success");
        navigate(-1);
      }
    },
    onError: (error: any) => {
      console.error(error);
      UseToast(error, "error");
    },
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      category_id: "",
      description: "",
      price: "",
      image: [] as File[],
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("category_id", values.category_id);
      formData.append("description", values.description);
      formData.append("price", values.price);

      values.image.forEach((file) => formData.append("image", file));

      await mutation.mutateAsync(formData);
      resetForm();
    },
  });

  const handleRemoveImage = (index: number) => {
    const updatedImages = formik.values.image.filter((_, i) => i !== index);
    formik.setFieldValue("image", updatedImages);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900">Add Product</h3>
        <button
          className="font-medium inline-flex items-center cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2" /> Back
        </button>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium">Product Name</label>
          <input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 w-full border rounded-md px-3 py-2 text-sm shadow-sm"
            placeholder="Enter product name"
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm">{formik.errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            name="category_id"
            value={formik.values.category_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 w-full border rounded-md px-3 py-2 text-sm shadow-sm"
          >
            <option value="">Select category</option>
            {categories?.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {formik.touched.category_id && formik.errors.category_id && (
            <p className="text-red-500 text-sm">{formik.errors.category_id}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            rows={3}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 w-full border rounded-md px-3 py-2 text-sm shadow-sm"
            placeholder="Enter description"
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-500 text-sm">{formik.errors.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 w-full border rounded-md px-3 py-2 text-sm shadow-sm"
            placeholder="Enter price"
          />
          {formik.touched.price && formik.errors.price && (
            <p className="text-red-500 text-sm">{formik.errors.price}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Upload Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) =>
              formik.setFieldValue(
                "image",
                Array.from(e.currentTarget.files || [])
              )
            }
            className="mt-1 w-full border rounded-md px-3 py-2 text-sm shadow-sm"
          />

          {formik.values.image.length > 0 && (
            <div className="mt-3 grid grid-cols-6">
              {formik.values.image.map((file, index) => (
                <div
                  key={index}
                  className="relative w-20 h-20 border rounded-md overflow-hidden group"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {formik.touched.image && formik.errors.image && (
            <p className="text-red-500 text-sm">{formik.errors.image as any}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="px-4 py-2 bg-gray-200 rounded-md text-sm hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
