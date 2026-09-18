"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";

import { getProductById } from "../../lib/api";

export default function ProductDetailsPage({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = use(params);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data.product);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-gray-500">Loading product...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-red-500">
          {error || "Product not found"}
        </p>

        <Link
          href="/products"
          className="mt-6 inline-block underline underline-offset-4"
        >
          Back to products
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf7f2]">
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-20">
        <Link
          href="/products"
          className="text-sm text-gray-500 underline underline-offset-4"
        >
          ← Back to collection
        </Link>

        <div className="mt-10 grid gap-12 md:grid-cols-2">
          <div className="overflow-hidden rounded-3xl bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="aspect-square h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
              {product.category}
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-gray-900">
              {product.name}
            </h1>

            <p className="mt-5 text-2xl font-semibold text-gray-900">
              ₹{product.price}
            </p>

            <div className="mt-8 border-t border-gray-200 pt-8">
              <p className="text-base leading-8 text-gray-600">
                {product.description}
              </p>
            </div>

            <a
              href="https://wa.me/YOUR_PHONE_NUMBER"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex w-fit rounded-full bg-black px-7 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Ask about this product
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}