"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getAdminProducts, deleteProduct } from "../lib/api";

export default function AdminDashboard() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        router.replace("/admin/login");
        return;
      }

      try {
        const data = await getAdminProducts();
        setProducts(data.products);
      } catch (error) {
        setError(error.message);

        // If token is invalid/expired, send admin back to login
        if (
          error.message.includes("authorized") ||
          error.message.includes("token")
        ) {
          localStorage.removeItem("adminToken");
          router.replace("/admin/login");
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  const handleDeleteProduct = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      await deleteProduct(deleteTarget._id);

      setProducts((previous) =>
        previous.filter((product) => product._id !== deleteTarget._id),
      );

      setDeleteTarget(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.replace("/admin/login");
  };

  const featuredCount = products.filter((product) => product.isFeatured).length;

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#faf7f2]">
        <p className="text-gray-500">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#faf7f2]">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
              Admin
            </p>

            <h1 className="mt-2 text-3xl font-semibold text-gray-900">
              Product Dashboard
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your handmade products from here.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-fit rounded-full border border-gray-300 bg-white px-5 py-2 text-sm font-medium transition hover:bg-gray-50"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">Products</p>

            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {products.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">Featured</p>

            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {featuredCount}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">Actions</p>

            <button
              onClick={() => router.push("/admin/products/new")}
              className="mt-3 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Add Product
            </button>
          </div>
        </div>

        {/* Product list */}
        <div className="mt-10 rounded-2xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">Products</h2>
          </div>

          {products.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              No products found.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-wider text-gray-500">
                      {product.category}
                    </p>

                    <h3 className="mt-1 font-medium text-gray-900">
                      {product.name}
                    </h3>

                    <p className="mt-1 font-semibold text-gray-900">
                      ₹{product.price}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {product.isFeatured && (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        Featured
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        router.push(`/admin/products/${product._id}/edit`)
                      }
                      className="rounded-full border border-gray-300 px-4 py-2 text-xs font-medium transition hover:bg-gray-50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(product)}
                      className="rounded-full border border-red-200 px-4 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
                Delete product
              </p>

              <h2 className="mt-3 text-xl font-semibold text-gray-900">
                Delete &quot;{deleteTarget.name}&quot;?
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                This will remove the product from your catalogue and delete its
                Cloudinary image when one is associated with it. This action
                cannot be undone.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-900 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteProduct}
                disabled={deleting}
                className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
