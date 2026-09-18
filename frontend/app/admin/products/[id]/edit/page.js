"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getProductById,
  updateProduct,
  generateDescription,
} from "../../../../lib/api";

export default function EditProductPage({ params }) {
    const { id } = use(params);
  const router = useRouter();

  const [productId, setProductId] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    isFeatured: false,
  });

  const [currentImage, setCurrentImage] = useState("");
  const [newImage, setNewImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

useEffect(() => {
  const loadProduct = async () => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    try {
      setProductId(id);

      const data = await getProductById(id);
      const product = data.product;

      setForm({
        name: product.name || "",
        category: product.category || "",
        price: product.price ?? "",
        description: product.description || "",
        isFeatured: Boolean(product.isFeatured),
      });

      setCurrentImage(product.image || "");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  loadProduct();
}, [id, router]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setNewImage(file);
  };

  const handleGenerateDescription = async () => {
    if (!form.name.trim()) {
      setError("Enter a product name first.");
      return;
    }

    setError("");
    setSuccess("");
    setGenerating(true);

    try {
      const data = await generateDescription({
        name: form.name,
        category: form.category,
        material: "",
        artStyle: "Indian folk art",
        keyDetails: "",
      });

      setForm((previous) => ({
        ...previous,
        description: data.description,
      }));
    } catch (error) {
      setError(error.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await updateProduct({
        id: productId,
        name: form.name,
        description: form.description,
        price: form.price,
        category: form.category,
        isFeatured: form.isFeatured,
        image: newImage,
      });

      setSuccess("Product updated successfully.");

      setTimeout(() => {
        router.push("/admin");
      }, 800);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#faf7f2]">
        <p className="text-gray-500">
          Loading product...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#faf7f2]">
      <section className="mx-auto max-w-3xl px-6 py-12">
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="text-sm text-gray-500 underline underline-offset-4"
        >
          ← Back to dashboard
        </button>

        <div className="mt-8">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
            Admin
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-gray-900">
            Edit Product
          </h1>

          <p className="mt-2 text-gray-600">
            Update your product details or replace its image.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-3xl border border-gray-200 bg-white p-6 md:p-8"
        >
          {/* Product Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Product Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
            />
          </div>

          {/* Category + Price */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Category
              </label>

              <input
                id="category"
                name="category"
                type="text"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Price (₹)
              </label>

              <input
                id="price"
                name="price"
                type="number"
                min="0"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
              />
            </div>
          </div>

          {/* Current Image */}
          {currentImage && (
            <div>
              <p className="mb-3 text-sm font-medium text-gray-900">
                Current Image
              </p>

              <div className="h-48 w-48 overflow-hidden rounded-2xl bg-gray-100">
                <img
                  src={currentImage}
                  alt={form.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}

          {/* New Image */}
          <div>
            <label
              htmlFor="image"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Replace Image
            </label>

            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm"
            />

            {newImage && (
              <p className="mt-2 text-sm text-gray-500">
                New image: {newImage.name}
              </p>
            )}

            <p className="mt-2 text-xs text-gray-500">
              Leave empty to keep the current image.
            </p>
          </div>

          {/* Description */}
          <div>
            <div className="mb-2 flex items-center justify-between gap-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-900"
              >
                Description
              </label>

              <button
                type="button"
                onClick={handleGenerateDescription}
                disabled={generating || !form.name.trim()}
                className="rounded-full border border-gray-300 px-4 py-2 text-xs font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {generating
                  ? "Generating..."
                  : "✨ Generate with AI"}
              </button>
            </div>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={6}
              required
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
            />

            <p className="mt-2 text-xs text-gray-500">
              Review and edit AI-generated text before saving.
            </p>
          </div>

          {/* Featured */}
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
              className="h-4 w-4"
            />

            <span className="text-sm text-gray-700">
              Show this product in Featured Products
            </span>
          </label>

          {/* Messages */}
          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving changes..." : "Save Changes"}
          </button>
        </form>
      </section>
    </main>
  );
}