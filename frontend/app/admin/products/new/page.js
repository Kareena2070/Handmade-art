"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  createProduct,
  generateDescription,
} from "../../../lib/api";

export default function NewProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    isFeatured: false,
  });

  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setImage(file);
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

    if (!image) {
      setError("Please select a product image.");
      return;
    }

    setLoading(true);

    try {
      await createProduct({
        name: form.name,
        description: form.description,
        price: form.price,
        category: form.category,
        isFeatured: form.isFeatured,
        image,
      });

      setSuccess("Product created successfully.");

      setTimeout(() => {
        router.push("/admin");
      }, 800);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
            Add Product
          </h1>

          <p className="mt-2 text-gray-600">
            Add a new handmade product to your collection.
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
              placeholder="Madhubani Peacock Pencil Pouch"
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
                placeholder="Pencil Pouch"
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
                placeholder="349"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
              />
            </div>
          </div>

          {/* Image */}
          <div>
            <label
              htmlFor="image"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Product Image
            </label>

            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm"
            />

            {image && (
              <p className="mt-2 text-sm text-gray-500">
                Selected: {image.name}
              </p>
            )}
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
              placeholder="Write a product description or generate one with AI..."
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

          {/* Error */}
          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating product..." : "Create Product"}
          </button>
        </form>
      </section>
    </main>
  );
}