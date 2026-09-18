"use client";

import { useEffect, useState } from "react";

import { getProducts } from "../lib/api";
import ProductCard from "../components/ProductCard";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.products);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <main className="min-h-screen bg-[#faf7f2]">
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
            Our collection
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">
            Handmade pieces, made with care.
          </h1>

          <p className="mt-5 text-lg leading-8 text-gray-600">
            Explore our collection of handmade artwork and everyday
            pieces inspired by traditional Indian art.
          </p>
        </div>

        {loading && (
          <p className="mt-12 text-gray-500">
            Loading products...
          </p>
        )}

        {error && (
          <p className="mt-12 text-red-500">
            {error}
          </p>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="mt-12 text-gray-500">
            No products available yet.
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}