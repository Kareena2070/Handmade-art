"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getProducts } from "../lib/api";
import ProductCard from "./ProductCard";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();

        const featuredProducts = data.products.filter(
          (product) => product.isFeatured
        );

        setProducts(featuredProducts.slice(0, 4));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-gray-500">Loading products...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
            Featured
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Made to be noticed
          </h2>

          <p className="mt-3 max-w-xl text-gray-600">
            A few handmade pieces from our collection.
          </p>
        </div>

        <Link
          href="/products"
          className="hidden text-sm font-medium underline underline-offset-4 sm:block"
        >
          View all
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="mt-10 text-gray-500">
          No featured products yet.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      )}

      <Link
        href="/products"
        className="mt-8 inline-block text-sm font-medium underline underline-offset-4 sm:hidden"
      >
        View all products
      </Link>
    </section>
  );
}