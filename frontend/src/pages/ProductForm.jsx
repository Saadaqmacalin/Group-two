import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../services/api";
import {
  ArrowLeft,
  Upload,
  Loader2,
  X,
  Package,
  DollarSign,
  Layers,
  FileText,
  Save,
  Image as ImageIcon,
} from "lucide-react";
import { motion } from "framer-motion";

const ProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get("/categories"),
          isEdit ? api.get(`/products/${id}`) : Promise.resolve(null),
        ]);

        setCategories(catRes.data);

        if (prodRes && prodRes.data) {
          const product = prodRes.data;
          setValue("name", product.name);
          setValue("description", product.description);
          setValue("price", product.price);
          setValue("countInStock", product.countInStock);
          setValue("category", product.category._id || product.category);

          if (product.images && product.images[0]) {
            setImagePreview(`http://localhost:5000${product.images[0]}`);
          }
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load form data");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchInitialData();
  }, [id, isEdit, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("countInStock", data.countInStock);
      formData.append("category", data.category);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      if (isEdit) {
        await api.put(`/products/${id}`, formData, config);
      } else {
        await api.post("/products", formData, config);
      }

      navigate("/products");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/products")}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-slate-500 text-sm">
            Fill in the details for your store item.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Left Column - Product Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block flex items-center gap-2">
                <Package className="w-4 h-4" /> Product Name
              </label>
              <input
                {...register("name", { required: "Name is required" })}
                placeholder="Ex: Wireless Headphones"
                className={`w-full px-4 py-2.5 border ${errors.name ? "border-red-500" : "border-slate-300"} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block flex items-center gap-2">
                <FileText className="w-4 h-4" /> Description
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                rows="4"
                placeholder="Describe your product features..."
                className={`w-full px-4 py-2.5 border ${errors.description ? "border-red-500" : "border-slate-300"} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1.5 block flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("price", {
                    required: "Price is required",
                    min: 0,
                  })}
                  placeholder="0.00"
                  className={`w-full px-4 py-2.5 border ${errors.price ? "border-red-500" : "border-slate-300"} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1.5 block flex items-center gap-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  {...register("countInStock", {
                    required: "Stock is required",
                    min: 0,
                  })}
                  placeholder="0"
                  className={`w-full px-4 py-2.5 border ${errors.countInStock ? "border-red-500" : "border-slate-300"} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Media & Categories */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Organization
            </h3>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block uppercase">
                Category
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className={`w-full px-4 py-2.5 border ${errors.category ? "border-red-500" : "border-slate-300"} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50`}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Media
            </h3>
            <div className="relative group">
              <div
                className={`w-full aspect-square rounded-2xl border-2 border-dashed ${imagePreview ? "border-blue-200" : "border-slate-200"} flex flex-col items-center justify-center overflow-hidden bg-slate-50 transition-all group-hover:bg-slate-100`}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <ImageIcon className="w-10 h-10 text-slate-300 mb-2" />
                    <p className="text-xs text-slate-500 font-medium">
                      Click to upload image
                    </p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isEdit ? "Update" : "Publish"}
            </button>
            <Link
              to="/products"
              className="px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
